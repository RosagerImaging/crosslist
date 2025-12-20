# UX Design to Story Traceability Matrix

**Project:** Crosslist
**Purpose:** Map user stories to UX design elements for clear implementation guidance
**Created:** 2025-12-19
**Version:** 1.0

---

## Document Purpose

This document creates explicit mappings between:
1. **User Stories** (from `docs/epics.md`)
2. **UX Design Elements** (from `docs/ux-design-crosslist.md`)
3. **Components** to implement
4. **Design Tokens** to use

**For Developers:** When starting a story, use this matrix to find exactly which wireframes, flows, and components to implement.

---

## Quick Reference Table

| Story | Epic | UX Sections | Wireframes | Components | Priority |
|-------|------|-------------|------------|------------|----------|
| 1.1-1.4 | Foundation | N/A | N/A | Setup only | ✅ Done |
| 2.1 | Auth | Flow 1, Screens 1-2 | Sign Up, Login | Button, Input, Card | ✅ Done |
| 2.2-2.3 | Auth | Flow 3 (partial) | N/A | Extension only | ✅ Done |
| 3.1 | Inventory | N/A | N/A | Database schema | ✅ Done |
| 3.2 | Inventory | Flow 2, Screen 5 | Add Item Form | Input, Button, Upload | ✅ Done |
| 3.3 | Inventory | Flow 2, Screens 3-4 | Inventory Dashboard | Table, Card, Badge | ✅ Done |
| 3.4 | Inventory | Flow 2, Screen 5 | Edit/Delete | Modal, Button | ✅ Done |
| 4.1 | Crosslisting | N/A | N/A | Backend interface | 🔜 Next |
| 4.2 | Crosslisting | N/A | N/A | Backend adapter | 🔜 Next |
| 4.3 | Crosslisting | N/A | N/A | Backend adapter | 🔜 Next |
| 4.4 | Crosslisting | Flow 3 (state) | N/A | State machine | 🔜 Next |
| 4.5 | Crosslisting | Flow 3, Screens 6-7-9 | Configuration, Progress, Status | Modal, Progress, Card | 🔜 Next |
| 5.1-5.2 | Optimizer | Flow 4, Screen 5 | Photo/Description | AI components | 📅 Future |
| 6.1-6.2 | Analytics | Flow 5, Screen 8 | Analytics Dashboard | Charts, Metrics | 📅 Future |

---

## Epic 1: Foundation & Infrastructure ✅ COMPLETED

### Story 1.1: Project Initialization
- **UX Design Sections:** None (infrastructure)
- **Wireframes:** None
- **Components:** None
- **Design System Setup:**
  - ✅ Tailwind CSS 4 configured
  - ✅ shadcn/ui initialized
  - ✅ Design tokens from `docs/ux-design-crosslist.md#design-tokens`

### Story 1.2: GitHub & Vercel
- **UX Design Sections:** None (infrastructure)
- **Wireframes:** None
- **Implementation:** CI/CD only

### Story 1.3: Supabase Setup
- **UX Design Sections:** None (infrastructure)
- **Wireframes:** None
- **Implementation:** Database setup only

### Story 1.4: Chrome Extension Shell
- **UX Design Sections:** None (extension scaffold)
- **Wireframes:** None
- **Implementation:** Extension infrastructure only

---

## Epic 2: User Authentication & Marketplace Credentials ✅ COMPLETED

### Story 2.1: User Authentication (Supabase Auth)

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-1-user-authentication`
- `docs/ux-design-crosslist.md#screen-1-sign-up-page`
- `docs/ux-design-crosslist.md#screen-2-login-page`
- `docs/ux-design-crosslist.md#sign-up--login-pages` (Accessibility section)

**Wireframes to Implement:**
1. **Screen 1: Sign Up Page**
   - Location: Lines 142-233
   - Mobile layout: 320-767px
   - Desktop layout: 1024px+
   - Components: Form, Inputs, Buttons, Social login

2. **Screen 2: Login Page**
   - Location: Lines 235-319
   - Mobile layout: 320-767px
   - Desktop layout: 1024px+
   - Components: Form, Inputs, Checkbox, Links

**User Flows:**
- **Happy Path - New User:** Lines 48-58
- **Happy Path - Existing User:** Lines 60-66
- **Error Cases:** Lines 74-77

