# Get Intel Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Invoke Playwright Backend**
  - [ ] The action to call the Playwright backend for page description is clear.
- [ ] **Step 2: Report Results**
  - [ ] The workflow accurately presents the `page_intel`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of describing a page's layout and elements is clearly fulfilled.
