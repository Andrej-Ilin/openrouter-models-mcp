# OpenRouter Models MCP

MCP server for fetching actual FREE models from OpenRouter API in real-time.

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

## Tools

### get_free_models

Get list of currently available FREE models from OpenRouter API.

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

## License

MIT
