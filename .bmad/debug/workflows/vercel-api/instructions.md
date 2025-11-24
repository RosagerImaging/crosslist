# Vercel API Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/vercel-api/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>
<critical>⚠️ VERCEL_ACCESS_TOKEN Environment Variable REQUIRED: This workflow expects the Vercel API access token to be available as an environment variable named `VERCEL_ACCESS_TOKEN`. Ensure it is set securely in your environment or `.env.local` file.</critical>

<workflow>

<step n="1" goal="Get Vercel API Command">
  <ask>Please specify the Vercel API command or action you wish to perform (e.g., "get latest deployment status", "trigger new deployment for project_id").</ask>
  <action>Store the user's input as `vercel_api_command`.</action>
  <template-output>vercel_api_command</template-output>
</step>

<step n="2" goal="Execute Vercel API Interaction">
  <action>
    Utilize a Python script (or similar) designed to interact with the Vercel API.
    The script should read the `VERCEL_ACCESS_TOKEN` from environment variables (e.g., `os.getenv("VERCEL_ACCESS_TOKEN")`).
    The `{{vercel_api_command}}` will be passed to this script, which will then execute the corresponding Vercel API calls.
  </action>
  <template-output>vercel_api_response</template-output>
</step>

<step n="3" goal="Report Results">
  <action>
    Present the `{{vercel_api_response}}` from the Vercel API interaction to the user.
    Summarize the outcome of the command.
  </action>
  <template-output>final_report</template-output>
</step>

</workflow>
