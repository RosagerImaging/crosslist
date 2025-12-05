# Story 1.2: GitHub Repository & Vercel Deployment

Date: 2025-12-03
Author: Joel
Story ID: 1.2
Story Key: 1-2-github-repository-&-vercel-deployment
Epic ID: 1
Epic Title: Foundation & Infrastructure
Status: ready-for-dev

---

## Story Statement

**As a** developer,
**I want** the code in GitHub with automatic Vercel deployments,
**So that** every commit is tested and deployable.

## Requirements Context Summary

This story, "GitHub Repository & Vercel Deployment," is a critical step in the "Foundation & Infrastructure" epic. It establishes the CI/CD pipeline and automated deployment process that underpins the entire project's development lifecycle.

**From Epic 1: Foundation & Infrastructure:**
This story directly follows the project initialization and focuses on making the codebase maintainable and deployable from the outset.

**From Architecture Document:**
This story implements the "Deployment" and "CI/CD" sections of the architecture, specifying Vercel for deployment and GitHub Actions for continuous integration.

**Technical Notes (from Epics):**

- Create `.github/workflows/ci.yml` for linting and type-checking.
- Configure Vercel project with environment variables placeholder.
- Enable Vercel GitHub integration.

---

## Structure Alignment Summary

This story builds upon the foundational project structure established in Story 1.1. No new directories or major structural changes are introduced. The primary focus is on adding the `.github/workflows` directory for CI/CD.

- **Key Additions:**
  - `.github/workflows/ci.yml`: This file will contain the GitHub Actions workflow for running linting and type-checking on every pull request.
- **Lessons Learned from Previous Story:**
  - First story in epic - no predecessor context.

---

## Acceptance Criteria

- **AC1.2.1:** A GitHub repository exists for the project.
- **AC1.2.2:** A Vercel project is created and connected to the GitHub repository.
- **AC1.2.3:** A CI workflow is implemented in GitHub Actions to run linting and type-checking on every pull request.
- **AC1.2.4:** Every pull request to the `main` branch triggers a preview deployment on Vercel.
- **AC1.2.5:** Every merge to the `main` branch triggers a production deployment on Vercel.

---

## Tasks & Subtasks

### Task: Set up GitHub Repository

- **[x] Subtask:** Create a new repository on GitHub named `crosslist`.
- **[x] Subtask:** Push the existing code to the new repository.

### Task: Configure Vercel

- **[ ] Subtask:** Create a new project on Vercel and link it to the GitHub repository.
- **[ ] Subtask:** Configure environment variables placeholder in Vercel project settings.

### Task: Implement CI Workflow

- **[x] Subtask:** Create the file `.github/workflows/ci.yml`.
- **[x] Subtask:** Add a job to the `ci.yml` file that runs `npm run lint` and `npm run type-check` on every pull request to the `main` branch.

---

## Dev Notes

- **GitHub Repository:** The new repository should be created under the user's personal GitHub account or an organization account if specified.
- **Vercel Integration:** Ensure the Vercel project is correctly linked to the new GitHub repository. The free tier of Vercel should be sufficient for this project's initial stages.
- **CI Workflow:** The `ci.yml` file should be placed in the `.github/workflows` directory. The workflow should be configured to run on pull requests to the `main` branch.
- **Citations:**
  - [Architecture Document](docs/architecture.md)
  - [Epics and User Stories](docs/epics.md)

---

## Dev Agent Record

### Context Reference

- [Story Context File](docs/sprint-artifacts/1-2-github-repository-&-vercel-deployment.context.xml)

---

## Change Log

| Date       | Version | Change        |
| ---------- | ------- | ------------- |
| 2025-12-03 | 1.0     | Initial draft |
