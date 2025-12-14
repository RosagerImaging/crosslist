# Crosslist - Epics and User Stories

**Author:** Joel  
**Date:** 2025-11-30  
**Version:** 1.0

---

## FR Coverage Matrix

| FR | Description | Epic | Stories |
|----|-------------|------|---------|
| FR1 | Users can create and manage accounts | Epic 2 | 2.1 |
| FR2 | Users can log in securely | Epic 2 | 2.1 |
| FR3 | Users can connect marketplace accounts via Extension | Epic 2 | 2.2, 2.3 |
| FR4 | Users can view consolidated dashboard | Epic 3 | 3.3 |
| FR5 | Users can manage profile and preferences | Epic 2 | 2.1 |
| FR6 | Users can add new items | Epic 3 | 3.2 |
| FR7 | Users can view, search, filter inventory | Epic 3 | 3.3 |
| FR8 | Users can edit item details | Epic 3 | 3.2, 3.4 |
| FR9 | Users can mark items sold/unsold | Epic 3 | 3.4, Epic 6 | 6.1 |
| FR10 | Users can categorize and tag items | Epic 3 | 3.2 |
| FR11 | Crosslisting Agent replicates listings | Epic 4 | 4.1-4.5 |
| FR12 | Crosslisting Agent transfers details | Epic 4 | 4.2, 4.3 |
| FR13 | Optimizer removes backgrounds | Epic 5 | 5.1 |
| FR14 | Optimizer generates descriptions | Epic 5 | 5.2 |
| FR15 | Users can review AI outputs | Epic 5 | 5.2 |
| FR16 | Users can initiate/monitor agent tasks | Epic 4 | 4.4, 4.5 |
| FR17 | Users can view inventory analytics | Epic 6 | 6.2 |
| FR18 | Users can view sales tracking | Epic 6 | 6.1, 6.2 |
| FR19-FR31 | Future/Growth Features | Post-MVP | Deferred |

---

## Epic 1: Foundation & Infrastructure

**Goal:** Establish the technical foundation (Next.js app, Supabase, Chrome Extension shell) to enable all future feature development.

**Value Delivered:** A working development environment with CI/CD, ready for feature implementation.

**FRs Covered:** Infrastructure foundation for all FRs

---

### Story 1.1: Project Initialization with Next.js 15

**As a** developer,  
**I want** the project initialized with Next.js 15, TypeScript, Tailwind CSS 4, and shadcn/ui,  
**So that** I have a modern, type-safe foundation for building features.

**Acceptance Criteria:**

**Given** I am starting a new project  
**When** I run the initialization command  
**Then** the project is created with Next.js 15, TypeScript 5, Tailwind CSS 4, and ESLint 9

**And** shadcn/ui is initialized and configured  
**And** the folder structure matches the Architecture document (`app/`, `components/`, `lib/`, `hooks/`)  
**And** naming conventions follow kebab-case for files, PascalCase for components  
**And** the project builds successfully with `npm run build`

**Prerequisites:** None

**Technical Notes:**
- Execute: `npx create-next-app@latest crosslist --typescript --tailwind --eslint`
- Follow with: `npx shadcn@latest init`
- Configure `components.json` for shadcn/ui with New York style
- Set up absolute imports with `@/` alias

---

### Story 1.2: GitHub Repository & Vercel Deployment

**As a** developer,  
**I want** the code in GitHub with automatic Vercel deployments,  
**So that** every commit is tested and deployable.

**Acceptance Criteria:**

**Given** the project is initialized  
**When** I push code to GitHub  
**Then** a GitHub repository exists at `github.com/[user]/crosslist`

**And** Vercel project is connected to the repository  
**And** every PR triggers a preview deployment  
**And** merges to `main` trigger production deployment  
**And** GitHub Actions runs linting and type-checking on every PR

**Prerequisites:** Story 1.1

**Technical Notes:**
- Create `.github/workflows/ci.yml` for linting and type-checking
- Configure Vercel project with environment variables placeholder
- Enable Vercel GitHub integration

