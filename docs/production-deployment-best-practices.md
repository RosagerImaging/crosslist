# Production Deployment Best Practices Checklist

This document provides a comprehensive checklist for deploying web applications to production, building upon the Epic 1 Vercel deployment experience and incorporating general best practices for reliability, security, and quality.

---

## Phase 1: Pre-Deployment Checks

1.  **Codebase Readiness:**
    -   Ensure that the latest code for the release builds successfully on your local machine.
    -   Run all automated tests (unit, integration, E2E) locally and ensure they pass with 100%.
    -   Review code for any last-minute changes or unaddressed issues.

2.  **Local Build Verification:**
    -   Execute a full production build locally: `cd apps/web && npm run build`
    -   Confirm there are no build errors or warnings.
    -   (Recommended): Run `cd apps/web && npm run test` to execute Playwright E2E tests against a local development server or preview environment to ensure all critical paths are working before deployment.

3.  **Vercel Project Configuration Review (Specific to Next.js on Vercel):**
    -   Navigate to your Vercel Dashboard for the 'crosslist' project.
    -   **Git Integration:** Verify that the Vercel project is correctly linked to the `main` (or production) branch of your GitHub repository.
    -   **Environment Variables (CRITICAL for Security):**
        -   Go to 'Settings' -> 'Environment Variables'.
        -   Ensure that all production-specific environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_EXT_MATCHES_HOST`, etc.) are correctly set and scoped for the 'Production' environment.
        -   **Never hardcode secrets.** All sensitive keys must be stored as environment variables.
        -   **Rotation:** Plan for regular rotation of API keys and secrets.

4.  **Database Readiness (if applicable):**
    -   Ensure all pending database migrations are reviewed, tested, and ready to be applied to the production database.
    -   Have a clear strategy for applying migrations (e.g., automated via CI/CD, manual script execution).
    -   **Backup:** Confirm a recent, successful backup of the production database exists.

5.  **Rollback Plan:**
    -   Have a clear and tested plan for rolling back to the previous stable version of the application if critical issues are discovered post-deployment.
    -   Ensure a quick rollback mechanism is in place (e.g., Vercel's instant rollbacks, Git revert).

6.  **Security Scanning:**
    -   Run a final security scan (e.g., SAST/DAST tools) on the production-candidate build or deployed preview environment.
    -   Address any high-severity vulnerabilities before proceeding.

7.  **Performance Baseline:**
    -   (If new features impact performance): Capture current performance metrics (LCP, FCP, INP, TTFB) from a staging environment to compare against production post-deployment.

---

## Phase 2: Initiating and Monitoring Deployment

1.  **Trigger Production Deployment:**
    -   The standard and recommended method is to **merge changes to the designated production branch** (e.g., `main` branch). If Vercel is configured for automatic deployments, this will trigger the production build.
    -   Alternatively, you can manually trigger a deployment from the Vercel Dashboard or via the Vercel CLI (`vercel deploy --prod`).

2.  **Monitor Build & Deployment Logs:**
    -   Immediately after triggering, go to the 'Deployments' section in your CI/CD platform (e.g., Vercel Dashboard, GitHub Actions).
    -   Monitor the build and deployment logs for any errors or warnings.
    -   Ensure the build passes and the deployment completes successfully.
    -   **Real-time Visibility:** Use monitoring tools to observe application health during deployment.

---

## Phase 3: Post-Deployment Verification & Communication

1.  **Access Production URL:**
    -   Once the deployment shows 'Ready' (or green in your CI/CD pipeline), access the live production URL (e.g., `https://crosslist.vercel.app`).
    -   Verify that the application loads correctly and there are no visual regressions across supported browsers/devices.

2.  **Smoke Testing Critical Functionalities:**
    -   Perform a quick, high-level verification of critical user flows:
        -   **Login/Signup Flow:** Test user login and signup functionality.
        -   **Homepage/Dashboard:** Verify the main pages load and critical UI elements are present.
        -   **Core Feature Flow:** Test the most important user-facing feature introduced/changed in this Epic.
    -   **Chrome Extension Connection:** If applicable, test the connection between your locally running Chrome extension (loaded unpackaged from `apps/chrome-extension/dist`) and the newly deployed production web app to ensure `externally_connectable` works as expected.

3.  **Browser Console Check:**
    -   Open your browser's developer console (F12) on the live production site.
    -   Check for any JavaScript errors, network issues, or security warnings.

4.  **Performance Monitoring:**
    -   Check real-time performance metrics (e.g., Core Web Vitals, API response times) in your monitoring dashboards (e.g., Vercel Analytics, Datadog, New Relic).
    -   Compare against baseline metrics from pre-deployment.

5.  **Error Monitoring & Alerting:**
    -   Verify error logging and alerting systems (e.g., Sentry, Bugsnag) are functional and correctly configured for the production environment.
    -   Confirm no new, high-severity errors are being reported.

6.  **Communication:**
    -   Inform all relevant stakeholders (Product Owners, QA, Leadership, Support) of the successful production deployment.
    -   Provide direct links to the new production version.
    -   Communicate any known issues or monitored regressions.

---

Once these steps are completed, your application is successfully deployed to production!

---

_This checklist was generated based on the Epic 1 Retrospective and general best practices for Next.js on Vercel deployments. It is a living document and should be adapted as your project and infrastructure evolve._
