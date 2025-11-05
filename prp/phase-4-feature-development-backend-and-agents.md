name: "PRP for Phase 4: Feature Development - Backend & Agents (`apps/server`)"
description: |
  This PRP outlines the plan for developing the backend and AI agent systems of the Crosslist application.

---

## Goal

**Feature Goal**: To build the backend API and AI agent systems for the Crosslist application, including the Crosslisting Agent, Listing Optimizer System, and Promotion Agent.

**Deliverable**: A functional FastAPI backend (`apps/api`) with the following features:
- API endpoints for all frontend needs (auth, CRUD for products/listings, agent configuration).
- A Crosslisting Agent that can scrape listing data and create new listings.
- A Listing Optimizer System with agents for photo optimization, description generation, and pricing.
- A Promotion Agent (Poshmark Bot) that can perform actions on Poshmark with human-like variability.

**Success Definition**: The backend API and at least two AI agent systems are implemented and functional.

## Why

- The backend and AI agents are the core of the Crosslist application, automating the most time-consuming tasks for resellers.

## What

- Create FastAPI endpoints for all frontend needs.
- Implement a Crosslisting Agent that can scrape listing data and create new listings.
- Implement a Listing Optimizer System with agents for photo optimization, description generation, and pricing.
- Implement a Promotion Agent (Poshmark Bot) that can perform actions on Poshmark with human-like variability.

### Success Criteria

- [ ] API endpoints for auth, CRUD for products/listings, and agent configuration are created.
- [ ] The Crosslisting Agent can successfully scrape a listing and create a new one.
- [ ] The Listing Optimizer System can optimize a photo, generate a description, and suggest a price.
- [ ] The Promotion Agent can perform actions on Poshmark.

## All Needed Context

### Context Completeness Check

_Before writing this PRP, validate: "If someone knew nothing about this codebase, would they have everything needed to implement this successfully?"

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://fastapi.tiangolo.com/
  why: FastAPI is the chosen framework for the backend API.
  critical: Understanding FastAPI's features is essential for building the API.

- url: https://python.langchain.com/docs/get_started/introduction
  why: LangChain is the recommended framework for building AI agents.
  critical: Understanding LangChain's concepts like agents, tools, and chains is crucial.

- url: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
  why: BeautifulSoup is a recommended library for web scraping.
  critical: Understanding how to parse HTML and extract data is essential for the Crosslisting Agent.

- url: https://pypi.org/project/rembg/
  why: rembg is a recommended library for background removal.
  critical: Understanding how to use rembg is essential for the Photo Agent.
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash

```

### Desired Codebase tree with files to be added and responsibility of file

```bash
apps/api/src/
├── agents/
│   ├── __init__.py
│   ├── crosslisting.py
│   ├── listing_optimizer.py
│   └── promotion.py
├── api/
│   ├── __init__.py
│   ├── endpoints/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── listings.py
│   │   ├── products.py
│   │   └── users.py
│   └── router.py
├── core/
│   ├── __init__.py
│   └── config.py
├── services/
│   ├── __init__.py
│   ├── auth.py
│   ├── listing.py
│   ├── product.py
│   └── user.py
└── main.py
```

### Known Gotchas of our codebase & Library Quirks

```python
# CRITICAL: The Promotion Agent's logic must be sophisticated to avoid detection by Poshmark.
# CRITICAL: Use randomized delays between actions to mimic human behavior.
```

## Implementation Blueprint

### Data models and structure

Refer to the PRP for "Phase 2: Database & Core Models".

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: CREATE apps/api/src/api/endpoints/auth.py
  - IMPLEMENT: API endpoints for user authentication.

Task 2: CREATE apps/api/src/api/endpoints/products.py
  - IMPLEMENT: CRUD API endpoints for products.

Task 3: CREATE apps/api/src/api/endpoints/listings.py
  - IMPLEMENT: CRUD API endpoints for listings.

Task 4: CREATE apps/api/src/agents/crosslisting.py
  - IMPLEMENT: The Crosslisting Agent.

Task 5: CREATE apps/api/src/agents/listing_optimizer.py
  - IMPLEMENT: The Listing Optimizer System.

Task 6: CREATE apps/api/src/agents/promotion.py
  - IMPLEMENT: The Promotion Agent.
```

### Implementation Patterns & Key Details

```python
# Use LangChain to define agents, tools, and chains.
# Use BeautifulSoup for web scraping.
# Use rembg for background removal.
```

### Integration Points

```yaml
DATABASE:
  - The backend will connect to the PostgreSQL database to store and retrieve data.

API:
  - The backend will expose a REST API for the frontend to consume.
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Run after each file creation - fix before proceeding
ruff check apps/api/src --fix
mypy apps/api/src
ruff format apps/api/src

# Expected: Zero errors. If errors exist, READ output and fix before proceeding.
```

### Level 2: Unit Tests (Component Validation)

```bash
# Test each component as it's created
uv run pytest apps/api/src/agents/tests/test_crosslisting.py -v
# ... and so on for other agents and services

# Full test suite for affected areas
uv run pytest apps/api/src/ -v

# Expected: All tests pass. If failing, debug root cause and fix implementation.
```

### Level 3: Integration Testing (System Validation)

```bash
# Service startup validation
uv run python apps/api/src/main.py &
sleep 3  # Allow startup time

# Health check validation
curl -f http://localhost:8000/health || echo "Service health check failed"

# Feature-specific endpoint testing
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Product"}' \
  | jq .  # Pretty print JSON response

# Expected: All integrations working, proper responses, no connection errors
```

## Final Validation Checklist

### Technical Validation

- [ ] All 3 validation levels completed successfully
- [ ] All tests pass: `uv run pytest apps/api/src/ -v`
- [ ] No linting errors: `uv run ruff check apps/api/src`
- [ ] No type errors: `uv run mypy apps/api/src`

### Feature Validation

- [ ] All success criteria from "What" section met
- [ ] API endpoints are documented

### Code Quality Validation

- [ ] Follows existing codebase patterns and naming conventions
- [ ] File placement matches desired codebase tree structure
- [ ] Anti-patterns avoided (check against Anti-Patterns section)

---

## Anti-Patterns to Avoid

- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip validation because "it should work"
- ❌ Don't ignore failing tests - fix them
- ❌ Don't use sync functions in async context
- ❌ Don't hardcode values that should be config
- ❌ Don't catch all exceptions - be specific
```