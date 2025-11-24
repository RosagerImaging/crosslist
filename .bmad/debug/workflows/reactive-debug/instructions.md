# Reactive Debug Workflow Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/debug/workflows/reactive-debug/workflow.yaml</critical>

<step n="1" goal="Triage the Case.">
  <check if="not initial_bug_report">
    <ask>Please provide the bug report or error logs for Detective Casey to triage:</ask>
    <action>Store user's input as `initial_bug_report`.</action>
  </check>
  <action>Pass `initial_bug_report` to Detective Casey for triage.</action>
  <action>Invoke agent "Detective Casey".</action>
  <action>Invoke agent "Inspector Git-chell" to analyze the commit history based on the bug report.</action>
  <action>Invoke agent "Loop Breaker" to begin monitoring for repetitive failures.</action>
  <template-output>initial_investigation_report</template-output>
</step>

<step n="2" goal="Propose a Fix.">
    <action>Invoke the appropriate specialist agent (e.g., "React Rita" for frontend bugs).</action>
    <action>The specialist agent analyzes the code and proposes a fix.</action>
    <template-output>proposed_code_changes</template-output>
</step>

<step n="3" goal="Implement the Fix.">
    <action>The specialist agent applies the code changes.</action>
    <template-output>modified_code</template-output>
</step>

<step n="4" goal="The Self-Correcting Loop.">
    <action>Invoke agent "Detective Casey" to trigger a new Vercel deployment.</action>
    <check if="build succeeds">
        <action>Invoke agent "Playwright Pete" to test the UI.</action>
        <check if="UI tests fail">
            <action>"Playwright Pete" reports the new bug to "Detective Casey".</action>
            <goto step="2" />
        </check>
    </check>
    <check if="build fails">
        <action>The Vercel webhook sends new logs to "Detective Casey".</action>
        <goto step="2" />
    </check>
</step>

<step n="5" goal="Test Generation & Knowledge Capture.">
    <action>Invoke agent "Test Tina" to generate unit and E2E tests.</action>
    <action>Invoke agent "Chronicler" to document the bug and its solution in the knowledge base.</action>
    <template-output>final_report</template-output>
</step>

</workflow>
