# OpenRouter Models MCP

MCP server for fetching actual FREE models from OpenRouter API in real-time

## Installation

```bash
cd ~/.local/share/mcp-servers/openrouter-models
npm install
```

## Configuration

Add to your Claude Code config (`~/.claude.json` or `~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "openrouter-models": {
      "command": "node",
      "args": ["/home/andrej/.local/share/mcp-servers/openrouter-models/index.js"]
    }
  }
}
```

## Tools

### get_free_models
Get list of currently available FREE models from OpenRouter API.

- `category` (optional): Filter - `all`, `chat`, `instruct`

### get_model_info
Get detailed info about a specific OpenRouter model.

- `model_id` (required): Model ID (e.g., `google/gemini-2.0-flash-exp:free`)

## License

MIT
