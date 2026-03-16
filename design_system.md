# Craigslist Redesign Design System (Cursor Spec)
## Goal
Modernize Craigslist by improving readability, hierarchy, and interaction clarity while preserving
the familiar Craigslist layout and information architecture.
Design adjectives:
- Utilitarian
- Trustworthy
- Fast
Non goals:
- Do not redesign all of Craigslist.
- Do not introduce “marketplace modern” visuals like heavy cards, large imagery, glossy
gradients, or prominent shadows.
- Do not change the mental model of the homepage layout. Keep it recognizable as Craigslist.
## Visual Principles
1. Familiar first
Keep Craigslist’s structure and hierarchy recognizable. Improvements should feel like cleanup
and refinement, not a rebrand.
2. Readability over decoration
Improve spacing rhythm, typography clarity, and scanability. Avoid visual noise.
3. Interaction is explicit
Links look like links. Hover states are obvious but subtle. No ambiguous click targets.
## Tokens
### Color
Surface and neutral system:
- `color.bg.page`: `#FFFFFF` (entire page background)
- `color.bg.subtle`: `#EEEEEE` (subtle section background when needed)
- `color.border.default`: `#EEEEEE` (default borders)
- `color.border.emphasis`: `#727272` (use sparingly, only where explicitly allowed)
- `color.text.primary`: `#191919`
- `color.text.secondary`: `#727272`
- `color.icon.default`: `#727272`
Brand and interaction colors:
- `color.link.default`: `#0020E5` (Craigslist blue)
- `color.link.visited`: `#800080` (Craigslist purple, also logo purple)
- `color.logo.purple`: `#800080` (logo only)
Additional colors:
- `#D0D0D0`: Lighter border color used for search input and button hover borders (between default and emphasis).
- `#FAFAFA`: Very light background used for search input (lighter than subtle background).

Usage rules:
- Page background is always white.
- Cards have no default fill.
- Subtle background blocks use `#EEEEEE` sparingly.
- Default borders are `#EEEEEE`. 
- Search input and button hover borders use `#D0D0D0` (lighter than emphasis border `#727272`).
- Emphasis borders (`#727272`) are used sparingly, only where explicitly needed.
- No drop shadows unless extremely subtle and necessary. Default is none.
### Typography
Font families:
- Headings:
- H1, H2: Times New Roman
- H3: Open Sans
- Body: Open Sans
Desktop type scale:
- `type.h1`: 32px, line height 1.2, weight 700, color primary
- `type.h2`: 24px, line height 1.25, weight 700, color primary
- `type.h3`: 18px, line height 1.3, weight 700, color primary, font Open Sans
- `type.body`: 16px, line height 1.5, weight 400, color secondary
- `type.note`: 12px, line height 1.4, weight 400, color secondary
Mobile scale (450px and below):
- `type.h1`: 28px
- `type.h2`: 20px
- `type.h3`: 16px
- Body stays readable, do not go below 12px for any body like text.
### Spacing
Base grid:
- Use an 8px spacing system.
- Prefer spacing values: 8, 16, 24, 32, 40.
Rhythm rules:
- After headings: use a small gap before content.
- Between paragraphs: 16px.
- Between category blocks: 32px.
- Major section separation: 40px.
### Layout
- Full width layout.
- Header border extends full page width (edge-to-edge).
- Header content has 24px horizontal padding (px-6).
- Main content container: left aligned content with 24px horizontal padding (px-6).
- Left rail: fixed 240px width, 24px right padding, sticky positioning with top offset 77px (header height).
- Horizontal padding:
  - Desktop: 24px
  - Mobile: 16px
### Grid and Container (Sprint 9)
- `layout.container.width`: 764px (centered content max-width)
- `layout.container.padding`: 24px (left and right)
- `layout.grid.columns`: 8
- `layout.grid.gap`: 16px
- `layout.card.icon`: 76px (1 column = 764px − 7×16px gaps ÷ 8)
### Radius
- `radius.input`: 4px
- `radius.card`: 8px
- `radius.button`: 8px
- `radius.chip`: 16px
No pill buttons.
### Motion
Durations:
- `motion.fast`: 100ms
- `motion.default`: 200ms
Easing:
- Primary (modern ease out for most transitions): `cubic-bezier(0.16, 1, 0.3, 1)`
- Secondary (standard UI curve for non hover transitions): `cubic-bezier(0.4, 0, 0.2, 1)`
Usage:
- Hover transitions: fast or default with primary easing.
- Open close and subtle fades: default with secondary easing.
- Avoid bouncy or playful animation.
## Interaction Rules
### Links
- Default state: blue `#0020E5`, no underline.
- Hover state: underline appears.
- Visited state: purple `#800080`.
- Links should remain clearly identifiable as links. Avoid turning links into buttons visually.
### Focus states
- No global focus ring system.
- Do not add a 2px focus ring.
- Rely on hover and pressed states for clarity.
- Accessibility: ensure keyboard focus is still visible using subtle, non ring changes where
required by the platform, but do not introduce a prominent ring design language.
### Hover and pressed states
Buttons:
- Outline buttons: Hover background becomes `#EEEEEE` (color.bg.subtle), border becomes `#D0D0D0`.
- Primary buttons: Hover uses a black overlay at 20 percent while preserving readability and contrast.
- Pressed state can be slightly stronger than hover.
- All hover transitions use fast duration (100ms) with primary easing.

