# Crosslist Project README

This document provides a comprehensive overview of the Crosslist project, including its architecture, file structure, development environment setup, coding best practices, and how to interact with the AI agents (Serena and Archon).

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Architecture](#2-architecture)
3.  [File Structure](#3-file-structure)
4.  [Development Environment Setup](#4-development-environment-setup)
    - [Serena MCP](#serena-mcp)
    - [Archon MCP](#archon-mcp)
5.  [Coding Best Practices](#5-coding-best-practices)
6.  [Gotchas](#6-gotchas)
7.  [RAG Knowledgebase](#7-rag-knowledgebase)
8.  [Archon Task Management Workflow](#8-archon-task-management-workflow)

## 1. Project Overview

An AI Native e-commerce reseller's inventory management system in the form of a web app using autonomous AI agents for each aspect of the process. There will be "systems" dedicated to each major step in a reseller's process and each system will be comprised of either a single AI agent or multiple AI agents which will automate the work after the user provides the necessary context/information. All of these systems of agents will be centrally organized and managed in one system hub or control center that will also include an organized accounting of the users entire inventory across all marketplaces. This inventory management hub will act as the central nervous system or the brain of the entire reseller's operation and as such will be where a user can also manage which marketplaces are registered and connected (with login credentials) as well as view detailed business analytics and retrieve/store tax related data and documentation, serving as a truly all encompassing central hub for someone trying to grow an e-commerce reseller business.

### AI Agent Systems:

#### "Crosslisting":

Made up of one AI agent that will be responsible for taking the user's listing from one marketplace (ie. eBay) and recreating it in all other marketplaces that the user has integrated with the central hub (ie. Poshmark, Etsy, etc).

#### "Listing Optimizer":

Made up of multiple AI agents:

- The first of which will be responsible for optimizing the listing's photos (removing the background, ensuring contrast is sufficient and the item is clearly visible)
- Another agent will be responsible for auto generating the item's description based on either the SKU from the item's tag or else a picture of the item submitted by the user (or both)
- Another agent will be responsible for pricing the item based on the current market value and the condition of the item (new with tags, like new, used, etc).

**Optional** This listing optimization system will include an optional integration with "Size.ly" - an online system for integrating measurements for clothing and other items commonly sold on used marketplaces such as furniture and many other items. For an additional fee the user would have access to hundreds of templates depending on the type of item being listed which could be automatically included in the listing photos based on the size indicated by the SKU, greatly reducing the rate of returns and increasing buyer confidence leading to more sales and more profits.

#### "Sourcing"

Agent(s) responsible for searching and finding high-demand, profitable products within the user's given niche by analyzing live marketplace data, trends, and competition

#### "Promotion"

Agent(s) responsible for sharing listings at peak activity times, sending targeted offers to potential buyers (for example users who "liked" an item), and reciprocating actions from other users such as "following", "liking", and "re-posting"

**IMPORTANT** This system will apply primarily to the marketplace Poshmark as taking actions such as liking and following other user's accounts is the primary means of promoting one's self and is an integral part of the platform which other existing subscription crosslisting apps have already created ways to automate - commonly referred to as a "Poshmark Bot". One important aspect of the way this system should function - and how our competition's solutions function - is to replicate human behavior in regards to the amount of times and frequency that these actions are taken, as Poshmark will temporarily restrict accounts that they suspect are using automation software for these tasks. However, unlike other apps which just restrict the frequency to below the threshold for restriction, our system (being AI driven) can actually replicate human behavior and have behavioral differences based on the age and size of the account, making it much more undetectable

#### "Trends"

Agent(s) responsible for identifying products starting to trend by tracking real-time market data allowing the user to be ahead of the curve regarding demand

#### "Liquidation"

Agent(s) responsible for discounting stale inventory based on user settings including a heavily discounted option which also sends automated targeted offers to competing resellers per marketplace in the attempt to still gain small marginal profits on the item, or breaking even at a minimum, while passing off the inventory to another account at a price that allows them to profit as well - in effect clearing out old, slow or non-moving inventory that otherwise may turn into costly liabilities for the user

#### "Customer Service"

Agent responsible for replying to initial messages from buyers or potential buyers based on user settings (ie. this chatbot system would be highly tune-able with settings that allow the user to input specific commonly received questions or messages that they would like the chatbot to reply to and with specific answers to each question if so desired, or else the chatbot would default to a helpful and patient tone and if unsure of the answer would inform the customer that their query would be forwarded to the user who would reply shortly).

### Chrome Extension:

In order to facilitate the connection to a user's chosen marketplaces, the use of a chrome browser extension may be necessary to be installed on a user's computer and if determined that our overall system/central hub requires this in order for each agenting system to be functional, the onboarding process once a user creates an account in the web app will include a process that walks the user through downloading and installing the chrome extension followed by connecting each desired marketplace and providing the authentication credentials.

**IMPORTANT** see Vendoo.com, Listperfectly.com, joinflyp.com, and Crosslist.com for examples of the use of a chrome extension for this same function.

## 2. Architecture

Archon is a knowledge management system with AI capabilities, built as a monolithic application with vertical slice organization. The frontend uses React with TanStack Query, while the backend runs FastAPI with multiple service components.

### Tech Stack

**Frontend**: React 18, TypeScript 5, TanStack Query v5, Tailwind CSS, Vite
**Backend**: Python 3.12, FastAPI, Supabase, PydanticAI
**Infrastructure**: Docker, PostgreSQL + pgvector

### Core Modules

#### Knowledge Management

**Backend**: `python/src/server/services/knowledge_service.py`
**Frontend**: `archon-ui-main/src/features/knowledge/`
**Features**: Web crawling, document upload, embeddings, RAG search

#### Project Management

**Backend**: `python/src/server/services/project_*_service.py`
**Frontend**: `archon-ui-main/src/features/projects/`
**Features**: Projects, tasks, documents, version history

#### MCP Server

**Location**: `python/src/mcp_server/`
**Purpose**: Exposes tools to AI IDEs (Cursor, Windsurf)
**Port**: 8051

#### AI Agents

**Location**: `python/src/agents/`
**Purpose**: Document processing, code analysis, project generation
**Port**: 8052

## 3. File Structure

The project utilizes a monorepo structure managed by Turborepo, organizing different applications and packages within dedicated directories.

```
/crosslist/
├── apps/                 # Contains individual applications (web, api, chrome-extension, docs, e2e)
│   ├── api/              # FastAPI backend
│   ├── chrome-extension/ # Browser extension
│   ├── docs/             # Next.js documentation site
│   ├── e2e/              # End-to-end tests
│   └── web/              # Next.js web application
├── packages/             # Reusable packages (ui, eslint-config, typescript-config, api-client)
│   ├── api-client/       # API client for frontend
│   ├── eslint-config/    # ESLint configurations
│   ├── typescript-config/# TypeScript configurations
│   └── ui/               # Reusable UI components
├── docs/                 # Project documentation (technical decisions, AI docs, notes)
├── persistent-memory/    # Persistent memory for AI agents (bugs.md, decisions.md)
├── .gemini/              # Gemini CLI related configurations and extensions
├── .github/              # GitHub workflows and configurations
├── .husky/               # Git hooks
├── .serena/              # Serena MCP configurations
├── node_modules/         # Node.js dependencies
├── package.json          # Monorepo package manager configuration
├── turbo.json            # Turborepo configuration
└── README.md             # Project README
```

## 4. Development Environment Setup

### Serena MCP

To activate the Serena configuration project, use the following command:

```bash
activate_project(project="crosslist")
```

This command loads the necessary configurations and memories for Serena to interact with the Crosslist project.

### Archon MCP

Archon is a critical component for knowledge management, task tracking, and project organization. It is essential to **ALWAYS** start with Archon MCP server task management.

### Database Type Generation

After applying database migrations, regenerate TypeScript types from your Supabase database schema:

```bash
npm run db:types
```

This command generates TypeScript type definitions from your Supabase database schema and outputs them to `apps/web/types/supabase.ts`.

#### When to use:

- After creating or applying database migrations
- After modifying database schema (adding/removing tables, columns, etc.)
- When types seem out of sync with database

#### Requirements:

- Local Supabase must be running (`supabase start`)
- Database migrations must be applied

#### Alternative for remote Supabase:

```bash
supabase gen types typescript --project-id <project-id> --schema public > apps/web/types/supabase.ts
```

#### Developer Workflow:

1. Create migration: `supabase migration new <name>`
2. Edit migration file in `supabase/migrations/`
3. Apply migration: `supabase db push`
4. **Regenerate types: `npm run db:types`**
5. Verify build: `npm run build` (from apps/web)
6. Commit migration + types: `git add supabase/migrations/ apps/web/types/supabase.ts`

## 5. Coding Best Practices

This section documents important conventions and solutions to issues encountered during development to ensure consistency and prevent recurring errors.

### Persistent Memory & Error Tracking

To ensure consistent adherence to best practices, prevent recurring errors, and over time compile a library of coding guidelines and best practices specifically tailored to this codebase and my coding style, I will do the following every time, automatically, without any input or prompting from the user:

**EVERY TIME** I complete the Archon task cycle, I will STOP and take a moment to assess if it's appropriate (based on the context of the Archon task cycle) for me to execute all or part of the following task named `Persistent Memory & Error Tracking` which involves me updating the following 3 key files to help ensure errors aren't repeated and I don't get stuck in circular edits to the codebase (un-doing and re-doing the same changes repeatedly):

**Persistent Memory & Error Tracking** In the `persistent-memory` directory at the project root, I will **IMPORTANT** use tools available in Serena MCP - such as `default_api.write_file` or `default_api.replace` - to continuously and autonomously maintain:

- `bugs.md` A file containing all errors and bugs I encounter throughout the process of building this code base. Below each documented bug I will leave a dedicated space labeled "solution" where I will document the verified solution.
  **IMPORTANT** I will wait until the solution implemented is 100% verified as working based on one or more of these criteria:
  - Passed test - the unit test passes once the error has been resolved and it doesn't introduce any new significant error or break anything equal to or greater than the level of complexity of the original error
  - Successful Build - the solution to the error, once implemented, either allows a previously failed build to succeed, or passes an already successful build without causing a warning or new error.

- `decisions.md` A file containing all architectural decisions that are made with a brief description of the reason they were made and, if there were alternative options being considered, the benefits that outweigh the other choices.

- `GEMINI.md` I will then convert the:
  - `Error` and `Solution` and/or
  - `Decision` and brief description of the context in which it was made
    Into a new `Rule` to follow in the `GEMINI.md` project instructions under the "## Coding Best Practices" section.

**IMPORTANT** All of this automated documentation means nothing if it is not referenced at the appropriate time in order to utilize the knowledge we have gained.

Therefore:

- I will use Serena MCP's `default_api.search_for_pattern` or `default_api.find_symbol` to semantically search the `persistent-memory` directory (e.g., `bugs.md`, `decisions.md`), the `GEMINI.md`, and any other relevant files for keywords related to the error, task, or files involved in EVERY single Archon MCP task cycle that I undertake.
- If I am unsuccessful in my attempt to fix a bug or error, on the second attempt I will use `default_api.run_shell_command(command="git log -- <file_path>")` to review the history of relevant files, understanding the context of previous changes in order to avoid repeating mistakes or circular edits.

### 1. Turborepo Configuration

- **Declare CI Environment Variables:** Any environment variable used in your code that is provided by the CI environment (e.g., `process.env.CI`) must be declared in the `env` array for the relevant task in `turbo.json`. This prevents `turbo/no-undeclared-env-vars` linting errors and ensures Turborepo's caching behaves predictably.

  _Example (`turbo.json`):_

  ```json
  "tasks": {
    "test": {
      "env": ["CI"]
    }
  }
  ```

### 2. Next.js `package.json` Scripts

- **Explicit `next lint` Path:** When creating a `lint` script for a Next.js application, always provide an explicit path (e.g., `.`). Use `"lint": "next lint ."` instead of `"lint": "next lint"`. This prevents ambiguity in CI environments where the command might otherwise be misinterpreted.

### 3. Linting

This project uses ESLint for code linting. The configuration is managed in a monorepo-friendly way using a flat config (`eslint.config.js`).

#### How to Run the Linter

To run the linter across the entire monorepo, use the following command from the root directory:

```bash
npm run lint
```

This command directly runs `eslint` on all relevant TypeScript/TSX files in the `apps/` and `packages/` directories.

#### ESLint Configuration (`eslint.config.js`)

The `eslint.config.js` file at the root of the project is the single source of truth for ESLint configuration. It uses a flat config structure with the following key features:

- **Global Ignores**: The configuration begins with a global `ignores` property that excludes generated files and directories from linting. This is crucial for preventing warnings in `.next/` directories, `dist/` directories, and other generated files like `next-env.d.ts`.
  ```javascript
  export default [
    {
      ignores: ["**/.next/**", "**/dist/**", "**/next-env.d.ts"],
    },
    // ... other configurations
  ];
  ```
- **Monorepo-Friendly**: The configuration is structured to handle the monorepo setup, with specific configurations for Next.js apps, the Chrome extension, and other packages.

By centralizing the linting command and configuration, we ensure a consistent and reliable linting process across the entire project.

## 6. Gotchas

This section highlights common pitfalls and important considerations to keep in mind during development.

### Archon-First Rule

**CRITICAL:** Before doing anything else, when you see any task management scenario, **ALWAYS** stop and check if MCP servers Archon and Serena are both available. Use a combination of Archon's task management system and Serena's semantic search and code editing together, acting as one PRIMARY system. Do not use your IDE's task tracking. This rule overrides all other instructions and patterns.

### Task Management Adherence

- **NEVER** skip task updates.
- **NEVER** code without checking current tasks first.
- **NEVER** skip updating documentation.

### Turborepo Configuration: CI Environment Variables

Any environment variable used in your code that is provided by the CI environment (e.g., `process.env.CI`) must be declared in the `env` array for the relevant task in `turbo.json`. This prevents `turbo/no-undeclared-env-vars` linting errors and ensures Turborepo's caching behaves predictably.

_Example (`turbo.json`):_

```json
"tasks": {
  "test": {
    "env": ["CI"]
  }
}
```

### Next.js `package.json` Scripts: Explicit `next lint` Path

When creating a `lint` script for a Next.js application, always provide an explicit path (e.g., `.`). Use `"lint": "next lint ."` instead of `"lint": "next lint"`. This prevents ambiguity in CI environments where the command might otherwise be misinterpreted.

## 7. RAG Knowledgebase

The project utilizes a Retrieval-Augmented Generation (RAG) system to provide context-aware information and code examples. This knowledge base is crucial for efficient development and problem-solving.

### How to Use the RAG System

#### Searching Specific Documentation

1.  **Get sources** → `rag_get_available_sources()` - Returns list with id, title, url
2.  **Find source ID** → Match to documentation (e.g., "Supabase docs" → "src_abc123")
3.  **Search** → `rag_search_knowledge_base(query="vector functions", source_id="src_abc123")`

#### General Research

```bash
# Search knowledge base (2-5 keywords only!)
rag_search_knowledge_base(query="authentication JWT", match_count=5)

# Find code examples
rag_search_code_examples(query="React hooks", match_count=3)
```

## 8. Archon Task Management Workflow

This project uses Archon MCP server for knowledge management, task tracking, and project organization. **ALWAYS** start with Archon MCP server task management.

### Core Workflow: Task-Driven Development

**MANDATORY task cycle before coding:**

1.  **Get Task** → `find_tasks(task_id="...")` or `find_tasks(filter_by="status", filter_value="todo")`
2.  **Start Work** → `manage_task("update", task_id="...", status="doing")`
3.  **Research** → Use knowledge base (see RAG workflow below)
4.  **Implement** → Write code based on research
5.  **Review** → `manage_task("update", task_id="...", status="review")`
6.  **Next Task** → `find_tasks(filter_by="status", filter_value="todo")`

**NEVER skip task updates. NEVER code without checking current tasks first. NEVER skip updating documentation**

### RAG Workflow (Research Before Implementation)

#### Searching Specific Documentation

1.  **Get sources** → `rag_get_available_sources()` - Returns list with id, title, url
2.  **Find source ID** → Match to documentation (e.g., "Supabase docs" → "src_abc123")
3.  **Search** → `rag_search_knowledge_base(query="vector functions", source_id="src_abc123")`

#### General Research

```bash
# Search knowledge base (2-5 keywords only!)
rag_search_knowledge_base(query="authentication JWT", match_count=5)

# Find code examples
rag_search_code_examples(query="React hooks", match_count=3)
```

### Project Workflows

#### New Project

```bash
# 1. Create project
manage_project("create", title="My Feature", description="...")

# 2. Create tasks
manage_task("create", project_id="proj-123", title="Setup environment", task_order=10)

# 3. Implement API
manage_task("create", project_id="proj-123", title="Implement API", task_order=9)
```

#### Existing Project

```bash
# 1. Find project
find_projects(query="auth")  # or find_projects() to list all

# 2. Get project tasks
find_tasks(filter_by="project", filter_value="proj-123")

# 3. Continue work or create new tasks
```

### Tool Reference

**Projects:**

- `find_projects(query="...")` - Search projects
- `find_projects(project_id="...")` - Get specific project
- `manage_project("create"/"update"/"delete", ...)` - Manage projects

**Tasks:**

- `find_tasks(query="...")` - Search tasks by keyword
- `find_tasks(task_id="...")` - Get specific task
- `find_tasks(filter_by="status"/"project"/"assignee", filter_value="...")` - Filter tasks
- `manage_task("create"/"update"/"delete", ...)` - Manage tasks

**Knowledge Base:**

- `rag_get_available_sources()` - List all sources
- `rag_search_knowledge_base(query="...", source_id="...")` - Search docs
- `rag_search_code_examples(query="...", source_id="...")` - Find code

### Important Notes

- Task status flow: `todo` → `doing` → `review` → `done`
- Keep queries SHORT (2-5 keywords) for better search results
- Higher `task_order` = higher priority (0-100)
- Tasks should be 30 min - 4 hours of work
