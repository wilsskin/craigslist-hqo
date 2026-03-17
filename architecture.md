# Craigslist Homepage Prototype — Architecture

This document gives an engineer with no prior context enough to understand the project’s goal, hierarchy, structure, and important conventions. It pulls from the existing spec and design docs and summarizes the current implementation.

---

## Goal and scope

**What this is:** A single-page prototype that recreates the Craigslist homepage with a clearer visual hierarchy and multi-city location selection. It is a **front-end only** prototype: no backend, no routing, no network calls. All behavior is client-side and synchronous.

**Design intent (from `design_system.md`):** Modernize Craigslist by improving readability and interaction clarity while keeping the layout recognizable. Design adjectives: **utilitarian**, **trustworthy**, **fast**. Avoid “marketplace modern” visuals (heavy cards, large imagery, glossy gradients). Use the design system for all tokens (colors, typography, spacing, motion).

**Out of scope:** Backend, database, real Craigslist routing or new pages, real search results pages, map API integration.

---

## Tech stack

- **React 19** with **TypeScript**
- **Vite** for build and dev
- **Tailwind CSS v4** for styling
- **shadcn** (Radix-based) for Dialog, Input, Button, and primitives
- **lucide-react** for icons
- **Vitest** + **React Testing Library** for tests

---

## Documentation reference

| File | Purpose |
|------|--------|
| **design_system.md** | Source of truth for colors, typography, spacing, radius, motion, and component specs. All UI must align with it. |
| **cursor_implementation_spec.md** | Full implementation spec: state model, layout contract, header/left rail/main content, location label rules, search behavior, LocationModal, data fixtures, acceptance criteria, sprint history. |
| **sprint9_redesign.md** | Spec for the centered layout, CombinedSearchBar, CategoryTabBar, and IconGrid (replacing the old left rail + section blocks). |
| **docs/sprint9_implementation_plan.md** | Phased implementation plan for Sprint 9 (tab mapping, components, refactors). |

---

## Application hierarchy

```
App (src/App.tsx)
  └── HomePage (src/components/home/HomePage.tsx)   ← single route, state owner
        ├── .app-container (768px max-width, 24px padding, from src/index.css)
        │     ├── HeaderShell
        │     ├── CategoryTabBar
        │     └── MainContentShell
        └── LocationModal (portaled, controlled by HomePage)
```

- **Single route:** The app renders `HomePage` only. There is no router.
- **State:** All page-level state lives in **HomePage** and is passed down as props. No global store. Child components are presentational or receive callbacks.
- **Layout:** Everything sits inside `.app-container`: max-width **768px**, centered, 24px horizontal padding. Header, tab bar, and main content are stacked vertically within it.

---

## State (HomePage)

| State | Purpose |
|-------|--------|
| `selectedCities` | Array of selected City (id, name). Default `[{ id: 'city_boston', name: 'Boston' }]`. Max 3. |
| `radiusMiles` | Radius in miles. Default 10. |
| `hasEditedRadius` | If true, location label shows “± N mi”. Default false so bar shows “Boston” until user edits radius. |
| `isLocationModalOpen` | Controls LocationModal open/close. |
| `headerSearchQuery` | Search input value; filters taxonomy in main content. |
| `modalCityQuery` | Search input inside LocationModal. |
| `activeTab` | Current category tab id. Default `'community'`. Tab order: community, services, discussion, housing, for-sale, jobs, gigs. |

`locationLabel` is derived via `computeHeaderLocationLabel(selectedCities, radiusMiles, hasEditedRadius, 160, measureText)` and passed to the header/CombinedSearchBar.

---

## Data flow

