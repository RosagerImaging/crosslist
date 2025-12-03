# Epic Technical Specification: Foundation & Infrastructure

Date: 2025-11-30
Author: Joel
Epic ID: 1
Status: Draft

---

## Overview

This Epic focuses on establishing the core technical foundation for the Crosslist application, an AI-native inventory management system for e-commerce resellers. The goal is to set up the Next.js web application, Supabase backend, and a basic Chrome Extension shell, creating a robust and modern development environment that will support all future feature development and AI agent integration.

## Objectives and Scope

**Objectives:**
- To establish a modern and scalable technical foundation using Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.
- To set up continuous integration and deployment pipelines with GitHub and Vercel.
- To configure a Supabase project for authentication and data storage.
- To create a basic shell for the Chrome Extension for future marketplace integration.

**In-Scope:**
- Project initialization with Next.js 15, TypeScript 5, Tailwind CSS 4, ESLint 9.
- Configuration of shadcn/ui.
- GitHub repository setup with Vercel deployment.
- CI/CD with GitHub Actions for linting and type-checking.
- Supabase project creation, local CLI setup, and migration directory.
- Supabase client configuration and RLS enablement.
- Basic Chrome Extension directory structure (`manifest.json`, `background/`, `content/`, `popup/`).
- Build script for the Chrome Extension.

**Out-of-Scope:**
- Detailed feature implementation within the Next.js app beyond basic setup.
- Advanced Supabase features (e.g., Edge Functions, Realtime beyond initial setup).
- Full Chrome Extension functionality (e.g., authentication bridge, marketplace interaction logic).

## System Architecture Alignment

This Epic directly aligns with the foundational decisions outlined in the Architecture document. It implements the chosen frontend framework (Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui), establishes the Supabase database and authentication integration, and creates the initial project structure and deployment mechanisms (GitHub, Vercel). The Chrome Extension shell sets the stage for the Extension Bridge and marketplace interaction patterns.


## Detailed Design

### Services and Modules

*   **Next.js Application:** The core web application, utilizing the App Router for routing, layouts, and server/client component architecture.
*   **shadcn/ui Component Library:** Integrated for consistent and accessible UI components, leveraging Tailwind CSS for styling.
*   **Supabase Client:** Configured in `lib/supabase/client.ts` to manage database interactions and user authentication (Supabase Auth).
*   **GitHub Actions:** Implemented for Continuous Integration, performing linting and type-checking on pull requests.
*   **Vercel Deployment:** Configured for Continuous Deployment, automatically deploying preview and production environments.
*   **Chrome Extension Shell:** A foundational extension structure including `manifest.json`, background service worker, and content scripts for initial marketplace interaction points.

### Data Models and Contracts

Epic 1 focuses on infrastructure setup and does not introduce new application-specific data models beyond those inherent to the chosen technologies.

*   **Supabase `auth.users` table:** Managed by Supabase Auth for user authentication and authorization. This table will implicitly define the contract for user identity.

### APIs and Interfaces

*   **Next.js API Routes (Implicit):** While Epic 1 doesn't define custom API routes, the App Router setup provides the foundation for future Server Actions and API endpoints for data handling and agent orchestration.
*   **Supabase API:** Accessed via `@supabase/supabase-js` client library for authentication, user management, and future database CRUD operations.
*   **GitHub/Vercel Webhooks/APIs (Implicit):** Utilized by the CI/CD pipeline for repository events and deployment status.
*   **Chrome Extension APIs (Implicit for shell):** Future stories will leverage `chrome.storage`, `chrome.runtime`, `chrome.tabs`, and `chrome.scripting` for extension functionality, with the shell providing the basic `manifest.json` configuration.

### Workflows and Sequencing

The implementation for Epic 1 follows a sequential workflow, with each story building upon the foundation laid by the previous one:

1.  **Story 1.1: Project Initialization with Next.js 15**
    *   **Action:** Execute `npx create-next-app@latest crosslist --typescript --tailwind --eslint` followed by `npx shadcn@latest init`.
    *   **Configuration:** Configure `components.json` for shadcn/ui and set up `@/` absolute imports.
    *   **Outcome:** A modern, type-safe Next.js project with a consistent UI framework.
