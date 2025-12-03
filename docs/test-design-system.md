# System-Level Test Design
**Project:** Crosslist  
**Date:** 2025-11-30  
**Author:** Test Architect (AI)  
**Mode:** System-Level Testability Review (Phase 3)

---

## Executive Summary

This document assesses the testability of the Crosslist architecture and defines a comprehensive testing strategy for the MVP. The architecture is **testable** with some areas requiring special attention (Chrome Extension, Humanizer Layer). Overall testability score: **PASS with CONCERNS** (see details below).

---

## Testability Assessment

### Controllability: ✅ PASS

**Can we control system state for testing?**

✅ **Strengths:**
- **Database State**: Supabase provides excellent test database support
  - Can use `supabase db reset` for clean state
  - Can seed test data via SQL migrations or factories
  - RLS policies are testable (can switch users)

- **API Mocking**: Architecture supports dependency injection
  - Marketplace Adapters use interface pattern → easily mockable
  - Can create `MockEbayAdapter`, `MockPoshmarkAdapter` for unit tests
  - XState machines are pure functions → highly controllable

- **Extension Bridge**: Custom hook pattern enables mocking
  - `useExtensionBridge` can be mocked in tests
  - Can simulate extension responses without real extension

⚠️ **Concerns:**
- **Chrome Extension Testing**: Real extension requires browser context
  - **Mitigation**: Use Playwright with extension loading
  - **Mitigation**: Create mock extension for faster tests

- **Humanizer Layer**: Random delays make tests non-deterministic
  - **Mitigation**: Add `TEST_MODE` flag to disable jitter in tests
  - **Mitigation**: Inject delay function for controllability

**Recommendation:** Add test mode configuration to disable randomness.

---

### Observability: ✅ PASS

**Can we inspect system state and validate outcomes?**

✅ **Strengths:**
- **Database Inspection**: Direct SQL queries for validation
  - Can verify RLS policies work correctly
  - Can check data integrity after operations

- **State Machine Visibility**: XState provides excellent observability
  - Can inspect current state
  - Can verify state transitions
  - Can test guards and actions independently

- **Logging**: Structured logging with prefixes (`[Agent:Poshmark]`)
  - Easy to filter logs in tests
  - Can assert on log messages for validation

- **API Responses**: Standard format `{ success, data, error }`
  - Predictable structure for assertions
  - Easy to validate error cases

⚠️ **Concerns:**
- **Extension <-> Web Communication**: Message passing is async
  - **Mitigation**: Use Playwright's `waitForEvent` for message assertions
  - **Mitigation**: Add message logging for debugging

- **Real-time Updates**: Supabase Realtime can cause race conditions
  - **Mitigation**: Use `waitFor` utilities in tests
  - **Mitigation**: Disable Realtime in unit tests, enable in E2E

**Recommendation:** Add test utilities for async assertions.

---

### Reliability: ✅ PASS

**Are tests isolated, reproducible, and stable?**

✅ **Strengths:**
- **Stateless Components**: React components are pure
  - Easy to test in isolation
  - No shared global state (except Zustand, which is mockable)

- **Database Isolation**: Each test can use fresh database
  - Supabase supports test database instances
  - Can use transactions for rollback

- **Parallel-Safe**: Architecture supports parallel test execution
  - RLS ensures user data isolation
  - No shared file system state

⚠️ **Concerns:**
- **Extension Tests**: Browser context is stateful
  - **Mitigation**: Use Playwright's `test.use()` for isolated contexts
  - **Mitigation**: Clear extension storage between tests

- **XState Machines**: Complex state machines can have race conditions
  - **Mitigation**: Use XState's testing utilities (`createActor`, `waitFor`)
  - **Mitigation**: Test state transitions independently

- **Marketplace API Mocks**: Need consistent mock responses
  - **Mitigation**: Use MSW (Mock Service Worker) for API mocking
  - **Mitigation**: Create fixture library for common responses

**Recommendation:** Establish test isolation patterns in Sprint 0.

---

## Architecturally Significant Requirements (ASRs)

These quality requirements drive testing strategy:

