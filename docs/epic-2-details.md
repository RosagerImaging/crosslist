**Epic Breakdown Summary**

**Epic 2: User Access & Marketplace Connection**
- **Goal:** Enable users to create accounts, authenticate, and securely connect their marketplace credentials via the Chrome Extension.
- **Value Delivered:** Users can sign up, log in, and link their eBay/Poshmark accounts.
- **Stories:**
    - **Story 2.1: User Authentication (Supabase Auth)** (Enhanced)
        - As a user, I want to securely sign up and log in with email/password or Google, so that I can access my private inventory and manage my account.
        - Covers detailed signup/login flows, password rules, email verification, Google OAuth, session persistence, redirection, and accessibility.
        - Prerequisites: Story 1.3
    - **Story 2.2: Extension Authentication Bridge** (Enhanced)
        - As a user, I want the Chrome Extension to automatically sync with my web app login state, so that I have a seamless, secure experience and don't have to authenticate twice.
        - Details immediate extension popup display of login status, secure retrieval and encrypted storage of Supabase session token, authenticated API calls, and rigorous origin validation for message passing.
        - Prerequisites: Story 2.1, Story 1.4
    - **Story 2.3: Marketplace Credential Management** (Enhanced)
        - As a user, I want to securely connect my eBay and Poshmark accounts, so that AI agents can seamlessly list items on my behalf and manage them across marketplaces.
        - Outlines user flow for connecting/disconnecting accounts, secure capture and encrypted storage of session cookies, error handling, and web app dashboard status updates.
        - Prerequisites: Story 2.2

**FR Coverage Matrix (for Epic 2)**

| FR | Description | Epic | Stories |
|----|-------------|------|---------|
| FR1 | Users can create and manage accounts | Epic 2 | 2.1 |
| FR2 | Users can log in securely | Epic 2 | 2.1 |
| FR3 | Users can connect marketplace accounts via Extension | Epic 2 | 2.2, 2.3 |
| FR5 | Users can manage profile and preferences | Epic 2 | 2.1 |