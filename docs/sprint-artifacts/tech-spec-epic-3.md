# Epic Technical Specification: Central Inventory Hub

Date: 2025-12-13
Author: Joel
Epic ID: 3
Status: Draft

---

## Overview

The Central Inventory Hub is the core operational dashboard for the Crosslist application. It transitions the product from infrastructure setup (completed in Epic 1 & 2) to delivering primary user value. This epic enables users to manage their entire inventory in a single location, supporting CRUD operations (Create, Read, Update, Delete) for items, along with search, filtering, and image management. The implementation establishes the foundational data structures (`items` schema) that all subsequent AI and automation features will rely on.

## Objectives and Scope

### In-Scope
*   **Database Schema:** Implementation of `items`, `item_images`, and `marketplace_listings` tables in Supabase.
*   **Add Item Workflow:** Comprehensive form with rich text description, price, condition, implementation of drag-and-drop image uploading to Supabase Storage.
*   **Inventory Dashboard:** A searchable, sortable, and filterable data grid to view inventory status using server-side pagination.
*   **Edit Functionality:** Ability to update all item details and modify image order/content.
*   **Delete Functionality:** Implementation of "soft delete" to maintain data integrity for historical reporting.
*   **Real-time Updates:** UI auto-updates when data changes using Supabase Realtime and TanStack Query.

### Out-of-Scope
*   **Crosslisting Automation:** The actual posting to marketplaces (Epic 4).
*   **AI Image/Text Optimization:** Background removal and description generation (Epic 5).
*   **Sales Analytics:** Revenue tracking and reporting (Epic 6).
*   **Bulk Actions:** Bulk edit or delete (deferred to post-MVP).

## System Architecture Alignment

This technical design strictly adheres to the definitions in `docs/architecture.md`:

*   **Frontend:** Built within the Next.js 15 App Router under `app/(dashboard)/inventory/`.
*   **State Management:**
    *   **Server State:** `TanStack Query` (v5) will handle all data fetching, caching, and mutations (`useInventory` hook).
    *   **Client State:** `react-hook-form` used for complex form state management; URL search params for dashboard filter state.
*   **UI Components:** Leveraging `shadcn/ui` (Table, Form, Input, Dialog, Card) and `lucide-react` for consistent aesthetics.
*   **Database:** Direct interaction via Supabase Client with strict Row Level Security (RLS) policies ensuring users only access their own data.
*   **Storage:** Supabase Storage used for hosting product images in a user-scoped bucket structure (`user-uploads/{user_id}/{item_id}/`).

## Detailed Design

### Services and Modules

| Module / Component | Responsibility | Inputs | Outputs | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **Database Migration** | Define SQL schema for inventory | `inventory_schema.sql` | `items`, `item_images`, `marketplace_listings` tables | Backend |
| **`useInventory` Hook** | Encapsulate TanStack Query logic | Filter params, sort options | `data`, `isLoading`, `createItem`, `updateItem` | Frontend |
| **Inventory Form** | Reusable form for Add/Edit | `defaultValues` (optional) | Form submission event | Frontend |
| **Image Uploader** | UI for drag-drop & upload logic | File objects | Uploaded URLs | Frontend |
| **Inventory Table** | Display grid with actions | `items[]` | UI Render, Action Events | Frontend |

### Data Models and Contracts

**Table: `items`**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique Item ID |
| `user_id` | `uuid` | FK `auth.users`, Not Null | Owner |
| `title` | `text` | Not Null | Max 80 chars (eBay limit) |
| `description` | `text` | Nullable | Rich text content |
| `price` | `decimal` | Not Null, Check > 0 | Listing price |
| `sku` | `text` | Unique per User | Stock Keeping Unit |
| `condition` | `enum` | `new`, `like_new`, `used`, `for_parts` | Standardized condition |
| `status` | `enum` | `active`, `sold`, `draft`, `deleted` | Lifecycle status |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |
| `deleted_at` | `timestamptz` | Nullable | For soft deletes |

**Table: `item_images`**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | |
| `item_id` | `uuid` | FK `items` (Cascade Delete) | |
| `url` | `text` | Not Null | Supabase Storage public URL |
| `order` | `int` | Not Null | Display order (0-11) |

**Table: `marketplace_listings`**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | |
| `item_id` | `uuid` | FK `items` | |
| `marketplace` | `enum` | `ebay`, `poshmark`, `mercari` | Target platform |
| `external_id` | `text` | | ID on the remote platform |
| `status` | `enum` | `active`, `sold`, `delisted` | Remote status |

### APIs and Interfaces

Since we use Supabase Client directly, "APIs" are typed function calls.

```typescript
// types/inventory.ts
export type Item = Database['public']['Tables']['items']['Row'];
export type CreateItemDTO = Omit<Item, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

// lib/inventory/actions.ts (or hooks)
function fetchItems(page: number, filters: ItemFilters): Promise<{ data: Item[], count: number }>;
function createItem(item: CreateItemDTO, images: File[]): Promise<Item>;
function updateItem(id: string, updates: Partial<Item>): Promise<Item>;
function softDeleteItem(id: string): Promise<void>;
```

