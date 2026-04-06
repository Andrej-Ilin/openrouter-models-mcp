# OpenRouter Models MCP

MCP server for fetching currently available free models from the OpenRouter API in real time.

## What it does

- lists models that currently have zero prompt and completion pricing
- returns detailed metadata for a specific model
- works as a lightweight MCP utility for model discovery inside coding agents and local tooling

## Installation

```bash
npm install -g openrouter-models-mcp
```

## Configuration

Add to your Claude Code config (`~/.claude.json`):

```json
{
  "mcpServers": {
    "openrouter-models": {
      "command": "openrouter-models-mcp",
      "args": []
    }
  }
}
```

The server uses the public OpenRouter models endpoint, so no API key is required for the read-only use cases implemented here.

## Tools

### get_free_models

Get the list of currently available free models from the OpenRouter API.

**Parameters:**
- `category` (optional): Filter by category - `all`, `chat`, `instruct`

**Example response:**
```json
{
  "total_free_models": 32,
  "models": [
    {
      "id": "google/gemma-3-27b-it:free",
      "name": "Google: Gemma 3 27B",
      "context_length": 131072
    }
  ]
}
```

### get_model_info

Get detailed info about a specific OpenRouter model.

**Parameters:**
- `model_id` (required): Model ID (e.g., `google/gemma-3-27b-it:free`)

## Notes

- The list of free models can change over time because it is fetched live from OpenRouter.
- The repository is intentionally small and focused on one task: quick discovery of currently free models.

## License

MIT
