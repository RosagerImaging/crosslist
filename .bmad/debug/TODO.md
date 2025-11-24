# Debugging Module Development Roadmap

## Phase 1: Core Components (MVP)

- **Implement "Todo" Workflows:**
  - `reactive-debug`: Fully integrate with Knowledge Keeper and Playwright Pete, including the self-correcting loop for failed fixes.
  - `circular-edit-intervention`: Fully implement loop detection and intervention.
  - `test-coverage-gap`: Fully implement coverage analysis and test generation.
  - `preventive-code-review`: Fully implement code analysis and anti-pattern detection.
  - `query-knowledge-base`: Fully integrate with Archon RAG and implement query logic.
  - P.I. Playwright's specific workflows (e.g., `verify-element`, `click-element`).
  - The Quartermaster's specific workflows (e.g., `verify-environment`, `inspect-dependencies`).
  - Detective Casey's `vercel-api` workflow.
- **Set up Automated Triggers:** Implement local build/lint/type-check failure detection via wrapper script. (Vercel webhook is a pro feature).
- **Knowledge Base Integration:** Initial implementation for documenting bugs/solutions via The Lead Reporter.

## Phase 2: Enhanced Features

- **Additional Agents:** Implement Backend Debugger, API Integration Debugger, Database Debugger, Environment Technician ("Techie Terry" - which is now The Quartermaster).
- **Query Enhancement:** More sophisticated querying of the bug/solution knowledge base.
- **Full Archon RAG Integration:** Full integration of the knowledge base with Archon RAG.
- **Expanded Test Generation.**
- **Module Lore:** Renaming of remaining agents to fit the "BMad Detective Agency" theme (Already done).

## Phase 3: Polish and Expansion

- **Additional Agents:** Extension Debugger, Marketplace Automation Debugger, LangChain Debugger, Agent Behavior Analyzer, Prompt Optimizer, Performance Debugger, Production Monitor.
- **Advanced Features:** Proactive `test-coverage-gap` and `preventive-code-review` workflows fully implemented.
- **Advanced Reporting and Analytics.**
- **Refined User Interaction.**

## Quick Commands

Create new agent:

```bash
workflow create-agent
```

Create new workflow:

```bash
workflow create-workflow
```

## Notes

This roadmap reflects the current understanding of the debug module's development. Priorities and details may evolve based on further analysis and user feedback.
