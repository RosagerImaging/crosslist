# crosslist - Technical Specification

**Author:** Joel
**Date:** 2025-12-19
**Project Level:** 3
**Change Type:** feature-enhancement
**Development Context:** greenfield

---

## Context

### Available Documents

**Product Brief**: Crosslist AI-native e-commerce reseller inventory management platform

- Vision: Central hub for managing inventory across multiple marketplaces
- Key differentiation: Unified ecosystem vs fragmented competitor tools (which have "clunky UX")
- Target users: Casual Cleaners, Side-Hustlers, Pro-Sellers
- AI-native approach with autonomous agents for crosslisting, optimization, and automation

**Project Phase**: Phase 3 (Implementation) - Epics 1-3 completed, Epic 4 ready to start

### Project Stack

**Monorepo Architecture:**

- Turborepo v2.5.8 with npm workspaces
- Node.js >= 18
- npm v10.9.3

**Web Application (apps/web):**

- Next.js 15.0.0 (App Router)
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4
- shadcn/ui components (Radix UI primitives)

**Database & Backend:**

- Supabase CLI v2.65.6
- Local development setup (ports 54321-54327)
- PostgreSQL 17
- Current schema: 5 tables (items, item_images, marketplace_credentials, marketplace_listings, users)
- 5 migrations applied (latest: 20251214072755_add_deleted_at_to_items.sql)

**State Management & Data Fetching:**

- TanStack Query v5.90.12
- React Hook Form v7.68.0
- Zod v4.1.13 (schema validation)

**Testing:**

- E2E: Playwright v1.57.0 with @axe-core/playwright for accessibility
- Unit: Vitest v4.0.15 with Testing Library
- Test locations: `playwright/tests/`, `tests/unit/`

**Error Tracking:**

- Sentry Next.js v10.30.0

**Build & Quality:**

- ESLint 9.0.0
- Prettier 3.6.2
- Husky v9.1.7 + lint-staged for pre-commit hooks

### Existing Codebase Structure

**Greenfield Project** - Establishing new patterns

**Current Structure:**

```
crosslist/
├── apps/
│   └── web/              # Next.js application
│       ├── app/          # App Router pages
│       ├── components/   # React components
│       ├── lib/          # Utilities and services
│       │   ├── supabase/ # Supabase client wrappers
│       │   ├── hooks/    # React hooks
│       │   └── services/ # Business logic
│       ├── types/        # TypeScript type definitions
│       │   └── supabase.ts  # Database types (362 lines)
│       └── tests/        # Test files
├── packages/
│   └── shared/           # Shared utilities
└── supabase/
    ├── migrations/       # Database migrations (5 files)
    └── config.toml       # Supabase configuration
```

**Established Patterns:**

- Server/Client component separation (Next.js 15 App Router)
- Supabase client initialization in `lib/supabase/`
- Hook-based data fetching with TanStack Query
- Zod schemas for validation
- Test co-location in `tests/` directories

**Current Database Types Location:**

- File: `apps/web/types/supabase.ts`
- Size: 362 lines
- Contains: Database interface, Tables, Enums, helper types
- Format: Appears to be Supabase CLI generated (standard structure)

**Identified Gap:**

- ❌ No npm script to regenerate database types
- ❌ Types must be manually regenerated after schema changes
- ❌ Risk of type/schema drift as database evolves

---

## The Change

### Problem Statement

During Epic 3 Story 3.1 (Inventory Database Schema), the team encountered friction when needing to generate TypeScript types from the Supabase database schema. The expected `npm run db:types` script does not exist, forcing developers to manually run Supabase CLI commands to regenerate types after schema changes.

**Current Manual Process:**

1. Developer applies database migration (`supabase db push`)
2. Developer manually runs: `supabase gen types typescript --local > apps/web/types/supabase.ts`
3. Developer must remember correct command syntax and output path
4. Risk of types falling out of sync with schema if step is forgotten

**Impact:**

- **Developer friction**: Manual command execution breaks flow
- **Inconsistency risk**: Easy to forget regeneration after migrations
- **Onboarding burden**: New team members must learn manual process
- **Critical for Epic 4**: Crosslisting system will add new tables (marketplace_listings, crosslisting_jobs), requiring frequent type updates

**Why This Matters Now:**
Epic 3 Retrospective identified this as a 30-minute quick win to implement before Epic 4 starts. Epic 4 will involve significant schema changes for the crosslisting system, making automated type generation essential.

### Proposed Solution

Add a single `db:types` npm script that leverages the existing Supabase CLI (already installed as devDependency) to automatically generate TypeScript types from the database schema and output them to the correct location.

**The Script:**

```json
"db:types": "supabase gen types typescript --local > apps/web/types/supabase.ts"
```

**For Remote Supabase (alternative command developers can use):**

```bash
supabase gen types typescript --project-id <project-id> --schema public > apps/web/types/supabase.ts
```

**Developer Workflow:**

1. Apply migration: `supabase db push` or `supabase migration up`
2. Regenerate types: `npm run db:types` (from project root)
3. Types are updated automatically at `apps/web/types/supabase.ts`