---

### Story 1.3: Supabase Project & Database Setup

**As a** developer,  
**I want** Supabase configured for authentication and data storage,  
**So that** I can build user-specific features securely.

**Acceptance Criteria:**

**Given** I need a backend database  
**When** I set up Supabase  
**Then** a Supabase project is created (production instance)

**And** local Supabase CLI is installed and initialized (`supabase init`)  
**And** database migrations directory exists (`supabase/migrations/`)  
**And** environment variables are configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

**And** Supabase client is configured in `lib/supabase/client.ts`  
**And** Row Level Security (RLS) is enabled by default

**Prerequisites:** Story 1.2

**Technical Notes:**
- Install: `npm install @supabase/supabase-js`
- Create client and server Supabase instances
- Configure environment variables in Vercel
- Document RLS pattern in Architecture

---

### Story 1.4: Chrome Extension Shell

**As a** developer,  
**I want** a basic Chrome Extension structure,  
**So that** I can later implement marketplace credential management.

**Acceptance Criteria:**

**Given** I need browser extension capabilities  
**When** I create the extension structure  
**Then** an `extension/` directory exists with:
  - `manifest.json` (Manifest V3)
  - `background/service-worker.ts`
  - `content/poshmark.ts`
  - `content/ebay.ts`
  - `popup/index.html`

**And** the extension loads in Chrome Developer Mode without errors  
**And** content scripts inject into `*.poshmark.com` and `*.ebay.com`  
**And** a build script packages the extension (`npm run build:extension`)

**Prerequisites:** Story 1.1

**Technical Notes:**
- Use `vite` or `tsup` for TypeScript bundling
- Configure `externally_connectable` for web app domain
- Set up basic message passing structure

---

## Epic 2: User Access & Marketplace Connection

**Goal:** Enable users to create accounts, authenticate, and securely connect their marketplace credentials via the Chrome Extension.

**Value Delivered:** Users can sign up, log in, and link their eBay/Poshmark accounts.

**FRs Covered:** FR1, FR2, FR3, FR5

---

### Story 2.1: User Authentication (Supabase Auth)

**As a** user,  
**I want** to securely sign up and log in with email/password or Google,  
**So that** I can access my private inventory and manage my account.

**Acceptance Criteria:**

**Given** I am a new user  
**When** I visit the sign-up page (`/signup`)  
**Then** I see a visually clean form with email, password (confirm password) fields, and a "Sign up with Google" button.  
**And** the email field validates for RFC 5322 format.  
**And** the password field requires a minimum of 8 characters, including at least one uppercase letter, one number, and one special character, with real-time feedback on password strength.  
**And** clicking "Sign up with Google" initiates a Google OAuth flow.  
**And** upon successful email/password signup, I receive an email verification link.  
**And** after verifying my email, I am redirected to the `/dashboard` page.

**Given** I am an existing user  
**When** I visit the login page (`/login`)  
**Then** I see an intuitive form with email and password fields, and "Login with Google" and "Forgot Password" links.  
**And** upon successful login, my session persists across browser tabs.  
**And** unauthenticated users attempting to access protected routes (e.g., `/dashboard`) are automatically redirected to `/login`.  
**And** clicking "Forgot Password" sends a password reset email and provides clear instructions.

**Prerequisites:** Story 1.3

**Technical Notes:**
-   Utilize Supabase Auth for all authentication methods (email/password, Google OAuth).
-   Implement server-side email verification with a configurable redirect URL.
-   Protected routes will be implemented using Next.js Middleware or client-side checks with `supabase.auth.getSession()`.
-   Develop a custom `AuthContext` or use Zustand for global authentication state management.
-   UI components will be built using `shadcn/ui` Form, Input, Button, and Alert components, ensuring WCAG 2.1 Level AA accessibility.
-   Error messages for failed authentication attempts (e.g., invalid credentials, network errors) will be displayed clearly and concisely below the relevant input fields.
-   Performance target: Critical authentication interactions (login/signup submission) should respond within 200ms.

