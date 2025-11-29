# Reactive Debug Workflow Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/.bmad/debug/workflows/reactive-debug/workflow.yaml</critical>

<step n="1" goal="Triage the Case.">
  <check if="not initial_bug_report">
    <ask>Please provide the bug report or error logs for Detective Casey to triage:</ask>
    <action>Store user's input as `initial_bug_report`.</action>
  </check>
  <action>Set a workflow variable `is_first_run = true`.</action>
  <action>Pass `initial_bug_report` to Detective Casey for triage.</action>
  <action>Invoke agent "Detective Casey".</action>
  <action>Invoke agent "Inspector Git-chell" to analyze the commit history based on the bug report.</action>
  <action>Invoke agent "Loop Breaker" to begin monitoring for repetitive failures.</action>
  <check if="is_first_run == true">

  </check>
</step>

<step n="2" goal="Propose a Fix.">
    <action>Invoke the appropriate specialist agent (e.g., "React Rita" for frontend bugs).</action>
    <action>The specialist agent analyzes the code and proposes a fix.</action>
    <check if="is_first_run == true">
  
    </check>
</step>

<step n="3" goal="Implement the Fix.">
    <action>The specialist agent applies the code changes.</action>
    <check if="is_first_run == true">
  
    </check>
</step>

<step n="4" goal="Commit, Push, Wait, and Verify.">
    <action>The specialist agent commits the code changes from Step 3 with a descriptive message.</action>
    <action>The agent pushes the commit to the current working branch to trigger the CI build.</action>
    <action>Wait for 75 seconds to allow the build to complete.</action>
    <action>Set `is_first_run = false`.</action>
    <action>Invoke the `retrieve-github-actions-logs` workflow to fetch the build logs.</action>
    <action>Store the retrieved logs as `build_logs` and check if they contain any error indicators.</action>
    <check if="build_logs indicate failure">
        <action>The failed build logs become the new `initial_bug_report`.</action>
        <action>Pass the new report back to "Detective Casey" for re-triage.</action>
        <goto step="2" />
    </check>
    <check if="build_logs indicate success">
        <action>The build was successful. Proceeding to final testing and knowledge capture.</action>
        <action>Invoke agent "Playwright Pete" to test the UI for regressions.</action>
        <check if="UI tests fail">
            <action>"Playwright Pete" reports the new UI bug to "Detective Casey". This becomes the new `initial_bug_report`.</action>
            <goto step="2" />
        </check>
    </check>
</step>

<step n="5" goal="Test Generation & Knowledge Capture.">
    <action>Invoke agent "Test Tina" to generate unit and E2E tests.</action>
    <action>Invoke agent "Chronicler" to document the bug and its solution in the knowledge base.</action>
    <template-output>final_report</template-output>
</step>

</workflow>
