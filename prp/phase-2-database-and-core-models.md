name: "PRP for Phase 2: Database & Core Models"
description: |
  This PRP outlines the plan for designing and implementing the database schema and core data models for the Crosslist application.

---

## Goal

**Feature Goal**: To design and implement the PostgreSQL database schema and corresponding data models for the Crosslist application.

**Deliverable**: A set of Pydantic models in the `apps/api/src/models` directory that define the data structures for users, marketplaces, products, listings, and analytics.

**Success Definition**: The Pydantic models are created and validated, and the database schema is designed and ready for migration.

## Why

- This is a foundational step for the entire application, as all other features will depend on this database schema and data models.

## What

- Design the PostgreSQL database schema with the following tables:
    - `users` (id, email, password_hash, etc.)
    - `marketplaces` (id, name, api_url, etc.)
    - `user_marketplaces` (linking users to marketplaces with encrypted credentials)
    - `products` (user_id, title, description, sku, etc.)
    - `listings` (product_id, marketplace_id, url, price, status, etc.)
    - `analytics_data` (for tracking sales, trends, etc.)
- Implement the corresponding data models in the Python backend using Pydantic.

### Success Criteria

- [ ] Pydantic models for all tables are created.
- [ ] Database schema design is complete and documented.

## All Needed Context

### Context Completeness Check

_Before writing this PRP, validate: "If someone knew nothing about this codebase, would they have everything needed to implement this successfully?"_

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://pydantic-docs.helpmanual.io/
  why: Pydantic is the chosen library for data modeling.
  critical: Understanding Pydantic's features is essential for creating the data models.

- url: https://www.postgresql.org/docs/
  why: PostgreSQL is the chosen database.
  critical: Understanding PostgreSQL data types and constraints is crucial for schema design.
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase

```bash

```

### Desired Codebase tree with files to be added and responsibility of file

```bash
apps/api/src/models/
├── __init__.py
├── analytics.py
├── base.py
├── listings.py
├── marketplaces.py
├── products.py
└── users.py
```

### Known Gotchas of our codebase & Library Quirks

```python
# CRITICAL: Pydantic models should be used for both request/response validation and as a single source of truth for data structures.
```

## Implementation Blueprint

### Data models and structure

Create the core data models using Pydantic.

```python
# In apps/api/src/models/base.py
from pydantic import BaseModel, Field
from uuid import UUID, uuid4

class CoreModel(BaseModel):
    id: UUID = Field(default_factory=uuid4)

# In apps/api/src/models/users.py
from .base import CoreModel

class User(CoreModel):
    email: str
    password_hash: str

# ... and so on for other models
```

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: CREATE apps/api/src/models/base.py
  - IMPLEMENT: A base Pydantic model with a UUID primary key.

Task 2: CREATE apps/api/src/models/users.py
  - IMPLEMENT: Pydantic model for the `users` table.

Task 3: CREATE apps/api/src/models/marketplaces.py
  - IMPLEMENT: Pydantic model for the `marketplaces` table.

Task 4: CREATE apps/api/src/models/products.py
  - IMPLEMENT: Pydantic model for the `products` table.

Task 5: CREATE apps/api/src/models/listings.py
  - IMPLEMENT: Pydantic model for the `listings` table.

Task 6: CREATE apps/api/src/models/analytics.py
  - IMPLEMENT: Pydantic model for the `analytics_data` table.
```

### Implementation Patterns & Key Details

```python
# All models should inherit from the CoreModel to ensure they have a UUID primary key.
# Use Pydantic's validation features to enforce data integrity.
```

### Integration Points

```yaml
DATABASE:
  - migration: "Initial schema creation with all tables."
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Run after each file creation - fix before proceeding
ruff check apps/api/src/models --fix
mypy apps/api/src/models
ruff format apps/api/src/models

# Project-wide validation
ruff check apps/api/src --fix
mypy apps/api/src
ruff format apps/api/src

# Expected: Zero errors. If errors exist, READ output and fix before proceeding.
```

### Level 2: Unit Tests (Component Validation)

```bash
# Test each model as it's created
uv run pytest apps/api/src/models/tests/test_users.py -v
# ... and so on for other models

# Full test suite for affected areas
uv run pytest apps/api/src/models/tests/ -v

# Expected: All tests pass. If failing, debug root cause and fix implementation.
```

### Level 3: Integration Testing (System Validation)

```bash
# Database validation (if database integration)
# Verify database schema, connections, migrations
psql $DATABASE_URL -c "\dt" || echo "Database connection failed or no tables found"

# Expected: All tables are created in the database.
```

## Final Validation Checklist

### Technical Validation

- [ ] All 3 validation levels completed successfully
- [ ] All tests pass: `uv run pytest apps/api/src/models/tests/ -v`
- [ ] No linting errors: `uv run ruff check apps/api/src/models`
- [ ] No type errors: `uv run mypy apps/api/src/models`
- [ ] No formatting issues: `uv run ruff format apps/api/src/models --check`

### Feature Validation

- [ ] All success criteria from "What" section met
- [ ] Database schema matches the Pydantic models

### Code Quality Validation

- [ ] Follows existing codebase patterns and naming conventions
- [ ] File placement matches desired codebase tree structure
- [ ] Anti-patterns avoided (check against Anti-Patterns section)
- [ ] Dependencies properly managed and imported

---

## Anti-Patterns to Avoid

- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip validation because "it should work"
- ❌ Don't ignore failing tests - fix them
- ❌ Don't use sync functions in async context
- ❌ Don't hardcode values that should be config
- ❌ Don't catch all exceptions - be specific
