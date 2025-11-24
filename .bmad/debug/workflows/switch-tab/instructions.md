# Switch Tab Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/switch-tab/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Get Target Tab">
  <action>
    First, invoke the Playwright backend to get a list of all currently open tabs and their titles/IDs.
    Present this list to the user.
  </action>
  <template-output>open_tabs_list</template-output>
</step>

<step n="2" goal="Select Tab">
  <ask>Based on the list of open tabs: {{open_tabs_list}}, please specify the ID or title of the tab you wish to switch to.</ask>
  <action>Store the user's input as the `target_tab`.</action>
  <template-output>target_tab</template-output>
</step>

<step n="3" goal="Invoke Playwright Backend">
  <action>
    Utilize the Playwright backend tool to switch to the `{{target_tab}}`.
    This will involve calling the `switch_tab` method (or equivalent) in the Playwright controller.
  </action>
  <template-output>switch_result</template-output>
</step>

<step n="4" goal="Report Results">
  <action>
    Based on the `{{switch_result}}` from the backend, report the outcome to the user.
    Confirm that the browser has successfully switched to the target tab.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
