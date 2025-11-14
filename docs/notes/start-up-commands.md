# Start Up Commands

MCP's and other servers and services to start before beginning work on the codebase:

## Serena MCP:

**From /home/optiks/dev/mcp/serena**:

```uv run serena start-mcp-server --context ide-assistant --transport streamable-http --port 9121

```

## Archon MCP:

**From /home/optiks/dev/context-engineering/Archon**:

```docker compose up -d --build

```

## Gemini/Claude CLI prompts:

**Serena MCP**

- To activate Serena MCP's tools:

Gemini:
prompt - ``Use Serena MCP to activate the Serena configuration project called "crosslist". This project already exists inside the `.serena` directory. I am NOT REFERRING TO ANY PROJECT INSIDE ARCHON MCP and you are absolutely not to create, modify, or in any way manage any project within Archon, this task has only to do with Serena MCP and loading memories and configurations relating to our project (crosslist) that allow Serena MCP's tools to be leveraged.``

Claude:
command - `/mcp_serena_initial_instructions`

- Browser window will automatically open

**Archon**

- After restarting Docker container, open `Http://localhost:3737`

- `GEMINI.md` and `CLAUDE.md` already have instructions for automatically leveraging Archon's RAG and Project/Task management systems
