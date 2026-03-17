# Sprint 9 — Layout Redesign: Implementation Plan (Updated)

This plan implements the spec in [sprint9_redesign.md](../sprint9_redesign.md) with the following **confirmed clarifications** applied throughout.

---

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| **LocationModal** | No changes. Keep current API and behavior. Location is only *displayed* in the combined search bar; clicking opens the same modal. Default: Boston only, no "±10 mi" by default → use `hasEditedRadius: false` by default so the bar shows "Boston" until the user edits radius. |
| **IconCard icons** | Use existing category icons (same assets + `getCategoryIconUrl`). When building the flattened list for a tab, keep **section id** with each item so IconGrid can call `getCategoryIconUrl(sectionId, item.id)` for merged tabs (e.g. community + events, jobs + resumes). Icon container remains one column (76px). |
| **Tab order** | **community → services → discussion → housing → for sale → jobs → gigs** (7 tabs in that row). |
| **Default active tab** | **community** — selected and highlighted on page load. |
| **Header height** | Keep the **current** header height. Do not use the spec’s 64px; leave existing padding/layout as-is. |

---

## Phase 1: Design system and data layer (no UI changes)

**1.1 Design system**

- In [design_system.md](../design_system.md), add new layout tokens (do not remove existing tokens):
  - `layout.container.width`: 720px
  - `layout.grid.columns`: 8
  - `layout.grid.gap`: 16px
  - `layout.card.icon`: 76px

**1.2 Tab-to-section mapping**

- Add [src/data/tabMapping.ts](../src/data/tabMapping.ts).
- Define `CATEGORY_TABS` in this order: **community, services, discussion, housing, for-sale, jobs, gigs** (tab ids match section ids where applicable; use `discussion` for tab id, map to section `discussion_forums`).
- Define `TAB_SECTION_MAP`: `community` → `['community', 'events']`; `jobs` → `['jobs', 'resumes']`; `discussion` → `['discussion_forums']`; all others → single section array. Section ids must match [craigslist_taxonomy.json](../craigslist_taxonomy.json).
- Export helper to get items for a tab (and optionally section id per item for icon resolution), e.g. `getItemsForTab(activeTab: string): { item: TaxonomyItem; sectionId: string }[]` using `taxonomySections` and the map.

**Check:** TypeScript build passes.

---

## Phase 2: New components (isolated, minimal wiring)

**2.1 CombinedSearchBar**

