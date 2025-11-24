# Inspect Dependencies Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/inspect-dependencies/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Scan Dependency Files">
  <action>
    Scan the project for dependency files (e.g., `package.json`, `requirements.txt`, `pyproject.toml`).
    Extract a list of all declared dependencies and their specified versions.
  </action>
  <template-output>declared_dependencies</template-output>
</step>

<step n="2" goal="Check Installed Versions">
  <action>
    Check the actual installed versions of the declared dependencies.
    Compare the installed versions against the specified versions to find any discrepancies.
  </action>
  <template-output>dependency_state</template-output>
</step>

<step n="3" goal="Report Findings">
  <action>
    Compile a report based on the `{{dependency_state}}`.
    List all dependencies, their specified versions, their installed versions, and note any mismatches or potential issues.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
