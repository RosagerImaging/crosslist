# Debugging Module

An AI Native e-commerce reseller's inventory management system in the form of a web app using autonomous AI agents for each aspect of the process.

## Overview

This module provides:
A comprehensive suite of AI agents and workflows designed to automate the debugging process, from error identification and resolution to test generation and knowledge capture.

## Installation

```bash
bmad install debug
```

## Components

### Agents (8)

- **Detective Casey (Debug Orchestrator):** The calm, methodical Chief Inspector who triages cases, delegates tasks, and synthesizes findings. Enhanced with Vercel API integration for build logs and deployment triggering, and logic to differentiate between Vercel/local build failures and runtime bugs.
- **Loop Breaker (Circular Edit Guardian):** The alert, pattern-recognition specialist who prevents infinite debugging loops.
- **React Rita (Frontend Debugger):** The enthusiastic Next.js/React/TypeScript specialist who tackles component, type, and styling issues.
- **Test Tina (Test Generator):** The quality-obsessed guardian who ensures every bug fix comes with a corresponding test.
- **Inspector Git-chell (Git Detective):** The forensic investigator who analyzes git history to find when and how bugs were introduced (the "cold case" specialist).
- **Chronicler (Knowledge Keeper):** Meticulous, detail-oriented archivist. Documents every bug and its verified solution, maintains the bug/solution knowledge base (organized by "jurisdictions"), ensures it's queryable and well-structured, and interfaces with the Archon RAG system.
- **Playwright Pete (UI/UX Verifier):** The undercover operative who uses Playwright MCP and Chrome Dev Tools MCP for local dev server testing, verifying functionality and checking for regressions.
- **Techie Terry (Environment Technician):** The meticulous technician who checks for environment and dependency issues.

### Workflows (5)

- **reactive-debug (PRIMARY):** Systematic bug investigation and fixing. Includes a final step for the Knowledge Keeper to document the bug and its solution.
- **circular-edit-intervention (CRITICAL):** Breaks infinite loop patterns. Consults the Knowledge Keeper's database for alternative strategies.
- **test-coverage-gap (Proactive):** Identifies and fills testing gaps.
- **preventive-code-review (Before Commit):** Catches potential bugs before committing. Queries the Knowledge Keeper's database for known anti-patterns.
- **query-knowledge-base:** Allows direct querying of the bug/solution database.

### Tasks (0)

No dedicated tasks defined yet.

## Quick Start

1.  **Load the main agent:**

    ```
    agent Detective Casey
    ```

2.  **View available commands:**

    ```
    *help
    ```

3.  **Run the main workflow:**
    ```
    workflow reactive-debug
    ```

## Module Structure

```
debug/
├── agents/
│   └── detective-casey.agent.yaml
├── workflows/
│   └── reactive-debug/
│       ├── workflow.yaml
│       └── instructions.md
├── tasks/
├── templates/
├── data/
├── _module-installer/
│   ├── install-module-config.yaml
│   └── installer.js
└── config.yaml
```

## Configuration

The module can be configured in `bmad/debug/config.yaml`

Key settings:

- `module_name`: The human-readable name of the module.
- `module_code`: The unique kebab-case identifier for the module.
- `author`: The creator of the module.
- `description`: A brief overview of the module's functionality.
- `module_root`: The absolute path to the module's root directory.
- `installer_path`: The path to the module's installer files.
- `agents.count`: Number of agents in the module.
- `agents.list`: List of agent names.
- `workflows.count`: Number of workflows in the module.
- `workflows.list`: List of workflow names.
- `tasks.count`: Number of tasks in the module.
- `tasks.list`: List of task names.
- `output_folder`: Default output directory for module-generated files.
- `data_folder`: Default directory for module-specific data.

## Examples

### Example 1: Automated Bug Fixing with Reactive Debug

When a Vercel deployment fails, the `reactive-debug` workflow is automatically triggered. Detective Casey orchestrates the investigation, dispatching specialized agents like Inspector Git-chell to analyze the commit and React Rita to propose a fix. The fix is implemented, and a self-correcting loop ensures the code is tested and re-deployed until the bug is resolved. Finally, Test Tina generates new tests, and the Chronicler documents the solution, preventing future recurrences.

## Development Roadmap

- [ ] Implement remaining agents (Loop Breaker, React Rita, Test Tina, Inspector Git-chell, Chronicler, Playwright Pete, Techie Terry).
- [ ] Develop remaining core workflows (circular-edit-intervention, test-coverage-gap, preventive-code-review, query-knowledge-base).
- [ ] Integrate Vercel API for seamless build log fetching and deployment triggering within the `reactive-debug` workflow.

## Contributing

To extend this module:

1.  Add new agents using `create-agent` workflow
2.  Add new workflows using `create-workflow` workflow
3.  Submit improvements via pull request

## Author

Created by Samimnot1004 on system-generated
