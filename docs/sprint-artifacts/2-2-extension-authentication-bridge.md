# Story 2.2: Extension Authentication Bridge
**Story ID:** 2.2
**Status**: done
**Priority:** High
**Owner:** Ameliant Record

## Dev Agent Record

### Context Reference

- [2-2-extension-authentication-bridge.context.xml](2-2-extension-authentication-bridge.context.xml)


## Story

As a user,
I want my authentication state to automatically synchronize between the web app and the Chrome Extension,
so that I can seamlessly connect marketplace accounts without logging in twice.

## Acceptance Criteria

1. **AC-2.2.1**: Chrome Extension popup displays current login state ("Logged in as [email]" or "Not logged in")
2. **AC-2.2.2**: When user logs in via web app, extension receives AUTH_STATE_SYNC message within 100ms
3. **AC-2.2.3**: Extension stores Supabase session token in chrome.storage.local with encryption (AES-256)
4. **AC-2.2.4**: Extension validates message origin before processing (rejects non-production domains)
5. **AC-2.2.5**: Extension sends AUTH_STATE_SYNCED confirmation back to web app after successful sync
6. **AC-2.2.6**: Web app displays "Extension connected" status indicator after successful sync
7. **AC-2.2.7**: Extension-to-webapp messages use type-safe protocol with TypeScript interfaces
8. **AC-2.2.8**: Extension can make authenticated API calls using stored session token

## Tasks / Subtasks

- [ ] Task 1: Define Type-Safe Message Protocol (AC: #7)
    - [ ] Subtask 1.1: Create shared types package or usage pattern for message definitions
    - [ ] Subtask 1.2: Define `AUTH_STATE_SYNC`, `AUTH_STATE_SYNCED`, and `EXTENSION_STATUS_REQUEST` message interfaces
    - [ ] Subtask 1.3: Implement type guards for runtime message validation

- [ ] Task 2: Implement Extension Bridge Hook (Web App) (AC: #2, #5, #6, #7)
    - [ ] Subtask 2.1: Create `useExtensionBridge` hook in `apps/web/hooks/`
    - [ ] Subtask 2.2: Implement `sendMessage` function with window.postMessage
    - [ ] Subtask 2.3: Implement message listener for responses
    - [ ] Subtask 2.4: Add extension availability detection (ping/pong)

- [ ] Task 3: Implement Auth State Synchronization (Web App Side) (AC: #2, #6)
    - [ ] Subtask 3.1: Integrate `useExtensionBridge` with `SupabaseAuth` provider
    - [ ] Subtask 3.2: Trigger `AUTH_STATE_SYNC` on login and session refresh
    - [ ] Subtask 3.3: Trigger `AUTH_STATE_CLEAR` on logout
    - [ ] Subtask 3.4: Create "ExtensionStatus" indicator component for Dashboard

- [ ] Task 4: Implement Extension Background Service Worker Logic (AC: #4, #3, #5)
    - [ ] Subtask 4.1: Implement message listener in `apps/chrome-extension/src/background/index.ts`
    - [ ] Subtask 4.2: Implement **Origin Validation** (Strictly check `sender.origin`)
    - [ ] Subtask 4.3: Implement **Encryption Service** using Web Crypto API (AES-GCM-256)
    - [ ] Subtask 4.4: Implement secure storage logic (`chrome.storage.local`)
    - [ ] Subtask 4.5: Send `AUTH_STATE_SYNCED` confirmation back to web app

- [ ] Task 5: Implement Extension Popup UI (AC: #1)
    - [ ] Subtask 5.1: Create React components for Popup (Login State / Logout State)
    - [ ] Subtask 5.2: Read auth state from `chrome.storage.local` on mount
    - [ ] Subtask 5.3: Listen for storage changes to update UI in real-time

- [ ] Task 6: Verify Authenticated API Access (AC: #8)
    - [ ] Subtask 6.1: Create a test protected API route `/api/test-auth`
    - [ ] Subtask 6.2: Implement `fetchWithAuth` utility in extension
    - [ ] Subtask 6.3: Verify extension can call API using stored token

- [ ] Task 7: Comprehensive Testing (Tech Spec Strategy)
    - [ ] Subtask 7.1: Unit tests for Encryption Service (Vitest)
    - [ ] Subtask 7.2: Unit tests for Message Validation Logic (Vitest)
    - [ ] Subtask 7.3: E2E Test: Full Login -> Sync -> Popup Display flow (Playwright)
    - [ ] Subtask 7.4: Security Test: Verify origin validation rejects unknown origins

## Dev Notes

### Architecture Alignment

- **Bridge Pattern**: Implements the `useExtensionBridge` React hook pattern defined in architecture.
- **Security**:
    - **Encryption**: Must use AES-256 (Web Crypto API) for creating the "Encrypted Credentials" layer.
    - **Origin Validation**: CRITICAL. The extension must strictly check `message.origin` against the allowed web app URL (`VITE_WEB_APP_URL`).
- **State Management**:
    - Web App: Supabase Auth is the source of truth.
    - Extension: `chrome.storage.local` is the **cache** of that truth.

### Learnings from Previous Story

**From Story 2.1 (Status: review)**

- **Testing**: Unit tests (Vitest) and Accessibility tests (Axe-core) are mandatory. Do not skip.
- **Structure**: Extension source is in `apps/chrome-extension`. Build with `npm run build:chrome`.
- **Environment**: Use `VITE_*` env vars for configuration. ensuring the `externally_connectable` key in manifest is set correctly for dev vs prod.

### Technical Constraints

- **Sync Latency**: Must be < 100ms (p95). Use `window.postMessage` directly, avoid complex serialization if possible.
- **Manifest V3**: Background script is a Service Worker (ephemeral). Do not rely on global variables for state persistence; use `chrome.storage`.
