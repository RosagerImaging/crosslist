# Verify Element Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/verify-element/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Get Target Element">
  <ask>Please specify the element to verify. You can use a CSS selector, an ID, or the text content of the element.</ask>
  <action>Store the user's input as the `target_element_selector`.</action>
  <template-output>target_element_selector</template-output>
</step>

<step n="2" goal="Invoke Playwright Backend">
  <action>
    Utilize the Playwright backend tool to check for the existence of the `{{target_element_selector}}` on the current web page.
    This will involve calling the appropriate controller method that handles element verification.
  </action>
  <template-output>verification_result</template-output>
</step>

<step n="3" goal="Report Results">
  <action>
    Based on the `{{verification_result}}` from the backend, report the outcome to the user.
    If the element was found, confirm its presence.
    If the element was not found, report that the target was not on screen.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
