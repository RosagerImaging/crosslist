# Epic Technical Specification: User Access & Marketplace Connection

Date: 2025-12-11
Author: Joel
Epic ID: 2
Status: Draft

---

## Overview

Epic 2 establishes the foundational user access and marketplace connection layer for Crosslist. This epic enables users to create accounts, authenticate securely using Supabase Auth (supporting both email/password and Google OAuth), and seamlessly connect their marketplace credentials (eBay and Poshmark) through a Chrome Extension bridge. 

The epic directly addresses **FR1** (account creation and management), **FR2** (secure login with session persistence), **FR3** (marketplace credential connection via extension), and **FR5** (profile and preference management). By completing this epic, users will transition from anonymous visitors to authenticated users with linked marketplace accounts, establishing the prerequisite authentication and authorization infrastructure required for all subsequent inventory management and AI agent features.

This work builds upon Epic 1's foundation (Next.js 15 app, Supabase project, Chrome Extension shell) and delivers the critical capability of secure, multi-marketplace identity and credential management—the gateway to all AI-powered reselling automation.

## Objectives and Scope

**In Scope:**
- User registration and authentication (email/password + Google OAuth)
- Password strength requirements, email verification, and account recovery flows
- Supabase Auth integration with Row Level Security (RLS) policies
- Session persistence across browser tabs and device restarts
- Chrome Extension authentication state synchronization with web app
- Secure Supabase session token storage in extension
- Marketplace credential capture and encrypted storage (eBay, Poshmark session cookies)
- Web app UI for connecting/disconnecting marketplace accounts
- Dashboard displaying marketplace connection status
- Profile and preference management UI
- Authenticated API route protection
- Origin validation for extension-to-webapp message passing

**Out of Scope:**
- Social login providers beyond Google (Facebook, Apple, etc.) - deferred to future iteration
- Multi-factor authentication (MFA) - future enhancement
- Actual marketplace API integration for listing operations (deferred to Epic 4)
- AI agent execution logic (Epic 4+)
- Inventory data models and CRUD operations (Epic 3)
- Size.ly integration (Future/Vision scope)
- Advanced profile settings beyond basic user info (post-MVP)

## System Architecture Alignment

This epic aligns directly with the architecture document's core technology decisions:

**Supabase Auth \u0026 Database (Category: Database \u0026 Auth):** Leverages Supabase's integrated authentication service for user management, supporting email/password and OAuth (Google). Row Level Security (RLS) policies will be implemented on all database tables to ensure users can only access their own data, as specified in the Security Architecture section.

**Chrome Extension Bridge (Category: Extension Bridge):** Implements the custom `useExtensionBridge` React hook pattern defined in the architecture, using `window.postMessage` for secure, type-safe communication between the web app and extension. The extension will store Supabase session tokens and marketplace credentials in Chrome's secure storage API with encryption.

**Security Architecture Alignment:** Adheres strictly to the defined security requirements:
- TLS 1.2+ for all data in transit
- AES-256 equivalent encryption for sensitive data at rest (Supabase storage, extension credentials)
- `externally_connectable` manifest permission restricted to production domain
- Origin validation on all cross-context messages

**Error Handling Pattern:** All auth-related errors will follow the standard API response format: `{ success: boolean, data?: any, error?: string }` as documented in Implementation Patterns.

**Consistency with Project Structure:** Code will be organized per the defined structure with authentication routes in `app/(auth)/`, Supabase client utilities in `lib/supabase/`, and extension bridge logic in `hooks/use-extension-bridge.ts`.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Key Inputs | Key Outputs | Owner |
|----------------|----------------|------------|-------------|-------|
| **Authentication Routes** (`app/(auth)/`) | Handle signup, login, logout, password reset flows | User credentials, OAuth tokens | Session tokens, redirect responses | Frontend |
| **Supabase Auth Client** (`lib/supabase/auth.ts`) | Wrapper for Supabase auth operations | Email/password, OAuth provider | User object, session | Backend/Lib |
| **Extension Bridge Hook** (`hooks/use-extension-bridge.ts`) | Type-safe message passing between web app and extension | Extension messages (auth state, credentials) | Typed message responses | Frontend Hook |
| **Extension Background Service Worker** (`extension/background/`) | Manage extension lifecycle, store credentials, sync auth state | Web app auth messages, marketplace cookies | Encrypted credential storage, API call results | Extension |
| **Extension Content Scripts** (`extension/content/`) | Inject into marketplace pages to capture session cookies | DOM events, network requests | Session cookies, credential data | Extension |
| **Marketplace Credentials Service** (`lib/services/marketplace-credentials.ts`) | Manage credential CRUD operations with encryption | Marketplace type, credentials | Encrypted storage, connection status | Backend/Lib |
| **Profile Management Component** (`components/profile/`) | User profile and preferences UI | User data, preferences | Updated user profile | Frontend |
| **Dashboard Status Widget** (`components/dashboard/marketplace-status.tsx`) | Display marketplace connection status | Credential status data | Visual status indicators | Frontend |
| **RLS Policies** (Supabase) | Enforce data access control at database level | User ID from session | Query row filtering | Database |