**Consistency with Existing Patterns:**
This follows the established `generate:*` pattern already used for `generate:api-client`, making it intuitive for the team.

**Why This Solves the Problem:**

- ✅ Single command: `npm run db:types`
- ✅ No memorization needed
- ✅ Correct output path guaranteed
- ✅ Uses existing Supabase CLI (no new dependencies)
- ✅ 30-minute implementation time
- ✅ Ready for Epic 4's schema changes

### Scope

**In Scope:**

- ✅ Add `db:types` script to root `package.json`
- ✅ Document the script in project README
- ✅ Works with local Supabase (`--local` flag)
- ✅ Provide alternative command for remote Supabase in documentation
- ✅ Output to `apps/web/types/supabase.ts` (existing location)
- ✅ Simple, manual execution (developer runs when needed)

**Out of Scope:**

- ❌ Automatic triggering after migrations (manual is sufficient for now)
- ❌ CI/CD validation that types match schema (future enhancement)
- ❌ Git pre-commit hooks to enforce regeneration (adds complexity)
- ❌ Custom type transformations or modifications
- ❌ Multiple output formats or locations
- ❌ Type validation or testing (separate concern)
- ❌ Support for multiple Supabase projects simultaneously

---

## Implementation Details

### Source Tree Changes

**Files to Modify:**

1. **`/package.json` - MODIFY**
   - Add `db:types` script to the `scripts` section
   - Location: After `generate:api-client` script (line ~20)
   - Action: Add new script entry

2. **`/README.md` - MODIFY**
   - Add Database Types Generation section
   - Location: In "Development Environment Setup" or new "Database" section
   - Action: Document the `db:types` command and when to use it

**Files Created:**

- None (uses existing Supabase CLI and output location)

**Files Affected (output):**

- `/apps/web/types/supabase.ts` - Will be regenerated when script runs (not modified by this change, just documented as the output target)

### Technical Approach

**Core Implementation:**

Leverage the Supabase CLI's built-in `gen types` command which is already installed in the project as a devDependency (v2.65.6).

**Script Definition:**

```json
"db:types": "supabase gen types typescript --local > apps/web/types/supabase.ts"
```

**Technical Details:**

1. **Command Breakdown:**
   - `supabase gen types typescript` - Generates TypeScript type definitions from database schema
   - `--local` - Targets the local Supabase instance (running on port 54321)
   - `> apps/web/types/supabase.ts` - Redirects output to the existing types file

2. **Why `--local` Flag:**
   - Works with local development setup (`supabase start`)
   - No need for project credentials or environment variables
   - Matches team's current workflow (local-first development)
   - Fast execution (no network calls)

3. **Alternative for Remote (documented, not scripted):**
   - Command: `supabase gen types typescript --project-id <PROJECT_ID> --schema public > apps/web/types/supabase.ts`
   - Requires: `SUPABASE_ACCESS_TOKEN` environment variable or `supabase login`
   - Use case: When local database is not running or syncing from production schema

4. **Output Format:**
   - Standard Supabase TypeScript types
   - Includes: Database interface, Tables, Enums, helper types (TablesInsert, TablesUpdate, etc.)
   - Matches current file format (362 lines for current schema)

5. **Execution Context:**
   - Run from project root (monorepo root)
   - Works within Turborepo workspace structure
   - No additional configuration needed (Supabase config.toml already exists)

### Existing Patterns to Follow

**Greenfield Project - Establishing Patterns**

This change follows and reinforces existing project conventions:

**1. Code Generation Script Pattern:**

- **Existing**: `generate:api-client` - Generates API client from OpenAPI spec
- **New**: `db:types` - Generates database types from Supabase schema
- **Pattern**: `generate:*` or `db:*` naming for code generation scripts
- **Consistency**: Both use external CLI tools, output to specific locations, run manually

**2. Script Naming Convention:**

- Root-level scripts use `:` separator (e.g., `install:api`, `lint:api`, `test:api`, `dev:api`)
- Generation scripts grouped under `generate:*` namespace
- Database operations use `db:` prefix (establishing pattern for future `db:*` commands)

**3. Output Location Pattern:**

- Generated files go in `apps/{app-name}/types/` or similar conventional locations
- `supabase.ts` already exists at `apps/web/types/supabase.ts` (362 lines)
- Script maintains this existing location

**4. Development Workflow:**

- Developers work locally first (`supabase start`, `npm run dev`)
- Code generation is manual, not automatic (maintains developer control)
- Clear separation between generation and usage

**5. Documentation Pattern:**

- README.md contains setup instructions and common commands
- New scripts should be documented in README with usage examples

### Integration Points

**1. Supabase CLI Integration:**

- **Dependency**: Supabase CLI v2.65.6 (already installed in `apps/web/package.json`)
- **Connection**: Script calls `supabase gen types` command
- **Configuration**: Uses existing `supabase/config.toml` for project settings
- **Requirement**: Local Supabase must be running (`supabase start`) before script execution

**2. TypeScript Build System:**

- **Output File**: `apps/web/types/supabase.ts`
- **Consumer**: All Next.js files that import from `@/types/supabase`
- **Build Impact**: Updated types are used by TypeScript compiler during `npm run build`
- **No Build Integration**: Script runs independently, not part of build pipeline

