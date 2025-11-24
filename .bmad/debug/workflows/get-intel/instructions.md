# Get Intel Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/get-intel/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Invoke Playwright Backend">
  <action>
    Utilize the Playwright backend tool to get a description of the current page's layout and elements.
    This will involve calling the `describe_page` method (or equivalent) in the Playwright controller.
  </action>
  <template-output>page_intel</template-output>
</step>

<step n="2" goal="Report Results">
  <action>
    Present the `{{page_intel}}` to the user, providing a full layout of the page and its elements.
    Confirm that the intel gathering was successful.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
