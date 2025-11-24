# Preventive Code Review Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata (name, description, author, module, type) is accurate.
- [ ] `installed_path` and other file paths are correctly defined and resolve.
- [ ] `standalone: true` is correctly set.
- [ ] Instructions (`instructions.md`) follow BMAD XML structure and conventions.
- [ ] All steps in `instructions.md` have `n` (number) and `goal` attributes.
- [ ] `template-output` tags match expected variables from steps.
- [ ] References to other workflows (`query-knowledge-base`) are correct.

## Functional Validation

- [ ] **Step 1: Analyze Staged Code Changes**
  - [ ] Workflow correctly retrieves and analyzes `git diff --staged` output.
  - [ ] `staged_changes_summary` accurately presents proposed changes.
- [ ] **Step 2: Query Knowledge Base for Anti-Patterns**
  - [ ] `query-knowledge-base` workflow is correctly invoked.
  - [ ] Queries are accurately formulated based on code changes.
  - [ ] `found_anti_patterns` correctly extracts and presents identified anti-patterns.
- [ ] **Step 3: Present Findings and Recommendations**
  - [ ] Presents appropriate anti-patterns and solutions, or confirms clean code.
  - [ ] Correctly captures user's choices for applying recommendations.
- [ ] **Step 4: Apply Fixes (Optional)**
  - [ ] Workflow correctly attempts to apply selected fixes.
  - [ ] Presents proposed changes (diffs) to user for confirmation.
  - [ ] `applied_fixes_report` details successful or failed applications of fixes.
- [ ] **Step 5: Final Report**
  - [ ] `final_review_summary` accurately summarizes findings and actions.
  - [ ] Provides appropriate recommendations (e.g., re-run tests).

## Persona and Communication

- [ ] Workflow maintains a Mixed instruction style (intent-based analysis, prescriptive choices).
- [ ] Workflow maintains Medium interactivity (guided decision points).
- [ ] Communication addresses the user as `{user_name}` and uses `{communication_language}`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains in `workflow.yaml` or `instructions.md`.
- [ ] Workflow is testable end-to-end.
- [ ] All critical aspects of preventive code review are addressed.
