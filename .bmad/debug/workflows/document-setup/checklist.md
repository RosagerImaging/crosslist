# Document Setup Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.
- [ ] Invocation of `inspect-dependencies` and `verify-environment` workflows is correct.

## Functional Validation

- [ ] **Step 1: Gather Environment Information**
  - [ ] Workflow correctly invokes sub-workflows to gather dependency and environment variable information.
  - [ ] `environment_information` accurately captures all required data.
- [ ] **Step 2: Compile Dossier**
  - [ ] `environment_dossier` is a well-structured markdown document.
- [ ] **Step 3: Save and Report**
  - [ ] The dossier is saved to the correct output folder.
  - [ ] The workflow accurately reports the file path to the user.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of documenting the environment setup is clearly fulfilled.