**3. Database Migration Workflow:**

- **Trigger Point**: Developer applies migration via `supabase db push` or `supabase migration up`
- **Developer Action**: Manually run `npm run db:types` after migration
- **Schema Sync**: Ensures types match latest database schema
- **No Automatic Hook**: Deliberately manual to give developers control

**4. Git Workflow:**

- **Generated File**: `apps/web/types/supabase.ts` is committed to git (not gitignored)
- **PR Review**: Type changes are visible in code review
- **Team Sync**: All developers get updated types when pulling changes
- **No Pre-commit Hook**: Manual execution, no enforcement (by design)

**5. Development Environment:**

- **Local Supabase**: Must be running on port 54321 (configured in `supabase/config.toml`)
- **Fallback**: Remote option documented for when local isn't available
- **No Environment Variables**: Local mode requires no additional configuration

---

## Development Context

### Relevant Existing Code

**1. Existing Database Types File:**

- **File**: `/apps/web/types/supabase.ts` (362 lines)
- **Purpose**: TypeScript type definitions for database schema
- **Current Format**: Standard Supabase CLI generated types
- **Usage**: Imported throughout the codebase as `@/types/supabase`
- **Status**: Currently requires manual regeneration after schema changes

**2. Package.json Scripts:**

- **File**: `/package.json`
- **Relevant Pattern**: `generate:api-client` script (line ~20)
- **Code**:
  ```json
  "generate:api-client": "openapi-typescript-codegen --input http://localhost:8000/openapi.json --output packages/api-client/src --client axios"
  ```
- **Pattern to Follow**: Code generation scripts use `generate:*` namespace

**3. Supabase Configuration:**

- **File**: `/supabase/config.toml`
- **Relevant Settings**:
  ```toml
  project_id = "crosslist"
  [api]
  port = 54321
  ```
- **Usage**: Local Supabase instance configuration used by CLI commands

**4. Recent Migrations:**

- **Latest**: `/supabase/migrations/20251214072755_add_deleted_at_to_items.sql`
- **Impact**: Each migration requires type regeneration
- **Current Tables**: items, item_images, marketplace_credentials, marketplace_listings, users

**5. Type Usage Examples:**

- Files importing from `@/types/supabase` include:
  - Data fetching hooks in `/apps/web/lib/hooks/`
  - API routes in `/apps/web/app/api/`
  - Components using database types throughout the application

### Dependencies

**Framework/Libraries:**

**Required Dependencies (Already Installed):**

1. **Supabase CLI** - v2.65.6
   - **Package**: `supabase` (devDependency in `apps/web/package.json`)
   - **Purpose**: Generates TypeScript types from database schema
   - **Command Used**: `supabase gen types typescript`
   - **Installation Status**: ✅ Already installed
   - **No Action Needed**: Existing dependency is sufficient

**Runtime Dependencies (No Changes):**

- **TypeScript** - v5.9.3 (consumes generated types)
- **Next.js** - v15.0.0 (uses types in App Router components)
- **React** - v19.2.0 (types used in components)

**Development Workflow Dependencies:**

- **Node.js** - >= 18 (required for npm scripts)
- **npm** - v10.9.3 (executes package.json scripts)
- **Turborepo** - v2.5.8 (monorepo task orchestration)

**Internal Modules:**

**None Required**

This is a standalone npm script that:

- Calls external Supabase CLI command
- Outputs to a file location
- Has no dependencies on internal project modules
- Does not require custom build scripts or utilities
- Works independently of application code

### Configuration Changes

**1. Root `package.json` - MODIFY**

**File**: `/package.json`

**Change**: Add new script to `scripts` section

**Before**:

```json
{
  "scripts": {
    "generate:api-client": "openapi-typescript-codegen --input http://localhost:8000/openapi.json --output packages/api-client/src --client axios"
    // ... other scripts
  }
}
```

**After**:

```json
{
  "scripts": {
    "generate:api-client": "openapi-typescript-codegen --input http://localhost:8000/openapi.json --output packages/api-client/src --client axios",
    "db:types": "supabase gen types typescript --local > apps/web/types/supabase.ts"
    // ... other scripts
  }
}
```

**Impact**: New `db:types` script available to all developers

**2. No Other Configuration Changes**

- **Supabase config.toml**: No changes needed (already configured)
- **TypeScript tsconfig.json**: No changes needed (types already imported)
- **Build configuration**: No changes needed (types consumed at build time)
- **Environment variables**: No changes needed (uses local Supabase)

### Existing Conventions (Greenfield)

**Note**: This is a greenfield project establishing new conventions.

**1. npm Script Naming Conventions:**

- **Pattern**: Use `:` separator for namespaced scripts
- **Examples**:
  - `generate:api-client` - Code generation namespace
  - `dev:api`, `lint:api`, `test:api` - Service-specific namespaces
- **New Pattern Being Established**: `db:*` namespace for database operations
  - `db:types` - Generate database types (this change)
  - Future: `db:migrate`, `db:reset`, etc.

**2. Code Generation Script Patterns:**

