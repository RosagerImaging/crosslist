# Click Element Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Get Target Element**
  - [ ] Workflow correctly prompts the user for an element selector.
  - [ ] `target_element_selector` variable is captured correctly.
- [ ] **Step 2: Invoke Playwright Backend**
  - [ ] The action to call the Playwright backend is clear and correctly references the `target_element_selector`.
- [ ] **Step 3: Report Results**
  - [ ] The workflow accurately reports success based on the `click_result`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of clicking an element is clearly fulfilled.
