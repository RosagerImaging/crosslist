# Preventive Code Review Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/preventive-code-review/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Analyze Staged Code Changes">
  <action>Get the `git diff --staged` to see the proposed changes.
  Analyze the diff to understand the scope and nature of the changes.
  Present a summary of the changes to {user_name} for confirmation before proceeding with the review.</action>
  <template-output>staged_changes_summary</template-output>
</step>

<step n="2" goal="Query Knowledge Base for Anti-Patterns">
  <action>Based on the code changes, formulate queries to check against the Knowledge Keeper's database.
  Invoke the 'query-knowledge-base' workflow to search for matching anti-patterns.
  If any anti-patterns are found, extract their descriptions and recommended solutions.</action>
  <invoke-workflow path="{project-root}/.bmad/debug/workflows/query-knowledge-base/workflow.yaml" />
  <template-output>found_anti_patterns</template-output>
</step>

<step n="3" goal="Present Findings and Recommendations">
  <check if="found_anti_patterns">
    <ask>The review has identified the following potential issues based on known anti-patterns:
    {{found_anti_patterns}}
    Please choose which recommendations you would like to apply (e.g., "1, 3"):</ask>
  </check>
  <check if="not found_anti_patterns">
    <action>Inform {user_name} that the code appears clean based on the current knowledge base.</action>
  </check>
  <action>Store the user's selections.</action>
  <template-output>user_selections</template-output>
</step>

<step n="4" goal="Apply Fixes (Optional)">
  <action if="user_selections">For each of the {{user_selections}}, attempt to automatically apply the recommended code change.
  Present the proposed changes (diffs) to {user_name} for final confirmation before writing to the files.</action>
  <template-output>applied_fixes_report</template-output>
</step>

<step n="5" goal="Final Report">
  <action>Summarize the anti-patterns found, the actions taken, and the final state of the code.
  If fixes were applied, recommend re-running tests before committing.
  Conclude the workflow.</action>
  <template-output>final_review_summary</template-output>
</step>

</workflow>
