# Capture Evidence Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Get Screenshot Options**
  - [ ] Workflow correctly prompts the user for screenshot options.
  - [ ] `screenshot_options` variable is captured correctly.
- [ ] **Step 2: Invoke Playwright Backend**
  - [ ] The action to call the Playwright backend is clear and correctly references the `screenshot_options`.
- [ ] **Step 3: Report Results**
  - [ ] The workflow accurately reports success and provides the file path based on the `screenshot_result`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of capturing a screenshot is clearly fulfilled.