- Create [src/components/CombinedSearchBar.tsx](../src/components/CombinedSearchBar.tsx) with spec props.
- Implement: pill container (44px height, 22px radius, #D0D0D0 border, #FAFAFA bg); left zone (Search 18px, input flex-1, placeholder "search anything", clear X when non-empty); vertical divider (1px #EEEEEE, 24px height, 8px margin); right zone (MapPin 16px + location label, max-width 160px, ellipsis, clickable, hover #EEEEEE on zone only, border-radius 0 22px 22px 0); far-right search button (32px circle, #191919 bg, Search 16px white, 6px margin, hover 20% black overlay).
- Wire `searchQuery` / `onSearchChange`, `locationLabel`, `onLocationClick`, `onSearchSubmit` (optional).

**2.2 CategoryTabBar**

- Create [src/components/CategoryTabBar.tsx](../src/components/CategoryTabBar.tsx) with `activeTab` and `onTabChange`.
- Use tab order: **community, services, discussion, housing, for-sale, jobs, gigs** (from tabMapping).
- Full-bleed bar (border-bottom #EEEEEE, 44px height); inner 720px centered, padding 0 24px, flex gap 4px; tab pills (14px Open Sans, 6px 14px padding, 16px radius); inactive #727272, hover #EEEEEE; active #191919 bg, #FFFFFF text, font-weight 500.

**2.3 IconGrid and IconCard**

- Create [src/components/IconGrid.tsx](../src/components/IconGrid.tsx).
- Accept items with section context: e.g. `items: { item: TaxonomyItem; sectionId: string }[]` so each card can call `getCategoryIconUrl(sectionId, item.id)` for the **existing** category icons (same as current SubcategoryCard behavior).
- Grid: `display: grid`, `grid-template-columns: repeat(8, 1fr)`, `gap: 16px`.
- Each cell (IconCard): 76px effective width (1 column), flex column, align center, gap 6px, padding 8px 4px, border 1px #EEEEEE, radius 8px, hover #EEEEEE; **icon**: 32×32 (down from current 64×64 box), use existing icon asset via `getCategoryIconUrl`, same gray filter; label Open Sans 11px, #727272, center, line-height 1.3, break-word, max 2 lines.

**Check:** New components render in isolation; IconGrid shows real icons.

---

## Phase 3: HeaderShell refactor

- In [src/components/home/HeaderShell.tsx](../src/components/home/HeaderShell.tsx):
  - Add 720px inner wrapper: `max-width: 720px`, `margin: 0 auto`, `padding: 0 24px` (or match current horizontal padding). **Do not** set height to 64px; keep current header height (existing py-4 / content height).
  - Remove current search input and standalone location trigger.
  - Render `CombinedSearchBar` with: `searchQuery`, `onSearchChange`, `locationLabel`, `onLocationClick`; optional `onSearchSubmit`.
  - New props: `locationLabel: string`, `onLocationClick: () => void`.
  - Keep logo, "create post" button, Star, User unchanged.

**Check:** Header full-bleed; content in 720px; CombinedSearchBar visible; location click opens modal once HomePage is wired.

---

## Phase 4: MainContentShell refactor

- In [src/components/home/MainContentShell.tsx](../src/components/home/MainContentShell.tsx):
  - Replace props with `activeTab: string`, `searchQuery: string`, `onClearSearch: () => void`.
  - Resolve items for `activeTab` via tabMapping: flattened list **with section id per item** (for IconGrid icon resolution).
  - When `searchQuery` is non-empty, filter that list with `itemMatchesQuery` from [src/lib/searchTaxonomy.ts](../src/lib/searchTaxonomy.ts).
  - Layout: outer `max-width: 720px`, `margin: 0 auto`, `padding: 24px 0`. Section heading: active tab label (e.g. "community"), Times New Roman 24px weight 700, #191919, margin-bottom 16px. Render `IconGrid` with (filtered) items including section ids.
  - Empty state: when filtered list is empty, show "No results" + "Clear search" button.

**Check:** Switching tabs changes content; search filters within tab; empty state works.

---

## Phase 5: HomePage state and layout

- In [src/components/home/HomePage.tsx](../src/components/home/HomePage.tsx):
  - Set **default `hasEditedRadius` to `false`** so the location bar shows "Boston" without "±10 mi" until the user edits radius in the modal.
  - Add `activeTab` state: `useState('community')` (community selected by default).
  - Remove: two-column layout, LeftRailShell and all its props, `scrollToSection`, any `leftRailCategories` usage. Keep `modalCityQuery` and all other location/modal state.
  - Compute `locationLabel` with `computeHeaderLocationLabel(..., 160, measureText)`.
  - Render: HeaderShell (with locationLabel, onLocationClick, search props, measureTextOverride), CategoryTabBar (activeTab, onTabChange), MainContentShell (activeTab, searchQuery, onClearSearch), LocationModal with **current** props (open, onOpenChange, setSelectedCities, etc.). Do **not** change LocationModal’s interface.

**Check:** No left rail; 720px centered content; community tab active on load; location in bar opens modal; modal unchanged.

---

## Phase 6: Remove left rail and dead code

- Delete or fully remove [src/components/home/LeftRailShell.tsx](../src/components/home/LeftRailShell.tsx) from the app (remove all imports/usages).
- Remove `leftRailCategories` usage from HomePage. [src/data/taxonomy.ts](../src/data/taxonomy.ts) can still export it for validation if needed.
- Remove [TaxonomySectionBlock.tsx](../src/components/home/TaxonomySectionBlock.tsx) and [SubcategoryCard.tsx](../src/components/home/SubcategoryCard.tsx) from the tree (delete or leave unused; recommendation: delete).

**Check:** Build passes; no references to LeftRailShell or left rail in UI.

---

## Phase 7: Tests and polish

- Update [HomePage.test.tsx](../src/components/home/HomePage.test.tsx): remove left-rail assertions; expect header, category tab bar, main content; default active tab community; search placeholder "search anything"; adjust section/taxonomy tests for single-tab view and tab switching.
- Keep all LocationModal tests passing; do not change LocationModal contract.
- Add tests for CombinedSearchBar (search, clear, location click), CategoryTabBar (tab order, change), MainContentShell/IconGrid (tab + search filter, empty state).
- Run lint, typecheck, build; manual pass for search, location modal, tab switching, empty state, 720px layout.

---

## What stays unchanged

- [craigslist_taxonomy.json](../craigslist_taxonomy.json), [src/data/taxonomy.ts](../src/data/taxonomy.ts)
- [LocationModal](../src/components/location/LocationModal.tsx) — same API and behavior
- [computeHeaderLocationLabel](../src/lib/locationLabel.ts), [filterSectionsByQuery](../src/lib/searchTaxonomy.ts), [itemMatchesQuery](../src/lib/searchTaxonomy.ts)
- City/radius state and modal logic (except default `hasEditedRadius: false`)
- Logo and header CTAs
- Existing design tokens (only new layout tokens added)

---

## Tab and section reference

- **Tab order (UI):** community, services, discussion, housing, for-sale, jobs, gigs.
- **Default active tab:** community.
- **TAB_SECTION_MAP (section ids from JSON):**  
  `community` → `['community', 'events']`;  
  `services` → `['services']`;  
  `discussion` → `['discussion_forums']`;  
  `housing` → `['housing']`;  
  `for-sale` → `['for_sale']`;  
  `jobs` → `['jobs', 'resumes']`;  
  `gigs` → `['gigs']`.
