# Extract Text Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/extract-text/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Invoke Playwright Backend">
  <action>
    Utilize the Playwright backend tool to extract all visible text from the current web page.
    This will involve calling the `get_all_webpage_text` method (or equivalent) in the Playwright controller.
  </action>
  <template-output>extracted_text</template-output>
</step>

<step n="2" goal="Report Results">
  <action>
    Present the `{{extracted_text}}` to the user.
    Confirm that the text extraction was successful.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
