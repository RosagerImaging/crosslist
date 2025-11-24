# Document Setup Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/document-setup/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Gather Environment Information">
  <action>
    Gather all pertinent information about the current environment setup.
    This includes:
    - Operating System
    - CPU Architecture
    - Key software versions (e.g., Node.js, Python)
    - A list of all installed project dependencies (from `inspect-dependencies` workflow).
    - A list of all environment variables (from `verify-environment` workflow).
  </action>
  <invoke-workflow path="{project-root}/.bmad/debug/workflows/inspect-dependencies/workflow.yaml" />
  <invoke-workflow path="{project-root}/.bmad/debug/workflows/verify-environment/workflow.yaml" />
  <template-output>environment_information</template-output>
</step>

<step n="2" goal="Compile Dossier">
  <action>
    Compile the gathered `{{environment_information}}` into a well-structured markdown document.
    Organize the information into clear sections for readability.
  </action>
  <template-output>environment_dossier</template-output>
</step>

<step n="3" goal="Save and Report">
  <action>
    Save the `{{environment_dossier}}` to a file in the project's documentation folder (`{output_folder}`).
    Report to the user that the environment dossier has been successfully compiled and saved, providing the file path.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