- **Manual Execution**: Generation scripts are run manually by developers
- **Output Committed**: Generated files are committed to git (not in .gitignore)
- **No Automation**: Scripts not triggered by build process or pre-commit hooks
- **Developer Control**: Developers decide when to regenerate

**3. Monorepo Structure:**

- **Root Scripts**: Common operations run from monorepo root
- **Workspace Awareness**: Scripts reference workspace paths (e.g., `apps/web/types/`)
- **Turborepo Integration**: Scripts can be orchestrated via turbo.json if needed

**4. Supabase Workflow:**

- **Local-First Development**: Developers run local Supabase instance
- **Migration Flow**:
  1. Create migration → `supabase migration new`
  2. Apply migration → `supabase db push` or `supabase migration up`
  3. Generate types → `npm run db:types` (NEW)
  4. Commit migration + types
- **Type Safety**: Database types are source of truth for data models

**5. Documentation Standards:**

- **README.md**: Primary developer documentation location
- **Script Documentation**: New scripts documented in README with usage examples
- **Developer Onboarding**: Clear, step-by-step instructions for common tasks

### Test Framework & Standards

**E2E Testing:**

- **Framework**: Playwright v1.57.0
- **Location**: `apps/web/playwright/tests/`
- **Configuration**: `apps/web/playwright.config.ts`
- **Accessibility**: @axe-core/playwright v4.11.0 for a11y testing
- **Run Command**: `npm run test` (from apps/web)

**Unit Testing:**

- **Framework**: Vitest v4.0.15
- **Test Library**: @testing-library/react v16.1.0, @testing-library/dom v10.4.0
- **Location**: `apps/web/tests/unit/`
- **Environment**: jsdom v25.0.1
- **Run Command**: `npm run test:unit` (from apps/web)

**Testing This Change:**

**No Traditional Tests Required** for this npm script because:

- It's a simple shell command wrapper
- Supabase CLI is externally maintained and tested
- Output validation done by TypeScript compiler
- Manual verification is sufficient

**Validation Approach:**

1. **Functional Test**: Run `npm run db:types` and verify:
   - Command executes successfully
   - File `apps/web/types/supabase.ts` is updated
   - No errors in output
2. **Integration Test**: TypeScript compiler validates generated types
   - Run `npm run build` - should compile without type errors
   - Existing code using types should continue working
3. **Developer Verification**: Developer manually inspects generated types file

**Future Testing Considerations:**

- Could add CI check to verify types are in sync with schema
- Could create npm script to validate types match database
- Not required for initial 30-minute implementation

---

## Implementation Stack

**Primary Technology:**

- **Supabase CLI** v2.65.6 - Database type generation
- **npm** scripts - Workflow automation
- **Shell** - Command execution and output redirection

**Supporting Stack:**

- **Node.js** >= 18 - Runtime for npm scripts
- **TypeScript** v5.9.3 - Consumes generated types
- **PostgreSQL** 17 - Database (via Supabase)

**Development Environment:**

- **Monorepo**: Turborepo v2.5.8 with npm workspaces
- **Local Supabase**: Running on ports 54321-54327
- **Output Location**: `apps/web/types/supabase.ts`

**No New Technologies Added:**

- Uses existing dependencies
- No additional packages required
- No new build tools needed

---

## Technical Details

**Command Specification:**

```bash
supabase gen types typescript --local > apps/web/types/supabase.ts
```

**Technical Breakdown:**

1. **`supabase gen types typescript`**
   - Supabase CLI command for type generation
   - Connects to running Supabase instance
   - Introspects database schema (tables, columns, enums, functions)
   - Generates TypeScript type definitions

2. **`--local` Flag**
   - Targets local Supabase instance (localhost:54321)
   - Reads from `supabase/config.toml` for project configuration
   - No authentication required (local development)
   - Fast execution (no network latency)

3. **Output Redirection `>`**
   - Shell redirection operator
   - Captures stdout from Supabase CLI
   - Writes to specified file path
   - Overwrites existing file completely (not append)

4. **Output Path: `apps/web/types/supabase.ts`**
   - Relative path from monorepo root
   - Matches existing location (maintains convention)
   - Accessible via TypeScript path alias `@/types/supabase`

**Generated Type Structure:**

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      [table_name]: {
        Row: {
          /* column types */
        };
        Insert: {
          /* insert types with optional defaults */
        };
        Update: {
          /* update types - all optional */
        };
      };
    };
    Enums: {
      /* database enums */
    };
    Functions: {
      /* database functions */
    };
  };
};