**Components Required:**
- **Button Component** (Lines 1463-1542)
  - Primary variant (Create Account, Sign In)
  - Secondary variant (Continue with Google)
  - States: default, hover, focus, loading

- **Input Component** (Lines 1544-1622)
  - Text input (email)
  - Password input (with show/hide toggle)
  - Error state with validation messages
  - Labels with required indicators

- **Card Component** (Lines 1686-1734)
  - Form container card
  - Shadow: Level 1
  - Max-width: 440px centered

**Design Tokens to Use:**
- Colors: primary, error, neutral-300, neutral-700
- Typography: H1 (32px mobile, 48px desktop), body (16px)
- Spacing: md (16px), lg (24px)
- Border radius: md (8px)
- Shadows: Level 1

**Accessibility Requirements:**
- Keyboard navigation: Tab through all fields
- ARIA labels: `aria-required`, `aria-invalid`, `aria-describedby`
- Focus indicators: 2px primary outline
- Error announcements: `role="alert"`
- Screen reader: Form labeled, errors announced

**Acceptance Criteria Mapping:**
- ✅ Email/password inputs → Screen 1 wireframe
- ✅ Social login (Google) → Secondary button in wireframe
- ✅ Password strength indicator → Input component with live region
- ✅ Error messages → Input error state in wireframe
- ✅ Email verification → Mentioned in flow (lines 55-56)

---

### Story 2.2: Extension Authentication Bridge

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-3-crosslisting-system` (Partial - marketplace connection)
- Lines 398-405 (Extension installation prompt)

**Wireframes to Implement:**
- **Extension Installation Prompt** (referenced in Flow 3)
  - Location: Lines 398-405
  - Modal/banner prompting extension install
  - Not a full wireframe (backend-focused story)

**Components Required:**
- **Modal/Dialog** (Lines 1736-1777)
  - For extension installation prompt
  - Small size variant (400px max-width)
  - Close button, informational content

**Design Tokens to Use:**
- Colors: info (blue), neutral
- Typography: body text
- Spacing: lg (24px) padding

**Acceptance Criteria Mapping:**
- ✅ Extension communicates with web app → Backend only
- ⚠️ Installation prompt → Mentioned in Flow 3, needs detailed wireframe
- ✅ Token storage → Backend only

**Missing UX Elements:**
- 🔴 **Gap Identified:** Extension installation modal needs detailed wireframe
- 🔴 **Gap Identified:** Extension connection status indicator design

---

### Story 2.3: Marketplace Credential Management

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-3-crosslisting-system`
- `docs/ux-design-crosslist.md#screen-6-crosslisting-configuration` (Marketplace cards)

**Wireframes to Implement:**
1. **Marketplace Connection Page** (referenced in Flow 3)
   - Location: Lines 390-397
   - Shows connected/not connected marketplaces
   - "Connect Marketplace" buttons

2. **Marketplace Cards** (in Screen 6)
   - Location: Lines 1044-1103
   - Shows connection status
   - Connect/Customize buttons

**User Flows:**
- **First Time Setup:** Lines 390-407
- **Connection flow:** Lines 401-407

**Components Required:**
- **Card Component** - Marketplace variant (Lines 1686-1734)
  - Checkbox for selection
  - Logo (32px)
  - Status badge
  - Action buttons

- **Badge Component** (Lines 1869-1918)
  - Success variant: "Connected ✓"
  - Neutral variant: "Not connected"

**Design Tokens to Use:**
- Colors: success (green), neutral
- Typography: H3 (20px), body (16px)
- Spacing: lg (24px) card padding
- Border radius: lg (12px)

**Acceptance Criteria Mapping:**
- ✅ Store credentials securely → Backend only
- ✅ Connect marketplaces UI → Marketplace cards in Screen 6
- ✅ Connection status → Badge component shown in wireframe
- ✅ Manage credentials → "Customize" button in marketplace card

**Missing UX Elements:**
- 🟡 **Enhancement Needed:** Detailed "Marketplace Connection Page" wireframe (currently only referenced in flow)

---

## Epic 3: Inventory Management Hub ✅ COMPLETED

### Story 3.1: Inventory Database Schema

