# Verify Environment Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/verify-environment/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Check Environment Variables">
  <action>
    Check for the presence and validity of critical environment variables (e.g., `DATABASE_URL`, `API_SECRET`).
    This workflow will need to be configured with the list of required variables.
  </action>
  <template-output>env_var_check_result</template-output>
</step>

<step n="2" goal="Verify System Paths">
  <action>
    Verify that all necessary system paths and directories exist and are accessible.
    This includes checking for build output directories, temp folders, etc.
  </action>
  <template-output>path_check_result</template-output>
</step>

<step n="3" goal="Report Findings">
  <action>
    Compile a report based on the `{{env_var_check_result}}` and `{{path_check_result}}`.
    If all checks pass, report that the environment is in order.
    If any discrepancies are found, provide a detailed list of the issues.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
