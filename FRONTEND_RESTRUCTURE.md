# Frontend Restructure: Page Separation, Routing, and Landing

Date: 2025-10-25
Scope: `technical/frontend/`

## Summary

- Introduced a public landing page and separated features into distinct authenticated pages under an app shell.
- Migrated routing to nested routes using `react-router-dom` with a shared `Layout` and `Outlet`.
- Split the monolithic `Dashboard` into `Overview` (insights + charts) and `DealsList` (filters + grid + create modal).
- Standardized URLs under `/app/*`; added onboarding (`/welcome`), settings, analytics, and a 404.

## New Route Map

- Public:
  - `/` → `Landing`
  - `/login` → `Login`
- Private:
  - `/welcome` → onboarding (first-deal wizard)
  - `/app` → app shell (`Layout` + `Outlet`)
    - `/app/overview` → `Overview` (Insights + Charts)
    - `/app/deals` → `DealsList` (filters + grid + create)
    - `/app/deals/:id` → `DealDetail`
    - `/app/analytics` → `Analytics`
    - `/app/settings` → `Settings`
- Fallback/legacy:
  - `/dashboard` → redirect to `/app/overview`
  - `*` → `NotFound`

## Files Added

- `src/pages/Landing.tsx`: public hero + CTA to login.
- `src/pages/Overview.tsx`: queries deals; renders `InsightsPanel` and `DashboardCharts`.
- `src/pages/DealsList.tsx`: URL-synced `stage` filter via `useSearchParams`; shows grid + `DealForm` modal.
- `src/pages/Analytics.tsx`: renders `DashboardCharts` over deals.
- `src/pages/Settings.tsx`: basic user account info from `useAuth`.
- `src/pages/Welcome.tsx`: onboarding with first-deal wizard; skip to overview.
- `src/pages/NotFound.tsx`: simple 404 with link based on auth state.
- `technical/FRONTEND_RESTRUCTURE.md`: this document.

## Files Updated

- `src/App.tsx`:
  - Added routes for `Landing`, `Login`, `Welcome`, and nested `/app/*` pages.
  - Legacy redirect from `/dashboard` to `/app/overview`.
  - Added `NotFound` catch-all.
- `src/components/layout/Layout.tsx`:
  - Converted to use `Outlet` for nested routes.
  - Added top navigation (Overview, Deals, Analytics, Settings).
- `src/pages/Login.tsx`:
  - Post-auth navigation updated: register → `/welcome`, login → `/app/overview`.
- `src/pages/DealDetail.tsx`:
  - Removed `Layout` wrapper (works under nested layout).
  - Back button to `/app/overview`; delete redirect to `/app/deals`.
  - Removed unused import to fix lint warning.
- `src/components/deals/DealCard.tsx`:
  - Card click navigates to `/app/deals/:id`.
- `src/components/dashboard/InsightsPanel.tsx`:
  - At-risk click navigates to `/app/deals/:id`.
- `src/pages/Dashboard.tsx`:
  - Replaced implementation with redirect to `/app/overview` (backward compatibility, prevents compile mismatch after `Layout` changes).

## Behavior Changes

- Authenticated shell now lives under `/app`. All private pages render within `Layout` via `Outlet`.
- Landing page at `/` for unauthenticated users.
- New onboarding step (`/welcome`) after successful registration to create the first deal (optional, skippable).
- Deals list filter `stage` is persisted in the URL (`?stage=...`).

## Non-Behavioral Notes

- `package.json` already included `react-router-dom` (v7), `@tanstack/react-query`, `zustand`, `axios`. No dependency changes were required.
- `utils/format.ts` unchanged except removal of one unused import from `DealDetail.tsx`.

## Migration Notes

- Any direct links in external docs or bookmarks to `/dashboard` will now redirect to `/app/overview`.
- Existing deep links to `/deals/:id` should be updated to `/app/deals/:id` (internal UI has been updated).
- If onboarding persistence is desired, extend auth payloads to include a `has_onboarded` flag; currently, welcome flow is triggered only after registration in the current session.

## QA Checklist

- Public:
  - `/` renders Landing with CTA to `/login`.
  - `/login` works for both login and registration.
- Post-auth:
  - Registration redirects to `/welcome`; creating a deal or skipping goes to `/app/overview`.
  - Login redirects to `/app/overview`.
- Private navigation under `/app`:
  - Top nav links switch between Overview, Deals, Analytics, Settings.
  - Overview shows `InsightsPanel`; Charts render when deals exist.
  - Deals shows filterable list; modal creates a deal; list refreshes.
  - Deal card click goes to `/app/deals/:id`; back button returns to `/app/overview`.
  - Deleting a deal redirects to `/app/deals`.
- Fallback:
  - Visiting `/dashboard` redirects to `/app/overview`.
  - Unknown path renders `NotFound` with a link back to start.

## Suggested Follow-ups (Optional)

- Add toasts for auth and CRUD results (`react-hot-toast` is present); add a global error boundary.
- Extend `GET /api/deals` to support `page`, `page_size`, `q`, `sort_by`, `sort_dir` for scalable lists.
- Consider lazy-loading `Analytics` and `DealDetail` for faster initial load.
- E2E smoke tests for auth redirects and essential routes.