**UX Design Sections:** None (database only)
**Wireframes:** None
**Implementation:** Backend schema only

---

### Story 3.2: Add Item Form

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-2-inventory-management`
- `docs/ux-design-crosslist.md#screen-5-add-item-form`

**Wireframes to Implement:**
1. **Screen 5: Add Item Form**
   - Location: Lines 639-779
   - Desktop: Two-column layout (photo upload left, details right)
   - Mobile: Single column, stacked
   - All form fields specified

**User Flows:**
- **Add New Item:** Lines 150-163

**Components Required:**
- **Input Component** (Lines 1544-1622)
  - Text input: Title (required, 80 char max)
  - Textarea: Description (1000 char max, auto-expand)
  - Number input: Price (required, $0.01 min)
  - Select: Condition (required dropdown)
  - Select: Category (searchable dropdown)

- **Photo Upload Component** (Custom)
  - Dotted border container (2px dashed, neutral-300)
  - Drag & drop enabled
  - 10 image max, 10MB per file
  - 80px × 80px thumbnails
  - Delete overlay on hover
  - Wireframe: Lines 682-699

- **Tags Input Component** (Custom)
  - Multi-input with chips
  - Max 10 tags
  - Add/remove functionality
  - Wireframe: Lines 760-764

- **Button Component** (Lines 1463-1542)
  - Cancel: Secondary variant
  - Save as Draft: Secondary variant
  - Publish: Primary variant

**Design Tokens to Use:**
- Colors: primary, error, neutral-300, neutral-50
- Typography: H1 (32px), labels (14px, 600 weight), body (16px)
- Spacing: lg (24px) between fields, md (16px) padding
- Border radius: md (8px)

**Accessibility Requirements:**
- All inputs have `<label>` elements
- Required fields: `aria-required="true"` + asterisk
- Character counters: `aria-live="polite"`
- Photo upload: `aria-label="Upload product photo"`
- Validation: `aria-invalid`, `aria-describedby`

**Acceptance Criteria Mapping:**
- ✅ Form fields: Title, Description, Price, Condition, Category → All in wireframe (lines 707-764)
- ✅ Photo upload (up to 10) → Photo upload component (lines 682-699)
- ✅ Tags/keywords → Tags input (lines 760-764)
- ✅ Save as draft → "Save as Draft" button (lines 773-775)
- ✅ Character limits/validation → Input component error states (lines 1606-1615)

---

### Story 3.3: Inventory Dashboard

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-2-inventory-management`
- `docs/ux-design-crosslist.md#screen-3-inventory-dashboard-empty-state`
- `docs/ux-design-crosslist.md#screen-4-inventory-dashboard-with-data`

**Wireframes to Implement:**
1. **Screen 3: Inventory Dashboard (Empty State)**
   - Location: Lines 321-378
   - Desktop: Sidebar + centered empty state
   - Mobile: Stacked layout
   - CTA buttons for first item

2. **Screen 4: Inventory Dashboard (With Data)**
   - Location: Lines 380-576
   - Desktop: Sidebar + data table
   - Mobile: Card-based layout
   - Search, filter, sort controls

**User Flows:**
- **View Inventory:** Implicit in flow
- **Search/Filter:** Lines 202-209

**Components Required:**
- **Navigation Sidebar** (Custom)
  - Width: 240px (desktop only)
  - Filter sections: All, Active, Sold, Draft
  - Marketplace filters
  - Wireframe: Lines 337-345, 391-399

- **Data Table Component** (Lines 1779-1858)
  - Columns: Checkbox, Image, Title, Price, Status, Actions
  - Sortable headers
  - Zebra striping optional
  - Row actions menu (⋮)
  - Wireframe: Lines 452-476

- **Card Component** - Inventory variant (Mobile)
  - Image: 16:9 aspect
  - Title, price, status
  - View button + actions menu
  - Wireframe: Lines 515-535

- **Badge Component** (Lines 1869-1918)
  - Active: Green
  - Sold: Neutral
  - Draft: Yellow
  - Wireframe: Lines 498-507

- **Empty State** (Custom)
  - Icon: 120px, neutral-300
  - Heading + body text
  - Primary CTA button
  - Wireframe: Lines 357-374

