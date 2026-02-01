#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const OPENROUTER_API = "https://openrouter.ai/api/v1/models";

const server = new Server(
  {
    name: "openrouter-models-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_free_models",
        description: "Get list of currently available FREE models from OpenRouter API (real-time)",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter: all, chat, instruct",
              enum: ["all", "chat", "instruct"],
              default: "all"
            }
          },
        },
      },
      {
        name: "get_model_info",
        description: "Get detailed info about specific OpenRouter model",
        inputSchema: {
          type: "object",
          properties: {
            model_id: {
              type: "string",
              description: "Model ID (e.g., google/gemini-2.0-flash-exp:free)",
            }
          },
          required: ["model_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_free_models") {
      const response = await fetch(OPENROUTER_API);
      const data = await response.json();
      
      const freeModels = data.data.filter(model => {
        const promptPrice = parseFloat(model.pricing?.prompt || "1");
        const completionPrice = parseFloat(model.pricing?.completion || "1");
        return promptPrice === 0 && completionPrice === 0;
      });

      const category = args.category || "all";
      let filtered = freeModels;
      
      if (category === "instruct") {
        filtered = freeModels.filter(m => m.id.includes("instruct"));
      } else if (category === "chat") {
        filtered = freeModels.filter(m => !m.id.includes("instruct"));
      }

      const modelList = filtered.map(m => ({
        id: m.id,
        name: m.name,
        context_length: m.context_length,
        created: m.created,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              total_free_models: modelList.length,
              models: modelList,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    }

    if (name === "get_model_info") {
      const response = await fetch(OPENROUTER_API);
      const data = await response.json();
      
      const model = data.data.find(m => m.id === args.model_id);
      
      if (!model) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Model not found" }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(model, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
