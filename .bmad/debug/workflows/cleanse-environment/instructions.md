# Cleanse Environment Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/cleanse-environment/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Identify Superfluous Elements">
  <action>
    Scan the project for temporary files, build artifacts, and cache directories (e.g., `__pycache__`, `.pytest_cache`, `.mypy_cache`, `node_modules/.cache`).
    Present a list of elements recommended for cleansing.
  </action>
  <template-output>elements_to_cleanse</template-output>
</step>

<step n="2" goal="Execute Cleansing">
  <ask>The following elements are recommended for cleansing:
  {{elements_to_cleanse}}
  Shall I proceed with the removal of these elements? [y/n]</ask>
  <action if="user_response == 'y'">
    Remove the selected elements from the file system.
  </action>
  <template-output>cleansing_log</template-output>
</step>

<step n="3" goal="Report Results">
  <action>
    Based on the `{{cleansing_log}}`, report the outcome to the user.
    Confirm that the environment has been successfully cleansed.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