// Helper types for easier access
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
```

**Requirements:**

**Prerequisites:**

- Local Supabase must be running: `supabase start`
- Database must have current schema applied
- Supabase CLI v2.65.6+ installed (already satisfied)

**Error Conditions:**

- **Supabase not running**: "Error: Failed to connect to localhost:54321"
  - **Solution**: Run `supabase start` first
- **Invalid schema**: Type generation fails if schema has errors
  - **Solution**: Fix migration files and reapply
- **Permission errors**: Cannot write to output file
  - **Solution**: Check file permissions on `apps/web/types/`

**Performance:**

- **Execution Time**: < 2 seconds (local database)
- **Network**: No network calls (fully local)
- **File Size**: Proportional to schema complexity (currently ~362 lines for 5 tables)

**Platform Compatibility:**

- **macOS**: ✅ Full support
- **Linux**: ✅ Full support
- **Windows**: ✅ Full support (shell redirection `>` works in cmd, PowerShell, Git Bash)

---

## Development Setup

**Prerequisites:**

1. **Node.js >= 18** - Already required for project
2. **npm v10.9.3** - Already installed
3. **Supabase CLI v2.65.6** - Already installed as devDependency
4. **Local Supabase Running** - Required for type generation

**Environment Setup:**

```bash
# 1. Ensure Supabase is running
supabase start

# Verify Supabase is running (check ports)
# API: http://localhost:54321
# DB: postgresql://postgres:postgres@localhost:54322/postgres

# 2. Navigate to project root
cd /path/to/crosslist

# 3. Install dependencies (if not already)
npm install

# 4. Ready to use db:types script (after implementation)
npm run db:types
```

**No Additional Setup Required:**

- No new packages to install
- No environment variables to configure
- No additional configuration files needed
- Works with existing Supabase and npm setup

**Developer Onboarding:**

New developers will:

1. Follow existing project setup (Supabase start, npm install)
2. Learn new `npm run db:types` command from updated README
3. Run script after applying any database migrations
4. Commit regenerated types file with migrations

---

## Implementation Guide

### Setup Steps

**No Setup Required**

This implementation uses only existing tools and dependencies:

- ✅ Supabase CLI already installed
- ✅ Local Supabase environment already configured
- ✅ Output directory already exists
- ✅ No new packages needed

Developer can proceed directly to implementation.

### Implementation Steps

**Step 1: Modify Root package.json**

1. Open `/package.json`
2. Locate the `"scripts"` section
3. Add the new `db:types` script after `generate:api-client`

```json
{
  "scripts": {
    "generate:api-client": "openapi-typescript-codegen --input http://localhost:8000/openapi.json --output packages/api-client/src --client axios",
    "db:types": "supabase gen types typescript --local > apps/web/types/supabase.ts"
  }
}
```

4. Save the file

**Estimated Time:** 2 minutes

---

**Step 2: Test the Script**

1. Ensure Supabase is running:

   ```bash
   supabase start
   ```

2. Run the new script from project root:

   ```bash
   npm run db:types
   ```

3. Verify success:
   - No error messages in console
   - File `apps/web/types/supabase.ts` exists
   - File contains valid TypeScript types
   - File size is reasonable (~300-400 lines for current schema)

4. Verify TypeScript compilation:
   ```bash
   cd apps/web
   npm run build
   ```

   - Should complete without type errors

**Estimated Time:** 5 minutes

---

**Step 3: Update README.md**

1. Open `/README.md`
2. Add documentation for the new script in appropriate section (e.g., "Database" or "Development")

**Example Documentation:**

````markdown
## Database Type Generation

After applying database migrations, regenerate TypeScript types:

```bash
npm run db:types
```
````

This command generates TypeScript type definitions from your Supabase database schema and outputs them to `apps/web/types/supabase.ts`.

**When to use:**

- After creating or applying database migrations
- After modifying database schema
- When types seem out of sync with database

**Requirements:**

- Local Supabase must be running (`supabase start`)
- Database migrations must be applied

**For remote Supabase** (alternative):

```bash
supabase gen types typescript --project-id <project-id> --schema public > apps/web/types/supabase.ts
```

````

**Estimated Time:** 10 minutes

---

**Step 4: Commit Changes**

1. Stage files:
   ```bash
   git add package.json README.md
````

2. Commit with descriptive message:

   ```bash
   git commit -m "feat: add db:types script for automated database type generation

   - Add npm script to generate TypeScript types from Supabase schema
   - Uses Supabase CLI with --local flag for local development
   - Outputs to apps/web/types/supabase.ts
   - Document usage in README.md
   - Resolves Epic 3 retrospective action item"
   ```

**Estimated Time:** 3 minutes

---

**Total Implementation Time:** ~20-30 minutes

### Testing Strategy

**Manual Validation (Primary Approach)**

Since this is a simple npm script wrapper, manual validation is sufficient:

**Test 1: Script Execution**

```bash
# Prerequisites
supabase start

# Execute
npm run db:types

# Expected Result
✅ Command completes without errors
✅ Console shows Supabase CLI output
✅ No "command not found" or permission errors
```

**Test 2: File Generation**

```bash
# Check file exists and was updated
ls -lh apps/web/types/supabase.ts

# Expected Result
✅ File exists at expected path
✅ File size is reasonable (~300-400 lines)
✅ Modified timestamp is recent
```

**Test 3: Type Content Validation**

```bash
# Open file and inspect
cat apps/web/types/supabase.ts | head -20

# Expected Result
✅ File contains TypeScript type definitions
✅ Exports `Database` type
✅ Contains table definitions for current schema
✅ No syntax errors or malformed output
```

**Test 4: TypeScript Compilation**

```bash
cd apps/web
npm run build

# Expected Result
✅ Build completes successfully
✅ No type errors
✅ Existing code using types still compiles
```