| ASR ID | Requirement | Category | Risk Score | Testing Approach |
|--------|-------------|----------|------------|------------------|
| ASR-1 | Humanizer must avoid Poshmark detection | SEC/BUS | **9** (3×3) | Manual testing + monitoring in production |
| ASR-2 | Response time \u003c200ms for UI interactions | PERF | **6** (2×3) | Performance tests with k6 or Playwright metrics |
| ASR-3 | RLS prevents cross-user data access | SEC | **9** (3×3) | Security tests with multiple user contexts |
| ASR-4 | Extension credentials never sent to server | SEC | **9** (3×3) | Integration tests + code review |
| ASR-5 | XState handles agent errors gracefully | TECH | **6** (2×3) | Unit tests for error transitions |
| ASR-6 | Real-time updates \u003c1s latency | PERF | **4** (2×2) | E2E tests with Supabase Realtime |
| ASR-7 | WCAG 2.1 AA compliance | BUS | **4** (2×2) | Automated accessibility tests (axe-core) |

**High-Risk ASRs (Score ≥6):** 5 items require special testing attention.

---

## Test Levels Strategy

Based on web app architecture with Chrome Extension:

### Recommended Split: **40% Unit / 30% Integration / 30% E2E**

**Rationale:**
- **40% Unit**: Complex business logic (XState machines, Adapters, Humanizer)
- **30% Integration**: API routes, Supabase queries, Extension Bridge
- **30% E2E**: Critical user journeys, Extension + Web interaction

### Test Level Breakdown by Epic:

| Epic | Unit | Integration | E2E | Rationale |
|------|------|-------------|-----|-----------|
| **Epic 1: Foundation** | 20% | 60% | 20% | Infrastructure setup, integration-heavy |
| **Epic 2: User Access** | 30% | 30% | 40% | Auth flows need E2E validation |
| **Epic 3: Inventory Hub** | 50% | 30% | 20% | CRUD logic, unit-testable |
| **Epic 4: Crosslisting Agent** | 40% | 20% | 40% | Complex logic + E2E for Extension |
| **Epic 5: Listing Optimizer** | 60% | 30% | 10% | AI integration, mostly unit-testable |
| **Epic 6: Basic Analytics** | 50% | 40% | 10% | Data aggregation, unit + integration |

---

## NFR Testing Approach

### Security Testing

**Tools:** Playwright E2E + OWASP ZAP (optional)

**Test Cases:**
- ✅ **RLS Validation** (ASR-3):
  - Create 2 users, verify User A cannot access User B's items
  - Test via API and UI
  - Priority: **P0**

- ✅ **Extension Credential Isolation** (ASR-4):
  - Verify no marketplace cookies in network requests to server
  - Use Playwright network interception
  - Priority: **P0**

- ✅ **Auth Bypass Prevention**:
  - Test protected routes redirect to login
  - Test API routes require valid session
  - Priority: **P0**

**Coverage Target:** 100% of security-critical paths

---

### Performance Testing

**Tools:** Playwright (for UI metrics), k6 (for load testing - optional for MVP)

**Test Cases:**
- ✅ **UI Responsiveness** (ASR-2):
  - Measure interaction time for inventory search
  - Target: \u003c200ms
  - Use Playwright's `page.evaluate(() => performance.now())`
  - Priority: **P1**

- ✅ **Real-time Latency** (ASR-6):
  - Measure time from item creation to dashboard update
  - Target: \u003c1s
  - Priority: **P2**

- ⚠️ **Load Testing** (Deferred to Growth):
  - Not critical for MVP (single-user focus)
  - Add when scaling to 100+ users

**Coverage Target:** Critical paths only for MVP

---

### Reliability Testing

**Tools:** Playwright + XState testing utilities

**Test Cases:**
- ✅ **Agent Error Handling** (ASR-5):
  - Test XState machine handles network errors
  - Test retry logic (max 3 attempts)
  - Test user-facing error messages
  - Priority: **P0**

- ✅ **Extension Disconnect**:
  - Simulate extension crash during crosslisting
  - Verify graceful degradation
  - Priority: **P1**

- ✅ **Database Connection Loss**:
  - Mock Supabase connection failure
  - Verify error handling and retry
  - Priority: **P1**

**Coverage Target:** All error paths in critical flows

---

