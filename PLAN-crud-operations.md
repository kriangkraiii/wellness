# PLAN: CRUD Operations for Wellness Platform

This plan outlines the design and step-by-step implementation for adding complete Create, Read, Update, and Delete (CRUD) capabilities across the key list-based pages of the Spa & Wellness Intelligence Platform.

---

## Overview

The current platform successfully displays dashboard pages populated with live database data (Customers, Partners, Suppliers, and Analytics). However, these pages are currently read-only. To make the platform fully operational for spa business owners, we need to add interactive forms to create new records, edit existing ones, and delete outdated profiles directly from the user interface.

---

## User Review Required

> [!IMPORTANT]
> **No Schema Migrations (Safety Option)**:
> Since the database contains existing schema definitions and models without columns like `visits` or `spending` on `CustomerSpaRecord`, we will utilize the `cautions` and `bodyPoints` JSON fields in the database to store and retrieve these extended details. This bypasses the need for dangerous database migrations while maintaining type safety and flexibility.

> [!WARNING]
> **Prisma Cascade Delete**:
> Deleting a Customer record (`CustomerSpaRecord`) will automatically trigger a cascade delete on its associated therapist checks record (`TherapistSpaRecord`), maintaining database referential integrity.

---

## Open Questions

> [!NOTE]
> 1. Should we add a **Saved Menus** section inside the **Signature Menu** page that allows spa operators to save generated AI 5-senses wellness menus to the database (`Offering` model)?
> 2. Should we support a transaction data editor on the **Business Analytics** page to allow owners to log daily sales/cost indexes (`DemandRecord` table) and update charts in real-time?

---

## Success Criteria

1. **Fully Functional Forms**: Modals to Add and Edit records for:
   - Customers (Name, Age, Gender, Nationality, Segment, Visits, Spending, Rating, Comments)
   - Ingredients/Suppliers (Ingredient Name, Category, Market Price, Unit, Supplier Name, MOQ, Contact Details)
   - Partners (Partner Name, Type, Channel, Description, Coverage Area, Score)
2. **Delete Operations**: Row-level or card-level delete action triggers with a confirm dialog to prevent accidental deletion.
3. **Optimistic UI / State Refetching**: The UI automatically updates or re-fetches its state when a change is made.
4. **Bilingual Tooltips & Labels**: Add/Edit/Delete buttons and forms fully match the selected language (TH/EN).
5. **No TypeScript/ESLint Errors**: Zero compilation errors on local build.

---

## Tech Stack & Design System

- **Framework**: Next.js 16.2.9 with App Router.
- **Styling**: Tailwind CSS (following the Soft UI design recommendations: emerald borders, subtle shadows, slate text, `#2D6A4F` primary colors).
- **Icons**: Lucide React.
- **Database client**: Prisma ORM with PostgreSQL.
- **State management**: Client-side React State (`useState`/`useEffect`) for list data.

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   │   ├── route.ts            # Support GET (Read), POST (Create), PUT (Update), DELETE (Delete)
│   │   │   ├── suppliers/
│   │   │   │   ├── route.ts            # Support GET (Read), POST (Create), PUT (Update), DELETE (Delete)
│   │   │   └── partners/
│   │   │       ├── route.ts            # Support GET (Read), POST (Create), PUT (Update), DELETE (Delete)
│   └── (dashboard)/
│       └── dashboard/
│           ├── customers/
│           │   └── page.tsx            # Add modals for Add/Edit/Delete
│           ├── suppliers/
│           │   └── page.tsx            # Add modals for Add/Edit/Delete
│           └── partners/
│               └── page.tsx            # Add modals for Add/Edit/Delete
```

---

## Task Breakdown

### 1. Database & Seeding (P0)

- **Task ID**: `DB_SEED_EXTEND`
- **Agent**: `database-architect`
- **Skills**: `database-design`
- **INPUT**: Current `prisma/schema.prisma`
- **OUTPUT**: Seed script updated in `prisma/seed.ts` or route fallback logic to write rich data format (e.g. JSON in cautions)
- **VERIFY**: Read `prisma/seed.ts` and inspect database entries

---

### 2. API Endpoints Upgrades (P1)

- **Task ID**: `API_CUSTOMERS_CRUD`
- **Agent**: `backend-specialist`
- **Skills**: `api-endpoint-builder`
- **INPUT**: `src/app/api/dashboard/customers/route.ts`
- **OUTPUT**: Supports GET (list all), POST (create new record), PUT (update record), DELETE (delete record)
- **VERIFY**: Test request with mock payloads using curl / test script

- **Task ID**: `API_SUPPLIERS_CRUD`
- **Agent**: `backend-specialist`
- **Skills**: `api-endpoint-builder`
- **INPUT**: `src/app/api/dashboard/suppliers/route.ts`
- **OUTPUT**: Supports GET (list all), POST (create ingredient), PUT (update ingredient), DELETE (delete ingredient)
- **VERIFY**: Test API output format

- **Task ID**: `API_PARTNERS_CRUD`
- **Agent**: `backend-specialist`
- **Skills**: `api-endpoint-builder`
- **INPUT**: `src/app/api/dashboard/partners/route.ts`
- **OUTPUT**: Supports GET (list all), POST (create partner), PUT (update partner), DELETE (delete partner)
- **VERIFY**: Test API output format

---

### 3. UI Component Modals & Integrations (P2)

- **Task ID**: `UI_CUSTOMERS_MODALS`
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **INPUT**: `src/app/(dashboard)/dashboard/customers/page.tsx`
- **OUTPUT**: Add form modal with validation, Edit prefilled form, Delete confirm dialog, and dynamic API requests
- **VERIFY**: Verify clicking add/edit/delete triggers modal transitions and saves data

- **Task ID**: `UI_SUPPLIERS_MODALS`
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **INPUT**: `src/app/(dashboard)/dashboard/suppliers/page.tsx`
- **OUTPUT**: Add/Edit/Delete modals for ingredients/suppliers and state re-fetching
- **VERIFY**: Verify cards edit/delete properly

- **Task ID**: `UI_PARTNERS_MODALS`
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **INPUT**: `src/app/(dashboard)/dashboard/partners/page.tsx`
- **OUTPUT**: Add/Edit/Delete modals for partners and match calculations
- **VERIFY**: Verify match score recalculation and rendering

---

## Phase X: Verification

### Automated Verifications
- Compile & check types:
  ```bash
  npx tsc --noEmit && npm run lint
  ```
- Build production bundle:
  ```bash
  npm run build
  ```

### Manual Verifications
- Open the UI at `http://localhost:3000/dashboard/customers`. Test adding a new customer, editing the customer, and deleting them. Confirm the KPI cards update immediately.
- Open `http://localhost:3000/dashboard/suppliers`. Add/edit/delete suppliers and ingredients, ensuring filters operate on the newly modified datasets.
- Open `http://localhost:3000/dashboard/partners`. Add/edit/delete partners. Verify that the match scores are rendered appropriately.
