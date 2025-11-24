# Circular Edit Intervention Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/circular-edit-intervention/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Detect and Analyze the Loop">
  <action>Receive the debugging history and logs from the context.
  Analyze the history for repeating patterns of file edits, error messages, and failed tests.
  Identify the files, functions, and error messages involved in the loop.
  Present a summary of the detected loop to {user_name}, confirming that an intervention is needed.</action>
  <template-output>loop_analysis_summary</template-output>
</step>

<step n="2" goal="Consult the Knowledge Base for Strategies">
  <action>Formulate a query based on the error messages and code context from the loop analysis.
  Invoke the 'query-knowledge-base' workflow to search for similar past cases.
  If relevant past cases are found, extract the successful resolution strategies.
  If no past cases are found, note this for the next step.</action>
  <invoke-workflow path="{project-root}/.bmad/debug/workflows/query-knowledge-base/workflow.yaml" />
  <template-output>alternative_strategies</template-output>
</step>

<step n="3" goal="Propose Intervention and Gather User Input">
  <check if="alternative_strategies">
    <ask>Based on the knowledge base, the following intervention strategies are available:
    {{alternative_strategies}}
    Please choose a strategy to apply (enter the number):</ask>
  </check>
  <check if="not alternative_strategies">
    <ask>No direct strategies were found in the knowledge base for this novel issue.
    How would you like to proceed, {user_name}?
    1. Initiate a brainstorming session for new approaches.
    2. Attempt a generic rollback of recent changes.
    3. Manually provide a specific intervention.</ask>
  </check>
  <action>Store the user's chosen intervention.</action>
  <template-output>chosen_intervention</template-output>
</step>

<step n="4" goal="Execute the Intervention">
  <action>Based on the {{chosen_intervention}}, execute the necessary actions. This might involve:
  Invoking another agent (e.g., "The JSX Gumshoe") with a new directive.
  Applying a code patch.
  Reverting a change.
  Report the outcome of the intervention to {user_name}.</action>
  <template-output>intervention_outcome</template-output>
</step>

<step n="5" goal="Final Validation and Handoff">
  <action>Re-run the original debugging task or a validation test.
  Ask {user_name} to confirm that the loop is broken and the issue is resolved.
  If the loop persists, return to Step 1 with the new information.
  If the loop is broken, conclude the workflow and provide a summary report to {user_name}.</action>
  <template-output>final_report</template-output>
</step>

</workflow>
