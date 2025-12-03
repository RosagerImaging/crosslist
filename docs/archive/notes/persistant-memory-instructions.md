<!--
**Uncomment once this process has been revised to work within the scope of continuing to utilize the tools from both Archon and Serena MCP's.
  *This might involve creating a custom context mode for Serena MCP!!*

## Approach

To ensure consistent adherence to best practices, prevent recurring errors, and over time compile a library of coding guidelines and best practices specifically taylored to this codebase and my coding style, i will do the following every time, automatically, without any input or prompting from the user:

[comment] **EVERY TIME** I complete the Archon task cycle, I will STOP and take a moment to asses if its appropriate (based on the context of the Archon task cycle) for me to execute all or part of the following task named `Persistant Memory & Error Tracking` which involves me updating the following 3 key files to help ensure errors aren't repeated and I don't get stuck in circular edits to the codebase (un-doing and re-doing the same changes repeatedly):

**Persistent Memory & Error Tracking** In the `persistent-memory` directory at the project root, i will **IMPORTANT** use tools available in Serena MCP - such as `default_api.write_file` or `default_api.replace` - to continuously and autonomously maintain:

- `bugs.md` A file containing all errors and bugs i encounter throughout the process of building this code base. Below each documented bug I will leave a dedicated space labeled "solution" where i will document the verified solution.
**IMPORTANT** I will wait until the solution implemented is 100% verified as working based on one or more of these criteria:
  - Passed test - the unit test passes once the error has been resolved and it doesn't introduce any new significant error or break anything equal to or greater than the level of complexity of the original error
  - Successful Build - the solution to the error, once implemented, either allows a previously fialed build to succeed, or passes an already successful build without causing a warning or new error.

- `decisions.md` A file containing all architectural decisions that are made with a brief description of the reason they were made and, if there were alternative options being considered, the benefits that outweigh the other choices.

- `GEMINI.md` I will then convert the:
    - `Error` and `Solution` and/or
    - `Decision` and brief description of the context in which it was made
  Into a new `Rule` to follow in the `GEMINI.md` project instructions under the "## Coding Best
  Practices" section.

**IMPORTANT** All of this automated documentation means nothing if it is not referenced at the appropriate time in order to utilize the knowledge we have gained.

Therefor:

- I will use Serena MCP's `default_api.search_for_pattern` or `default_api.find_symbol` to semantically search the `persistent-memory` directory (e.g., `bugs.md`, `decisions.md`), the `GEMINI.md`, and any other relevant files for keywords related to the error, task, or files involved in EVERY single Archon MCP task cycle that I undertake.
- If I am unsuccessful in my atempt to fix a bug or error,  on the second attempt I will use `default_api.run_shell_command(command="git log -- <file_path>")` to review the history of relevant files, understanding the context of previous changes in order to avoid repeating mistakes or circular edits.

^^^^ The above steps cannot be skipped over or forgotten under any circumstances ^^^^ -->
