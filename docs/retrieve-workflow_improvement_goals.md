# Improvement Goals for retrieve-github-actions-logs Workflow

## Primary Goal: Refactor to a CLI-Based Log Retrieval System

The core objective is to completely overhaul the workflow's logic, transforming it from a non-functional browser navigator into a robust, reliable log retriever.

### Specific Changes Required:

1.  **Abandon Browser Automation:** Remove all Playwright-based browser navigation steps (Steps 3, 4, and 5).
2.  **Implement CLI/API Retrieval:** Replace the removed steps with a new step that executes a shell command via `run_shell_command`. This command will use the GitHub CLI (`gh run view --log`) or `curl` with the GitHub API to directly fetch the raw logs for the specified workflow run.
3.  **Output Logs:** The final step will output the fetched logs as a variable (e.g., `retrieved_logs`) to be consumed by the parent `reactive-debug` workflow.
4.  **Simplify User Input:** The workflow currently asks for a `run_id`. We should also explore if the latest run can be fetched automatically if no ID is provided, reducing the burden on the user/calling workflow.

## Secondary Goal: Reassign Workflow to the Correct Specialist Agent

To align with BMAD best practices, the workflow must be assigned to the agent whose skills match the task.

### Specific Changes Required:

1.  **Update Agent Ownership:** The primary agent for this workflow should be changed from **P.I. Playwright** to **Inspector Git-chell**.
2.  **Update Workflow Description:** The `description` field in `workflow.yaml` must be updated to reflect that Inspector Git-chell is the operative.
3.  **Update Instructions:** The instructions within `instructions.md` should be rewritten to be from the perspective of Inspector Git-chell, focusing on CLI commands and API interactions rather than browser actions.
