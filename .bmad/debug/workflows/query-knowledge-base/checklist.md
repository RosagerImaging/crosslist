# Query Knowledge Base Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata (name, description, author, module, type) is accurate.
- [ ] `installed_path` and other file paths are correctly defined and resolve.
- [ ] `standalone: true` is correctly set.
- [ ] Instructions (`instructions.md`) follow BMAD XML structure and conventions.
- [ ] All steps in `instructions.md` have `n` (number) and `goal` attributes.
- [ ] `template-output` tags match expected variables from steps.
- [ ] `query_knowledge_bases_tool` (or equivalent) is correctly referenced.

## Functional Validation

- [ ] **Step 1: Receive and Refine Query**
  - [ ] Workflow correctly detects if a query is provided as an input parameter.
  - [ ] If no query input, workflow interactively guides user to formulate a clear query.
  - [ ] `knowledge_query` accurately captures the user's or workflow's query.
- [ ] **Step 2: Execute Archon RAG Query**
  - [ ] `query_knowledge_bases_tool` is correctly invoked with `knowledge_query`.
  - [ ] Tool returns a structured JSON response (`rag_search_results`).
  - [ ] Search parameters (e.g., `number_of_results`) are appropriately set.
- [ ] **Step 3: Synthesize and Present Results**
  - [ ] Workflow correctly parses `rag_search_results` JSON.
  - [ ] Content is synthesized, prioritizing results by 'score' or relevance.
  - [ ] If invoked by user, presents a clear, readable summary with key excerpts and source links.
  - [ ] If invoked by another workflow, returns structured results for automated processing.
  - [ ] `final_rag_summary` (for user) or structured results (for workflow) accurately reflects findings.

## Persona and Communication

- [ ] Workflow maintains a Mixed instruction style (intent-based for user queries, prescriptive for execution).
- [ ] Workflow maintains Medium interactivity (guided user interaction, low automated interaction).
- [ ] Communication addresses the user as `{user_name}` and uses `{communication_language}`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains in `workflow.yaml` or `instructions.md`.
- [ ] Workflow is testable end-to-end.
- [ ] All critical aspects of querying the Archon RAG knowledge base are addressed.
