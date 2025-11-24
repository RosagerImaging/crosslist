# Cleanse Environment Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Identify Superfluous Elements**
  - [ ] Workflow correctly identifies temporary files and cache directories.
  - [ ] `elements_to_cleanse` variable is captured correctly.
- [ ] **Step 2: Execute Cleansing**
  - [ ] Workflow correctly prompts the user for confirmation.
  - [ ] If confirmed, workflow successfully removes the identified elements.
  - [ ] `cleansing_log` captures the output of the removal process.
- [ ] **Step 3: Report Results**
  - [ ] The workflow generates a clear report of the cleansing status.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of cleansing the environment is clearly fulfilled.
