# Sprint 8 — Layout Redesign + Combined Search Bar
## Implementation Spec for Cursor

---

## Overview

This sprint replaces the full-width left-rail layout with a centered 720px container, introduces a horizontal category tab system, and upgrades the header search bar to an Airbnb-style combined search + location component. The left rail is removed entirely. All existing state logic, taxonomy data, location modal internals, and design tokens are preserved unless explicitly overridden below.

---

## 1. Design System Updates

### Container

Replace the current full-width left-rail layout with a centered content container:

```
max-width: 720px
margin: 0 auto
padding: 0 (no horizontal padding — grid handles its own spacing)
```

The header remains full-bleed (edge-to-edge border). Header content aligns to 720px via an inner wrapper.

### Grid System (new)

All icon grid content uses this system:

```
grid-template-columns: repeat(8, 1fr)
gap: 16px
```

Math: 720px container − (7 gaps × 16px = 112px) = 608px ÷ 8 = **76px per column**

Each icon card is one column wide (76px). Labels wrap to two lines if needed.

### Updated Tokens

Add these to the design system. Do not remove existing tokens.

```
layout.container.width: 720px
layout.grid.columns: 8
layout.grid.gap: 16px
layout.card.icon: 76px (1 column)
```

---

## 2. Layout Structure

### Before (Sprint 7)

```
[HeaderShell — full bleed]
[LeftRailShell 240px fixed] + [MainContentShell flex-1]
```

### After (Sprint 8)

```
[HeaderShell — full bleed, content constrained to 720px]
[CategoryTabBar — full bleed, content constrained to 720px]
[MainContentShell — centered 720px container]
```

### Remove

- `LeftRailShell` component entirely
- All left rail state and props (`leftRailCategories`, scroll handlers, category disable logic)
- The two-column row layout in `HomePage`

### Keep

- `LocationModal` — unchanged
- All `selectedCities`, `radiusMiles`, `hasEditedRadius`, `isLocationModalOpen` state
- `headerSearchQuery` state (now used by the combined search bar)
- `computeHeaderLocationLabel` utility — unchanged
- `filterSectionsByQuery` utility — unchanged

---

## 3. HeaderShell Updates

### Layout

Header content (logo, search bar, CTAs) lives inside a centered 720px inner wrapper:

```
<div style="width: 100%; border-bottom: 1px solid #EEEEEE;">
  <div style="max-width: 720px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 16px;">
    [Logo]
    [CombinedSearchBar — flex: 1]
    [CTAs]
  </div>
</div>

Note: height 64px matches the existing header height from Sprint 7. Do not change the header height — verify against the existing HeaderShell implementation before setting.
```

### Remove from HeaderShell

- The standalone location trigger (MapPin + label) — this moves into the combined search bar
- The old search input component — replaced by `CombinedSearchBar`

### Keep in HeaderShell

- Logo image (src/assets/craigslist-logo.png, height 32px, width auto)
- "create post" button (SquarePen icon + text, existing styles)
- Star (favorites) icon with circular hover
- SquareUser (account) icon with circular hover

---

## 4. CombinedSearchBar Component (new)

### Purpose

Replaces the standalone search input. A single unified bar with two interaction zones: search and location. Visually similar to Airbnb's search bar.

### File

`src/components/CombinedSearchBar.tsx`

### Props

```typescript
interface CombinedSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  locationLabel: string
  onLocationClick: () => void
  onSearchSubmit?: () => void
}
```

### Visual Structure

```
[Search icon 18px] [search input — flex:1] [divider] [MapPin 16px + location label] [divider] [Search button — circular icon]
```

Full bar specs:
- Height: 44px
- Border: 1px solid #D0D0D0
- Border-radius: 22px (pill shape — this is the one exception to the 8px rule, intentional for this component)
- Background: #FAFAFA
- Max-width: 100% (fills available header space between logo and CTAs)

### Left zone (search)

