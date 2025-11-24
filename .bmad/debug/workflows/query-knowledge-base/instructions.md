# Query Knowledge Base Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/debug/workflows/query-knowledge-base/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Receive and Refine Query">
  <action>
    Check if a query has been provided as an input parameter from a calling workflow.
    If no query is provided, interactively guide {user_name} to formulate a clear, specific query for the Archon RAG knowledge base.
    Focus on keywords, error messages, and desired outcomes to create an effective query.
  </action>
  <template-output>knowledge_query</template-output>
</step>

<step n="2" goal="Execute Archon RAG Query">
  <action>
    Utilize the `rag_search_knowledge_base` tool to query the Archon RAG knowledge base.
    Pass the `knowledge_query` (from Step 1) as the search query.
    Retrieve a reasonable number of high-quality results to ensure comprehensive information.
    The structured JSON response from the `rag_search_knowledge_base` tool will be captured for processing.
  </action>
  <template-output>rag_search_results</template-output>
</step>

<step n="3" goal="Synthesize and Present Results">
  <action>
    Parse the JSON response from `rag_search_results`.
    Synthesize the content from the results, prioritizing the most relevant information based on the 'score'.
    If the workflow was invoked directly by {user_name}, present a clear, readable summary of the findings, including key excerpts and links to the source locations.
    If the workflow was invoked by another automated process, return the structured, synthesized results to the calling workflow for its own use.
  </action>
  <template-output>final_rag_summary</template-output>
</step>

</workflow>
