# Proposed Fix for Frontend Turbo Lint Issue

**Case:** Frontend `turbo` lint failure: `No package found with name 'ui' in workspace`

**Analysis:**
The `turbo.json` file currently lacks a `workspaces` definition. Without this, Turborepo cannot correctly identify the `ui` package (located at `packages/ui`) or any other packages/apps within the monorepo structure.

**Proposed Solution:**
Add a `workspaces` array to the `turbo.json` file, explicitly defining the locations of all packages and applications within the project. This will allow `turbo` to correctly locate and operate on these workspaces.

**Specific Code Change:**

**File:** `turbo.json`

**Old Code (excerpt):**

```json
{
  "$schema": "https://turborepo.com/schema.json",

  "remoteCache": {
    "signature": false
  },
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["CI", "EMAIL_SERVER", "EMAIL_FROM", "NEXTAUTH_SECRET"]
    }
    // ... rest of tasks
  }
}
```

**New Code (excerpt):**

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "workspaces": ["apps/*", "packages/*"],
  "remoteCache": {
    "signature": false
  },
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["CI", "EMAIL_SERVER", "EMAIL_FROM", "NEXTAUTH_SECRET"]
    }
    // ... rest of tasks
  }
}
```

**Rationale:**
Explicitly defining `workspaces` ensures that Turborepo correctly maps the project's directory structure to its internal package management system, resolving the "no package found" error. This is a standard configuration requirement for monorepos using Turborepo.
