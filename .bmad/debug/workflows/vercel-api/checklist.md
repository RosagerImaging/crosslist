# Vercel API Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Get Vercel API Command**
  - [ ] Workflow correctly prompts the user for a Vercel API command.
  - [ ] `vercel_api_command` variable is captured correctly.
- [ ] **Step 2: Execute Vercel API Interaction**
  - [ ] The action to interact with the Vercel API is clear and correctly references the `vercel_api_command`.
- [ ] **Step 3: Report Results**
  - [ ] The workflow accurately reports the Vercel API response and outcome.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of interacting with the Vercel API is clearly fulfilled.
