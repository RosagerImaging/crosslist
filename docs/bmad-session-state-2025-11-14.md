# BMad Session State - 2025-11-14

## Resumption Instructions

To resume this session, provide the following prompt to the BMad Builder agent:

"CRITICAL: You are the BMad Builder agent. Resume our previous session by loading the session state from `@docs/bmad-session-state-2025-11-14.md`. You were in the middle of the `create-module` workflow. You had just completed Step 1 and were about to begin Step 2. The full module brief is included below. Use it to continue the `create-module` workflow from Step 2."

## Current State

- **Workflow:** `create-module`
- **Current Step:** Proceeding to Step 2: Plan module components.
- **Module Brief:**

---

# Debugging Module Brief

## Module Concept and Vision

This module will cover every aspect of debugging; error identification, resolution, and prevention; and test coverage. It will have a specialized debugging orchestrator as well as specialized agents for each language and coding framework, as well as agents for test creation and validation. It will utilize Playwright MCP and Chrome Dev Tools MCP to work in an iterative self-correcting loop, jumping between agents who identify errors and bugs, agents who write tests based on resolving those errors, agents who write the code to fix the errors and pass the tests, and agents who directly view the end results of the new code by launching a local dev server and utilizing Playwright or Chrome Dev Tools to test the actual rendered code just as a human user would (clicking, scrolling, typing, etc, using the actual functionality of the new code and verifying the new code didn't break any existing functionality or that resolving one error uncovered a new error). At which point that agent would draft a short report with either the message that the fixes have been successful, or that there are still errors and include detailed descriptions, build log messages, and file names, etc, and pass that report back to the orchestrator so that the process can be repeated until the section of codebase is error free and fully functional.

## Module Identity

- **Module Code:** `debug`
- **Module Name:** `Debugging Module`
- **Module Category:** Technical (devops, testing, architecture)
- **Personality Theme:** The "BMad Detective Agency" - a team of specialized detectives and experts, each with a unique personality and role, working together to solve cases (bug investigations).

## Agent Architecture Planning

- **Debug Orchestrator ("Detective Casey"):** The calm, methodical Chief Inspector who triages cases, delegates tasks, and synthesizes findings. Enhanced with Vercel API integration for build logs and deployment triggering, and logic to differentiate between Vercel/local build failures and runtime bugs.
- **Circular Edit Guardian ("Loop Breaker"):** The alert, pattern-recognition specialist who prevents infinite debugging loops.
- **Frontend Debugger ("React Rita"):** The enthusiastic Next.js/React/TypeScript specialist who tackles component, type, and styling issues.
- **Test Generator ("Test Tina"):** The quality-obsessed guardian who ensures every bug fix comes with a corresponding test.
- **Git Detective ("Inspector Git-chell"):** The forensic investigator who analyzes git history to find when and how bugs were introduced (the "cold case" specialist).
- **Knowledge Keeper ("Chronicler"):** Meticulous, detail-oriented archivist. Documents every bug and its verified solution, maintains the bug/solution knowledge base (organized by "jurisdictions"), ensures it's queryable and well-structured, and interfaces with the Archon RAG system.
- **UI/UX Verifier ("Playwright Pete"):** The undercover operative who uses Playwright MCP and Chrome Dev Tools MCP for local dev server testing, verifying functionality and checking for regressions.
- **Environment Technician ("Techie Terry"):** The meticulous technician who checks for environment and dependency issues (Phase 2 agent).

## Workflow Ecosystem Design

- **Core Workflows:**
  - **`reactive-debug` (PRIMARY):** Systematic bug investigation and fixing. Will include a final step for the **Knowledge Keeper** to document the bug and its solution.
  - **`circular-edit-intervention` (CRITICAL):** Breaks infinite loop patterns. Will consult the **Knowledge Keeper's** database for alternative strategies.

- **Feature Workflows:**
  - **`test-coverage-gap` (Proactive):** Identifies and fills testing gaps.
  - **`preventive-code-review` (Before Commit):** Catches potential bugs before committing. Will query the **Knowledge Keeper's** database for known anti-patterns.

- **Utility Workflows:**
  - **`query-knowledge-base`:** Allows direct querying of the bug/solution database.

## User Journey and Scenarios

1.  **The Reactive Debugger:** "As a developer leveraging LLM code assist agents, I want to fix errors written in the AI generated code, so that I end up with a codebase that functions as intended."
2.  **The Proactive Guardian:** "As a novice vibe coder using an AI code assist agent, I want to have a system in place that preemptively avoids incorrectly written code before I commit and push to my GitHub repository, so that my codebase builds and deploys to my local dev server without any errors in the logs."
3.  **The Knowledge Builder:** "As a non-coding app developer, I want to build a file containing the solutions to every error and bug I encounter while building my app, so that I can add it to my RAG knowledge base within Archon MCP and give the coding agent proper context to not repeat past mistakes."

**Scenario Walkthrough: The Build & Deploy Debugger (Revised for Automation and Self-Correction)**

1.  **The Build Fails on Vercel:** You push your code. The Vercel deployment fails.
2.  **Automated Alarm:** The Vercel webhook sends a distress signal to the `apps/api` endpoint.
3.  **Detective Casey Takes the Case:** The `debug-orchestrator` agent activates, receiving the Vercel build logs and context. Casey dispatches **Inspector Git-chell** to analyze the commit. **Loop Breaker** begins its watch.
4.  **The Proposed Fix:** **React Rita** analyzes the code and proposes a fix.
5.  **Implementation:** Rita applies the code changes.
6.  **The Critical Test (The Self-Correcting Loop):**
    - **Detective Casey triggers a new Vercel deployment.**
    - If the build succeeds, Casey dispatches **Playwright Pete** to test the UI on the deployed app.
    - If the build fails again, the Vercel webhook sends new logs to Casey, and the loop continues with React Rita.
    - If Playwright Pete finds a new bug or regression, he reports it to Casey, and the loop continues with React Rita.
7.  **Test Generation & Knowledge Capture:** Once the fix is truly verified by Playwright Pete, **Test Tina** generates the necessary unit and E2E tests. The **Knowledge Keeper** meticulously documents the entire process, including failed attempts and the final, successful solution, into the bug/solution database (organized by "jurisdictions").

## Technical and Resource Planning

- **Data Requirements:**
  - Access to the entire codebase for analysis.
  - Read and write to the bug/solution knowledge base (structured markdown or JSON file).
  - Interact with `git` for history analysis.
  - Read build logs and error messages (from Vercel API and local processes).
- **Integration Points:**
  - **Archon MCP:** The bug/solution knowledge base will be a primary source for the RAG system.
  - **Playwright MCP & Chrome Dev Tools MCP:** "Playwright Pete" will rely on these for UI/UX testing.
  - **Vercel API:** For fetching build logs and triggering deployments.
  - **BMad Core:** The module will be built using the BMad core framework.
- **Complexity Assessment:**
  - This is a **Complex** module. It involves multiple agents with distinct roles, complex workflows with conditional logic, and deep integration with external tools (Git, Playwright, Vercel API, Archon RAG).

## Success Metrics and Validation

- **Module Success Criteria:**
  - **Reduced Time-to-Resolution:** The average time it takes to fix a bug should decrease significantly.
  - **Increased First-Pass Success Rate:** The percentage of builds that succeed on the first try should increase over time.
  - **Reduced Recurring Errors:** The number of times the same or similar bugs reappear should approach zero, thanks to the **Knowledge Keeper**.
  - **Increased Test Coverage:** The overall test coverage of the codebase should steadily increase as the module generates tests for each bug fix.
- **Quality Standards:**
  - **Performance:** The debugging module should not significantly slow down the development process. The automated loop should be efficient.
  - **Reliability:** The module should be able to handle a wide variety of common frontend errors without getting stuck in unresolvable loops.
  - **User Experience:** The reports generated by the module should be clear, concise, and actionable. When user intervention _is_ required, it should be a simple and straightforward process.

## Development Roadmap

- **Phase 1 - MVP (Minimum Viable Module):**
  - **Core Agents:**
    - Debug Orchestrator ("Detective Casey") - _Enhanced with Vercel API integration for build logs and deployment triggering, and logic to differentiate between Vercel/local build failures and runtime bugs._
    - Circular Edit Guardian ("Loop Breaker")
    - Frontend Debugger ("React Rita") - _Specialized in Next.js/React/TypeScript issues._
    - Test Generator ("Test Tina")
    - Git Detective ("Inspector Git-chell") - _Renamed._
    - Knowledge Keeper ("Chronicler") - _Initial implementation for documenting bugs/solutions, with a structured format for the knowledge base organized by "jurisdictions."_
    - UI/UX Verifier ("Playwright Pete") - _Initial implementation for local dev server testing, utilizing Playwright MCP and Chrome Dev Tools MCP._
  - **Core Workflows:**
    - `reactive-debug` (PRIMARY) - _Fully integrated with Knowledge Keeper and Playwright Pete, including the self-correcting loop for failed fixes._
    - `circular-edit-intervention` (CRITICAL)
  - **Key Features:**
    - Automated Vercel build failure detection via webhook to the `apps/api` endpoint.
    - Automated local build/lint/type-check failure detection via wrapper script.
    - Self-correcting loop for build failures, including automated re-deployment to Vercel.
    - Structured bug/solution knowledge base creation, organized by "jurisdictions."
    - Autonomous operation once invoked, minimizing user intervention.
    - **Execution Modes:** "Autonomous" (Hot Pursuit) and "Supervised" (Stakeout), both with "fast" and "thorough" speed options.
    - **Delighter:** "Eureka!" moments for root cause discovery.
    - **Delighter:** "Level Up" system for user ranks and bug "jurisdictions."
    - **Easter Egg:** "Donut Break" after repeated failures.

- **Phase 2 - Enhancement (Backend & Integration):**
  - **Additional Agents:**
    - Backend Debugger (FastAPI/Python specialist)
    - API Integration Debugger (Contract testing, auth flows)
    - Database Debugger (SQL queries, migrations)
    - **Environment Technician ("Techie Terry")** - _New agent for environment and dependency issues._
  - **Enhanced Features:**
    - More sophisticated querying of the bug/solution knowledge base.
    - Full integration of the knowledge base with Archon RAG.
    - Expanded test generation capabilities.
    - **Module Lore:** Renaming of remaining agents to fit the "BMad Detective Agency" theme.
    - **Delighters:** Agent-specific delighters aligned with their personalities and roles.

- **Phase 3 - Polish & Expansion (Chrome Extension, AI Agent Behavior, Performance):**
  - **Additional Agents:**
    - Extension Debugger
    - Marketplace Automation Debugger
    - LangChain Debugger
    - Agent Behavior Analyzer
    - Prompt Optimizer
    - Performance Debugger
    - Production Monitor
  - **Advanced Features:**
    - Proactive `test-coverage-gap` and `preventive-code-review` workflows fully implemented.
    - Advanced reporting and analytics on debugging trends.
    - Refined user interaction and reporting.
    - **Easter Egg:** `*testify` command for mock court cases.
    - **Delighter:** "Case Closed" celebration for tough cases.
    - **Module Lore:** Further integration of the detective agency lore.
