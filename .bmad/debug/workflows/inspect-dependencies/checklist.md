# Inspect Dependencies Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata is accurate.
- [ ] `standalone: false` is correctly set.
- [ ] Instructions (`instructions.md`) are valid and follow BMAD XML structure.
- [ ] All steps have `n` and `goal` attributes.

## Functional Validation

- [ ] **Step 1: Scan Dependency Files**
  - [ ] Workflow correctly identifies and scans dependency files.
  - [ ] `declared_dependencies` variable is captured correctly.
- [ ] **Step 2: Check Installed Versions**
  - [ ] Workflow correctly checks installed package versions.
  - [ ] `dependency_state` accurately reflects discrepancies.
- [ ] **Step 3: Report Findings**
  - [ ] The workflow generates a clear report of dependency states.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains.
- [ ] The workflow's purpose of inspecting dependencies is clearly fulfilled.