**Test 5: IDE Integration**

```bash
# Open a file that imports from @/types/supabase in VS Code
# Check type intellisense

# Expected Result
✅ Type hints work correctly
✅ Autocomplete suggestions appear
✅ No "cannot find module" errors
```

**Test 6: Error Handling**

```bash
# Test without Supabase running
supabase stop
npm run db:types

# Expected Result
✅ Clear error message about connection failure
✅ Script exits with non-zero status

# Restart Supabase
supabase start
```

**No Automated Tests Required**

This change does not require unit or E2E tests because:

- Simple shell command wrapper
- Supabase CLI is externally tested
- Output validation happens via TypeScript compiler
- Manual verification is faster than test creation (30 min limit)

### Acceptance Criteria

**Must Have (Required for Story Completion):**

1. **✅ Script Added to package.json**
   - `db:types` script exists in root `package.json`
   - Script command is: `supabase gen types typescript --local > apps/web/types/supabase.ts`
   - Script runs without errors when executed from project root

2. **✅ Script Executes Successfully**
   - Running `npm run db:types` generates types file
   - No errors when Supabase is running
   - Output file is created at `apps/web/types/supabase.ts`
   - File contains valid TypeScript type definitions

3. **✅ Types Match Current Schema**
   - Generated types include all 5 current tables
   - Tables: items, item_images, marketplace_credentials, marketplace_listings, users
   - Types are accurate and usable in TypeScript code
   - TypeScript compiler accepts generated types

4. **✅ Documentation Updated**
   - README.md includes section on database type generation
   - Documentation explains when to use `npm run db:types`
   - Documentation includes prerequisites (Supabase must be running)
   - Documentation mentions alternative for remote Supabase

5. **✅ Existing Code Unaffected**
   - All existing code using `@/types/supabase` continues to work
   - TypeScript build completes successfully (`npm run build`)
   - No breaking changes to type structure

**Should Have (Nice to Have):**

6. **✅ Clear Error Messages**
   - Helpful error when Supabase is not running
   - Indicates what to do if type generation fails

7. **✅ Developer Workflow Integration**
   - Team understands when to run the script
   - Script becomes part of standard migration workflow
   - No confusion about manual vs automated execution

**Could Have (Future Enhancements):**

- CI check to validate types match schema
- Pre-commit hook to remind about type regeneration
- Automatic type generation after migrations
- Support for multiple Supabase environments

**Won't Have (Out of Scope):**

- Automatic triggering (manual execution is sufficient)
- Custom type transformations
- Type validation tests
- Git hooks enforcement

---

## Developer Resources

### File Paths Reference

**Files to Modify:**

1. **`/package.json`** - Root package.json
   - **Action**: Add `db:types` script
   - **Line**: ~20 (after `generate:api-client`)
   - **Section**: `scripts` object

2. **`/README.md`** - Project documentation
   - **Action**: Add Database Type Generation section
   - **Location**: Development or Database section
   - **Content**: Usage instructions, when to run, prerequisites

**Files Affected (Output):**

3. **`/apps/web/types/supabase.ts`** - Database types
   - **Action**: Regenerated by script
   - **Current**: 362 lines
   - **Format**: Supabase CLI generated TypeScript types

**Configuration Files (No Changes):**

4. **`/supabase/config.toml`** - Supabase configuration
   - **Status**: No changes needed
   - **Used By**: Supabase CLI for local connection

5. **`/apps/web/package.json`** - Web app package.json
   - **Status**: No changes needed
   - **Contains**: Supabase CLI v2.65.6 as devDependency

### Key Code Locations

**Existing Code Patterns:**

1. **Code Generation Script Pattern**
   - **File**: `/package.json`
   - **Location**: `scripts.generate:api-client`
   - **Pattern**: External CLI tool → output redirection → committed file
   - **New Script Follows This Pattern**: `db:types`

2. **Type Import Locations**
   - **Pattern**: `import { Database } from '@/types/supabase'`
   - **Files Using Types**:
     - `/apps/web/lib/hooks/*.ts` - Data fetching hooks
     - `/apps/web/app/api/**/*.ts` - API route handlers
     - `/apps/web/components/**/*.tsx` - Components using database data

3. **Supabase Client Setup**
   - **Directory**: `/apps/web/lib/supabase/`
   - **Files**: Client initialization, middleware
   - **Usage**: Consumes types from `@/types/supabase`

4. **Database Migrations**
   - **Directory**: `/supabase/migrations/`
   - **Latest**: `20251214072755_add_deleted_at_to_items.sql`
   - **Count**: 5 migrations applied
   - **Workflow**: After migration → run `npm run db:types`

**No New Code Components:**

This change creates NO new code files or modules:

- Only adds npm script configuration
- Only updates documentation
- Types are generated by external CLI

### Testing Locations

**No Test Files Required**

This change does not require creating new test files because:

- Simple npm script (no logic to test)
- Supabase CLI is externally maintained
- TypeScript compiler validates output
- Manual verification is sufficient

**Validation Locations:**

1. **Terminal - Script Execution**
   - **Command**: `npm run db:types`
   - **Validates**: Script runs without errors