2.  **Story 1.2: GitHub Repository & Vercel Deployment**
    *   **Action:** Create a GitHub repository and link it to a new Vercel project.
    *   **Configuration:** Implement a GitHub Actions workflow (`.github/workflows/ci.yml`) for automated linting and type-checking on pull requests.
    *   **Outcome:** Automated CI/CD pipeline ensuring code quality and deployability.
3.  **Story 1.3: Supabase Project & Database Setup**
    *   **Action:** Provision a new Supabase project and install/initialize the local Supabase CLI.
    *   **Configuration:** Set up environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and configure the Supabase client in `lib/supabase/client.ts`.
    *   **Security:** Enable Row Level Security (RLS) on all tables by default.
    *   **Outcome:** A secure and scalable backend database ready for application data.
4.  **Story 1.4: Chrome Extension Shell**
    *   **Action:** Create the base directory structure for the Chrome Extension (`extension/`) including `manifest.json`, `background/service-worker.ts`, `content/poshmark.ts`, `content/ebay.ts`, and `popup/index.html`.
    *   **Build:** Implement a build script (`npm run build:extension`) to package the extension.
    *   **Outcome:** A functional, loadable Chrome Extension shell in developer mode, ready for future credential management and marketplace interaction logic.


## Non-Functional Requirements

### Performance

This Epic lays the foundation for achieving the PRD's performance targets, particularly regarding initial load times.
*   **Initial Load (FCP/LCP):** Under 2 seconds on typical broadband (PRD). Achieved through Next.js 15 optimizations (React Server Components, bundling), Tailwind CSS for efficient styling, and Vercel's optimized deployment infrastructure.
*   **Build Times:** CI/CD setup (Story 1.2) should ensure rapid build and deployment cycles, contributing to overall development agility.

### Security

The security decisions made in this Epic are foundational for the entire application.
*   **Authentication & Authorization:** Implemented via Supabase Auth (Story 1.3), providing industry-standard secure user authentication. Row Level Security (RLS) enabled on all Supabase tables by default ensures robust authorization.
*   **Data Protection:** Supabase handles encryption in transit (TLS) and at rest.
*   **Extension Security:** The Chrome Extension shell (Story 1.4) is configured with Manifest V3, and future connection points will adhere to `externally_connectable` restrictions as per Architecture.

### Reliability/Availability

The choices in this Epic contribute directly to the application's reliability and availability.
*   **Version Control & CI/CD:** GitHub repository and GitHub Actions (Story 1.2) ensure code integrity and automated testing, reducing the risk of introducing regressions.
*   **Deployment:** Vercel (Story 1.2) provides a highly available and scalable deployment platform with automatic rollbacks.
*   **Backend Stability:** Supabase (Story 1.3) as a managed service offers inherent reliability and uptime guarantees.

### Observability

This Epic establishes the initial mechanisms for observability, which will be expanded in later Epics.
*   **Error Reporting:** The foundation for integrating Sentry via Vercel (Architecture) is laid, allowing for critical error monitoring.
*   **Logging:** Basic console logging for development with the ability to integrate structured logging for production environments will be in place.
*   **Build/Deploy Status:** GitHub and Vercel provide dashboards for monitoring build and deployment statuses.

## Dependencies and Integrations

This Epic establishes the core dependencies and integration points for the project, setting up the development environment and foundational services.

*   **Next.js 15:** The primary React framework for the web application.
    *   Integration: Initialized via `create-next-app`, forming the base of the `app/` directory.
*   **React 19:** The core UI library, bundled with Next.js 15.
*   **TypeScript 5:** The primary programming language, used across the entire codebase.
    *   Integration: Configured globally in the project and enforced by ESLint.
*   **Tailwind CSS 4:** The utility-first CSS framework for styling.
    *   Integration: Configured during Next.js initialization, used for rapid UI development.
*   **shadcn/ui:** A collection of re-usable components.
    *   Integration: Initialized post-Next.js setup, providing accessible and customizable UI primitives.
*   **Supabase (PostgreSQL):** The backend-as-a-service, providing authentication, database, and storage.
    *   Integration: Configured via `@supabase/supabase-js` client library in `lib/supabase/client.ts`, with Supabase CLI for local development and migrations.
*   **GitHub:** Version control and source code management.
    *   Integration: Connected for CI/CD workflows via GitHub Actions.
*   **Vercel:** Deployment platform.
    *   Integration: Configured for automated deployments from GitHub.
*   **ESLint 9:** Code linting to enforce code quality and style.
    *   Integration: Configured as a development dependency and run via GitHub Actions.
