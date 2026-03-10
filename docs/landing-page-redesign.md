# Landing Page Redesign (March 2026)

Reimplemented the landing page with a distinctive, editorial layout that breaks from generic centered SaaS patterns. All design decisions follow CLAUDE.md design context (light theme, emerald accent, Sora + Space Mono, terminal motif).

---

## Key Design Changes

### Hero — Asymmetric Split Layout
- **Before**: Centered badge → h1 → subtitle → CTAs → terminal stacked vertically
- **After**: Two-column grid. Text content (left-aligned) on the left, terminal demo on the right
- Radial glow repositioned to follow the terminal (top-right)
- On mobile: stacks vertically (text above, terminal below)
- `min-h-screen` keeps hero full-viewport on desktop

### Features — Editorial Two-Column List
- **Before**: 3×2 card grid with 40×40 icon boxes above each feature title
- **After**: Sticky section intro on the left, numbered feature list with dividers on the right
- Features numbered 01–06 in monospace, with inline "Soon" badges
- No icon boxes — cleaner, more editorial feel
- Dividers (`divide-y`) create visual rhythm between items

### HowItWorks — Terminal Window Presentation
- **Before**: Vertical timeline with numbered circles and a gradient line on the left
- **After**: Steps inside a macOS-style terminal window (`pikname --how-it-works`)
- Each step prefixed with `→ Step 01` in Space Mono
- Blinking cursor at the bottom reinforces the terminal motif
- Section header remains centered above the terminal

### DemoSection — Refined Styling
- Functionality unchanged (journey picker chips, interactive name cards, validation panel)
- Background changed from `bg-black` to `bg-surface border-t` for better section rhythm
- Chip unselected state uses `bg-black` (the #f7f8fa background) instead of `bg-surface`
- Tighter spacing and slightly smaller typography in validation panel
- Brand score bars thinner (h-1.5 vs h-2) for subtlety

### Pricing — Split Layout
- **Before**: Single centered card with accent border
- **After**: Two-column. Left: section label, headline, $29 price (large), CTA button, "try demo" link. Right: "What's included" card with feature checklist
- Price rendered at `clamp(48px, 8vw, 64px)` for impact
- No card wrapper on the left side — just confident typography

### Navbar — Mobile Menu Added
- Desktop: unchanged
- Mobile: added hamburger menu button with dropdown. Previously nav links were `hidden` on mobile with no alternative.
- "Get Started" CTA visible on both mobile and desktop

### Footer — Logo Added
- Added PikName logo alongside tagline with a `w-px h-3.5` separator
- Links unchanged

---

## CSS Additions

### Stagger Reveal Animation
```css
.stagger-parent > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s var(--ease-out-expo), transform 0.5s var(--ease-out-expo);
}

.stagger-parent.visible > * {
  opacity: 1;
  transform: none;
}

.stagger-parent.visible > *:nth-child(n) { transition-delay: n * 0.04s; }
```

Used by the Features list. Parent observed by `useScrollReveal()` hook — when it enters viewport, `visible` class is added, triggering staggered child transitions.

All existing animations preserved (fadeUp, tickerScroll, scoreReveal, etc.) — generate and history pages unaffected.

---

## Layout Rhythm

| Section      | Background     | Padding (desktop)  | Border          |
|-------------|----------------|-------------------|-----------------|
| Hero        | bg-black       | pt-[100px] pb-20  | none            |
| Features    | bg-surface     | py-32             | border-t        |
| HowItWorks  | bg-black       | py-32             | none            |
| DemoSection | bg-surface     | py-32             | border-t        |
| Pricing     | bg-black       | py-32             | none            |
| Footer      | bg-black       | py-10             | border-t        |

Alternating bg-black (#f7f8fa) / bg-surface (#ffffff) creates clear section separation. Varied padding (hero is taller, footer is compact) establishes visual rhythm.

---

## Files Changed

- `src/app/globals.css` — Added `.stagger-parent` animation classes
- `src/components/landing/Navbar.tsx` — Added mobile hamburger menu
- `src/components/landing/Hero.tsx` — Split layout rewrite
- `src/components/landing/TerminalDemo.tsx` — Removed outer margins for grid embedding
- `src/components/landing/Features.tsx` — Editorial two-column list rewrite
- `src/components/landing/HowItWorks.tsx` — Terminal window rewrite
- `src/components/landing/DemoSection.tsx` — Refined styling
- `src/components/landing/Pricing.tsx` — Split layout rewrite
- `src/components/landing/Footer.tsx` — Added logo

## Files NOT Changed

- `src/app/page.tsx` — Same component imports and order
- `src/app/layout.tsx` — Same fonts, metadata, analytics
- `src/lib/demo-data.ts` — Same demo journeys and names
- `src/lib/constants.ts` — Same TLD list and tier config
- `src/lib/hooks.ts` — Same `useScrollReveal` hook
