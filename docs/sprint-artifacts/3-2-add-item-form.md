# Story 3.2: Add Item Form

**Status:** Ready for Dev
**Epic:** Epic 3 (Central Inventory Hub)
**Priority:** High
**Estimation:** 5 Points

## User Story
**As a** user,
**I want** to add a new item with photos and details,
**So that** I can build my inventory.

## Acceptance Criteria

### AC 1: Form Inputs & Validation
**Given** I am on the `/inventory/new` page
**When** I view the form
**Then** I see the following fields:
*   Title (Required, max 80 chars)
*   Price (Required, number > 0)
*   Condition (Required, dropdown: New, Like New, Used, For Parts)
*   SKU (Optional)
*   Description (Optional)
**And** submitting empty required fields shows inline errors.

### AC 2: Image Upload
**Given** I am filling out the form
**When** I drag and drop images or select files
**Then** they are uploaded to Supabase Storage (`user-uploads/{user_id}/`).
**And** I see a preview of the uploaded images.
**And** I can remove an image before submitting.

### AC 3: Successful Submission
**Given** the form is valid with at least one image
**When** I click "Create Item"
**Then** the item is inserted into the `items` table.
**And** image references are inserted into `item_images` table.
**And** I am redirected to the Inventory Dashboard (or item detail view).

## Technical Tasks

1.  **Create Zod Schema**: Define `insertItemSchema` matching database constraints.
2.  **Implement Storage Logic**: Create `useImageUpload` hook for Supabase Storage.
3.  **Build Form Component**: `InventoryForm` using `react-hook-form` + `shadcn/ui`.
4.  **Create Page**: `app/(dashboard)/inventory/new/page.tsx`.
5.  **Wire Up Actions**: Connect form submission to Supabase `insert` calls.

## Technical Notes
-   Use `react-hook-form` with `zodResolver`.
-   Images should be uploaded *before* the item row is created (or in parallel), but we need the `item_id` first?
    -   *Correction:* We can upload images first to a temporary path or just generate a UUID for the item on the client (or let Supabase do it and move images later?).
    -   *Simpler Approach:* Upload images to `user-uploads/{user_id}/temp/` or just flat `user-uploads/{user_id}/{random_id}` and store that URL. The `items` table generation triggers the ID.
    -   *Optimized:* Generate `item_id` (UUID) on the client or in the first step of the transaction to use in the storage path `user-uploads/{user_id}/{item_id}/`.
