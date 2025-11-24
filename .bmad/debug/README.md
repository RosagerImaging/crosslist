# Debugging Module Brief

## Module Concept and Vision

This module will cover every aspect of debugging; error identification, resolution, and prevention; and test coverage. It will have a specialized debugging orchestrator as well as specialized agents for each language and coding framework, as well as agents for test creation and validation. It will utilize Playwright MCP and Chrome Dev Tools MCP to work in an iterative self-correcting loop, jumping between agents who identify errors and bugs, agents who write tests based on resolving those errors, agents who write the code to fix the errors and pass the tests, and agents who directly view the end results of the new code by launching a local dev server and utilizing Playwright or Chrome Dev Tools to test the actual rendered code just as a human user would (clicking, scrolling, typing, etc, using the actual functionality of the new code and verifying the new code didn't break any existing functionality or that resolving one error uncovered a new error). At which point that agent would draft a short report with either the message that the fixes have been successful, or that there are still errors and include detailed descriptions, build log messages, and file names, etc, and pass that report back to the orchestrator so that the process can be repeated until the section of codebase is error free and fully functional.

## Module Identity

- **Module Code:** `debug`
- **Module Name:** `Debugging Module`
- **Module Category:** Technical (devops, testing, architecture)
- **Personality Theme:** The "BMad Detective Agency" - a team of specialized detectives and experts, each with a unique personality and role, working together to solve cases (bug investigations).

## Agent Roster (BMad Detective Agency)

- **Detective Casey (Debug Orchestrator):** The calm, methodical Chief Inspector who triages cases, delegates tasks, and synthesizes findings.
- **Loop Breaker (Circular Edit Guardian):** The alert, pattern-recognition specialist who prevents infinite debugging loops.
- **The JSX Gumshoe (Frontend Debugger):** The enthusiastic Next.js/React/TypeScript specialist who tackles component, type, and styling issues.
- **The Quality Marshal (Test Generator):** The quality-obsessed guardian who ensures every bug fix comes with a corresponding test.
- **Inspector Git-chell (Git Detective):** The forensic investigator who analyzes git history to find when and how bugs were introduced.
- **The Lead Reporter (Knowledge Keeper):** Meticulous, detail-oriented archivist. Documents every bug and its verified solution.
- **P.I. Playwright (UI/UX Verifier):** The undercover operative who uses Playwright MCP and Chrome Dev Tools MCP for local dev server testing, verifying functionality and checking for regressions.
- **The Quartermaster (Environment Technician):** The meticulous technician who checks for environment and dependency issues.

## Workflow Protocols

- **reactive-debug (PRIMARY):** Systematic bug investigation and fixing.
- **circular-edit-intervention:** Detects and breaks repetitive or circular debugging patterns, leveraging the Knowledge Keeper's database to suggest alternative strategies.
- **test-coverage-gap:** Proactively identifies and fills gaps in test coverage.
- **preventive-code-review:** Analyzes proposed code changes before they are committed, identifying potential bugs and suggesting improvements.
- **query-knowledge-base:** Allows for the direct querying of the bug/solution Archon RAG knowledge base.
- **verify-element (P.I. Playwright):** Uses the Playwright backend to verify that a specific UI element exists on the current web page.
- **click-element (P.I. Playwright):** Uses the Playwright backend to simulate a click on a specific UI element.
- **fill-form (P.I. Playwright):** Uses the Playwright backend to fill form fields on the current web page.
- **extract-text (P.I. Playwright):** Uses the Playwright backend to extract all visible text from the current web page.
- **capture-evidence (P.I. Playwright):** Uses the Playwright backend to take a screenshot of the current web page.
- **switch-tab (P.I. Playwright):** Uses the Playwright backend to switch to a different open tab in the browser.
- **get-intel (P.I. Playwright):** Uses the Playwright backend to describe the current page's layout and elements.
- **verify-environment (The Quartermaster):** Verifies the current operational environment for any discrepancies.
- **inspect-dependencies (The Quartermaster):** Conducts a thorough inspection of all project dependencies and their states.
- **install-dependencies (The Quartermaster):** Procures and installs any missing or outdated dependencies.
- **cleanse-environment (The Quartermaster):** Executes a thorough cleansing of the environment.
- **document-setup (The Quartermaster):** Compiles a detailed dossier of the current environment setup.

## User Journey and Scenarios

1.  **The Reactive Debugger:** "As a developer leveraging LLM code assist agents, I want to fix errors written in the AI generated code, so that I end up with a codebase that functions as intended."
2.  **The Proactive Guardian:** "As a novice vibe coder using an AI code assist agent, I want to have a system in place that preemptively avoids incorrectly written code before I commit and push to my GitHub repository, so that my codebase builds and deploys to my local dev server without any errors in the logs."
3.  **The Knowledge Builder:** "As a non-coding app developer, I want to build a file containing the solutions to every error and bug I encounter while building my app, so that I can add it to my RAG knowledge base within Archon MCP and give the coding agent proper context to not repeat past mistakes."

## Development Roadmap (Phase 1 - MVP)

This module is designed for the first phase of development, focusing on core debugging functionalities, comprehensive agent roles, and foundational workflows to establish a robust debugging ecosystem.
