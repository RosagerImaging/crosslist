# Story 3.3: Inventory Dashboard

**Status:** Ready for Dev
**Epic:** Epic 3 (Central Inventory Hub)
**Priority:** High
**Estimation:** 5 Points

## User Story
**As a** user,
**I want** to view all my items in a searchable table,
**So that** I can quickly find and manage my inventory.

## Acceptance Criteria

### AC 1: Table View
**Given** I have items in my inventory
**When** I navigate to `/inventory`
**Then** I see a table with columns:
*   Photo (thumbnail)
*   Title
*   SKU
*   Price
*   Condition
*   Status (Active/Sold/Draft)
*   Last Updated
*   Actions (menu)

### AC 2: Search & Filter
**Given** I am on the dashboard
**When** I type in the search bar
**Then** the table updates to show matching Titles or SKUs (debounced).
**And** I can filter by Status (Active, Sold, Draft).

### AC 3: Real-time Updates & Pagination
**Given** the dashboard is open
**When** I add or edit an item in another tab
**Then** the table refreshes automatically (or via manual refresh button if real-time is too costly).
**And** the table supports pagination (showing 10-20 items per page).

## Technical Tasks

1.  **Create Data Hook**: `useInventory` using TanStack Query to fetch from `items` table.
2.  **Build Table Component**: Use `shapcn/ui` Table, specific columns definition.
3.  **Implement Search/Filter**: Client-side filtering (for MVP) or Server-side (Supabase `.ilike()`).
    *   *Decision:* Server-side filtering is better for scalability.
4.  **Create Page**: `app/(dashboard)/inventory/page.tsx`.

## Technical Notes
-   Use `tanstack-react-table` (via shadcn/ui DataTable) for sorting/pagination.
-   Supabase query: `.from('items').select('*, item_images(url)').order('updated_at', { ascending: false })`.