### Data Models and Contracts

**User Profile Table** (`users`)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Supabase Auth manages password/oauth via auth.users
  -- Additional profile fields:
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- RLS Policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own profile"
  ON users FOR ALL
  USING (auth.uid() = id);
```

**Marketplace Credentials Table** (`marketplace_credentials`)
```sql
CREATE TABLE marketplace_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  marketplace_type TEXT NOT NULL, -- 'ebay' | 'poshmark'
  credential_data BYTEA NOT NULL, -- AES-256 encrypted JSON
  is_connected BOOLEAN DEFAULT false,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, marketplace_type)
);

-- RLS Policy
ALTER TABLE marketplace_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own credentials"
  ON marketplace_credentials FOR ALL
  USING (auth.uid() = user_id);
```

**Session State (Managed by Supabase Auth)**
- Stored in `auth.sessions` table (managed automatically)
- Access token (JWT) contains: `user_id`, `email`, `exp`, `iat`
- Refresh token for token renewal

**Extension Storage Schema** (Chrome Storage API)
```typescript
interface ExtensionStorage {
  supabaseSession: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
  marketplaceCredentials: {
    ebay?: EncryptedCredentials;
    poshmark?: EncryptedCredentials;
  };
}

interface EncryptedCredentials {
  encryptedData: string; // AES-256 encrypted cookie string
  lastUpdated: number;
}
```

### APIs and Interfaces

**Authentication Endpoints** (Supabase Client SDK - no custom API routes needed)
- `supabase.auth.signUp({ email, password })` - User registration
- `supabase.auth.signInWithPassword({ email, password })` - Email/password login
- `supabase.auth.signInWithOAuth({ provider: 'google' })` - Google OAuth login
- `supabase.auth.signOut()` - Logout
- `supabase.auth.resetPasswordForEmail(email)` - Password reset request

**Marketplace Credentials API** (Custom Next.js API Routes)

**POST** `/api/marketplace/connect`
```typescript
// Request
{
  marketplace: 'ebay' | 'poshmark',
  credentials: EncryptedCredentialData
}

// Response
{
  success: boolean,
  data?: {
    id: string,
    marketplace: string,
    is_connected: boolean
  },
  error?: string
}
```

**DELETE** `/api/marketplace/disconnect`
```typescript
// Request
{
  marketplace: 'ebay' | 'poshmark'
}

// Response
{
  success: boolean,
  error?: string
}
```

**GET** `/api/marketplace/status`
```typescript
// Response
{
  success: boolean,
  data?: {
    ebay: { connected: boolean, last_verified: string | null },
    poshmark: { connected: boolean, last_verified: string | null }
  },
  error?: string
}
```

**Extension Bridge Message Protocol**

**Message: AUTH_STATE_SYNC**
```typescript
// Web App → Extension
{
  type: 'AUTH_STATE_SYNC',
  payload: {
    session: SupabaseSession | null
  }
}

// Extension → Web App
{
  type: 'AUTH_STATE_SYNCED',
  payload: { success: boolean }
}
```

**Message: CREDENTIAL_CAPTURED**
```typescript
// Extension → Web App
{
  type: 'CREDENTIAL_CAPTURED',
  payload: {
    marketplace: 'ebay' | 'poshmark',
    credentials: EncryptedCredentials
  }
}
```

All messages include origin validation and type checking per `useExtensionBridge` hook implementation.

### Workflows and Sequencing

**User Registration Flow**
1. User submits email/password via signup form
2. Frontend validates password strength (client-side)
3. Call `supabase.auth.signUp({ email, password })`
4. Supabase sends verification email
5. User clicks verification link
6. Supabase confirms account, creates entry in `auth.users`
7. Redirect to login page with success message

**User Login Flow (Email/Password)**
1. User submits email/password via login form
2. Call `supabase.auth.signInWithPassword({ email, password })`
3. Supabase validates credentials
4. On success: Returns session with access_token and refresh_token
5. Store session in localStorage (handled by Supabase client)
6. Trigger `AUTH_STATE_SYNC` message to extension
7. Extension stores session in Chrome storage
8. Redirect to dashboard

**User Login Flow (Google OAuth)**
1. User clicks "Sign in with Google" button
2. Call `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Redirect to Google OAuth consent screen
4. User authorizes application
5. Google redirects back with OAuth code
6. Supabase exchanges code for tokens, creates/updates user
7. Follow steps 4-8 from email/password flow