**Design Tokens to Use:**
- Colors: success, neutral-50, neutral-200, neutral-700
- Typography: H1 (32px), H2 (24px), body (16px), small (14px)
- Spacing: lg (24px), md (16px), sm (8px)
- Shadows: Level 1 (cards)

**Accessibility Requirements:**
- Table: `<table>` with `<th scope="col">`
- Row headers: Item title as `<th scope="row">`
- Sortable: `aria-sort` attributes
- Checkboxes: `aria-label="Select [item name]"`
- Action menu: `aria-haspopup`, `aria-expanded`
- Keyboard: Tab, Arrow keys, Enter, Space

**Acceptance Criteria Mapping:**
- ✅ View all items → Table in Screen 4 (lines 452-476)
- ✅ Search by title/SKU → Search input (lines 421-422)
- ✅ Filter by status → Sidebar filters (lines 391-399)
- ✅ Filter by marketplace → Sidebar marketplace section (lines 400-401)
- ✅ Pagination/infinite scroll → Pagination component (lines 538-541)
- ✅ Real-time updates → Backend only, UI reflects changes

---

### Story 3.4: Edit & Delete Item

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-2-inventory-management`
- `docs/ux-design-crosslist.md#screen-5-add-item-form` (reused for edit)

**Wireframes to Implement:**
1. **Edit Item Flow** (Uses Add Item Form)
   - Location: Lines 165-178
   - Same wireframe as Screen 5, pre-filled with data
   - Modal or page, based on implementation choice

2. **Delete Confirmation Modal** (Referenced, not detailed)
   - User flow: Lines 180-190
   - Modal with warning, confirm/cancel buttons
   - Uses Modal component (lines 1736-1777)

**User Flows:**
- **Edit Existing Item:** Lines 165-178
- **Delete Item:** Lines 180-190

**Components Required:**
- **Add Item Form** (Reused) - All components from Story 3.2
  - Pre-filled with existing item data
  - Same validation

- **Modal/Dialog Component** (Lines 1736-1777)
  - Small variant for delete confirmation
  - Destructive action styling
  - Structure:
    - Header: "Delete Item?"
    - Body: Warning message
    - Footer: Cancel (secondary) + Delete (destructive)

**Design Tokens to Use:**
- Colors: error (red) for destructive button
- Same as Story 3.2 for form

**Accessibility Requirements:**
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Focus trap: Tab cycles within modal
- Escape: Closes modal
- Delete button: Clear `aria-label="Delete [item name]"`

**Acceptance Criteria Mapping:**
- ✅ Edit button opens form → Action menu in table (line 471)
- ✅ Pre-filled form → Add Item Form reused (lines 639-779)
- ✅ Update item → Save button action
- ✅ Optimistic update → Backend/TanStack Query
- ✅ Delete button → Action menu in table (line 471)
- ✅ Confirmation modal → Modal component (lines 1736-1777)
- ✅ Soft delete → Backend only

**Missing UX Elements:**
- 🟡 **Enhancement Needed:** Detailed delete confirmation modal wireframe

---

## Epic 4: The Crosslisting Agent 🔜 NEXT

### Story 4.1: Marketplace Adapter Interface

**UX Design Sections:** None (backend TypeScript interface)
**Wireframes:** None
**Components:** None
**Implementation:** Backend only - no UI

---

### Story 4.2: eBay Adapter (Strict API Compliance)

**UX Design Sections:** None (backend adapter)
**Wireframes:** None
**Components:** None
**Implementation:** Backend only - no UI

---

### Story 4.3: Poshmark Adapter & Humanizer Layer

**UX Design Sections:** None (backend adapter)
**Wireframes:** None
**Components:** None
**Implementation:** Backend only - no UI

---

