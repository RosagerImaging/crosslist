# Improvement Goals for .bmad/debug Module

## Primary Goal: Implement a GitHub Actions-driven Continuous Debugging Loop

The core objective is to enhance the `debug` module's main `reactive-debug` workflow to operate in a self-correcting loop, using GitHub Actions as the trigger and source of build/error logs, removing the dependency on Vercel webhooks for this process.

### Desired Functionality:

1.  **Trigger**: The loop should be initiated or continued after an agent makes a code commit.
2.  **Execution**: A GitHub Action will automatically run a build command on the new commit.
3.  **Log Retrieval**: An agent or workflow within the `debug` module must automatically retrieve the logs from the completed GitHub Action run. The existing `retrieve-github-actions-logs` workflow should be leveraged for this purpose.
4.  **Re-entry into Workflow**: The retrieved logs are to be presented to the `Detective Casey` agent, effectively re-starting the `reactive-debug` workflow with the new information.
5.  **Continuation**: This cycle repeats, with the system autonomously attempting fixes, committing code, and checking build logs, until the GitHub Action build completes without any errors.

### Key Components to Modify/Integrate:

- **`reactive-debug` workflow**: This is the main workflow that will need to be modified to orchestrate the loop and call the log retrieval workflow.
- **`retrieve-github-actions-logs` workflow**: This existing workflow will be integrated and called by `reactive-debug`.
- **Agent Integration**: We will need to determine which agent (`Inspector Git-chell` or another) is responsible for initiating the log retrieval process after a commit.