**Extension Auth Sync Flow**
1. User logs in via web app
2. Web app detects session change (Supabase `onAuthStateChange` listener)
3. Web app sends `AUTH_STATE_SYNC` message via `window.postMessage`
4. Extension background script receives message
5. Extension validates origin (production domain only)
6. Extension stores session in `chrome.storage.local` (encrypted)
7. Extension sends `AUTH_STATE_SYNCED` confirmation
8. Web app updates UI to show extension connected

**Marketplace Credential Connection Flow**
1. User navigates to Settings → Marketplace Connections
2. User clicks "Connect eBay" or "Connect Poshmark"
3. Extension content script activates on marketplace site
4. User logs into marketplace (manual step)
5. Content script intercepts authentication cookies from network requests
6. Content script encrypts credentials (AES-256)
7. Send `CREDENTIAL_CAPTURED` message to web app
8. Web app calls `/api/marketplace/connect` with encrypted credentials
9. API route stores encrypted credentials in `marketplace_credentials` table
10. Web app updates dashboard to show "Connected" status

**Session Persistence Flow**
1. User closes browser tab
2. Session tokens remain in localStorage (web app) and chrome.storage (extension)
3. User reopens application
4. Supabase client auto-refreshes session using refresh_token
5. Extension re-syncs on web app load
6. User remains authenticated without re-login

## Non-Functional Requirements

### Performance

**Authentication Performance Targets** (aligned with PRD Section: Non-Functional Requirements > Performance)

- **Login Response Time**: Complete login flow (credential validation + session creation) within 500ms (p95)
- **OAuth Redirect Latency**: Google OAuth redirect round-trip < 2 seconds total (depends on external provider)
- **Session Refresh**: Token refresh operation < 200ms (p95) - must occur silently without user perception
- **Extension Sync Latency**: Auth state synchronization between web app and extension < 100ms
- **Marketplace Credential Storage**: Encrypt and store credentials < 300ms (p95)
- **Dashboard Load Time**: Marketplace connection status widget render < 200ms (part of overall dashboard FCP < 2s requirement from PRD)

**Database Query Performance**:
- User profile lookup by UUID: < 50ms (indexed query)
- Marketplace credentials retrieval: < 50ms (indexed by user_id + marketplace_type)
- RLS policy evaluation overhead: < 10ms additional per query

### Security

**Authentication \u0026 Authorization** (aligned with PRD Section: Non-Functional Requirements > Security)

- **Password Requirements**: Minimum 8 characters, must include uppercase, lowercase, number, and special character
- **Email Verification**: Required before account activation (Supabase managed)
- **Session Management**: 
  - Access tokens expire after 1 hour
  - Refresh tokens valid for 30 days with sliding window
  - Automatic token refresh 5 minutes before expiration
- **Row Level Security (RLS)**: All database tables enforce user_id = auth.uid() policies, preventing cross-user data access

**Data Encryption** (aligned with PRD requirement for TLS 1.2+ and AES-256)

- **In Transit**: All API requests use HTTPS with TLS 1.3 (Vercel enforced)
- **At Rest**:
  - Supabase database: Native AES-256 encryption for all data at rest
  - Extension storage: Marketplace credentials encrypted using Web Crypto API (AES-GCM-256) before storing in `chrome.storage.local`
  - Encryption keys: Derived from user's Supabase session token (never stored in plaintext)

**Chrome Extension Security** (aligned with Architecture Section: Security Architecture)

- **Manifest v3**: Uses latest security standards for Chrome extensions
- **Content Security Policy**: Strict CSP preventing inline script execution
- **Externally Connectable**: Restricted to production domain only (e.g., `https://crosslist.app`)
- **Origin Validation**: All `window.postMessage` communications validate sender origin against whitelist
- **Permissions**: Minimal permissions requested (storage, cookies for specific marketplace domains only)