- **Taxonomy:** `craigslist_taxonomy.json` (repo root) → `src/data/taxonomy.ts` (validation, exports `taxonomySections`, `leftRailCategories`). Do not modify the JSON.
- **Tab → sections:** `src/data/tabMapping.ts` defines `CATEGORY_TABS` and `TAB_SECTION_MAP` (e.g. `community` → `['community', 'events']`, `jobs` → `['jobs', 'resumes']`). `getItemsForTab(activeTab)` returns a flat list of `{ item, sectionId }` for the active tab.
- **Search:** `headerSearchQuery` filters items per tab via `itemMatchesQuery` from `src/lib/searchTaxonomy.ts`. Empty query shows all items for the tab; non-empty hides non-matching; zero matches show “No results” + “Clear search”.
- **Cities/radius:** `src/data/constants.ts` holds city list and radius options. LocationModal and label logic use these.

---

## Component tree and responsibilities

| Component | Responsibility |
|-----------|-----------------|
| **HeaderShell** | Logo, CombinedSearchBar (search + location), “Post an ad” (pill hover), Star and User icons. Receives `headerSearchQuery`, `onSearchQueryChange`, `locationLabel`, `onLocationClick`, `isLocationModalOpen`. |
| **CombinedSearchBar** | Pill-shaped bar: left zone (search input + clear), 1px divider, right zone (location label), search submit icon. Expand/collapse (276px ↔ 352px), hover layers, focus behavior. See “CombinedSearchBar behavior” below. |
| **CategoryTabBar** | Seven tabs (community … gigs). Underline-style active indicator; active tab drives MainContentShell. Radix Tabs + Framer Motion for sliding underline. |
| **MainContentShell** | Section heading (active tab label) + IconGrid. Uses `getItemsForTab(activeTab)`, filters by `searchQuery` with `itemMatchesQuery`. Empty state when search has no matches. |
| **IconGrid** | 8-column CSS grid of icon cards. Each card: icon (from `getCategoryIconUrl(sectionId, item.id)`), label. Min height 76px; cards grow for two-line labels. Grid uses `alignItems: start` so only two-line cards are taller. |
| **LocationModal** | shadcn Dialog: city search, city list, selected chips, radius select + Reset, Apply. Map placeholder. All changes apply immediately; Apply only closes. |

---

## Layout and container

- **Global container (`.app-container` in `src/index.css`):** `max-width: 768px`, `margin: 0 auto`, `padding: 0 24px`. All sections live inside it.
- **Header:** Full-bleed border; content aligns within the same 768px constraint (HeaderShell content is inside the container).
- **CategoryTabBar:** Full width of container; tabs left-aligned.
- **MainContentShell:** Full width of container; padding top/bottom.

Design system layout tokens (see `design_system.md`): container width 768px, 8-column grid, 16px gap, card/icon column 82px (derived from container and gaps).

---

## CombinedSearchBar behavior (recent work)

The combined search bar is a central UX piece. Summary of current behavior:

