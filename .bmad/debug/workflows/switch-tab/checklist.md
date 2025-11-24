# Switch Tab Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Get Target Tab**
  - [ ] Workflow correctly calls the backend to get a list of open tabs.
  - [ ] `open_tabs_list` is presented to the user.
- [ ] **Step 2: Select Tab**
  - [ ] Workflow prompts the user to select a tab from the list.
  - [ ] `target_tab` variable is captured correctly.
- [ ] **Step 3: Invoke Playwright Backend**
  - [ ] The action to call the Playwright backend is clear and correctly references the `target_tab`.
- [ ] **Step 4: Report Results**
  - [ ] The workflow accurately reports success based on the `switch_result`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of switching tabs is clearly fulfilled.
