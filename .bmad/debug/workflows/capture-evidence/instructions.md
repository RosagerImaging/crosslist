# Capture Evidence Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/capture-evidence/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Get Screenshot Options">
  <ask>Please provide a filename for the evidence (e.g., "login-page-error.png"). You can also specify if you need a full-page screenshot.</ask>
  <action>Store the user's input as `screenshot_options`.</action>
  <template-output>screenshot_options</template-output>
</step>

<step n="2" goal="Invoke Playwright Backend">
  <action>
    Utilize the Playwright backend tool to take a screenshot of the current web page, using the `{{screenshot_options}}`.
    This will involve calling the `capture_screenshot` method (or equivalent) in the Playwright controller.
  </action>
  <template-output>screenshot_result</template-output>
</step>

<step n="3" goal="Report Results">
  <action>
    Based on the `{{screenshot_result}}` from the backend, report the outcome to the user.
    Confirm that the screenshot was successfully captured and provide the file path.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
