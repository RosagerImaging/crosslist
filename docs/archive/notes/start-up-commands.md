# Start Up Commands

MCP's and other servers and services to start before beginning work on the codebase:

## Serena MCP:

**From /home/optiks/dev/mcp/serena**:

```uv run serena start-mcp-server --project crosslist --context /home/optiks/dev/mcp/serena/src/serena/resources/config/contexts/gemini-archon.yml --mode /home/optiks/dev/mcp/serena/src/serena/resources/config/modes/bmad.yml --mode interactive --mode editing --project /home/optiks/dev/crosslist --transport streamable-http --port 9121

```

## Archon MCP:

**From /home/optiks/dev/context-engineering/Archon**:

```docker compose up -d --build

```

## Gemini/Claude CLI prompts:

**Serena MCP**

- To activate Serena MCP's tools:

Gemini:
prompt - `activate Serena project crosslist`

Claude:
command - `/mcp_serena_initial_instructions`

- Browser window will automatically open

**Load project context**

- After Serena activates project, use Gemini custom slash command /primer to load project context into chat session

**Archon**

- After restarting Docker container, open `Http://localhost:3737`

- `GEMINI.md` and `CLAUDE.md` already have instructions for automatically leveraging Archon's RAG and Project/Task management systems