### Maintainability Testing

**Tools:** Vitest (coverage), ESLint, TypeScript

**Metrics:**
- **Code Coverage**: ≥80% for critical paths (XState, Adapters, Humanizer)
- **Type Safety**: 100% (TypeScript strict mode)
- **Linting**: 0 errors (ESLint)

**Automated Gates:**
- Coverage report on every PR
- Type-check in CI/CD
- Lint check blocks merge

---

## Test Environment Requirements

### Local Development
- **Database**: Local Supabase via Docker
- **Extension**: Chrome Developer Mode
- **Tools**: Vitest, Playwright, MSW

### CI/CD (GitHub Actions)
- **Database**: Supabase test project (ephemeral)
- **Browser**: Playwright with Chromium
- **Extension**: Packaged extension loaded in tests

### Staging (Optional for MVP)
- **Database**: Supabase staging project
- **Deployment**: Vercel preview deployment
- **Extension**: Unpacked extension (not published)

---

## Testability Concerns

### 🔴 HIGH: Humanizer Layer Testing (ASR-1)

**Problem:** How do we test "human-like" behavior without triggering Poshmark detection?

**Concerns:**
- Cannot test against real Poshmark (risk of account ban)
- Randomness makes tests non-deterministic
- No way to validate "undetectability" in automated tests

**Mitigations:**
1. **Unit Tests**: Test delay calculation logic with mocked randomness
   ```typescript
   // Mock Math.random() to return predictable values
   test('humanizer adds delay between 500-1200ms', () => {
     jest.spyOn(Math, 'random').mockReturnValue(0.5);
     expect(calculateDelay()).toBe(850); // 500 + (700 * 0.5)
   });
   ```

2. **Integration Tests**: Test Humanizer with mock Poshmark DOM
   - Create fixture HTML matching Poshmark structure
   - Verify Humanizer intercepts actions
   - Measure delays are within expected range

3. **Manual Testing**: Use test Poshmark account
   - Monitor for detection/throttling
   - Adjust delay parameters based on feedback
   - **Owner:** Product team

4. **Production Monitoring**: Track account restrictions
   - Alert if user accounts get flagged
   - Adjust Humanizer parameters in response

**Recommendation:** Accept that full automation is impossible. Rely on unit tests + production monitoring.

---

### ⚠️ MEDIUM: Chrome Extension Testing

**Problem:** Extension tests require browser context, slower than unit tests.

**Concerns:**
- Playwright with extension is slower (\u003e5s per test)
- Extension state persists between tests
- Hard to mock extension in web app tests

**Mitigations:**
1. **Mock Extension for Web Tests**:
   ```typescript
   // Mock useExtensionBridge in component tests
   jest.mock('@/hooks/use-extension-bridge', () => ({
     useExtensionBridge: () => ({
       sendMessage: jest.fn(),
       isConnected: true,
     }),
   }));
   ```

2. **Dedicated Extension E2E Tests**:
   - Use Playwright's `context.addInitScript()` to load extension
   - Clear `chrome.storage.local` between tests
   - Limit to P0 scenarios only (auth, credential management)

3. **Separate Test Suites**:
   - **Fast**: Unit + Integration (no extension) - run on every commit
   - **Slow**: E2E with extension - run on PR only

**Recommendation:** Minimize extension E2E tests, mock aggressively.

---

### ⚠️ MEDIUM: XState Machine Complexity

**Problem:** Complex state machines can have subtle bugs in transitions.

**Concerns:**
- Many states and transitions to test
- Race conditions in async actions
- Hard to visualize all paths

**Mitigations:**
1. **Use XState Testing Utilities**:
   ```typescript
   import { createActor } from 'xstate';
   
   test('crosslisting machine handles error', async () => {
     const actor = createActor(crosslistMachine);
     actor.start();
     actor.send({ type: 'START' });
     await waitFor(actor, (state) => state.matches('error'));
     expect(actor.getSnapshot().context.error).toBeDefined();
   });
   ```

2. **Visual Testing**: Use XState Visualizer
   - Generate state diagrams
   - Review with team for completeness

3. **Property-Based Testing** (Optional):
   - Use `fast-check` to generate random event sequences
   - Verify machine never reaches invalid state

