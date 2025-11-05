name: "PRP for Phase 5: Chrome Extension (`packages/browser-extension`)"
description: |
  This PRP outlines the plan for developing the Chrome Extension for the Crosslist application.

---

## Goal

**Feature Goal**: To build a functional Chrome Extension that can perform in-browser automation on marketplace websites, controlled by the FastAPI backend.

**Deliverable**: A functional Chrome Extension (`apps/chrome-extension`) with the following features:
- Secure communication with the FastAPI backend.
- Content scripts for each target marketplace to perform actions like filling forms, clicking buttons, and scraping data.
- Authentication handling to detect expired sessions.

**Success Definition**: The Chrome Extension can successfully receive commands from the backend and perform at least one automated action on a marketplace website.

## Why

- The Chrome Extension is a critical component for automating tasks on marketplace websites that do not have APIs or for actions that are best performed in a browser context.

## What

- Establish a secure communication channel between the background script and the FastAPI backend.
- Write content scripts for each target marketplace (Poshmark, eBay, etc.).
- Implement authentication handling to detect expired sessions and notify the backend.

### Success Criteria

- [ ] The Chrome Extension can securely communicate with the backend.
- [ ] A content script for at least one marketplace is created and can perform an action.
- [ ] The extension can detect an expired session.

## All Needed Context

### Context Completeness Check

_Before writing this PRP, validate: "If someone knew nothing about this codebase, would they have everything needed to implement this successfully?"_

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://developer.chrome.com/docs/extensions/
  why: This is the official documentation for Chrome Extensions.
  critical: Understanding the architecture of Chrome Extensions, including background scripts, content scripts, and message passing, is essential.
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash

```

### Desired Codebase tree with files to be added and responsibility of file

```bash
apps/chrome-extension/src/
├── background.ts
├── content.ts
└── main.ts
```

### Known Gotchas of our codebase & Library Quirks

```python
# CRITICAL: Ensure that the communication between the background script and the backend is secure.
# CRITICAL: Content scripts run in an isolated world, so they need to communicate with the background script to interact with the backend.
```

## Implementation Blueprint

### Data models and structure

N/A for this phase.

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: MODIFY apps/chrome-extension/src/background.ts
  - IMPLEMENT: Secure communication with the FastAPI backend.

Task 2: MODIFY apps/chrome-extension/src/content.ts
  - IMPLEMENT: A content script for a target marketplace to perform a specific action.

Task 3: MODIFY apps/chrome-extension/src/background.ts
  - IMPLEMENT: Authentication handling to detect expired sessions.
```

### Implementation Patterns & Key Details

```python
# Use message passing to communicate between the content script and the background script.
# Use a secure method (e.g., tokens) to authenticate with the backend.
```

### Integration Points

```yaml
API:
  - The Chrome Extension will communicate with the FastAPI backend to receive commands and send data.
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Run after each file creation - fix before proceeding
npm run lint --prefix apps/chrome-extension

# Expected: Zero errors. If errors exist, READ output and fix before proceeding.
```

### Level 2: Unit Tests (Component Validation)

```bash
# Test each component as it's created
npm run test --prefix apps/chrome-extension

# Expected: All tests pass. If failing, debug root cause and fix implementation.
```

### Level 3: Integration Testing (System Validation)

```bash
# Manual testing of the Chrome Extension in the browser.

# Expected: The extension is functional and performs the automated actions correctly.
```

## Final Validation Checklist

### Technical Validation

- [ ] All 3 validation levels completed successfully
- [ ] All tests pass: `npm run test --prefix apps/chrome-extension`
- [ ] No linting errors: `npm run lint --prefix apps/chrome-extension`

### Feature Validation

- [ ] All success criteria from "What" section met
- [ ] The extension is installable and runs without errors.

### Code Quality Validation

- [ ] Follows existing codebase patterns and naming conventions
- [ ] File placement matches desired codebase tree structure
- [ ] Anti-patterns avoided (check against Anti-Patterns section)

---

## Anti-Patterns to Avoid

- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip validation because "it should work"
- ❌ Don't ignore failing tests - fix them
- ❌ Don't hardcode values that should be config