### Story 4.4: Crosslisting State Machine (XState)

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-3-crosslisting-system` (State transitions)

**Wireframes:** None (backend state machine)
**Components:** None (state logic only)

**User Flow Integration:**
- State machine powers Flow 3 (lines 208-284)
- States align with UI progress screens

**State to UI Mapping:**
- `idle` → Configuration screen
- `validating` → Loading state
- `uploading_photos` → Progress: "Uploading photos..."
- `filling_form` → Progress: "Creating listing..."
- `submitting` → Progress: "Publishing..."
- `success` → Success screen
- `error` → Error state with retry

**Implementation:** Backend state machine, but UI reflects these states in Screen 7 (Progress)

---

### Story 4.5: Crosslisting UI ⭐ PRIMARY UI STORY FOR EPIC 4

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-3-crosslisting-system` (ENTIRE FLOW)
- `docs/ux-design-crosslist.md#screen-6-crosslisting-configuration`
- `docs/ux-design-crosslist.md#screen-7-crosslisting-progress`
- `docs/ux-design-crosslist.md#screen-9-multi-marketplace-status-dashboard`

**Wireframes to Implement:**

1. **Screen 6: Crosslisting Configuration**
   - Location: Lines 781-855
   - Desktop: Two-column (original item left, marketplaces right)
   - Mobile: Stacked
   - Marketplace cards with checkboxes
   - Options checkboxes
   - Preview + Start buttons

2. **Screen 7: Crosslisting Progress**
   - Location: Lines 857-951
   - Real-time progress per marketplace
   - Progress bars (0-100%)
   - Status indicators: Queue, In Progress, Success, Error
   - Retry buttons for failures
   - Completion summary

3. **Screen 9: Multi-Marketplace Status Dashboard**
   - Location: Lines 953-1040
   - Post-crosslisting view
   - Status cards per marketplace
   - External listing links
   - Activity timeline
   - Platform-specific stats (views, watchers, likes)

**User Flows:**
- **First Time Setup:** Lines 390-407 (marketplace connection)
- **Crosslist Single Item:** Lines 409-426
- **Bulk Crosslist:** Lines 428-442

**Components Required:**

- **Marketplace Selection Card** (Custom, spec in wireframe)
  - Checkbox: 24px, top left
  - Logo: 32px
  - Connection status: Badge component
  - "Customize" button: Expands settings
  - Wireframe: Lines 805-855

- **Original Item Preview Card** (Custom)
  - Image preview
  - Title, price, condition
  - Current marketplace status
  - Wireframe: Lines 790-803

- **Progress Card** (Custom)
  - Per marketplace
  - Status indicator: Queue/In Progress/Success/Error
  - Progress bar component
  - Real-time status text
  - Action buttons (Retry on error)
  - Wireframe: Lines 876-927

- **Progress Bar Component** (Custom)
  - Height: 8px
  - Background: neutral-200
  - Fill: primary color
  - Animated transitions
  - Spec: Lines 928-933

- **Status Badge** (Uses Badge Component)
  - Queue: Clock icon, gray
  - In Progress: Spinner, blue
  - Success: Checkmark, green
  - Error: X icon, red
  - Spec: Lines 935-939

- **Modal/Dialog Component** (Lines 1736-1777)
  - Medium variant for configuration
  - Large variant for progress view
  - Footer buttons: Cancel, Preview, Start

- **Activity Timeline** (Custom)
  - Chronological event list
  - Icons: Filled (completed), Outline (pending)
  - Timestamps + event descriptions
  - Wireframe: Lines 1033-1038

**Design Tokens to Use:**
- Colors: primary, success, warning, error, neutral
- Typography: H2 (24px), body (16px), small (14px)
- Spacing: lg (24px), md (16px)
- Border radius: lg (12px) for cards
- Shadows: Level 2 (cards), Level 3 (modal)

**Accessibility Requirements:**
- Checkboxes: `aria-label="Crosslist to [marketplace]"`
- Progress bars: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Live regions: `aria-live="polite"` for status updates
- Completion announcements: `role="alert"` for errors
- External links: `aria-label="View listing on [marketplace]"` + external icon

**Acceptance Criteria Mapping:**
- ✅ Select items (checkboxes) → Inventory table checkboxes (Story 3.3)
- ✅ "Crosslist" button appears → Conditional button in header
- ✅ Modal with selected items → Screen 6 (lines 790-803)
- ✅ Marketplace checkboxes → Marketplace cards (lines 805-855)
- ✅ Start crosslisting → "Start Crosslisting" button (line 853)
- ✅ Progress bar per item → Progress cards (lines 876-927)
- ✅ Real-time status → `aria-live` regions (lines 935-939)
- ✅ Pause/cancel → User flow mentions this, needs button wireframe
- ✅ Completion summary → Success state (lines 895-927)
- ✅ Marketplace icons on items → Badge/icon in inventory table