*   **Prettier 3:** Code formatter for consistent code style.
    *   Integration: Configured as a development dependency.
*   **Turbo 2:** Monorepo management tool.
    *   Integration: Used for running scripts across `apps/` and `packages/` workspaces.
*   **Chrome Extension (Manifest V3):** Basic structure for browser-side interactions.
    *   Integration: Requires a separate build process (`npm run build:extension`) and loads into Chrome Developer Mode.


## Acceptance Criteria (Authoritative)

The following Acceptance Criteria for Epic 1 stories serve as the authoritative statements for verifying completion and correctness:

### Story 1.1: Project Initialization with Next.js 15
*   **AC1.1.1:** The project is created with Next.js 15, TypeScript 5, Tailwind CSS 4, and ESLint 9.
*   **AC1.1.2:** shadcn/ui is initialized and configured with the New York style.
*   **AC1.1.3:** The folder structure matches the Architecture document (`app/`, `components/`, `lib/`, `hooks/`).
*   **AC1.1.4:** Naming conventions (kebab-case for files, PascalCase for components) are established.
*   **AC1.1.5:** The project builds successfully with `npm run build`.

### Story 1.2: GitHub Repository & Vercel Deployment
*   **AC1.2.1:** A GitHub repository for `crosslist` exists and is accessible.
*   **AC1.2.2:** The Vercel project is connected to the GitHub repository.
*   **AC1.2.3:** Every Pull Request (PR) triggers a preview deployment on Vercel.
*   **AC1.2.4:** Merges to the `main` branch trigger a production deployment on Vercel.
*   **AC1.2.5:** GitHub Actions run linting and type-checking on every PR.

### Story 1.3: Supabase Project & Database Setup
*   **AC1.3.1:** A Supabase project is created and configured as a production instance.
*   **AC1.3.2:** The local Supabase CLI is installed and initialized (`supabase init`) within the project.
*   **AC1.3.3:** A database migrations directory (`supabase/migrations/`) exists.
*   **AC1.3.4:** Required environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are configured.
*   **AC1.3.5:** A Supabase client is configured in `lib/supabase/client.ts`.
*   **AC1.3.6:** Row Level Security (RLS) is enabled by default on all new tables.

### Story 1.4: Chrome Extension Shell
*   **AC1.4.1:** An `extension/` directory exists with `manifest.json` (Manifest V3), `background/service-worker.ts`, `content/poshmark.ts`, `content/ebay.ts`, and `popup/index.html`.
*   **AC1.4.2:** The extension loads in Chrome Developer Mode without errors.
*   **AC1.4.3:** Content scripts are configured to inject into `*.poshmark.com` and `*.ebay.com`.
*   **AC1.4.4:** A build script (`npm run build:extension`) is available and correctly packages the extension.

## Traceability Mapping

| AC ID   | Specification Section(s) | Component(s)/API(s)                  | Test Idea                                    |
|---------|--------------------------|--------------------------------------|----------------------------------------------|
| AC1.1.1 | PRD (NFR-Performance), Arch (Proj. Init) | Next.js, TypeScript, Tailwind, ESLint | `npx create-next-app` output verification    |
| AC1.1.2 | Arch (UI Components)     | shadcn/ui                            | `shadcn@latest init` verification, `components.json` |
| AC1.1.3 | Arch (Proj. Structure)   | Folder structure                     | File system check                            |
| AC1.1.4 | Arch (Naming Conv.)      | Codebase, ESLint                     | Linting check, manual review                 |
| AC1.1.5 | PRD (NFR-Performance), Arch (Testing) | `npm run build`                     | Build command execution                      |
| AC1.2.1 | Arch (Deployment)        | GitHub                               | `git remote -v` check, browser verification  |
| AC1.2.2 | Arch (Deployment)        | Vercel, GitHub                       | Vercel dashboard verification                |
| AC1.2.3 | Arch (Deployment)        | Vercel, GitHub Actions               | PR creation, Vercel preview URL check        |
| AC1.2.4 | Arch (Deployment)        | Vercel, GitHub Actions               | Merge to `main`, Vercel production URL check |
| AC1.2.5 | Arch (Testing Strategy)  | GitHub Actions, ESLint, TypeScript   | PR creation, GitHub Actions log review       |
| AC1.3.1 | PRD (NFR-Security), Arch (DB & Auth) | Supabase project                     | Supabase dashboard verification              |
| AC1.3.2 | Arch (DB & Auth)         | Supabase CLI                         | `supabase init` execution, directory check   |
| AC1.3.3 | Arch (DB & Auth)         | `supabase/migrations/`               | File system check                            |
| AC1.3.4 | Arch (DB & Auth)         | Environment variables                | `.env.local` check, Vercel config check      |
| AC1.3.5 | Arch (DB & Auth)         | `@supabase/supabase-js`              | Code review of `lib/supabase/client.ts`      |
| AC1.3.6 | Arch (DB & Auth)         | Supabase RLS                         | Supabase dashboard (Auth section) verification |
| AC1.4.1 | Arch (Proj. Structure), PRD (FR3) | Chrome Extension directory, `manifest.json` | File system check, `manifest.json` review    |
| AC1.4.2 | Arch (Testing Strategy)  | Chrome Developer Mode                | Browser loading, console check               |
| AC1.4.3 | Arch (Proj. Structure)   | `manifest.json`, content scripts     | `manifest.json` review, content script inspection |
| AC1.4.4 | Arch (Proj. Structure)   | Build script                         | `npm run build:extension` execution, output check |

