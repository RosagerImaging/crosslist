# Architecture

## Executive Summary

Crosslist is an AI-native inventory management hub designed to empower e-commerce resellers. The architecture prioritizes **stealth** and **compliance** by leveraging a hybrid approach: a robust Next.js web application for management and a "Human-Like" Chrome Extension for marketplace interactions. The system is built on a modern stack (Next.js 15, Supabase, XState) to ensure scalability, real-time responsiveness, and undetectable automation.

## Project Initialization

First implementation story should execute:

```bash
npx create-next-app@latest crosslist --typescript --tailwind --eslint
# Followed by:
npx shadcn@latest init
```

This establishes the base architecture with these decisions:
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript 5
*   **Styling:** Tailwind CSS 4
*   **UI Components:** shadcn/ui
*   **Linting:** ESLint 9

## Decision Summary

| Category | Decision | Version | Rationale |
| -------- | -------- | ------- | --------- |
| **Database & Auth** | Supabase | PostgreSQL 15 | Relational data model fits inventory; Realtime features support requirements; Auth is integrated and easy. |
| **State Management** | TanStack Query + Zustand | v5 / v4 | TanStack Query for server state (inventory); Zustand for client UI state (agent status). |
| **Extension Bridge** | Custom 'useExtensionBridge' Hook | React 19 Hook | Encapsulates message passing complexity; provides clean API for React components; ensures type safety. |
| **Agent Orchestration** | Client-Side XState | v5 | Ensures all agent actions originate from user's local IP/session to prevent detection; robust state management. |
| **Marketplace Integration** | Adapter Pattern | TS Interface | Decouples core inventory logic from specific marketplace APIs; allows easy addition of new marketplaces. |
| **Testing Strategy** | Hybrid (Vitest + Playwright) | v1 / v1.40 | Vitest for fast unit/logic testing; Playwright for critical browser automation and extension E2E testing. |
| **Deployment** | Vercel | Platform | Optimized for Next.js; zero-config scaling; seamless integration with GitHub and CI/CD. |
| **Novel Pattern** | Scoped Humanizer Layer | Custom | Applies human-like jitter/delays **ONLY** to Poshmark agents to avoid detection. Other agents bypass this. |
| **Compliance Pattern** | Strict API Compliance | eBay v2024 | Non-stealth agents must adhere to strict API rate limits/policies, modeled after eBay's rigorous standards. |

## Project Structure

```
crosslist/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Main app routes
│   ├── api/                # API routes (webhooks, etc.)
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── agents/             # Agent UI components
│   └── inventory/          # Inventory management components
├── lib/
│   ├── agents/             # Core Agent Logic
│   │   ├── core/           # Base classes & types
│   │   ├── machines/       # XState machines
│   │   └── humanizer/      # Humanizer middleware (Poshmark)
│   ├── adapters/           # Marketplace Adapters
│   │   ├── ebay/           # eBay Adapter (Strict API)
│   │   └── poshmark/       # Poshmark Adapter (Human-Like)
│   ├── bridge/             # Chrome Extension Bridge
│   └── supabase/           # Database client
├── hooks/
│   ├── use-extension-bridge.ts # The Bridge Hook
│   └── use-inventory.ts    # TanStack Query hooks
├── types/                  # TypeScript definitions
└── extension/              # Chrome Extension Source
    ├── manifest.json
    ├── background/         # Service Worker
    └── content/            # Content Scripts
```

## Epic to Architecture Mapping

| Epic/Feature | Architectural Component |
| ------------ | ----------------------- |
| **Core Platform** | Next.js App Router, Supabase Auth |
| **Inventory Mgmt** | Supabase Database, TanStack Query |
| **Crosslisting Agent** | XState Machine, Marketplace Adapters |
| **Listing Optimizer** | Server Actions (Background Removal), OpenAI API |
| **Poshmark Promotion** | XState Machine + **Humanizer Layer** |
| **Chrome Extension** | `extension/` directory + Bridge Hook |

## Technology Stack Details

### Core Technologies
*   **Frontend:** Next.js 15, React 19, Tailwind CSS 4, shadcn/ui
*   **Backend:** Next.js Server Actions, Supabase (PostgreSQL)
*   **State:** XState (Agents), TanStack Query (Data), Zustand (UI)
*   **Testing:** Vitest (Unit), Playwright (E2E)

### Integration Points
*   **Web <-> Extension:** Custom `useExtensionBridge` hook using `window.postMessage` with strict type validation.
*   **Web <-> Database:** Supabase Client (using Row Level Security).
*   **Agent <-> Marketplace:**
    *   **eBay:** Direct API calls via `EbayAdapter` (Strict Compliance).
    *   **Poshmark:** DOM manipulation via `PoshmarkAdapter` + `Humanizer` (Stealth).

## Novel Pattern Designs

### Scoped Humanizer Layer (Poshmark Only)
**Problem:** Poshmark detects automated behavior (perfect timing, straight mouse lines).
**Solution:** A middleware layer that intercepts agent actions *before* they reach the browser.
**Logic:**
1.  Agent requests `click(element)`.
2.  Humanizer checks target. If Poshmark:
    *   Calculates "Human Delay" (e.g., 500ms + random(0-300ms)).
    *   Simulates "Bezier Curve" mouse movement.
    *   Executes click.
3.  If eBay/Other: Executes immediately (0ms delay).

## Implementation Patterns

### Consistency Rules

#### Naming Conventions
*   **Files:** `kebab-case.ts` (e.g., `user-profile.tsx`)
*   **Components:** `PascalCase` (e.g., `UserProfile`)
*   **Functions:** `camelCase` (e.g., `fetchInventory`)
*   **Database:** `snake_case` (e.g., `user_id`, `inventory_items`)

#### Error Handling
*   **Agents:** All agent errors must be caught and reported to the UI via the XState `onError` transition. Agents must never crash the whole app.
*   **API:** All API routes return standard `{ success: boolean, data?: any, error?: string }` format.

#### Logging Strategy
*   **Dev:** Console logging with structured prefixes `[Agent:Poshmark]`.
*   **Prod:** Critical errors sent to Sentry (via Vercel integration).

## Security Architecture
*   **Auth:** Supabase Auth (Email/Password + Social).
*   **RLS:** Row Level Security enabled on ALL Supabase tables. Users can ONLY see their own inventory.
*   **Extension:** `externally_connectable` permission restricted to the production domain.

## Deployment Architecture
*   **Platform:** Vercel (Pro plan recommended for commercial use).
*   **Database:** Supabase Managed Service.
*   **CI/CD:** GitHub Actions running Vitest + Playwright on every PR.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-11-30_
_For: Joel_