**Missing UX Elements:**
- 🟡 **Enhancement Needed:** Pause/Cancel buttons in progress screen (mentioned in acceptance criteria but not in wireframe)
- 🟡 **Enhancement Needed:** Marketplace icons in inventory table to show where items are listed

---

## Epic 5: Listing Optimizer 📅 FUTURE

### Story 5.1: Background Removal Service

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-4-listing-optimizer`
- `docs/ux-design-crosslist.md#screen-5-add-item-form` (Photo optimization section)

**Wireframes to Implement:**
1. **Photo Background Removal Interface** (In Add Item Form)
   - Location: Flow 4, lines 286-302
   - Referenced in Screen 5 (lines 721-723)
   - "Remove Background" button below photo upload
   - Side-by-side preview (original vs. optimized)
   - Accept/reject buttons

**User Flows:**
- **Photo Background Removal:** Lines 286-302

**Components Required:**
- **AI Processing Modal** (Custom)
  - Loading state with spinner
  - "Processing..." message
  - ~2-3 second duration

- **Preview Comparison** (Custom)
  - Two-column: Original | Optimized
  - Labels for each
  - Accept ("Use Optimized") button
  - Reject ("Keep Original") button

- **Button Component** - AI variant
  - Icon: Sparkle/magic wand
  - Text: "Remove Background"
  - Secondary style
  - Wireframe reference: Lines 721-723

**Design Tokens to Use:**
- Colors: primary (AI actions), neutral
- Typography: body (16px)
- Spacing: md (16px)

**Acceptance Criteria Mapping:**
- ✅ Upload photo → Photo upload in Story 3.2
- ✅ "Remove Background" button → Referenced in wireframe (line 721)
- ✅ AI processing → Loading modal (referenced in flow)
- ✅ Preview side-by-side → Flow describes this (lines 295-298)
- ✅ Accept/reject → Buttons in flow (line 298)

**Missing UX Elements:**
- 🔴 **Gap Identified:** Detailed wireframe for side-by-side preview comparison
- 🔴 **Gap Identified:** AI processing loading state modal

---

### Story 5.2: AI Description Generator

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-4-listing-optimizer`
- `docs/ux-design-crosslist.md#screen-5-add-item-form` (Description section)

**Wireframes to Implement:**
1. **AI Description Generation Interface** (In Add Item Form)
   - Location: Flow 4, lines 304-326
   - "Generate Description" button near description field
   - Loading state during generation
   - Preview of generated text
   - Inline editing capability
   - Accept/regenerate buttons

**User Flows:**
- **AI Description Generation:** Lines 304-326

**Components Required:**
- **Description Field with AI** (Enhanced Input)
  - Standard textarea from Story 3.2
  - Plus: "Generate Description" button
  - Loading state overlay
  - Character counter

- **AI Preview Modal** (Custom)
  - Generated description preview
  - Editable text area
  - Buttons: "Try Again" (regenerate), "Use This Description"
  - Character count

**Design Tokens to Use:**
- Colors: primary, neutral
- Typography: body (16px)
- Spacing: md (16px)

**Accessibility Requirements:**
- Loading: `aria-busy="true"`, `aria-live="polite"` announcement
- Preview: Focus moves to editable text
- Regenerate: Clear label "Generate new description"

**Acceptance Criteria Mapping:**
- ✅ Enter basic details → Title, category in form (Story 3.2)
- ✅ "Generate Description" button → Referenced in flow (line 307)
- ✅ AI processing → Loading state (lines 308-309)
- ✅ Preview generated text → Preview modal (lines 310-312)
- ✅ Edit inline → Editable textarea in preview
- ✅ "Use This Description" → Button in flow (line 313)

**Missing UX Elements:**
- 🔴 **Gap Identified:** Detailed wireframe for AI description preview/edit modal
- 🔴 **Gap Identified:** "Generate Description" button placement in form

---

## Epic 6: Analytics & Basic Sales Tracking 📅 FUTURE