---

### Story 2.2: Extension Authentication Bridge

**As a** user,  
**I want** the Chrome Extension to automatically sync with my web app login state,  
**So that** I have a seamless, secure experience and don't have to authenticate twice.

**Acceptance Criteria:**

**Given** I am logged into the web app (via Story 2.1)  
**When** I open the extension popup  
**Then** the extension popup immediately displays "Logged in as [user's email]".  
**And** the extension securely retrieves and stores my active Supabase session token in `chrome.storage.local` (encrypted).  
**And** the extension can use this token to make authenticated calls to the Supabase API on my behalf.

**Given** I log out of the web app  
**When** the web app communicates its logout state to the extension  
**Then** the extension clears any stored session tokens and displays "Not logged in".

**Given** the web app sends a message to the extension  
**When** the extension receives the message via `window.postMessage` (from the web app) or `chrome.runtime.sendMessage` (from content scripts)  
**Then** the extension rigorously validates the message's origin to prevent cross-site scripting (XSS) attacks.

**Prerequisites:** Story 2.1, Story 1.4

**Technical Notes:**
-   Implement the `useExtensionBridge` hook within the web application (`apps/web/lib/bridge/use-extension-bridge.ts` - from Architecture).
-   Utilize `window.postMessage` for communication between the web app and content scripts, ensuring strict origin validation (`event.origin` check).
-   Establish message passing between content scripts and the background service worker using `chrome.runtime.sendMessage`.
-   Session tokens obtained from the web app must be immediately encrypted before storage in `chrome.storage.local`. A simple symmetric encryption mechanism (e.g., using `crypto.subtle` API with a generated key stored in session storage or passed securely) should be used.
-   The background service worker will act as the central hub for authentication state, handling token storage, retrieval, and relaying authenticated API requests.
-   The extension popup will query the background service worker for login status upon opening.
-   Refer to Architecture Document for `externally_connectable` permission details in `manifest.json`.

---

### Story 2.3: Marketplace Credential Management

**As a** user,  
**I want** to securely connect my eBay and Poshmark accounts,  
**So that** AI agents can seamlessly list items on my behalf and manage them across marketplaces.

**Acceptance Criteria:**

**Given** I am logged into the web app (via Story 2.2)  
**When** I navigate to the "Connected Marketplaces" section (e.g., `/settings/marketplaces`)  
**Then** I see buttons to "Connect eBay" and "Connect Poshmark" with clear status indicators (e.g., "Connected", "Disconnected").

**Given** I click "Connect eBay"  
**When** the extension opens a new tab or window to the eBay login page  
**Then** I can log in to my eBay account.  
**And** upon successful login, the extension automatically captures the necessary session cookies using the `chrome.cookies` API.  
**And** these captured cookies are immediately encrypted using the same mechanism as the Supabase session token (from Story 2.2) and stored securely in `chrome.storage.local`.  
**And** the web app dashboard updates to show "eBay: Connected ✓" with a clear status indicator.  
**And** if the connection fails (e.g., invalid login, API error), a user-friendly error message is displayed in the web app and/or extension popup.

**Given** I click "Connect Poshmark"  
**When** the same secure connection flow occurs for Poshmark  
**Then** my Poshmark session cookies are captured, encrypted, and stored.  
**And** the web app dashboard updates to show "Poshmark: Connected ✓".

**Given** a marketplace account is connected  
**When** I click a "Disconnect" button for that marketplace  
**Then** all associated encrypted credentials (cookies, tokens) for that marketplace are securely cleared from `chrome.storage.local`.  
**And** the web app dashboard updates the status to "Disconnected".

**Prerequisites:** Story 2.2