## Risks, Assumptions, Open Questions

### Risks
*   **Dependency on External Services:** Heavy reliance on Next.js, Supabase, Vercel, and GitHub. Disruptions or breaking changes in these services could impact development and operations.
    *   _Mitigation:_ Monitor official channels for updates, utilize stable/LTS versions where possible.
*   **Chrome Extension Compatibility:** Browser updates (especially for Manifest V3) could introduce breaking changes to the Chrome Extension shell or content script injection methods.
    *   _Mitigation:_ Implement automated browser testing (Playwright), closely follow Chrome Extension developer announcements.
*   **Initial Setup Performance:** The `create-next-app` and `shadcn/ui` setup might introduce unexpected performance overhead if not configured optimally.
    *   _Mitigation:_ Adhere to best practices for Next.js and Tailwind CSS, conduct performance audits post-initialization.

### Assumptions
*   The `create-next-app` CLI will continue to provide a stable and production-ready foundation for Next.js applications.
*   Supabase's managed service will meet the security, performance, and availability requirements for the MVP.
*   GitHub Actions and Vercel's integrated CI/CD capabilities will be sufficient for the MVP's development and deployment needs.
*   The chosen versions of all technologies (Next.js 15, TypeScript 5, etc.) are compatible and stable for production use.

### Open Questions
*   What is the detailed strategy for managing Supabase database schema changes and migrations in a multi-developer team environment beyond basic `supabase migration new`?
*   Are there any specific Vercel environment variables required beyond the Supabase keys for the foundational setup, particularly for analytics or other services not yet defined?

## Test Strategy Summary

The testing strategy for Epic 1 will focus on verifying the successful setup and configuration of the foundational components as outlined in the Acceptance Criteria.

*   **Unit/Integration Testing (Vitest):** Not heavily applicable for initial setup, but will be used for any utility functions or core logic introduced within this Epic (e.g., Supabase client wrapper).
*   **End-to-End Testing (Playwright):** Playwright will be crucial for:
    *   Verifying successful project build and local server startup.
    *   Testing Chrome Extension loading in developer mode and content script injection.
    *   Confirming successful Vercel deployments and accessibility of deployed environments.
*   **Manual Verification:**
    *   **CLI Output Review:** Checking the console output of `create-next-app`, `shadcn@latest init`, and `supabase init` for successful completion and expected messages.
    *   **File System Audit:** Manually inspecting folder structures, presence of key configuration files (`manifest.json`, `.github/workflows/ci.yml`, `components.json`), and adherence to naming conventions.
    *   **Browser Inspection:** Using Chrome Developer Tools to verify the Chrome Extension loads correctly, `manifest.json` is valid, and content scripts are active.
    *   **Platform UI Checks:** Confirming GitHub repository setup, Vercel project connection, and successful deployments through their respective web interfaces.
*   **CI/CD Pipeline Validation:** Ensuring GitHub Actions run successfully on PRs, performing linting and type-checking as configured.
*   **Security Testing:** Initial checks for RLS enablement on Supabase tables via the Supabase dashboard.
*   **Performance Monitoring:** Basic checks for FCP/LCP using browser developer tools on initial deployments.