Cards:
- Default has no fill.
- On hover, background fill becomes `#EEEEEE`.

Category grid:
- Responsive grid layout: repeat(auto-fit, minmax(72px, max-content))
- Maximum 8 columns per row (max-width: 744px)
- Wraps to fewer columns on smaller screens
- Gap: 24px between cards
## Components
### Search Input
Purpose:
Primary functional element on homepage.
Specs:
- Height: minimum 44px.
- Max-width: 400px, width: 100% (centered in header).
- Border: 1px solid `#D0D0D0` (lighter than emphasis border).
- Radius: 8px (radius.button, matches button styling).
- Background: `#FAFAFA` (very light gray, slightly lighter than page background).
- Text: Open Sans 16px.
- Placeholder: "Search anything" (capitalized).
- Icon: magnifying glass (20px), left aligned inside the field, color `#727272`.
- Clear button: X icon (18px) appears when query is non-empty, right-aligned.
- Icon and text are vertically centered.
### Buttons
Primary button (not currently used in header):
- Fill: `#0020E5`
- Text: white
- Radius: 8px
- Hover: black overlay at 20 percent

Secondary/Outline button (used for "create post"):
- Background: transparent
- Border: 1px solid `#EEEEEE` (color.border.default)
- Text: `#191919` (color.text.primary), lowercase
- Radius: 8px
- Height: 36px (h-9)
- Icon and text vertically centered
- Hover: background `#EEEEEE` (color.bg.subtle), border `#D0D0D0`
- Transition: background-color and border-color with fast duration and primary easing

Icon buttons (Star, SquareUser in header):
- Size: 20px icons
- Color: `#191919` (color.text.primary)
- Hover: circular background `#EEEEEE` (color.bg.subtle)
- Circle size: 36px × 36px (matches button height)
- Circle is absolutely positioned, doesn't affect spacing
- Transition: opacity with fast duration and primary easing
### Chips
- Outline chips with subtle fill on hover.
- Radius: 16px
- Default: border `#EEEEEE`, text `#191919` or `#727272` depending on hierarchy.
- Hover: subtle fill, use `#EEEEEE`.
### Cards
- Default: no fill
- Border: 1px `#EEEEEE`
- Radius: 8px
- Padding: 12px default, 16px for larger card sections
- Hover: fill `#EEEEEE`
- If a card is clickable, ensure hover indicates clickability.

### Left Rail
Location trigger button:
- Font: Open Sans 16px, weight 400 (normal)
- Icon: MapPin (20px) with 4px gap to text
- Height: 36px (with py-2 padding)
- Hover: background `#EEEEEE` (color.bg.subtle)
- Bottom margin: 12px (mb-3)
- Line-height: 1.5

Category buttons:
- Font: Open Sans 16px, weight 700 (bold)
- Height: 36px (with py-2 padding) - matches location button
- Hover: background `#EEEEEE` (color.bg.subtle)
- Always enabled, even during search
- Clicking clears search and scrolls to section
- No spacing between "categories" label and first button (mb-0)

Categories label:
- Font: Open Sans 12px, weight 700 (semibold)
- Color: `#727272` (color.text.secondary)
- Bottom margin: 0px (no gap before category list)
### Left Rail
Location trigger button:
- Font: Open Sans 16px, weight 400 (normal)
- Icon: MapPin (20px) with 4px gap to text
- Height: 36px (with py-2 padding)
- Hover: background `#EEEEEE` (color.bg.subtle)
- Bottom margin: 12px (mb-3)
- Line-height: 1.5

Category buttons:
- Font: Open Sans 16px, weight 700 (bold)
- Height: 36px (with py-2 padding) - matches location button
- Hover: background `#EEEEEE` (color.bg.subtle)
- Always enabled, even during search
- Clicking clears search and scrolls to section
- No spacing between "categories" label and first button (mb-0)

Categories label:
- Font: Open Sans 12px, weight 700 (semibold)
- Color: `#727272` (color.text.secondary)
- Bottom margin: 0px (no gap before category list)

### Icons
- Use lucide-react icons.
- Default size: 20px.
- Default color: `#727272` (color.icon.default) for secondary icons.
- Primary icons (header actions): `#191919` (color.text.primary).
- Account icon: SquareUser (more square-shaped than User icon).
- Active state may use `#0020E5` sparingly.
- Icons are vertically centered with text when used in buttons.
## Do and Do Not
Do:
- Keep homepage structure recognizable.
- Prioritize scanability and clear link styling.
- Use whitespace and subtle borders for separation.
Do not:
- No hero imagery, no decorative illustrations.
- No glossy gradients, no strong shadows, no modern marketplace card heavy layout.
- No pill buttons.
- No global focus ring design language.