**Recommendation:** Invest in XState testing utilities in Sprint 0.

---

## Recommendations for Sprint 0

**Sprint 0 Goal:** Establish testing foundation before feature development.

### 1. Set Up Test Infrastructure

**Tasks:**
- [ ] Configure Vitest with coverage reporting
- [ ] Set up Playwright with extension support
- [ ] Create test database setup script
- [ ] Configure MSW for API mocking
- [ ] Add test utilities to `lib/test-utils/`

**Owner:** Dev team  
**Effort:** 2-3 days

---

### 2. Create Test Utilities

**Files to Create:**
- `lib/test-utils/db-helpers.ts` - Database seeding and cleanup
- `lib/test-utils/auth-helpers.ts` - Mock user sessions
- `lib/test-utils/extension-mock.ts` - Mock extension bridge
- `lib/test-utils/xstate-helpers.ts` - XState testing utilities

**Owner:** Dev team  
**Effort:** 1-2 days

---

### 3. Establish Test Patterns

**Document:**
- How to test React components (with shadcn/ui)
- How to test XState machines
- How to test Supabase queries with RLS
- How to test Extension E2E flows

**Owner:** Test Architect (AI) + Dev team  
**Effort:** 1 day (documentation)

---

### 4. Configure CI/CD

**GitHub Actions Workflow:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit # Vitest
      - run: npm run test:e2e # Playwright
      - run: npm run lint
      - run: npm run type-check
```

**Owner:** Dev team  
**Effort:** 0.5 days

---

### 5. Add Test Mode for Humanizer

**Code Change:**
```typescript
// lib/agents/humanizer/middleware.ts
export class HumanizerMiddleware {
  constructor(private config: { testMode?: boolean } = {}) {}
  
  async click(element: Element) {
    if (this.config.testMode) {
      // No delay in tests
      element.click();
    } else {
      // Production: add human-like delay
      await this.addDelay();
      await this.moveCursor(element);
      element.click();
    }
  }
}
```

**Owner:** Dev team  
**Effort:** 0.5 days

---

## Test Execution Strategy

### Smoke Tests (\u003c2 min)
- App loads without errors
- Database connection works
- Auth redirects to login

### P0 Tests (\u003c10 min)
- User can sign up and log in
- RLS prevents cross-user access
- Extension credentials stay in browser
- Crosslisting agent handles errors

### P1 Tests (\u003c30 min)
- Full CRUD for inventory items
- Extension bridge communication
- XState machine state transitions
- Real-time updates work

### P2/P3 Tests (\u003c60 min)
- Edge cases
- Performance benchmarks
- Accessibility checks

**Total CI/CD Time:** \u003c60 min for full suite

---

## Quality Gate Criteria

**Before merging to main:**
- ✅ All P0 tests pass (100%)
- ✅ P1 tests pass rate ≥95%
- ✅ No high-risk (score ≥6) items unmitigated
- ✅ Code coverage ≥80% for critical paths
- ✅ TypeScript type-check passes
- ✅ ESLint passes with 0 errors

**Before production deployment:**
- ✅ All tests pass (P0-P3)
- ✅ Manual testing of Humanizer Layer
- ✅ Security review of Extension credential handling
- ✅ Performance benchmarks meet targets

---

## Summary

**Testability Score:** ✅ **PASS with CONCERNS**

**Strengths:**
- Modern stack with excellent testing support
- Architecture designed for testability (interfaces, DI)
- Clear separation of concerns

**Concerns:**
- Humanizer Layer requires manual testing + monitoring
- Chrome Extension E2E tests are slow
- XState complexity needs dedicated utilities

**Recommendation:** ✅ **APPROVED FOR IMPLEMENTATION**

The architecture is testable. Address concerns in Sprint 0 by:
1. Setting up test infrastructure
2. Creating test utilities
3. Adding test mode for Humanizer
4. Documenting test patterns

**Next Steps:**
1. Review this document with team
2. Run `implementation-readiness` workflow (final gate check)
3. Proceed to Sprint Planning
4. Execute Sprint 0 tasks before feature development

---

_Generated by BMad Test Architect - System-Level Mode_  
_Date: 2025-11-30_