**Technical Notes:**
-   **CRITICAL:** Marketplace credentials (cookies/tokens) must **never** be sent to the web application server. All handling and storage occurs exclusively within the Chrome Extension.
-   Utilize the `chrome.cookies` API in the background service worker or a dedicated helper script to capture specific session cookies for eBay and Poshmark after the user logs in.
-   Implement a robust encryption/decryption utility within the extension for `chrome.storage.local` data, leveraging Web Cryptography API (e.g., AES-GCM) with a key derived from a user-specific secret or a secure key exchange mechanism.
-   The background service worker will manage the state of connected marketplaces and provide an API for content scripts/web app to query connection status.
-   The web app will communicate with the extension via the `useExtensionBridge` (from Story 2.2) to initiate connection flows and receive status updates.
-   Implement comprehensive error handling for network issues, failed logins, and API rate limits during the connection process.
-   Refer to the Architecture Document for the "Adapter Pattern" and "Scoped Humanizer Layer" for how these credentials will eventually be used by AI agents.

---

## Epic 3: Central Inventory Hub

**Goal:** Create the central dashboard where users can add, view, search, edit, and organize their inventory items.

**Value Delivered:** Users can manage their entire inventory in one place.

**FRs Covered:** FR4, FR6, FR7, FR8, FR9, FR10

---

### Story 3.1: Inventory Database Schema

**As a** developer,  
**I want** database tables for items, images, and marketplace listings,  
**So that** I can store and query inventory data efficiently.

**Acceptance Criteria:**

**Given** I need to store inventory data  
**When** I create the database schema  
**Then** the following tables exist:

**`items` table:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `title` (text, required)
- `description` (text)
- `price` (decimal)
- `sku` (text, unique per user)
- `condition` (enum: new, like_new, used, for_parts)
- `status` (enum: active, sold, draft)
- `created_at`, `updated_at`

**`item_images` table:**
- `id` (uuid, primary key)
- `item_id` (uuid, foreign key)
- `url` (text, Supabase Storage URL)
- `order` (integer)