### Story 6.1: Mark Item as Sold

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-5-analytics--sales-tracking`
- Referenced in Screen 4 (Inventory Dashboard actions)

**Wireframes to Implement:**
1. **Mark as Sold Dialog** (Referenced in Flow 5)
   - Location: Lines 345-358
   - Modal with sale details form
   - Fields: Sale price, marketplace, date
   - Confirm/cancel buttons

**User Flows:**
- **Mark Item as Sold:** Lines 345-358

**Components Required:**
- **Modal/Dialog Component** (Lines 1736-1777)
  - Small variant
  - Form inside modal

- **Input Components**
  - Number input: Sale price
  - Select: Marketplace (dropdown)
  - Date input: Sale date (default today)

- **Button Component**
  - Cancel: Secondary
  - Confirm Sale: Primary

**Design Tokens to Use:**
- Colors: primary, neutral
- Typography: H2 (24px), body (16px)
- Spacing: lg (24px)

**Accessibility Requirements:**
- Modal: `role="dialog"`, `aria-modal="true"`
- Form: Proper labels
- Focus: Auto-focus on first field

**Acceptance Criteria Mapping:**
- ✅ "Mark as Sold" button → Action menu in inventory table
- ✅ Dialog with fields → Modal wireframe (lines 345-358)
- ✅ Sale price input → Number input
- ✅ Marketplace select → Dropdown
- ✅ Sale date → Date input (auto-filled)
- ✅ Confirm button → Primary button
- ✅ Item status updated → Backend + UI refresh

**Missing UX Elements:**
- 🟡 **Enhancement Needed:** Detailed wireframe for "Mark as Sold" dialog

---

### Story 6.2: Analytics Dashboard

**UX Design Sections:**
- `docs/ux-design-crosslist.md#flow-5-analytics--sales-tracking`
- `docs/ux-design-crosslist.md#screen-8-analytics-dashboard`

**Wireframes to Implement:**
1. **Screen 8: Analytics Dashboard**
   - Location: Lines 781-855
   - Metric cards (4 KPIs)
   - Sales chart (line graph)
   - Marketplace breakdown (bar chart)
   - Top performing items (ranked list)

**User Flows:**
- **View Analytics Dashboard:** Lines 330-343

**Components Required:**

- **Metric Card** (Custom)
  - Size: 200px × 140px
  - Icon: 32px, top
  - Value: 32px, 700 weight, center
  - Label: 14px, uppercase, neutral-500
  - Change indicator: Arrow + percentage (green/red)
  - Wireframe: Lines 801-829

- **Line Chart Component** (Custom or library)
  - Height: 300px
  - X-axis: Time period
  - Y-axis: Sales amount
  - Line: 2px, primary color
  - Data points: 8px circles
  - Hover tooltips
  - Wireframe: Lines 831-849

- **Time Range Selector** (Custom)
  - Buttons: 7D, 30D, 90D
  - Active: Primary background
  - Inactive: Secondary style
  - Wireframe: Line 833

- **Bar Chart Component** (Custom or library)
  - Horizontal bars
  - Colored by marketplace
  - Labels: Name, amount, percentage
  - Hover: Highlight
  - Wireframe: Lines 851-863

- **Ordered List** (Custom)
  - Rank number
  - Item name
  - Sale amount
  - Hover: Highlight
  - Click: Navigate to item
  - Wireframe: Lines 865-873

**Design Tokens to Use:**
- Colors: primary, success, error, neutral
- Typography: H1 (32px), H2 (24px), body (16px), small (14px)
- Spacing: lg (24px), xl (32px)
- Border radius: lg (12px) for cards
- Shadows: Level 1 for cards

**Accessibility Requirements:**
- Charts: `<figure>` with `<figcaption>`
- Alternative: Data table for screen readers
- Tooltips: `aria-describedby`
- Keyboard: Navigate chart with arrow keys
- Focus: Visible indicators on data points

**Acceptance Criteria Mapping:**
- ✅ View key metrics → Metric cards (lines 801-829)
- ✅ Total sales, active items, avg price, sold items → 4 cards in wireframe
- ✅ Sales chart → Line chart (lines 831-849)
- ✅ Marketplace breakdown → Bar chart (lines 851-863)
- ✅ Top performing items → Ordered list (lines 865-873)
- ✅ Filter by date → Time range selector (line 833)
- ✅ Export functionality → "Export" button mentioned but not detailed

