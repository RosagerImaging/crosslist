# Install Dependencies Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/install-dependencies/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Identify Dependencies to Install">
  <action>
    First, invoke the `inspect-dependencies` workflow to get the current state of all project dependencies.
    Identify any dependencies that are missing or have version mismatches.
  </action>
  <invoke-workflow path="{project-root}/.bmad/debug/workflows/inspect-dependencies/workflow.yaml" />
  <template-output>dependencies_to_install</template-output>
</step>

<step n="2" goal="Install Dependencies">
  <action>
    Based on the `{{dependencies_to_install}}`, run the appropriate package manager command (e.g., `npm install`, `pip install -r requirements.txt`) to install or update the dependencies.
  </action>
  <template-output>installation_log</template-output>
</step>

<step n="3" goal="Report Results">
  <action>
    Based on the `{{installation_log}}`, report the outcome to the user.
    Confirm that all dependencies were successfully installed and are now up to date.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