2. **File System - Output File**
   - **Location**: `/apps/web/types/supabase.ts`
   - **Validates**: File exists, contains types, reasonable size

3. **TypeScript Compiler - Type Validation**
   - **Command**: `npm run build` (from apps/web)
   - **Validates**: Generated types are valid, no compilation errors

4. **IDE - Developer Experience**
   - **Location**: Any file importing from `@/types/supabase`
   - **Validates**: Type hints, autocomplete, IntelliSense work correctly

**Existing Test Suites (Unaffected):**

- **E2E Tests**: `/apps/web/playwright/tests/` - No changes needed
- **Unit Tests**: `/apps/web/tests/unit/` - No changes needed
- Both test suites will continue to pass after change

### Documentation to Update

**1. README.md (Primary Documentation)**

**File**: `/README.md`

**Section to Add**: "Database Type Generation" or "Database Development"

**Content**:

````markdown
## Database Type Generation

After applying database migrations, regenerate TypeScript types:

```bash
npm run db:types
```
````

This command generates TypeScript type definitions from your Supabase database schema.

**When to use:**

- After creating or applying database migrations
- After modifying database schema
- When types seem out of sync with database

**Requirements:**

- Local Supabase must be running (`supabase start`)
- Database migrations must be applied

**For remote Supabase** (alternative):

```bash
supabase gen types typescript --project-id <project-id> --schema public > apps/web/types/supabase.ts
```

**Output**: Types are generated at `apps/web/types/supabase.ts`

````

**2. Migration Workflow Documentation (If Exists)**

**Check for**: Any existing documentation about database migrations

**Update**: Add step to regenerate types after migrations

**Example**:
```markdown
## Database Migration Workflow

1. Create migration: `supabase migration new <name>`
2. Edit migration file in `supabase/migrations/`
3. Apply migration: `supabase db push`
4. **Regenerate types: `npm run db:types`** ← ADD THIS
5. Commit migration + types: `git add supabase/migrations/ apps/web/types/supabase.ts`
````

**3. Developer Onboarding Guide (If Exists)**

**Check for**: `CONTRIBUTING.md`, `docs/development.md`, or similar

**Update**: Include `db:types` in available npm scripts list

**4. No API Documentation Needed**

- This is a developer-only script (not user-facing)
- No API reference needed
- No component documentation needed

---

## UX/UI Considerations

**Not Applicable - Developer Tool Only**

This change has no user-facing UI components:

- No web interface changes
- No user interactions
- No visual design considerations
- No accessibility requirements

**Developer Experience (DX) Considerations:**

1. **Clear Command Name**
   - `db:types` is concise and descriptive
   - Follows established `db:*` namespace pattern
   - Easy to remember and type

2. **Error Messages**
   - Supabase CLI provides clear error messages when:
     - Local instance not running
     - Connection fails
     - Schema has errors
   - Developer can easily diagnose and fix issues

3. **Documentation Clarity**
   - README clearly explains when to use the command
   - Prerequisites are explicitly stated
   - Alternative for remote Supabase is documented

4. **Workflow Integration**
   - Fits naturally into existing migration workflow
   - Manual execution gives developer control
   - No hidden automation or surprises

5. **Success Feedback**
   - Silent success (file generated) is acceptable for CLI tools
   - Developers can verify by checking file timestamp or git status
   - TypeScript compiler provides validation

---

## Testing Approach

**Manual Testing Only (No Automated Tests)**

**Rationale:**

- Simple shell command wrapper (no logic to test)
- Supabase CLI is externally tested and maintained
- Output validation done by TypeScript compiler
- Creating automated tests would take longer than manual verification
- 30-minute time limit for this task

**Testing Phases:**

**Phase 1: Implementation Verification (During Development)**

```bash
# 1. Verify script runs
npm run db:types

# Expected: Command completes, file updated
# Time: 30 seconds

# 2. Check output file
ls -lh apps/web/types/supabase.ts

# Expected: File exists, reasonable size (~300-400 lines)
# Time: 10 seconds

# 3. Verify TypeScript compilation
cd apps/web && npm run build

# Expected: Build succeeds, no type errors
# Time: 2 minutes
```

**Phase 2: Error Handling Verification**

```bash
# 1. Test without Supabase running
supabase stop
npm run db:types

# Expected: Clear error message
# Time: 30 seconds

# 2. Restart and verify recovery
supabase start
npm run db:types

# Expected: Success
# Time: 1 minute
```

**Phase 3: Developer Workflow Integration**

```bash
# Simulate full migration workflow
# 1. Apply a migration
supabase db push

# 2. Regenerate types
npm run db:types

# 3. Verify types updated
git diff apps/web/types/supabase.ts

# 4. Build application
npm run build