- **Expand/collapse:** Default width **276px**; on input focus or location click it expands to **352px** with a 300ms ease-out transition. Search submit icon is hidden when collapsed (width/opacity 0); when expanded it appears (32px circle). Collapse on outside click or Escape; bar stays expanded while LocationModal is open (via `isLocationModalOpen`).
- **Equal-width zones:** CSS Grid with `gridTemplateColumns: minmax(100px, 1fr) 1px minmax(100px, 1fr) auto` so left (search) and right (location) zones are always the same width. Search submit button has `minWidth: 0` when collapsed so it doesn’t steal space.
- **Hover:** Left zone: hover shows #EEEEEE fill from left edge to center (left rounded). Right zone: hover shows #EEEEEE from center to right edge (right rounded). When **expanded**, location hover extends over the search icon area (search icon has higher z-index so it stays on top). Hover layers use a 1px inset (top/left/right -1, bottom 1) so they don’t overhang the bar and they cover the center divider.
- **Search focus:** When the search input is focused, the search-zone hover fill is **not** shown (`isSearchFocused`); it reappears on blur.
- **Search submit icon:** Brand blue (`var(--color-link-default)`), white icon; hover darkens blue (#0019b8).
- **Search zone padding:** Right padding 8px when collapsed; **removed** (0) when bar is expanded so the input area uses full width.

Pure logic used by the bar: `computeHeaderLocationLabel` (from `src/lib/locationLabel.ts`). Filtering uses `itemMatchesQuery` / `filterSectionsByQuery` from `src/lib/searchTaxonomy.ts`.

---

## Key files (non-exhaustive)

| Path | Role |
|------|------|
| `src/App.tsx` | Renders `HomePage`. |
| `src/main.tsx` | Entry; mounts App. |
| `src/index.css` | Global styles, CSS variables (colors, motion), `.app-container`. |
| `src/components/home/HomePage.tsx` | State owner; composes HeaderShell, CategoryTabBar, MainContentShell, LocationModal. |
| `src/components/home/HeaderShell.tsx` | Header layout; embeds CombinedSearchBar and passes `isLocationModalOpen`. |
| `src/components/CombinedSearchBar.tsx` | Search + location bar; expand/collapse, hover, focus, grid layout. |
| `src/components/CategoryTabBar.tsx` | Category tabs; underline active state (Framer Motion). |
| `src/components/home/MainContentShell.tsx` | Tab content; filters items by tab + search; renders IconGrid or empty state. |
| `src/components/IconGrid.tsx` | 8-column grid of icon cards; category icons from assets. |
| `src/components/location/LocationModal.tsx` | Location picker dialog (cities, radius, map placeholder). |
| `src/data/taxonomy.ts` | Loads and validates taxonomy; exports `taxonomySections`, `leftRailCategories`. |
| `src/data/tabMapping.ts` | `CATEGORY_TABS`, `TAB_SECTION_MAP`, `getItemsForTab`. |
| `src/data/types.ts` | Shared types (City, taxonomy types, etc.). |
| `src/data/constants.ts` | Cities list, radius options, defaults. |
| `src/lib/locationLabel.ts` | `computeHeaderLocationLabel`, `createCanvasMeasureText`. |
| `src/lib/searchTaxonomy.ts` | `normalizeQuery`, `itemMatchesQuery`, `filterSectionsByQuery`. |
| `src/utils/categoryIcons.ts` | `getCategoryIconUrl(sectionId, itemId)` for IconGrid. |
| `craigslist_taxonomy.json` | Read-only category/section data. |

---

## Testing

- **Vitest** + **React Testing Library.** Unit tests for `lib/locationLabel` and `lib/searchTaxonomy`; integration tests for HomePage (modal, search, tabs, overflow label via `measureTextOverride`).
- **No E2E** in scope. No backend; all tests are client-side.

---

## Summary of recent changes (session context)

1. **CombinedSearchBar**
   - Expand/collapse (276px ↔ 352px) on focus/click; collapse on outside click or Escape; `isLocationModalOpen` prevents collapse while modal is open.
   - CSS Grid for equal-width left/right zones; search submit button `minWidth: 0` when collapsed.
   - Hover layers for search and location zones (rounded to bar edges); location hover extends over search icon when expanded; search icon given higher z-index.
   - Search zone hover hidden when input is focused (`isSearchFocused`).
   - Search submit icon: brand blue, white icon, darker blue on hover.
   - Search zone right padding removed when expanded.
   - Hover layers inset (bottom 1px) to avoid bottom overhang; center divider covered by hover.
   - Input: `text-box-trim: trim-both` and `text-edge: cap alphabetic` for Open Sans vertical alignment (with type cast for `textEdge`).

2. **CategoryTabBar**
   - Switched to underline-style active state (no pill); Framer Motion sliding underline; tabs left-aligned.

3. **IconGrid**
   - Content-driven height; min-height 76px; grid `alignItems: start` so only two-line cards are taller; equal padding and hover on cards.

4. **Header**
   - “Post an ad” uses pill-shaped hover (rounded, 8px padding) and `transform: translateX(-4px)` for text alignment; `isLocationModalOpen` passed to HeaderShell/CombinedSearchBar.

5. **Global**
   - Container max-width set to **768px** in `src/index.css` and referenced in `design_system.md`.

Use **design_system.md** and **cursor_implementation_spec.md** for detailed tokens, contracts, and acceptance criteria.