**Missing UX Elements:**
- 🟡 **Enhancement Needed:** Export button functionality/modal wireframe
- 🟡 **Enhancement Needed:** Filter controls wireframe

---

## Gap Analysis Summary

### Critical Gaps (Block Implementation) 🔴

1. **Story 2.2 - Extension Authentication**
   - Missing: Extension installation modal detailed wireframe
   - Missing: Extension connection status indicator

2. **Story 5.1 - Background Removal**
   - Missing: Side-by-side preview comparison wireframe
   - Missing: AI processing loading modal wireframe

3. **Story 5.2 - AI Description Generator**
   - Missing: AI description preview/edit modal wireframe
   - Missing: "Generate Description" button placement specification

### Enhancement Gaps (Improve UX) 🟡

1. **Story 2.3 - Marketplace Credentials**
   - Enhancement: Detailed standalone "Marketplace Connection Page"

2. **Story 3.4 - Edit & Delete**
   - Enhancement: Detailed delete confirmation modal

3. **Story 4.5 - Crosslisting UI**
   - Enhancement: Pause/Cancel button wireframes
   - Enhancement: Marketplace icons in inventory table

4. **Story 6.1 - Mark as Sold**
   - Enhancement: Detailed "Mark as Sold" dialog wireframe

5. **Story 6.2 - Analytics**
   - Enhancement: Export functionality wireframe
   - Enhancement: Advanced filter controls

### No Gaps (Ready for Implementation) ✅

- ✅ Story 2.1: User Authentication - COMPLETE
- ✅ Story 3.2: Add Item Form - COMPLETE
- ✅ Story 3.3: Inventory Dashboard - COMPLETE
- ✅ Story 4.1-4.4: Backend stories - No UI needed
- ✅ Story 4.5: Crosslisting UI - COMPLETE (with minor enhancements)

---

## Developer Quick Start Guide

### For Story 4.5 (Next Implementation)

**Step 1: Review Design Materials**
1. Read user flows: `docs/ux-design-crosslist.md` lines 208-284 (Flow 3)
2. Study wireframes:
   - Screen 6 (Configuration): lines 781-855
   - Screen 7 (Progress): lines 857-951
   - Screen 9 (Status): lines 953-1040
3. Review components: lines 1463-1858

**Step 2: Identify Components to Build**
- [ ] Marketplace Selection Card (custom - lines 805-855)
- [ ] Original Item Preview Card (custom - lines 790-803)
- [ ] Progress Card (custom - lines 876-927)
- [ ] Progress Bar (custom - lines 928-933)
- [ ] Status Badge (use Badge component - lines 1869-1918)
- [ ] Activity Timeline (custom - lines 1033-1038)
- [ ] Modal/Dialog (use existing - lines 1736-1777)

**Step 3: Set Up Design Tokens**
Use Tailwind config from lines 2157-2242:
```tsx
// Example usage
<div className="bg-primary text-white rounded-lg p-lg">
  Crosslist to eBay
</div>
```

**Step 4: Implement in Order**
1. **Day 1-2:** Configuration screen (Screen 6)
   - Marketplace cards
   - Options checkboxes
   - Preview/Start buttons

2. **Day 3-4:** Progress screen (Screen 7)
   - Progress cards per marketplace
   - Real-time updates (WebSocket/polling)
   - Error handling with retry

3. **Day 5:** Status dashboard (Screen 9)
   - Status cards
   - Activity timeline
   - External links

**Step 5: Test Accessibility**
- Keyboard navigation (Tab, Enter, Space, Escape)
- Screen reader (NVDA/JAWS)
- Color contrast (Axe DevTools)
- Focus indicators visible

**Step 6: Review Acceptance Criteria**
Check off each criterion from Epic 4.5 (lines 595-625 in `epics.md`)

---

## Maintenance

**This Document Should Be Updated When:**
- New stories are added to epics
- Wireframes are added/modified
- Gaps are filled
- Components are implemented

**Version History:**
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-19 | 1.0 | Initial traceability matrix | UX Designer |

---

**Document Status:** ✅ Complete and Ready for Use

This matrix will be maintained throughout development to ensure design-development alignment.
