# Workflow Understanding: .bmad/debug/workflows/reactive-debug

## Workflow Purpose and Value

The `reactive-debug` workflow is the orchestration engine for the "BMad Detective Agency" module. Its primary purpose is to systematically investigate, fix, and document software bugs through a collaborative effort of specialized AI agents. It aims to provide an autonomous or semi-autonomous self-correcting loop for debugging.

## Workflow Structure and Key Characteristics

- **Workflow Type:** Action Workflow / Interactive Workflow. It guides and orchestrates agent actions, making it highly prescriptive.
- **User Journey:** The workflow leads from an initial bug report or error logs through a cycle of triage, fix proposal, implementation, and verification, culminating in test generation and knowledge capture.
- **Step Flow:** Consists of 5 main steps:
  1.  **Triage the Case:** Initial assessment and agent invocation (Detective Casey, Inspector Git-chell, Loop Breaker).
  2.  **Propose a Fix:** A specialist agent (e.g., React Rita) analyzes and proposes code changes.
  3.  **Implement the Fix:** The specialist agent applies the proposed code changes.
  4.  **The Self-Correcting Loop:** Critical step for verification and looping. Currently Vercel-dependent.
  5.  **Test Generation & Knowledge Capture:** Generates tests and documents the solution (Test Tina, Chronicler).
- **Instruction Style:** Predominantly prescriptive, guiding the execution engine with specific agent invocations and conditional logic. This is appropriate for an orchestration workflow.
- **Checkpoints:** Utilizes `<template-output>` tags for capturing intermediate results, such as `initial_investigation_report`, `proposed_code_changes`, `modified_code`, and `final_report`.
- **Config Dependencies:** Relies on `bmad/debug/config.yaml` for basic variables and declares a dependency on the "Vercel API" tool.

## Observations and Potential Improvements

- **Strength:** The workflow is well-structured, with clear goals for each step and logical flow, adhering to best practices for focused steps and scope.
- **Primary Improvement Area:** **Step 4: The Self-Correcting Loop** is tightly coupled with Vercel, specifically triggering Vercel deployments and relying on Vercel webhooks for log feedback. This needs to be refactored to integrate with GitHub Actions, as per the defined improvement goal.
- **Secondary Improvement Area:** The workflow currently lacks a dedicated `checklist.md` file, which is a recommended practice for formalizing validation criteria. Adding one would enhance its robustness and adherence to BMAD module standards.

In summary, `reactive-debug` is a foundational workflow for the `debug` module, well-designed for its purpose but requiring a strategic update to its core self-correction mechanism to leverage GitHub Actions more effectively.
