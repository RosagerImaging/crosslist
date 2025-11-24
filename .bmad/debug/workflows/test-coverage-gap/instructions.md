# Test Coverage Gap Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/test-coverage-gap/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Analyze Test Coverage">
  <action>Run the project's test coverage tool (e.g., `pytest --cov`).
  Analyze the coverage report to identify files and functions with low coverage.
  Present a summary of the findings to {user_name}, highlighting the most critical gaps.</action>
  <template-output>coverage_gaps_report</template-output>
</step>

<step n="2" goal="Prioritize Gaps for Test Generation">
  <ask>The following areas with insufficient test coverage have been identified:
  {{coverage_gaps_report}}
  Please select the areas you wish to generate tests for (e.g., "1, 3, 4"):</ask>
  <action>Store the user's selected gaps.</action>
  <template-output>selected_gaps</template-output>
</step>

<step n="3" goal="Generate New Tests (with Regression Focus)">
  <action>For each of the {{selected_gaps}}:
  1. Analyze the corresponding code to understand its functionality and recent commit history.
  2. If the area was part of a recent bug fix, instruct "The Quality Marshal" to generate **targeted regression tests**.
  3. Otherwise, instruct "The Quality Marshal" to generate standard unit or integration tests.
  4. Present the generated tests to {user_name} for review.</action>
  <template-output>generated_tests</template-output>
</step>

<step n="4" goal="Integrate New Tests">
  <ask>The following tests have been generated:
  {{generated_tests}}
  Shall I proceed with integrating them into the codebase? [y/n]</ask>
  <action if="user_response == 'y'">Write the new tests to the appropriate test files in the project.
  Report on the successful integration.</action>
  <template-output>integration_report</template-output>
</step>

<step n="5" goal="Final Validation">
  <action>Re-run the entire test suite, including the newly added tests.
  Re-run the test coverage tool to measure the improvement.
  Present a final report to {user_name}, showing the successful test run and the updated coverage metrics.</action>
  <template-output>final_validation_report</template-output>
</step>

</workflow>
