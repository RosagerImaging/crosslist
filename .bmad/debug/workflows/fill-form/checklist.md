# Fill Form Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Get Form Data**
  - [ ] Workflow correctly prompts the user for form data.
  - [ ] `form_data` variable is captured correctly.
- [ ] **Step 2: Invoke Playwright Backend**
  - [ ] The action to call the Playwright backend is clear and correctly references the `form_data`.
- [ ] **Step 3: Report Results**
  - [ ] The workflow accurately reports success based on the `fill_result`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of filling a form is clearly fulfilled.
