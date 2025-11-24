# Circular Edit Intervention Workflow Validation Checklist

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

- [ ] **Step 1: Detect and Analyze the Loop**
  - [ ] Workflow accurately identifies repeating patterns in provided logs/history.
  - [ ] Loop analysis summary is clear, concise, and identifies key elements (files, errors).
- [ ] **Step 2: Consult the Knowledge Base for Strategies**
  - [ ] `query-knowledge-base` workflow is correctly invoked.
  - [ ] Relevant alternative strategies are extracted when available.
  - [ ] Workflow handles cases where no strategies are found gracefully.
- [ ] **Step 3: Propose Intervention and Gather User Input**
  - [ ] Presents appropriate options (strategies or novel issue choices) to the user.
  - [ ] Correctly captures and stores user's chosen intervention.
- [ ] **Step 4: Execute the Intervention**
  - [ ] Executes the chosen intervention based on user input.
  - [ ] Correctly reports the outcome of the intervention.
- [ ] **Step 5: Final Validation and Handoff**
  - [ ] Re-runs validation/test after intervention.
  - [ ] Accurately confirms if the loop is broken or persists.
  - [ ] Provides a clear summary report at conclusion.

## Persona and Communication

- [ ] Workflow maintains a Mixed instruction style (intent-based analysis, prescriptive choices).
- [ ] Workflow maintains Medium interactivity (guided decision points).
- [ ] Communication addresses the user as `{user_name}` and uses `{communication_language}`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains in `workflow.yaml` or `instructions.md`.
- [ ] Workflow is testable end-to-end.
- [ ] All critical aspects of breaking circular edits are addressed.
