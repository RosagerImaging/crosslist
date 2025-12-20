# Story 3.4: Edit & Delete Item

**Status:** ready-for-dev
**Epic:** Epic 3 (Central Inventory Hub)
**Priority:** Medium
**Estimation:** 3 Points

## User Story

**As a** user,
**I want** to edit or delete items,
**So that** I can keep my inventory accurate.

## Acceptance Criteria

- **AC 1: Edit Item**
  - **Given** I am viewing the inventory dashboard
  - **When** I click "Edit" on an item
  - **Then** the Add Item form opens pre-filled with the item's data
  - **And** I can modify any field
  - **And** I can add or remove photos
  - **And** when I save, the item is updated in the database
  - **And** the dashboard reflects the changes immediately (optimistic update)

- **AC 2: Delete Item**
  - **Given** I want to delete an item
  - **When** I click "Delete"
  - **Then** a confirmation modal appears
  - **And** when I confirm, the item is soft-deleted (status = 'deleted')
  - **And** the item is removed from the dashboard view

## Technical Tasks

- **Task 1: Implement Item Editing Functionality**
  - [x] Subtask 1.1: Create API endpoint or Supabase function for updating item details.

  - [x] Subtask 1.2: Integrate API/Supabase function into web app for editing.
  - [x] Subtask 1.3: Pre-fill "Add Item Form" (`/inventory/new`) with existing item data when in edit mode.

  - [x] Subtask 1.4: Enable adding/removing photos during edit.

  - [x] Subtask 1.5: Implement optimistic UI updates for item saving.
  - [x] Subtask 1.6: Write unit/integration tests for item update API/function.
  - [x] Subtask 1.7: Write Playwright E2E test for the edit item flow.

- **Task 2: Implement Item Deletion Functionality**
  - [x] Subtask 2.1: Create API endpoint or Supabase function for soft-deleting an item (update `deleted_at` column).

  - [x] Subtask 2.2: Integrate API/Supabase function into web app for deletion.

  - Subtask 2.3: Implement confirmation modal using `shadcn/ui` Dialog component.

  - [x] Subtask 2.4: Implement optimistic UI updates for item deletion.

  - [x] Subtask 2.5: Write unit/integration tests for item delete API/function.
  - [x] Subtask 2.6: Write Playwright E2E test for the delete item flow.

- **Task 3: Update Inventory Dashboard UI**
  - [x] Subtask 3.1: Add "Edit" action button/menu item to each row in the inventory table.
  - [x] Subtask 3.2: Add "Delete" action button/menu item to each row in the inventory table.
  - [x] Subtask 3.3: Ensure dashboard reflects soft-deleted items by filtering them out of the default view.

## Technical Notes

- Implement soft delete by adding a `deleted_at` column to the `items` table in Supabase, and setting its value on deletion. This allows for data recovery and historical tracking.
- Utilize `shadcn/ui`'s `Dialog` component for the delete confirmation modal, ensuring a consistent user experience.
- Leverage TanStack Query's mutation capabilities for `update` and `delete` operations, including optimistic updates to enhance perceived performance.
- Ensure Row Level Security (RLS) policies on the `items` table prevent users from editing or deleting items they do not own.

### References

- [Architecture Document: Database & Auth, State Management, UI Components, Implementation Patterns, Security](/docs/architecture.md)
- [Epics Document: Epic 3 - Central Inventory Hub](/docs/epics.md)
- [Story 3.3: Inventory Dashboard](/docs/sprint-artifacts/3-3-inventory-dashboard.md)

<!-- Dev Agent Record - DO NOT EDIT BELOW THIS LINE -->
<!-- ----------------------------------------------- -->

### Dev Agent Record

**Completion Notes:**

- Story drafted based on PRD, Epic 3, and Architecture Document.
- Key architectural decisions like Supabase for database, TanStack Query for state management, and shadcn/ui for UI components are incorporated.
- Soft delete approach is explicitly defined.

**Debug Log References:**

- Context File: [/docs/sprint-artifacts/3-4-edit-and-delete-item.context.xml](/docs/sprint-artifacts/3-4-edit-and-delete-item.context.xml)
- None

**File List:**

- New:
  - `/home/optiks/dev/crosslist/docs/sprint-artifacts/3-4-edit-and-delete-item.md`
- Modified:
  - `docs/sprint-artifacts/sprint-status.yaml` (to be updated in next step)
- Deleted:
  - None

**Dev Notes:**

- This story directly builds upon Story 3.3 (Inventory Dashboard) and Story 3.2 (Add Item Form), reusing and extending their components and data hooks.
- Particular attention should be paid to the implementation of optimistic UI updates for a seamless user experience during edit and delete operations.
- The soft delete mechanism should be thoroughly tested to ensure data integrity and proper filtering in the dashboard.
- **Learnings from Previous Story (from Story 3.3 - Inventory Dashboard):** - **Architectural Decisions:** Server-side filtering is better for scalability. - **Technical Notes:** Use `tanstack-react-table` (via shadcn/ui DataTable) for sorting/pagination. Supabase query: `.from('items').select('*, item_images(url)').order('updated_at', { ascending: false })`. Implement optimistic UI updates.
  [Source: /docs/sprint-artifacts/3-3-inventory-dashboard.md]

**Senior Developer Review (AI):**

- Review Outcome: Pending
- Unresolved Action Items: None
- Key Findings: None
- Architectural Concerns: None

**Senior Developer Review -> Action Items:**

- [ ] Item 1
- [ ] Item 2

**Review Follow-ups (AI):**

- [ ] Task 1
- [ ] Task 2

**Story Status:** Draft

<!-- Change Log - DO NOT EDIT ABOVE THIS LINE -->
<!-- ----------------------------------------- -->

### Change Log

- **2025-12-13:** Initial draft created by BMad Master for Story 3.4: Edit & Delete Item.
