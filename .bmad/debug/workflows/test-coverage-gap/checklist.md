# Test Coverage Gap Workflow Validation Checklist

## Workflow Structure and Integrity

- [ ] YAML parses without errors.
- [ ] `workflow.yaml` metadata (name, description, author, module, type) is accurate.
- [ ] `installed_path` and other file paths are correctly defined and resolve.
- [ ] `standalone: true` is correctly set.
- [ ] Instructions (`instructions.md`) follow BMAD XML structure and conventions.
- [ ] All steps in `instructions.md` have `n` (number) and `goal` attributes.
- [ ] `template-output` tags match expected variables from steps.
- [ ] References to agents ("The Quality Marshal") are correct.

## Functional Validation

- [ ] **Step 1: Analyze Test Coverage**
  - [ ] Workflow correctly executes coverage tool and analyzes its report.
  - [ ] `coverage_gaps_report` accurately identifies and summarizes low-coverage areas.
- [ ] **Step 2: Prioritize Gaps for Test Generation**
  - [ ] Presents a clear, numbered list of coverage gaps.
  - [ ] Correctly captures user's selection of gaps.
- [ ] **Step 3: Generate New Tests (with Regression Focus)**
  - [ ] Accurately analyzes code and commit history for selected gaps.
  - [ ] Correctly instructs "The Quality Marshal" to generate appropriate tests (regression or standard).
  - [ ] `generated_tests` presents generated code for review.
- [ ] **Step 4: Integrate New Tests**
  - [ ] Correctly captures user's confirmation for integration.
  - [ ] Successfully writes generated tests to the file system.
  - [ ] `integration_report` provides details of the integration.
- [ ] **Step 5: Final Validation**
  - [ ] Successfully re-runs tests and coverage tool.
  - [ ] `final_validation_report` accurately shows test run results and updated coverage metrics.

## Persona and Communication

- [ ] Workflow maintains a Mixed instruction style (intent-based analysis, prescriptive choices).
- [ ] Workflow maintains Medium interactivity (guided decision points).
- [ ] Communication addresses the user as `{user_name}` and uses `{communication_language}`.

## Final Review

- [ ] No placeholder text (e.g., TODO) remains in `workflow.yaml` or `instructions.md`.
- [ ] Workflow is testable end-to-end.
- [ ] All critical aspects of identifying and filling test coverage gaps are addressed.