- Leading Search icon (18px, color #727272), 12px left padding
- Text input: flex-1, no border, background transparent, font 15px Open Sans
- Placeholder: "search anything"
- Clear button (X icon, 16px) appears when query is non-empty, right side of search zone
- Wired to `searchQuery` / `onSearchChange` props

### Divider

- 1px solid #EEEEEE (color.border.default), height 24px, margin 0 8px

### Right zone (location)

- MapPin icon (16px, color #727272), 8px gap
- Location label text: computed from `locationLabel` prop (e.g. "Boston ±10 mi")
- Font: 15px Open Sans, color #191919
- Max-width: 160px, overflow hidden, white-space nowrap, text-overflow ellipsis
- Entire right zone is a button — clicking fires `onLocationClick`
- Hover: background subtle (#EEEEEE) on the zone only, border-radius 0 22px 22px 0

### Search button (far right)

- Circular button, 32px diameter
- Background: #191919
- Search icon (16px, color #FFFFFF) centered
- 6px margin from right edge of bar
- Hover: black overlay at 20% opacity over #191919 background (matches design system primary button hover rule)
- Clicking fires `onSearchSubmit` if provided

### State wiring in HomePage

Pass these props to `CombinedSearchBar`:
- `searchQuery={headerSearchQuery}`
- `onSearchChange={(v) => setHeaderSearchQuery(v)}`
- `locationLabel={computeHeaderLocationLabel(selectedCities, radiusMiles, hasEditedRadius, 160, measureText)}`
- `onLocationClick={() => setIsLocationModalOpen(true)}`

Note: `maxWidthPx` for location label is now 160 (fits within the right zone), down from 240 in the old left rail trigger.

---

## 5. CategoryTabBar Component (new)

### Purpose

Full-width secondary nav bar below the header. Shows 7 category tabs. Active tab uses a filled dark pill. Clicking a tab updates the active category and renders the corresponding taxonomy section in `MainContentShell`.

### File

`src/components/CategoryTabBar.tsx`

### Props

```typescript
interface CategoryTabBarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}
```

### Tab definitions (hardcoded, not from taxonomy JSON)

```typescript
const CATEGORY_TABS = [
  { id: 'for-sale',    label: 'for sale' },
  { id: 'housing',     label: 'housing' },
  { id: 'jobs',        label: 'jobs' },
  { id: 'services',    label: 'services' },
  { id: 'community',   label: 'community' },
  { id: 'gigs',        label: 'gigs' },
  { id: 'discussion',  label: 'discussion' },
]
```

Note: "events" items merge into community tab content. "resumes" items merge into jobs tab content. This merge happens in the data mapping layer (see Section 7), not in the tab definitions.

### Visual specs

Outer bar:
- Full-bleed width, border-bottom: 1px solid #EEEEEE
- Background: #FFFFFF
- Height: 44px

Inner content:
- max-width: 720px, margin: 0 auto, padding: 0 24px
- display: flex, align-items: center, gap: 4px

Each tab button:
- Font: Open Sans 14px, weight 400, lowercase
- Color (inactive): #727272
- Padding: 6px 14px
- Border-radius: 16px (pill)
- Background (inactive): transparent
- Hover (inactive): background #EEEEEE
- Transition: background-color 100ms cubic-bezier(0.16, 1, 0.3, 1)

Active tab:
- Background: #191919
- Color: #FFFFFF
- Font-weight: 500
- No border

---

## 6. MainContentShell Updates

### New behavior

`MainContentShell` now receives `activeTab` instead of `filteredSections`. It renders only the taxonomy section(s) mapped to the active tab.

### Updated props

```typescript
interface MainContentShellProps {
  activeTab: string
  searchQuery: string
  onClearSearch: () => void
}
```

### Layout

```
<div style="max-width: 720px; margin: 0 auto; padding: 24px 0;">
  [section heading]
  [IconGrid]
</div>
```

### Section heading

- Font: Times New Roman, 24px, weight 700 (type.h2)
- Color: #191919
- Margin bottom: 16px
- Text: the active tab label (e.g. "for sale")

### Search filtering

When `searchQuery` is non-empty, filter the active tab's items by case-insensitive substring match against `item.label`. Show empty state ("No results" + "Clear search" button) if zero matches. This preserves existing `filterSectionsByQuery` behavior scoped to the active tab only.

---

## 7. IconGrid Component (new)

### Purpose

Renders the subcategory items for the active tab as an 8-column icon card grid.

### File

`src/components/IconGrid.tsx`

### Props

```typescript
interface IconGridProps {
  items: TaxonomyItem[]  // verify exact type name from src/data/taxonomy.ts exports before using
}
```

### Grid

```css
display: grid;
grid-template-columns: repeat(8, 1fr);
gap: 16px;
```

### IconCard (each item)

```
[icon placeholder 32px × 32px]
[label text]
```

Specs:
- Width: 1 column (76px — derived from 720px container − 7×16px gaps ÷ 8 columns)
- display: flex, flex-direction: column, align-items: center, gap: 6px
- Padding: 8px 4px
- Border: 1px solid #EEEEEE
- Border-radius: 8px (radius.card)
- Background: transparent
- Hover: background #EEEEEE (color.bg.subtle), transition background-color 100ms cubic-bezier(0.16, 1, 0.3, 1) (motion.fast + primary easing)

Icon placeholder:
- Width: 32px, height: 32px
- Border-radius: 6px
- Background: #EEEEEE

Label:
- Font: Open Sans 11px, weight 400
- Color: #727272
- Text-align: center
- Line-height: 1.3
- Word-break: break-word
- Max 2 lines (no truncation — let it wrap)

---

## 8. Taxonomy Tab Mapping

### File

`src/data/tabMapping.ts`

### Purpose

Maps each `CATEGORY_TABS` id to one or more taxonomy section ids from `craigslist_taxonomy.json`. This is where the events→community and resumes→jobs merges happen.

### Structure

```typescript
export const TAB_SECTION_MAP: Record<string, string[]> = {
  'for-sale':   ['for_sale'],
  'housing':    ['housing'],
  'jobs':       ['jobs', 'resumes'],
  'services':   ['services'],
  'community':  ['community', 'events'],
  'gigs':       ['gigs'],
  'discussion': ['discussion'],
}
```

Adjust the string ids to match the actual `id` fields in `craigslist_taxonomy.json`. Do not guess — read the JSON to confirm section ids before writing this map.

### Usage in MainContentShell

```typescript
const sectionIds = TAB_SECTION_MAP[activeTab]
const items = sectionIds.flatMap(id =>
  taxonomySections.find(s => s.id === id)?.items ?? []
)
```

---

## 9. HomePage State Updates

### Add

```typescript
const [activeTab, setActiveTab] = useState('for-sale')
```

Default is 'for-sale'.

### Remove

- `modalCityQuery` can stay (used by LocationModal internally — confirm if it lives in HomePage or modal)
- Left rail category scroll handlers
- `leftRailCategories` usage

### Updated render

```tsx
<HeaderShell
  searchQuery={headerSearchQuery}
  onSearchChange={setHeaderSearchQuery}
  selectedCities={selectedCities}
  radiusMiles={radiusMiles}
  hasEditedRadius={hasEditedRadius}
  onLocationClick={() => setIsLocationModalOpen(true)}
  measureTextOverride={measureTextOverride}
/>
<CategoryTabBar
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
<MainContentShell
  activeTab={activeTab}
  searchQuery={headerSearchQuery}
  onClearSearch={() => setHeaderSearchQuery('')}
/>
<LocationModal
  isOpen={isLocationModalOpen}
  onClose={() => setIsLocationModalOpen(false)}
  selectedCities={selectedCities}
  onSelectedCitiesChange={setSelectedCities}
  radiusMiles={radiusMiles}
  onRadiusMilesChange={setRadiusMiles}
  hasEditedRadius={hasEditedRadius}
  onHasEditedRadiusChange={setHasEditedRadius}
  modalCityQuery={modalCityQuery}
  onModalCityQueryChange={setModalCityQuery}
/>
```

---

## 10. What Does Not Change

The following are explicitly preserved and must not be modified:

- `craigslist_taxonomy.json` — do not touch
- `src/data/taxonomy.ts` — validation and exports unchanged
- `LocationModal` component internals
- `computeHeaderLocationLabel` in `lib/locationLabel.ts`
- `filterSectionsByQuery` in `lib/searchTaxonomy.ts`
- All city/radius state and modal interaction logic
- Design tokens (colors, spacing, motion) — only additions listed in Section 1 are new
- Logo asset and CTAs in header

### Superseded from Sprint 7 remaining work

The header secondary row (selected location chips below the search bar) listed as remaining work in Sprint 7 is **superseded by this sprint**. The location is now surfaced inside the `CombinedSearchBar` right zone. Do not implement the chips secondary row.

---

## 11. Acceptance Criteria

1. Left rail is fully removed. No 240px sidebar renders anywhere.
2. Header is full-bleed with content constrained to 720px inner wrapper.
3. CombinedSearchBar renders with search zone + divider + location zone + search button.
4. Location zone shows computed label from selectedCities state (e.g. "Boston ±10 mi").
5. Clicking location zone opens LocationModal. Modal behavior unchanged.
6. CategoryTabBar renders below header, full-bleed, 7 tabs.
7. Active tab shows filled dark pill (#191919 bg, white text).
8. Clicking a tab updates activeTab state and re-renders MainContentShell with that tab's items.
9. MainContentShell renders a centered 720px container with an 8-col, 16px gap icon grid.
10. All subcategory items for the active tab render as IconCards (icon placeholder + label).
11. Events items appear under community tab. Resumes items appear under jobs tab.
12. Search query filters items within the active tab in real time.
13. Empty state renders when search produces zero matches within the active tab.
14. No TypeScript errors, no ESLint violations, no console errors.
15. All existing location modal tests pass. Update or add tests for CombinedSearchBar, CategoryTabBar, and tab switching.