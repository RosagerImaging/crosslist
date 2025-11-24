# Install Dependencies Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.
- [ ] Invocation of `inspect-dependencies` workflow is correct.

## Functional Validation

- [ ] **Step 1: Identify Dependencies to Install**
  - [ ] Workflow correctly invokes `inspect-dependencies`.
  - [ ] `dependencies_to_install` accurately reflects missing or mismatched dependencies.
- [ ] **Step 2: Install Dependencies**
  - [ ] Workflow runs the correct package manager commands.
  - [ ] `installation_log` captures the output of the installation process.
- [ ] **Step 3: Report Results**
  - [ ] The workflow generates a clear report of the installation status.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of installing dependencies is clearly fulfilled.
