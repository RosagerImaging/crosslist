# Verify Environment Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Check Environment Variables**
  - [ ] Workflow correctly checks for specified environment variables.
- [ ] **Step 2: Verify System Paths**
  - [ ] Workflow correctly verifies necessary system paths.
- [ ] **Step 3: Report Findings**
  - [ ] The workflow accurately reports the status of the environment based on the checks.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of verifying the environment is clearly fulfilled.
