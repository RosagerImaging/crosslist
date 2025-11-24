# Fill Form Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/fill-form/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Get Form Data">
  <ask>Please provide the data to fill the form with. Specify the element selector and the value for each field (e.g., "#email: john.doe@example.com, #password: 12345").</ask>
  <action>Store the user's input as `form_data`.</action>
  <template-output>form_data</template-output>
</step>

<step n="2" goal="Invoke Playwright Backend">
  <action>
    Utilize the Playwright backend tool to fill the form fields based on the `{{form_data}}`.
    This will involve parsing the `form_data` and calling the `fill_id` method (or equivalent) for each field in the Playwright controller.
  </action>
  <template-output>fill_result</template-output>
</step>

<step n="3" goal="Report Results">
  <action>
    Based on the `{{fill_result}}` from the backend, report the outcome to the user.
    Confirm that the form fields were successfully populated.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