# Expected: All steps succeed
# Time: 3 minutes
```

**Phase 4: Documentation Verification**

1. Read README section on database type generation
2. Verify instructions are clear and accurate
3. Ensure prerequisites are listed
4. Check alternative remote command is documented

**Time: 2 minutes**

**Total Testing Time: ~10 minutes**

**Success Criteria:**

- ✅ Script executes without errors
- ✅ Types file generated correctly
- ✅ TypeScript compilation succeeds
- ✅ Error handling works (clear messages)
- ✅ Documentation is clear and helpful

**No Regression Testing Needed:**

- Change is additive (no existing functionality modified)
- Existing code continues to work unchanged
- No database schema changes
- No breaking changes to types structure

---

## Deployment Strategy

### Deployment Steps

**Simple Git Workflow (No Special Deployment)**

This change requires no special deployment process:

**Step 1: Create Branch**

```bash
git checkout -b feat/db-types-script
```

**Step 2: Implement Changes**

1. Modify `package.json` (add `db:types` script)
2. Update `README.md` (add documentation)
3. Test the script locally
4. Verify build still works

**Step 3: Commit Changes**

```bash
git add package.json README.md
git commit -m "feat: add db:types script for automated database type generation

- Add npm script to generate TypeScript types from Supabase schema
- Uses Supabase CLI with --local flag for local development
- Outputs to apps/web/types/supabase.ts
- Document usage in README.md
- Resolves Epic 3 retrospective action item"
```

**Step 4: Push and Create PR**

```bash
git push origin feat/db-types-script
# Create PR via GitHub UI
```

**Step 5: PR Review**

- Review package.json change
- Review README documentation
- Verify no unintended changes
- Check commit message follows convention

**Step 6: Merge to Main**

```bash
# After approval, merge PR
# Squash and merge (recommended)
```

**Step 7: Team Communication**

```markdown
📢 New npm script available: `npm run db:types`

Use this to regenerate TypeScript types after database migrations.
See README for details.
```

**No Deployment Infrastructure Changes:**

- No CI/CD changes needed
- No environment variables to set
- No server deployments required
- Script is developer-only tool

**Immediate Availability:**

- After merging, all developers get the script on next `git pull`
- Works immediately (uses existing Supabase CLI)
- No installation or setup required

### Rollback Plan

**Extremely Low Risk - Rollback Unlikely to Be Needed**

**Why Rollback is Unlikely:**

- Change is purely additive (no existing functionality modified)
- No database changes
- No production code changes
- Script is developer-only tool
- No user-facing impact
- No runtime dependencies

**If Rollback is Needed:**

**Option 1: Simple Git Revert (Recommended)**

```bash
# Revert the merge commit
git revert <commit-hash>
git push origin main
```

**Time to Rollback: 1 minute**

**Option 2: Manual Removal**

```bash
# 1. Remove script from package.json
# Delete the "db:types": "..." line

# 2. Remove documentation from README
# Delete the Database Type Generation section

# 3. Commit changes
git add package.json README.md
git commit -m "revert: remove db:types script"
git push origin main
```

**Time to Rollback: 5 minutes**

**Impact of Rollback:**

- Developers revert to manual type generation
- No data loss
- No production downtime
- No user impact
- Types file (`apps/web/types/supabase.ts`) remains unchanged

**Rollback Scenarios (Theoretical):**

1. **Script Doesn't Work on Windows**
   - Impact: Windows developers can't use script
   - Mitigation: Fix script with Windows-compatible syntax
   - Rollback: Not needed, just fix the script

2. **Script Conflicts with Existing Workflow**
   - Impact: Developer confusion or workflow disruption
   - Mitigation: Update documentation, provide examples
   - Rollback: Not needed, just improve docs

3. **Supabase CLI Version Incompatibility**
   - Impact: Script fails on some machines
   - Mitigation: Update script or document required version
   - Rollback: Not needed, just fix compatibility

**No Rollback Testing Required:**

- Risk is negligible
- Rollback is trivial (simple revert)
- No complex dependencies or state to restore

### Monitoring

**No Traditional Monitoring Required**

This is a developer-only tool with no production runtime:

- No server processes to monitor
- No user-facing features
- No performance metrics needed
- No error tracking required

**Developer Feedback Monitoring:**

**Week 1-2 After Deployment:**

- Monitor team Slack/chat for questions or issues
- Check if developers are using the script
- Gather feedback on documentation clarity
- Address any confusion or errors

**Indicators of Success:**

1. **Positive Signs:**
   - Developers use `npm run db:types` after migrations
   - No questions about manual type generation
   - Type/schema drift issues decrease
   - Epic 4 development proceeds smoothly

2. **Warning Signs:**
   - Developers still manually generating types
   - Confusion about when to run the script
   - Script errors or failures
   - Documentation questions

**Feedback Channels:**

- Team chat/Slack
- Code review comments
- Sprint retrospectives
- Direct developer feedback

**Continuous Improvement:**

**Collect Feedback On:**

- Script usability
- Documentation clarity
- Integration with existing workflow
- Any friction points

**Potential Enhancements (Based on Feedback):**

- Add script to Turborepo tasks
- Create git hook reminder
- Add CI validation
- Support for remote Supabase

**No Automated Monitoring:**

- No logs to track
- No metrics to collect
- No alerts to configure
- No dashboards needed

**Simple Success Metrics:**

- Script runs successfully for all developers
- Type regeneration becomes routine part of workflow
- Epic 4 implementation proceeds without type-related friction
