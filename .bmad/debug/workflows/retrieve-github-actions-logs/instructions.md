# Retrieve GitHub Actions Logs - Instructions for Inspector Git-chell

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/.bmad/debug/workflows/retrieve-github-actions-logs/workflow.yaml</critical>
<critical>This workflow requires the GitHub CLI (`gh`) to be installed and authenticated.</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Gather Case-File Details.">
  <action>State that Inspector Git-chell is on the case.</action>
  <action>Explain that this requires the GitHub CLI (`gh`) to be installed and authenticated (`gh auth login`).</action>
  <ask>Please provide the GitHub repository (e.g., 'RosagerImaging/crosslist'):</ask>
  <action>Store user input as `repo_path`.</action>

<ask optional="true">Please provide the GitHub Actions Run ID (e.g., '19621881771'). If not provided, I will retrieve the latest run.</ask>
<action>Store user input as `run_id`.</action>
</step>

<step n="2" goal="Retrieve Logs from the Archives.">
  <check if="run_id is not empty">
    <action>A specific Run ID was provided. Constructing the command: `gh run view {run_id} --log -R {repo_path}`</action>
    <action>Store the command as `log_retrieval_command`.</action>
  </check>
  <check if="run_id is empty">
    <action>No Run ID provided. First, I will find the latest run.</action>
    <action>Construct the command to get the latest run ID: `gh run list --limit 1 --json databaseId --jq ".[0].databaseId" -R {repo_path}`</action>
    <action>Execute this command using `run_shell_command`.</action>
    <check if="error occurred">
      <action>Report the error and stop the workflow.</action>
    </check>
    <action>Store the output as `latest_run_id`.</action>
    <action>Now, construct the command to retrieve the logs for the latest run: `gh run view {latest_run_id} --log -R {repo_path}`</action>
    <action>Store the command as `log_retrieval_command`.</action>
  </check>
  
  <action>Execute the `log_retrieval_command` using the `run_shell_command` tool.</action>
  <action>Check for any errors in the command execution (stderr).</action>
  <check if="error occurred">
    <action>Report the error to the user and stop the workflow.</action>
  </check>
  <check if="no error">
    <action>Store the output (stdout) of the command as `retrieved_logs`.</action>
    <action>Announce that the logs have been successfully retrieved.</action>
  </check>
</step>

<step n="3" goal="Present Findings.">
    <action>Present the retrieved logs for review.</action>
    <template-output>retrieved_logs</template-output>
</step>

</workflow>