**`marketplace_listings` table:**
- `id` (uuid, primary key)
- `item_id` (uuid, foreign key)
- `marketplace` (enum: ebay, poshmark, mercari)
- `external_id` (text, marketplace's listing ID)
- `status` (enum: active, sold, delisted)

**And** RLS policies are applied (users can only access their own items)  
**And** TypeScript types are generated (`npm run db:types`)

**Prerequisites:** Story 1.3

**Technical Notes:**
- Create migration: `supabase migration new inventory_schema`
- Use Supabase CLI to generate types
- Enable RLS on all tables

---

### Story 3.2: Add Item Form

**As a** user,  
**I want** to add a new item with photos and details,  
**So that** I can build my inventory.

**Acceptance Criteria:**

**Given** I want to add an item  
**When** I navigate to `/inventory/new`  
**Then** I see a form with fields:
  - Title (required, max 80 chars)
  - Description (optional, rich text)
  - Price (required, decimal)
  - SKU (optional, auto-generated if empty)
  - Condition (dropdown: New, Like New, Used, For Parts)
  - Photos (drag-and-drop, max 12 images)

**And** I can drag-and-drop photos to upload  
**And** photos are uploaded to Supabase Storage bucket `user-uploads/{user_id}/`  
**And** I see a preview of uploaded photos  
**And** form validation shows errors inline (Zod schema)

**When** I submit the form  
**Then** the item is created in the database  
**And** I see a success notification  
**And** I am redirected to the inventory dashboard

**Prerequisites:** Story 3.1

**Technical Notes:**
- Use `react-hook-form` + `zod` for validation
- Use shadcn/ui Form, Input, Textarea, Select components
- Implement photo upload with progress indicator
- Generate SKU with format: `ITEM-{timestamp}-{random}`

---

### Story 3.3: Inventory Dashboard

**As a** user,  
**I want** to view all my items in a searchable table,  
**So that** I can quickly find and manage my inventory.

**Acceptance Criteria:**

**Given** I have items in my inventory  
**When** I navigate to `/inventory`  
**Then** I see a table with columns:
  - Photo (thumbnail)
  - Title
  - SKU
  - Price
  - Condition
  - Status (Active/Sold badge)
  - Marketplaces (icons for eBay, Poshmark if listed)
  - Actions (Edit, Delete buttons)

**And** I can search by title or SKU (debounced input)  
**And** I can filter by Status (Active, Sold, Draft)  
**And** I can filter by Marketplace  
**And** the table uses pagination or infinite scroll  
**And** data updates in real-time when I add/edit items (TanStack Query)

**Prerequisites:** Story 3.1

**Technical Notes:**
- Implement `useInventory` hook with TanStack Query
- Use shadcn/ui Table, Input, Badge components
- Enable Supabase Realtime subscriptions for live updates
- Implement optimistic UI updates

---

### Story 3.4: Edit & Delete Item

**As a** user,  
**I want** to edit or delete items,  
**So that** I can keep my inventory accurate.

**Acceptance Criteria:**

**Given** I am viewing the inventory dashboard  
**When** I click "Edit" on an item  
**Then** the Add Item form opens pre-filled with the item's data

**And** I can modify any field  
**And** I can add or remove photos  
**And** when I save, the item is updated in the database  
**And** the dashboard reflects the changes immediately (optimistic update)

**Given** I want to delete an item  
**When** I click "Delete"  
**Then** a confirmation modal appears

**And** when I confirm, the item is soft-deleted (status = 'deleted')  
**And** the item is removed from the dashboard view

**Prerequisites:** Story 3.2, Story 3.3

**Technical Notes:**
- Implement soft delete (add `deleted_at` column)
- Use shadcn/ui Dialog for confirmation modal
- Use TanStack Query mutations with optimistic updates

---

## Epic 4: The Crosslisting Agent

**Goal:** Implement the core AI agent that replicates listings from the Hub to marketplaces using the Adapter Pattern and Humanizer Layer.

**Value Delivered:** Users can automatically copy listings to eBay and Poshmark with one click.

**FRs Covered:** FR11, FR12, FR16

---

### Story 4.1: Marketplace Adapter Interface

**As a** developer,  
**I want** a standard TypeScript interface for marketplace integrations,  
**So that** I can add new marketplaces without refactoring core logic.

**Acceptance Criteria:**

**Given** I need a pluggable marketplace system  
**When** I define the adapter interface  
**Then** a `MarketplaceAdapter` interface exists with methods:
  - `list(item: Item): Promise<ListingResult>`
  - `update(externalId: string, item: Item): Promise<void>`
  - `delist(externalId: string): Promise<void>`
  - `verify(): Promise<boolean>` (check credentials)

**And** a `MockAdapter` class is implemented for testing  
**And** TypeScript enforces the interface for all adapters

**Prerequisites:** Story 3.1

**Technical Notes:**
- Create `lib/adapters/types.ts`
- Define `ListingResult` type with `success`, `externalId`, `errors`
- Create `lib/adapters/mock-adapter.ts` for unit tests

---

### Story 4.2: eBay Adapter (Strict API Compliance)

**As a** developer,  
**I want** an eBay adapter that uses the official Trading API,  
**So that** we comply with eBay's terms and avoid account restrictions.

**Acceptance Criteria:**

**Given** I need to list items on eBay  
**When** I implement the eBay adapter  
**Then** an `EbayAdapter` class exists implementing `MarketplaceAdapter`

**And** it maps internal `Item` to eBay's `AddItem` XML/JSON format  
**And** it handles OAuth 2.0 token refresh  
**And** it respects eBay's rate limits (5000 calls/day for standard tier)  
**And** it handles eBay-specific errors (e.g., "Title exceeds 80 characters")  
**And** it logs all API calls with `[Agent:eBay]` prefix

**Prerequisites:** Story 4.1, Story 2.3

**Technical Notes:**
- Use eBay Trading API v1207 or later
- Implement exponential backoff for rate limit errors
- Follow "Strict API Compliance" pattern from Architecture
- Store OAuth tokens in Extension storage

---

### Story 4.3: Poshmark Adapter & Humanizer Layer

**As a** developer,  
**I want** a Poshmark adapter with the Humanizer middleware,  
**So that** our automation is undetectable by Poshmark's anti-bot systems.

**Acceptance Criteria:**

**Given** I need to list items on Poshmark (which has no public API)  
**When** I implement the Poshmark adapter  
**Then** a `PoshmarkAdapter` class exists implementing `MarketplaceAdapter`

**And** it uses DOM manipulation via the Extension's content script  
**And** a `HumanizerMiddleware` class intercepts all actions  
**And** the Humanizer adds randomized delays:
  - Base delay: 500ms
  - Random jitter: 0-700ms
  - Total delay per action: 500-1200ms

**And** the Humanizer simulates human-like cursor movement (Bezier curves)  
**And** the Humanizer varies typing speed (150-300ms per character)  
**And** actions are logged with `[Agent:Poshmark]` prefix

**Prerequisites:** Story 4.1, Story 2.3

**Technical Notes:**
- **CRITICAL:** This is the "Stealth" component
- Implement in `lib/agents/humanizer/middleware.ts`
- Use `chrome.debugger` API for cursor simulation (if available)
- Fallback to `element.dispatchEvent()` with trusted events

---

### Story 4.4: Crosslisting State Machine (XState)

**As a** developer,  
**I want** a robust state machine to orchestrate the crosslisting process,  
**So that** it handles errors, retries, and user cancellations gracefully.

**Acceptance Criteria:**

**Given** I need to manage complex async workflows  
**When** I implement the state machine  
**Then** an XState machine exists with states:
  - `idle`
  - `validating` (check item has required fields)
  - `uploading_photos`
  - `filling_form`
  - `submitting`
  - `success`
  - `error`

**And** the machine handles events:
  - `START` (begin crosslisting)
  - `PAUSE` (user pauses)
  - `RESUME` (user resumes)
  - `CANCEL` (user cancels)
  - `RETRY` (retry after error)

**And** errors trigger automatic retry (max 3 attempts)  
**And** the machine exposes current state to the UI  
**And** all state transitions are logged

**Prerequisites:** Story 4.1

**Technical Notes:**
- Install: `npm install xstate`
- Create `lib/agents/machines/crosslist-machine.ts`
- Use XState v5 with TypeScript
- Integrate with Zustand for UI state

---

### Story 4.5: Crosslisting UI

**As a** user,  
**I want** to select items and click "Crosslist" to publish them to other marketplaces,  
**So that** I can expand my reach with minimal effort.

**Acceptance Criteria:**

**Given** I am viewing my inventory  
**When** I select one or more items (checkboxes)  
**Then** a "Crosslist" button appears

**When** I click "Crosslist"  
**Then** a modal opens showing:
  - Selected items (thumbnails)
  - Marketplace checkboxes (eBay, Poshmark)
  - "Start Crosslisting" button

**When** I start crosslisting  
**Then** I see a progress bar for each item  
**And** I see real-time status updates (e.g., "Uploading photos to Poshmark...")  
**And** I can pause or cancel the process

**When** crosslisting completes  
**Then** I see a summary:
  - ✓ 3 items listed successfully
  - ✗ 1 item failed (with error message)

**And** the inventory dashboard shows marketplace icons for successfully listed items

**Prerequisites:** Story 4.4, Story 3.3

**Technical Notes:**
- Use Zustand to track crosslisting state
- Use shadcn/ui Dialog, Progress, Checkbox components
- Connect to XState machine via `useMachine` hook

---

## Epic 5: Listing Optimizer

**Goal:** Provide AI-powered tools to enhance listing quality through background removal and description generation.

**Value Delivered:** Users can improve their listings with professional photos and compelling descriptions.

**FRs Covered:** FR13, FR14, FR15

---

### Story 5.1: Background Removal Service

**As a** user,  
**I want** to remove backgrounds from my product photos,  
**So that** my listings look professional and consistent.

**Acceptance Criteria:**

**Given** I am editing an item  
**When** I click "Remove Background" on a photo  
**Then** the photo is sent to a background removal API (e.g., remove.bg)

**And** I see a "Processing..." spinner  
**And** the processed image is saved as a new variant  
**And** the original image is preserved  
**And** I can toggle between original and processed versions  
**And** processing completes in under 5 seconds

**Prerequisites:** Story 3.2

**Technical Notes:**
- Use remove.bg API or open-source alternative (rembg)
- Store variants in Supabase Storage: `{item_id}/original.jpg`, `{item_id}/no-bg.jpg`
- Implement API route: `/api/optimize/remove-bg`

---

### Story 5.2: AI Description Generator

**As a** user,  
**I want** the AI to generate a product description for me,  
**So that** I save time and create compelling listings.

**Acceptance Criteria:**

**Given** I am adding or editing an item  
**When** I click "Generate Description"  
**Then** the AI analyzes the title, condition, and photos

**And** it generates a 2-3 paragraph description  
**And** the description includes:
  - Product highlights
  - Condition details
  - Suggested use cases
  - SEO-friendly keywords

**And** the generated text fills the Description field  
**And** I can edit the text before saving  
**And** generation completes in under 3 seconds

**Prerequisites:** Story 3.2

**Technical Notes:**
- Use OpenAI GPT-4o or similar
- Implement API route: `/api/optimize/generate-description`
- Prompt engineering: include item title, condition, category
- Optional: analyze photos with GPT-4 Vision

---

## Epic 6: Basic Analytics

**Goal:** Provide users with visibility into their business performance through sales tracking and basic metrics.

**Value Delivered:** Users can track revenue and understand their inventory status.

**FRs Covered:** FR9, FR17, FR18

---

### Story 6.1: Mark Item as Sold

**As a** user,  
**I want** to mark items as sold and record sale details,  
**So that** I can track my revenue accurately.

**Acceptance Criteria:**

**Given** I have an active item  
**When** I click "Mark as Sold"  
**Then** a modal opens with fields:
  - Sale Price (required, pre-filled with listing price)
  - Sale Date (required, defaults to today)
  - Marketplace (required, dropdown)
  - Fees (optional, decimal)
  - Notes (optional, text)

**When** I submit  
**Then** the item status changes to "Sold"  
**And** a `sales` record is created in the database  
**And** the inventory dashboard shows the item as sold  
**And** I can undo the sale (revert to Active)

**Prerequisites:** Story 3.3

**Technical Notes:**
- Create `sales` table with columns: item_id, sale_price, sale_date, marketplace, fees
- Calculate net profit: sale_price - fees - (original cost if tracked)

---

### Story 6.2: Analytics Dashboard

**As a** user,  
**I want** to see charts and metrics about my sales,  
**So that** I can understand my business performance.

**Acceptance Criteria:**

**Given** I have sales data  
**When** I navigate to `/analytics`  
**Then** I see:
  - **Total Active Value** card (sum of all active item prices)
  - **Total Sales (This Month)** card (sum of sale prices)
  - **Items Sold (This Month)** card (count)
  - **Bar Chart:** Sales by Month (last 6 months)

**And** the data updates in real-time  
**And** I can filter by marketplace  
**And** I can export data as CSV

**Prerequisites:** Story 6.1

**Technical Notes:**
- Use `recharts` for charts
- Use shadcn/ui Card components
- Implement API route: `/api/analytics/summary`
- Use TanStack Query for data fetching

---

## Implementation Sequence

**Recommended order for development:**

1. **Epic 1** (Foundation) - Stories 1.1 → 1.4
2. **Epic 2** (Auth) - Stories 2.1 → 2.3
3. **Epic 3** (Inventory) - Stories 3.1 → 3.4
4. **Epic 4** (Crosslisting) - Stories 4.1 → 4.5
5. **Epic 5** (Optimizer) - Stories 5.1 → 5.2
6. **Epic 6** (Analytics) - Stories 6.1 → 6.2

**Total Stories:** 20 MVP stories

---

_Generated by BMad Method - Epic and Story Decomposition Workflow_  
_Context: PRD + UX Design + Architecture_  
_All 18 MVP Functional Requirements (FR1-FR18) are covered_
