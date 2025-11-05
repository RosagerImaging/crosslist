name: "PRP for Phase 3: Feature Development - Central Hub (`apps/web`)"
description: |
  This PRP outlines the plan for developing the central hub of the Crosslist application, which is the user-facing Next.js application.

---

## Goal

**Feature Goal**: To build the user interface for the central hub of the Crosslist application, including authentication, a dashboard for inventory management, marketplace integration settings, and agent configuration.

**Deliverable**: A functional Next.js application (`apps/web`) with the following features:
- User authentication (login, registration, logout).
- A dashboard page with a table view for products/listings.
- A settings page for managing marketplace connections.
- Settings pages for configuring AI agent systems.

**Success Definition**: The central hub UI is implemented and functional, using placeholder data where necessary, and is ready for integration with the backend API.

## Why

- The central hub is the primary interface for users to interact with the Crosslist application. It is essential for managing inventory, connecting marketplaces, and configuring the AI agents.

## What

- Implement the full login, registration, and logout flow using NextAuth.js.
- Create a main dashboard page to display an overview of inventory.
- Implement a table view for all products/listings with sorting and filtering.
- Create a settings page where users can add, view, and remove marketplace connections.
- Build a secure form to input and encrypt marketplace credentials, which will be sent to the FastAPI backend.
- For each agentic system (Promotion, Liquidation, etc.), create a settings page with UI controls (toggles, sliders, text inputs) to configure its behavior.

### Success Criteria

- [ ] Users can register, log in, and log out.
- [ ] The dashboard displays a table of products/listings.
- [ ] Users can add, view, and remove marketplace connections.
- [ ] Settings pages for AI agents are created with UI controls.

## All Needed Context

### Context Completeness Check

_Before writing this PRP, validate: "If someone knew nothing about this codebase, would they have everything needed to implement this successfully?"_

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs
  why: Next.js is the chosen framework for the web application.
  critical: Understanding Next.js concepts like the App Router, Server Components, and Client Components is crucial.

- url: https://tailwindcss.com/docs
  why: Tailwind CSS is used for styling.
  critical: Understanding utility-first CSS is essential for building the UI.

- url: https://ui.shadcn.com/docs
  why: shadcn/ui is the chosen component library.
  critical: Understanding how to use and customize shadcn/ui components is essential.

- url: https://next-auth.js.org/getting-started/introduction
  why: NextAuth.js is used for authentication.
  critical: Understanding how to configure and use NextAuth.js is crucial for implementing authentication.
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash

```

### Desired Codebase tree with files to be added and responsibility of file

```bash
apps/web/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx
├── dashboard/
│   └── page.tsx
├── settings/
│   ├── marketplaces/
│   │   └── page.tsx
│   └── agents/
│       ├── promotion/
│       │   └── page.tsx
│       └── liquidation/
│           └── page.tsx
└── layout.tsx
```

### Known Gotchas of our codebase & Library Quirks

```python
# CRITICAL: Ensure that client-side and server-side rendering are used appropriately in Next.js.
# CRITICAL: Use placeholder data for UI development until the backend API is ready.
```

## Implementation Blueprint

### Data models and structure

N/A for this phase, as it focuses on the frontend UI.

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: CREATE apps/web/app/(auth)/login/page.tsx
  - IMPLEMENT: The login form with email and password fields.

Task 2: CREATE apps/web/app/(auth)/register/page.tsx
  - IMPLEMENT: The registration form with email and password fields.

Task 3: CREATE apps/web/app/dashboard/page.tsx
  - IMPLEMENT: The dashboard page with a table to display products/listings.

Task 4: CREATE apps/web/app/settings/marketplaces/page.tsx
  - IMPLEMENT: The marketplace settings page with a form to add/remove marketplace connections.

Task 5: CREATE apps/web/app/settings/agents/promotion/page.tsx
  - IMPLEMENT: The settings page for the Promotion agent with UI controls.

Task 6: CREATE apps/web/app/settings/agents/liquidation/page.tsx
  - IMPLEMENT: The settings page for the Liquidation agent with UI controls.
```

### Implementation Patterns & Key Details

```python
# Use shadcn/ui components for building the UI.
# Use React Query (TanStack Query) for managing server state, even with placeholder data.
```

### Integration Points

```yaml
API:
  - The frontend will eventually connect to the FastAPI backend for data.
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Run after each file creation - fix before proceeding
npm run lint --prefix apps/web
npm run check-types --prefix apps/web

# Expected: Zero errors. If errors exist, READ output and fix before proceeding.
```

### Level 2: Unit Tests (Component Validation)

```bash
# Test each component as it's created
npm run test --prefix apps/web

# Expected: All tests pass. If failing, debug root cause and fix implementation.
```

### Level 3: Integration Testing (System Validation)

```bash
# Manual testing of the UI in the browser.

# Expected: The UI is functional and matches the design.
```

## Final Validation Checklist

### Technical Validation

- [ ] All 3 validation levels completed successfully
- [ ] All tests pass: `npm run test --prefix apps/web`
- [ ] No linting errors: `npm run lint --prefix apps/web`
- [ ] No type errors: `npm run check-types --prefix apps/web`

### Feature Validation

- [ ] All success criteria from "What" section met
- [ ] UI is responsive and accessible

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