### Workflows and Sequencing

**1. Create Item Workflow**
1.  **User** fills out "Add Item" form.
2.  **User** drags images -> **Frontend** generates previews.
3.  **User** clicks Submit.
4.  **Frontend** uploads images to Supabase Storage in parallel -> receives URLs.
5.  **Frontend** constructs `Item` object with image URLs.
6.  **Frontend** calls `supabase.from('items').insert()`.
7.  **Database** triggers RLS check -> Inserts row.
8.  **Frontend** invalidates `['inventory']` query key.
9.  **User** redirected to Dashboard.

**2. Delete Item Workflow**
1.  **User** clicks Delete -> Confirmation Modal appears.
2.  **User** confirms.
3.  **Frontend** calls `updateItem(id, { status: 'deleted', deleted_at: new Date() })`.
4.  **Frontend** Optimistically updates UI (removes row immediately).
5.  **Database** updates row.

## Non-Functional Requirements

### Performance
*   **Dashboard Load:** < 500ms Time to First Byte (TTFB), < 1.5s Largest Contentful Paint (LCP) for the main grid.
*   **Search:** Debounced search (300ms) should return results within 200ms via indexed database queries.
*   **Image Optimization:** Frontend should request resized images from Supabase Storage (if transformation features enabled) or standard CDN URLs.

### Security
*   **RLS:** Strict policies. `auth.uid() = user_id` for all CRUD operations.
*   **Input Validation:** `zod` schema validation on both client (UX) and server (API/Database constraints).
*   **Storage Access:** Storage bucket policies must restrict upload/delete to the resource owner.

### Reliability/Availability
*   **Offline Handling:** TanStack Query `staleTime` and `gcTime` configured to allow navigating back to previously viewed inventory without re-fetching immediately. Note: Writes require connectivity.

### Observability
*   **Error Logging:** Failed uploads or database transactions logged to console (dev) with actionable error codes.

## Dependencies and Integrations

*   **Supabase Client (`@supabase/supabase-js`):** Core data/auth/storage.
*   **TanStack Query (`@tanstack/react-query`):** Async state management.
*   **React Hook Form (`react-hook-form`):** Form handling.
*   **Zod (`zod`):** Schema validation.
*   **shadcn/ui:** Component primitives.
*   **dnd-kit (optional) or native API:** For image reordering (drag-and-drop).

## Acceptance Criteria (Authoritative)

1.  **Schema Implementation:**
    *   [ ] `items`, `item_images`, `marketplace_listings` tables exist in Supabase.
    *   [ ] RLS policies enable full CRUD for owners and deny all access to others.
    *   [ ] TypeScript types are auto-generated and match the schema.
2.  **Add Item:**
    *   [ ] Form validates required fields (Title, Price).
    *   [ ] Images can be uploaded (min 1, max 12).
    *   [ ] Successful submission creates database record and redirects to dashboard.
3.  **Inventory Dashboard:**
    *   [ ] Lists all "active" items by default.
    *   [ ] Pagination works (e.g., 20 items per page).
    *   [ ] Search by SKU or Title filters the list correctly.
    *   [ ] Sort by Price / Date Created works.
4.  **Edit Item:**
    *   [ ] Existing data pre-fills the form.
    *   [ ] Changing a value and saving updates the database.
    *   [ ] Image order can be changed and saved.
5.  **Delete Item:**
    *   [ ] "Delete" action performs a soft delete (status='deleted').
    *   [ ] Deleted items no longer appear in the default dashboard view.

## Traceability Mapping

| AC ID | Spec Section | Component | Test Idea |
| :--- | :--- | :--- | :--- |
| AC-1 | Data Models | Database | Verify RLS with a second user account (should fail). |
| AC-2 | Workflows | `InventoryForm` | Upload 13 images -> Check validation error. |
| AC-3 | Detailed Design | `InventoryTable` | Add 21 items -> Verify pagination control appears. |
| AC-5 | Workflows | `useInventory` | Delete item -> Query DB directly to ensure row exists but `status='deleted'`. |

## Risks, Assumptions, Open Questions

*   **Assumption:** We will use a simple "Soft Delete" (status column) rather than moving data to an archive table.
*   **Risk:** Image reordering complexity. **Mitigation:** Start with simple "remove and re-add" if drag-and-drop reordering is too complex for MVP.
*   **Open Question:** Do we need to resize images on the client before upload to save bandwidth/storage? **Decision:** Post-MVP optimization. Upload raw for now (up to 5MB limit).

## Test Strategy Summary

*   **Unit Tests (`vitest`):**
    *   Test `zod` schemas for form validation logic.
    *   Test state reducers if using complex state for image uploads.
*   **Integration Tests:**
    *   Test the `useInventory` hook with a mocked Supabase client.
*   **E2E Tests (`playwright`):**
    *   Full flow: Login -> Add Item (with fake image) -> Verify on Dashboard -> Edit Item -> Delete Item -> Verify removed.
