# Start Up Commands

MCP's and other servers and services to start before beginning work on the codebase:

## Serena MCP:

**From /home/optiks/dev/mcp/serena**:

```uv run serena start-mcp-server --project crosslist --context ide-assistant --transport streamable-http --port 9121

```

## Archon MCP:

**From /home/optiks/dev/context-engineering/Archon**:

```docker compose up -d --build

```

## Gemini/Claude CLI prompts:

**Serena MCP**

- To activate Serena MCP's tools:

Gemini:
prompt - ``Use Serena MCP to first read Serena's initial instructions and ensure project onboarding has been completed for the current working directory. Afterwards, use Serena MCP's `activate_project` tool to activate project name "crosslist" located at home/optiks/dev/crosslist. I am NOT IN ANY WAY REFERRING TO THE ARCHON MCP SERVER OR ANY PROJECT WITHIN ARCHON OR ITS PROJECT MANAGEMENT OR TASK MANAGEMENT SYSTEM. DO NOT IN AN WAY ALTER, CREATE, OR MANAGE ANY PROJECT USING ARCHON. THIS TASK ONLY INVOLVES THE SERENA MCP SERVER AND THREE OF THE TOOLS AVAILABLE THROUGH THE SERENA MCP: `check_onboarding_performed`, `initial_instructions` AND `activate_project`.``

Claude:
command - `/mcp_serena_initial_instructions`

- Browser window will automatically open

**Archon**

- After restarting Docker container, open `Http://localhost:3737`

- `GEMINI.md` and `CLAUDE.md` already have instructions for automatically leveraging Archon's RAG and Project/Task management systems