**API Route Protection**

- All `/api/marketplace/*` routes require valid Supabase session token
- Middleware validates token before route handler execution
- Rate limiting: 100 requests per minute per user (Vercel Edge Middleware)

**Credential Handling**

- Marketplace session cookies never transmitted in plaintext
- Credentials encrypted before crossing extension/webapp boundary
- No credential logging in production environment (enforced via Vercel env vars)

### Reliability/Availability

**Availability** (aligned with PRD Section: Non-Functional Requirements > Scalability)

- **Supabase Uptime SLA**: 99.9% uptime (Supabase managed service guarantee)
- **Vercel Deployment**: Zero-downtime deployments via Vercel's blue-green deployment strategy
- **Authentication Service**: Inherits Supabase Auth availability (regional redundancy, automatic failover)

**Session Recovery \u0026 Degradation**

- **Token Refresh Failure**: If refresh token expires, gracefully redirect to login page with context preservation (return URL saved)
- **Extension Disconnect**: If extension loses sync, web app displays "Extension disconnected" warning but remains functional for non-marketplace features
- **Database Connection Loss**: Supabase client auto-retries up to 3 times with exponential backoff before surfacing error
- **Partial Feature Degradation**: If marketplace credential retrieval fails, user can still access profile and other non-marketplace features

**Error Recovery Patterns**

- **Network Failures**: Automatic retry with exponential backoff (100ms, 200ms, 400ms intervals)
- **OAuth Failures**: Clear error messaging with actionable next steps (e.g., "Google login failed, please try again or use email/password")
- **Credential Encryption Errors**: Fail securely by rejecting storage and logging error (never store plaintext fallback)

### Observability

**Logging Strategy** (aligned with Architecture Section: Logging Strategy)

**Development Environment**:
- Structured console logging with prefixes: `[Auth:Login]`, `[Extension:Sync]`, `[API:Marketplace]`
- Log all authentication state transitions
- Log extension message passing (payload types only, no sensitive data)

**Production Environment**:
- Critical errors sent to Sentry via Vercel integration
- Error categories tracked:
  - `AuthError` - Login/signup failures, token issues
  - `ExtensionError` - Bridge communication failures
  - `CredentialError` - Marketplace credential capture/storage failures
  - `DatabaseError` - Supabase query failures

**Metrics to Collect** (via Vercel Analytics + Supabase Dashboard)

- **Authentication Metrics**:
  - Login success/failure rate (by method: email, Google)
  - Average login duration
  - Session refresh frequency
  - Password reset request count
- **Extension Metrics**:
  - Extension sync success rate
  - Message passing latency (p50, p95, p99)
  - Extension installation/active user count
- **Marketplace Connection Metrics**:
  - Credential connection success rate (by marketplace)
  - Active connected marketplace accounts per user
  - Credential verification frequency

**Security Signal Logging** (NEVER log sensitive data - passwords, tokens, credentials)

- Failed login attempts per user (rate-limit detection)
- Suspicious extension message origins (CSP violation attempts)
- RLS policy violations (attempted cross-user data access)

**Tracing**

- Request ID propagation through Next.js API routes for end-to-end request tracing
- Supabase client logs include correlation IDs for debugging query chains

## Dependencies and Integrations

**Core Framework Dependencies** (from `apps/web/package.json`)

| Dependency | Version | Purpose |
|------------|---------|---------|
| `next` | ^15.0.0 | Next.js framework (App Router, Server Actions) |
| `react` | 19.2.0 | React library |
| `react-dom` | 19.2.0 | React DOM rendering |
| `typescript` | ^5.9.3 | TypeScript language support |

**Authentication \u0026 Database**

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@supabase/ssr` | ^0.8.0 | Supabase client for server-side rendering (includes auth client) |
| `supabase` (dev) | ^2.65.6 | Supabase CLI for migrations and local development |

**UI Components \u0026 Styling**

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tailwindcss` | ^4.0.0 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4.0.0 | PostCSS plugin for Tailwind |
| `class-variance-authority` | ^0.7.1 | Library for managing component variants (used by shadcn/ui) |
| `clsx` | ^2.1.1 | Conditional className utility |
| `tailwind-merge` | ^3.4.0 | Merge Tailwind classes without conflicts |
| `lucide-react` | ^0.555.0 | Icon library for React |
| `tw-animate-css` | ^1.4.0 | Tailwind animation utilities |

**Chrome Extension Build**

| Dependency | Version | Purpose |
|------------|---------|---------|
| `vite` | ^5.x.x | Build tool for extension bundling |
| `vite-plugin-web-extension` | ^4.5.0 | Vite plugin for Chrome extension manifest generation |

**Testing**

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@playwright/test` | ^1.57.0 | E2E testing framework |

**External Service Integrations**

- **Supabase Cloud**: PostgreSQL 15 database, Supabase Auth service (managed)
- **Vercel**: Hosting platform for Next.js deployment (managed)
- **Google OAuth**: OAuth 2.0 provider for social login (external API)
- **eBay Marketplace**: Session cookie capture for credential storage (no SDK - direct DOM interaction)
- **Poshmark Marketplace**: Session cookie capture for credential storage (no SDK - direct DOM interaction)

**Future Dependencies** (Not Yet Required for Epic 2)

- `@tanstack/react-query` - Server state management (Epic 3+)
- `zustand` - Client UI state management (Epic 4+)
- `xstate` - State machine library for agents (Epic 4+)

**Version Constraints \u0026 Compatibility**

- Node.js: \u003e=18 (specified in root package.json)
- Package manager: npm@10.9.3
- Supabase API version: v2024 (latest stable)
- Chrome Extension: Manifest V3 (required for modern Chrome)

## Acceptance Criteria (Authoritative)

**Story 2.1: User Authentication (Supabase Auth)**

1. **AC-2.1.1**: Users can sign up with valid email and password meeting strength requirements (8+ chars, uppercase, lowercase, number, special character)
2. **AC-2.1.2**: Users receive email verification after signup and account is activated upon email confirmation
3. **AC-2.1.3**: Users can log in with verified email/password credentials and receive valid session token
4. **AC-2.1.4**: Users can log in with Google OAuth and session is created automatically after authorization
5. **AC-2.1.5**: Failed login attempts display clear, actionable error messages (e.g., "Invalid credentials" vs "Email not verified")
6. **AC-2.1.6**: Password reset flow allows users to request reset email and set new password via link
7. **AC-2.1.7**: User sessions persist across browser tab closures and browser restarts
8. **AC-2.1.8**: Sessions automatically refresh before expiration (no user-visible interruption)
9. **AC-2.1.9**: Users can log out and session is completely terminated (tokens invalidated)
10. **AC-2.1.10**: Authentication UI is keyboard navigable and screen reader compatible (WCAG 2.1 AA)

**Story 2.2: Extension Authentication Bridge**

11. **AC-2.2.1**: Chrome Extension popup displays current login state ("Logged in as [email]" or "Not logged in")
12. **AC-2.2.2**: When user logs in via web app, extension receives AUTH_STATE_SYNC message within 100ms
13. **AC-2.2.3**: Extension stores Supabase session token in chrome.storage.local with encryption
14. **AC-2.2.4**: Extension validates message origin before processing (rejects non-production domains)
15. **AC-2.2.5**: Extension sends AUTH_STATE_SYNCED confirmation back to web app after successful sync
16. **AC-2.2.6**: Web app displays "Extension connected" status indicator after successful sync
17. **AC-2.2.7**: Extension-to-webapp messages use type-safe protocol with TypeScript interfaces
18. **AC-2.2.8**: Extension can make authenticated API calls using stored session token

**Story 2.3: Marketplace Credential Management**

19. **AC-2.3.1**: Users can initiate marketplace connection from Settings → Marketplace Connections page
20. **AC-2.3.2**: Extension content script activates on eBay.com when "Connect eBay" is clicked
21. **AC-2.3.3**: Extension content script activates on Poshmark.com when "Connect Poshmark" is clicked
22. **AC-2.3.4**: Content script captures session cookies after user manually logs into marketplace
23. **AC-2.3.5**: Captured credentials are encrypted (AES-256) before transmission to web app
24. **AC-2.3.6**: Web app stores encrypted credentials in marketplace_credentials table with user_id foreign key
25. **AC-2.3.7**: Dashboard displays "Connected" status badge for successfully linked marketplaces
26. **AC-2.3.8**: Dashboard displays "Not Connected" status for unlinked marketplaces
27. **AC-2.3.9**: Users can disconnect marketplace accounts via "Disconnect" button (deletes credentials from database)
28. **AC-2.3.10**: Error states are displayed clearly (e.g., "Failed to capture credentials - please log in again")

**Row Level Security** (Cross-Cutting)

29. **AC-RLS.1**: Database queries enforce RLS policies - users can only query their own users row
30. **AC-RLS.2**: Marketplace credential queries return only credentials belonging to authenticated user
31. **AC-RLS.3**: Attempting to access another user's data returns empty result set (not error)

## Traceability Mapping

| AC ID | Spec Section(s) | Component(s)/API(s) | Test Idea |
|-------|----------------|---------------------|-----------|
| AC-2.1.1 | Detailed Design > Data Models, Security > Auth | `app/(auth)/signup`, Supabase Auth | E2E: Submit form with weak password, verify rejection. Submit valid password, verify acceptance. |
| AC-2.1.2 | Detailed Design > Workflows (Registration) | Supabase Auth (email service) | Integration: Mock email service, verify verification email sent. Check account status before/after verification. |
| AC-2.1.3 | Detailed Design > APIs (signInWithPassword) | `app/(auth)/login`, Supabase Auth | E2E: Login with valid creds, assert session token in localStorage. Verify redirect to dashboard. |
| AC-2.1.4 | Detailed Design > Workflows (Google OAuth) | `supabase.auth.signInWithOAuth` | E2E: Click Google button, mock OAuth flow, verify session created. |
| AC-2.1.5 | Security > Error Handling Pattern | Authentication Routes | Unit: Test error message mapping for various failure scenarios (wrong password, unverified email, etc.). |
| AC-2.1.6 | Detailed Design > APIs (resetPasswordForEmail) | Supabase Auth | Integration: Request password reset, verify email sent. Follow link, set new password, login with new password. |
| AC-2.1.7 | Detailed Design > Workflows (Session Persistence) | Supabase Client, localStorage | E2E: Login, close browser, reopen, assert still logged in. |
| AC-2.1.8 | Performance > Session Refresh | Supabase Client auto-refresh | Integration: Mock expired token, verify silent refresh occurs. Assert no user-visible interruption. |
| AC-2.1.9 | Detailed Design > APIs (signOut) | Authentication Routes | E2E: Login, logout, assert tokens removed from storage. Attempt authenticated API call, verify 401. |
| AC-2.1.10 | NFR > Accessibility | `app/(auth)/*` components | Accessibility: Tab through all form elements, submit with keyboard. Run screen reader test. |
| AC-2.2.1 | Detailed Design > Services (Extension Popup) | Extension Background Service Worker | Extension Unit: Render popup, assert login state display based on storage. |
| AC-2.2.2 | Performance > Extension Sync Latency | useExtensionBridge hook, window.postMessage | Integration: Trigger login, measure time until extension receives message. Assert < 100ms. |
| AC-2.2.3 | Security > Extension Storage | Extension Background (chrome.storage.local) | Extension Unit: Store session, read encrypted value, verify AES-256 encryption. |
| AC-2.2.4 | Security > Origin Validation | Extension Background message handler | Extension Unit: Send message from untrusted origin, verify rejection. Send from production origin, verify acceptance. |
| AC-2.2.5 | Detailed Design > APIs (AUTH_STATE_SYNCED) | Extension → Web App message | Integration: Mock extension, send sync message, verify web app receives confirmation. |
| AC-2.2.6 | Detailed Design > Services (Dashboard Widget) | Dashboard Status Widget component | Unit: Render widget with synced state, assert "Extension connected" displayed. |
| AC-2.2.7 | Detailed Design > APIs (Extension Bridge Protocol) | useExtensionBridge TypeScript interfaces | Type Check: Verify message types compile. Send invalid message shape, assert TypeScript error. |
| AC-2.2.8 | Security > API Route Protection | Extension making calls to `/api/marketplace/*` | Integration: Extension calls authenticated endpoint with token, verify success. Call without token, verify 401. |
| AC-2.3.1 | Detailed Design > Services (Profile Component) | Settings page UI | E2E: Navigate to Settings, click marketplace connection section, assert UI loads. |
| AC-2.3.2 | Detailed Design > Services (Content Scripts) | Extension content script for eBay | Extension E2E: Click "Connect eBay", verify content script injected into ebay.com tab. |
| AC-2.3.3 | Detailed Design > Services (Content Scripts) | Extension content script for Poshmark | Extension E2E: Click "Connect Poshmark", verify content script injected into poshmark.com tab. |
| AC-2.3.4 | Detailed Design > Workflows (Credential Connection) | Extension content script cookie interception | Extension Integration: Mock marketplace login, intercept cookies from network, assert capture. |
| AC-2.3.5 | Security > Credential Handling | Extension content script encryption | Extension Unit: Capture credentials, verify encrypted before postMessage. Assert AES-256 used. |
| AC-2.3.6 | Detailed Design > Data Models (marketplace_credentials) | `/api/marketplace/connect` API route | Integration: POST encrypted credentials, verify database insert. Query table, assert is_connected=true. |
| AC-2.3.7 | Detailed Design > Services (Dashboard Widget) | Dashboard marketplace status component | E2E: Connect marketplace, refresh dashboard, assert "Connected" badge visible. |
| AC-2.3.8 | Detailed Design > Services (Dashboard Widget) | Dashboard marketplace status component | Unit: Render widget with disconnected state, assert "Not Connected" text. |
| AC-2.3.9 | Detailed Design > APIs (DELETE /marketplace/disconnect) | `/api/marketplace/disconnect` route | Integration: Connect marketplace, disconnect, query database, assert credential row deleted. |
| AC-2.3.10 | Reliability > Error Recovery | Error handling in credential flow | E2E: Simulate credential capture failure, verify error message displayed to user. |
| AC-RLS.1 | Security > RLS Policies, Data Models (users) | Supabase RLS policy on users table | Integration: Login as User A, attempt to query User B's profile, assert empty result. |
| AC-RLS.2 | Security > RLS Policies, Data Models (marketplace_credentials) | Supabase RLS policy on marketplace_credentials | Integration: Login as User A, query credentials, assert only User A's credentials returned. |
| AC-RLS.3 | Security > RLS Policies | All RLS-enabled tables | Integration: Manually craft query bypassing app layer, verify RLS still enforces user isolation. |

## Risks, Assumptions, Open Questions

**RISK-1**: Chrome Extension Manifest V3 limitations may restrict credential capture functionality
- **Mitigation**: Prototype credential interception early in Story 2.3 to validate approach. If blocked, consider alternative strategies (OAuth where available, user-input fields as fallback).

**RISK-2**: Marketplace platforms (eBay, Poshmark) may detect and flag automated credential capture
- **Mitigation**: Encrypt all data immediately, minimize storage duration, operate only on user-initiated actions. Follow each marketplace's TOS strictly.

**RISK-3**: Supabase Auth service downtime would block all authentication operations
- **Mitigation**: Monitor Supabase status page, have incident response plan. Consider implementing "graceful degradation" mode that caches user profile data locally for read-only operations during outages.

**RISK-4**: Google OAuth policy changes could break social login
- **Mitigation**: Ensure email/password flow is equally polished as fallback. Stay subscribed to Google OAuth developer updates.

**RISK-5**: Extension-to-webapp message passing could fail in cross-origin scenarios during local development
- **Mitigation**: Test extension in both local development (localhost) and production environments early. Document setup instructions clearly.

**ASSUMPTION-1**: Supabase RLS policies will enforce user isolation without performance degradation
- **Validation**: Benchmark RLS-enabled queries in Story 2.1. If overhead > 10ms, consider caching strategies or denormalization.

**ASSUMPTION-2**: Users will have Chrome browser installed and are willing to install extension
- **Validation**: Include browser/extension check in onboarding flow. Provide clear installation instructions. Track installation completion rate.

**ASSUMPTION-3**: Session token encryption in extension storage is sufficient for credential security
- **Validation**: Security audit of extension storage implementation in Story 2.2. Consult Chrome security best practices guide.

**ASSUMPTION-4**: eBay and Poshmark do not change their authentication cookie structures frequently
- **Validation**: Implement robust error handling for credential capture failures. Log failures for monitoring. Consider versioning credential capture logic.

**QUESTION-1**: Should we implement multi-factor authentication (MFA) in MVP or defer to post-MVP?
- **Current Decision**: Deferred to post-MVP per scope definition. Revisit if early users request it strongly.

**QUESTION-2**: What is the maximum number of marketplace accounts a user can connect?
- **Current Decision**: No hard limit in Epic 2. Database schema supports N:M relationship. Monitor actual usage patterns in beta.

**QUESTION-3**: Should password reset emails expire after a certain time period?
- **Current Decision**: Leverage Supabase Auth default (24 hours). Can configure later if needed.

**QUESTION-4**: Do we need to support "Remember Me" functionality for extended session duration?
- **Current Decision**: Not in MVP. Current 30-day refresh token lifespan provides reasonable session persistence. Add if user feedback indicates need.

## Test Strategy Summary

**Test Levels \u0026 Frameworks** (aligned with Architecture Section: Testing Strategy)

**Unit Tests** (Vitest)
- **Scope**: Individual functions, React components in isolation, utility libraries
- **Coverage Targets**:
  - Authentication utility functions (password validation, error message formatting): 100%
  - Extension message validation logic: 100%
  - TypeScript type guards and interfaces: Compile-time checked, runtime validation tested
- **Key Tests**:
  - Password strength validation edge cases
  - Session token encryption/decryption roundtrip
  - RLS policy SQL syntax validation (via Supabase migration tests)

**Integration Tests** (Vitest + Supabase Test Client)
- **Scope**: API routes, database operations, Supabase Auth flows (mocked at boundary)
- **Coverage Targets**:
  - All `/api/marketplace/*` endpoints: Success and error paths
  - Database CRUD operations with RLS enabled: User isolation verification
  - Supabase Auth client integration: Mocked external calls, real client logic
- **Key Tests**:
  - POST /api/marketplace/connect stores encrypted credentials correctly
  - DELETE /api/marketplace/disconnect enforces RLS (user can only delete own credentials)
  - Session refresh logic handles expired tokens gracefully

**End-to-End Tests** (Playwright)
- **Scope**: Complete user flows from browser, extension interactions, cross-context communication
- **Coverage Targets**:
  - All 31 acceptance criteria must have at least one E2E test
  - Happy path flows: 100% coverage
  - Critical error paths: 80% coverage
- **Key Tests**:
  - **Auth Flow**: Signup → Email verification → Login → Dashboard (AC-2.1.1 through AC-2.1.3)
  - **Google OAuth**: Click button → Mock OAuth consent → Session created → Dashboard (AC-2.1.4)
  - **Extension Sync**: Web login → Extension receives sync → Popup displays state (AC-2.2.2, AC-2.2.1)
  - **Marketplace Connection**: Navigate to Settings → Connect eBay → Mock credential capture → Dashboard shows "Connected" (AC-2.3.1 through AC-2.3.7)
  - **Session Persistence**: Login → Close browser → Reopen → Still logged in (AC-2.1.7)

**Chrome Extension Tests** (Playwright + Extension Testing API)
- **Scope**: Extension-specific logic (background service worker, content scripts, popup)
- **Coverage Targets**:
  - Message passing between extension and web app: 100%
  - Credential encryption in extension: 100%
  - Origin validation: 100%
- **Key Tests**:
  - Extension loads popup, displays correct login state from storage
  - Content script injects into marketplace page on demand
  - Origin validation rejects messages from untrusted sources
  - Encrypted session storage roundtrip (store → retrieve → decrypt)

**Accessibility Tests** (Axe-core via Playwright)
- **Scope**: All authentication UI components
- **Coverage**: WCAG 2.1 Level AA compliance
- **Key Tests**:
  - Keyboard navigation through signup/login forms
  - Screen reader announcement testing for error messages
  - Color contrast validation for all interactive elements

**Test Execution Strategy**

- **Local Development**: Vitest unit tests run on file save (watch mode)
- **Pre-Commit Hook**: Lint-staged runs Vitest unit tests on changed files
- **CI/CD (GitHub Actions)**: 
  - Run all unit tests (Vitest)
  - Run all integration tests (Vitest + Supabase Test Client)
  - Run E2E smoke tests (Playwright - critical paths only, ~5 tests)
- **Full E2E Suite**: Run nightly on staging environment (all Playwright tests, ~25 tests)
- **Pre-Deployment**: Full test suite must pass before merging to main branch

**Test Data Management**

- **Unit Tests**: Mock data in test files
- **Integration Tests**: Supabase local instance with test fixtures
- **E2E Tests**: Dedicated test user accounts (test@crosslist.app), ephemeral credentials

**Coverage Goals**

- **Overall Code Coverage**: 80% minimum (enforced in CI)
- **Critical Path Coverage**: 100% (auth flows, credential management, RLS policies)
- **Acceptance Criteria Coverage**: 100% (all 31 ACs must have test coverage)
