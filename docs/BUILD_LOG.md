# SaaSName — Build Log

Detailed breakdown of every submission, the logic behind each decision, and how the system works end-to-end.

---

## Table of Contents

1. [Pre-Rebuild: Static Landing Page](#1-pre-rebuild-static-landing-page)
2. [Full-Stack Rebuild (Next.js 15)](#2-full-stack-rebuild-nextjs-15)
3. [Design Overhaul](#3-design-overhaul)
4. [CLI Generate Script](#4-cli-generate-script)
5. [Architecture & Logic Reference](#5-architecture--logic-reference)

---

## 1. Pre-Rebuild: Static Landing Page

### `ce43418` — Initial landing page
- Single `index.html` with inline CSS
- Dark theme with custom design tokens (`#080a0c` bg, `#3cff8a` accent)
- Sora (display) + Space Mono (mono) font pairing
- Sections: Hero, Features, How It Works, Pricing, CTA form, Footer

### `f025cfc` — Basic name generation POC
- `app.js` with naive prefix+suffix name combiner (no AI)
- Mock domain checker with random availability
- Simple keyword extraction from idea text
- Proof-of-concept only — never shipped to users

### `ffaa42f` — Landing page redesign
- Terminal demo card showing a mock `saasname validate` session
- Animated hero ticker cycling through "Validate it.", "Check domains.", "Secure handles.", "Ship faster."
- Film grain overlay via SVG noise filter
- Scroll-reveal animations with IntersectionObserver
- Formspree integration for email capture

### `5d5e8ff` — Pricing model change
- Moved from unlimited plan to credit-based tiers:
  - **Free**: 3 generations, 5 names/gen, .com only, brand score preview
  - **Pro** ($29 one-time): 50 gens, 10 names/gen, all TLDs, social handles, trademark screening, competitor analysis

### `0929c7f` — Mobile responsiveness
- Three breakpoints: desktop (default), tablet (768px), small phone (480px)
- Responsive nav (hides links on mobile, keeps CTA), stacked pricing grid, collapsible features grid

### `e201a23` — SEO & social sharing
- Open Graph + Twitter Card meta tags
- `og-image.png` for link previews
- Email input added to CTA form for lead capture

---

## 2. Full-Stack Rebuild (Next.js 15)

### `bd6c2b4` — Complete rebuild

This was the major commit — 56 files, 10,890 lines. Built in 7 phases:

#### Phase 1: Scaffold + Landing Page Port

**What**: Initialize Next.js 15, port the static HTML into React components.

**Logic**:
- `create-next-app` with App Router, TypeScript, Tailwind CSS v4
- Design tokens ported to Tailwind's `@theme` directive in `globals.css` — all colors, fonts, and easing curves defined as CSS custom properties so Tailwind classes like `bg-black`, `text-accent`, `border-border` work out of the box
- Each landing page section became its own component in `src/components/landing/`
- Grain overlay, animations (`fadeUp`, `tickerScroll`, `blink`, `pulse`), and scroll reveal preserved via CSS keyframes + a `useScrollReveal` hook using IntersectionObserver
- `og-image.png` moved to `public/`

**Files**: `layout.tsx`, `page.tsx`, `globals.css`, 7 landing components

#### Phase 2: Auth + Database

**What**: Google OAuth via NextAuth.js, SQLite database via Drizzle ORM.

**Logic**:
- **NextAuth.js v4** with Google provider — handles OAuth flow, CSRF protection, session management
- **Sign-in is mid-flow**: user lands on `/generate`, types their idea, clicks "Generate" — if not authenticated, redirected to Google OAuth, then back to `/generate`
- **No passwords, no anonymous sessions** — everything tied to Google account
- **Drizzle ORM + better-sqlite3** for persistence — lightweight, zero-config, WAL mode for concurrent reads
- **Schema** (`src/lib/db/schema.ts`):
  - `users`: id, email, name, image, googleId, tier (free/pro), generationsUsed, generationsLimit, namesPerGeneration, stripeCustomerId, timestamps
  - `generations`: id, userId, ideaText, names (JSON), createdAt
  - `validations`: id, generationId, name, domains/socials/trademark/competitors (all JSON), brandScore, createdAt
- **Tier constants** (`src/lib/constants.ts`): defines exactly what each tier gets — generation limits, TLDs, feature flags. Single source of truth used by API routes.
- **Session callback** enriches the NextAuth session with DB fields (userId, tier, usage counts) so the client knows the user's state without extra API calls
- **DB singleton** uses a Proxy for lazy initialization — avoids crashing at build time when better-sqlite3 tries to open a file

#### Phase 3: Service Interfaces + Implementations

**What**: TypeScript interfaces for all services, with AI and mock implementations.

**Logic**:
- **Interface-first design** (`src/lib/services/interfaces.ts`): `INameGenerator`, `IDomainChecker`, `ISocialChecker`, `ITrademarkScreener`, `ICompetitorAnalyzer`, `IBrandScorer` — swap implementations by changing one import
- **AI services** (OpenAI GPT-4o-mini):
  - `name-generator.ts`: System prompt instructs the model to generate short, brandable, spellable names. `temperature: 0.9` for creativity. JSON response format enforced.
  - `brand-scorer.ts`: Scores on 5 dimensions (memorability, pronounceability, uniqueness, relevance, length) with weighted average. `temperature: 0.4` for consistency.
  - `trademark-screener.ts`: AI heuristic checking for known trademarks, similar-sounding names, common registered combinations. Returns risk level (clear/caution/high-risk).
  - `competitor-analyzer.ts`: Finds companies with similar names in the same industry, rates similarity 0-100.
- **Mock services** (swappable):
  - `domain-checker.ts`: Simulates WHOIS lookup. `.com` has 30% availability, `.io/.app/.dev` have 60%. Deterministic per name would be better but random is fine for testing.
  - `social-checker.ts`: Mock availability for X, LinkedIn, Instagram handles (~50% chance).
- **Rate limiter** (`src/lib/rate-limit.ts`): In-memory sliding window. Keyed by `{action}:{userId}`. Returns boolean — API routes check before processing. Sufficient for single-server deployment.

#### Phase 4: API Routes

**What**: Three API endpoints that power the generate page.

**Logic**:
- `POST /api/generate`:
  1. Verify auth (NextAuth session)
  2. Rate limit check (5/min per user)
  3. Generation limit check (free: 3, pro: 50) — returns `{ upgrade: true }` if exceeded
  4. Validate input (minimum 10 chars)
  5. Call `nameGenerator.generate()` with tier-appropriate count (5 or 10)
  6. Score each name with `brandScorer.score()` in parallel
  7. Save generation to DB
  8. Increment `generationsUsed` on user record
  9. Return names with scores + remaining count

- `POST /api/validate`:
  1. Verify auth + rate limit (10/min)
  2. Run checks in parallel based on tier:
     - Domain check (always) — uses tier's TLD list
     - Social check (pro only)
     - Trademark screening (pro only)
     - Competitor analysis (pro only)
  3. Save validation to DB
  4. Return results + `tierLocked` flags so UI knows what to show as locked

- `GET /api/session`:
  1. Return user info, tier, usage counts, remaining generations
  2. Returns `{ authenticated: false }` if not signed in

#### Phase 5: Generate Page UI

**What**: The main app page at `/generate`.

**Logic**:
- **State machine**: `loading` → `result` → `selectedName` → validation panel
- **Sign-in gate**: `IdeaInput` checks `sessionStatus` — if unauthenticated, button text changes to "Sign in with Google to Generate" and click triggers `signIn("google")`
- **IdeaInput**: Textarea with submit handler
- **NameList**: Cards showing name, tagline, reasoning, brand score gauge
- **BrandScore**: SVG circular gauge with `strokeDasharray`/`strokeDashoffset` to draw the arc. Color-coded: green (80+), orange (60-79), red (<60)
- **ValidationPanel**: Fires `POST /api/validate` when a name is selected (via `useEffect` on `name.name`). Shows domains, socials, trademark, competitors. Locked sections show "Upgrade to Pro" for free users.
- **UpgradePrompt**: Modal triggered when generation limit hit. Calls `POST /api/stripe/checkout` to get Stripe URL, redirects user.
- **SessionBanner**: Shows avatar + name + sign out, or sign in button

#### Phase 6: Stripe Payment

**What**: One-time $29 payment to upgrade free → pro.

**Logic**:
- `POST /api/stripe/checkout`:
  1. Verify auth, check user isn't already pro
  2. Create Stripe Checkout Session (`mode: "payment"`, `unit_amount: 2900`)
  3. Pass `userId` in session metadata for webhook to identify the user
  4. Return checkout URL — client redirects to Stripe

- `POST /api/stripe/webhook`:
  1. Verify Stripe webhook signature
  2. On `checkout.session.completed`:
     - Extract `userId` from session metadata
     - Update user record: `tier → "pro"`, `generationsLimit → 50`, `namesPerGeneration → 10`
     - Store `stripeCustomerId` for reference

- Stripe client is lazy-initialized (same pattern as DB) to avoid build-time crashes when `STRIPE_SECRET_KEY` isn't set

#### Phase 7: Polish

**What**: Error states, loading states, env config, DB init.

**Logic**:
- `.env.example` with all required variables documented
- `npm run db:init` runs `src/lib/db/init.ts` which creates tables with `CREATE TABLE IF NOT EXISTS`
- `.gitignore` excludes `node_modules/`, `.next/`, `.env`, `data/*.db`, `.claude/`
- Loading skeleton on generate page
- `next.config.ts` adds `better-sqlite3` to `serverExternalPackages` so Next.js doesn't try to bundle the native module

---

## 3. Design Overhaul

### `b809e41` — Premium dark SaaS aesthetic

**What**: Complete visual redesign of the `/generate` page.

**Logic & design decisions**:

- **Ambient atmosphere**: Two fixed radial gradients (green top-right, blue bottom-left) with a subtle pulse animation. Creates depth without being distracting. Matches the landing page's radial glow behind the hero.

- **Terminal-style input**: The textarea is wrapped in a terminal window (traffic light dots, centered title, `$` prompt prefix). This reinforces the developer/hacker brand and mirrors the landing page's terminal demo. Bottom bar shows word count and houses the submit button.

- **Focus glow**: Input container gets a green box-shadow and border on focus, creating a "selected terminal" effect.

- **Collapsible hero**: Before first generation, shows a full hero section with badge, large headline ("Name your next **big thing**"), and description. After generating, collapses to a compact inline header with a regenerate form. Prevents the page from feeling top-heavy once you're working.

- **Staggered card animations**: Name cards enter with `fadeUp` animation, each delayed by `i * 0.06s`. Creates a cascade effect that draws the eye down the list.

- **Card design**: Left accent bar (green when selected, invisible otherwise), numbered ranks (`01`, `02`...), tagline inline with name, reasoning truncated to one line. Selected card gets a green glow shadow.

- **Sticky validation panel**: Uses `lg:sticky lg:top-[80px]` so it follows scroll on desktop. Empty state shows a "Select a name" placeholder with a plus icon.

- **Status pills**: Domain/social availability shown with small rounded pills — green "Open" or orange "Taken" with a tiny colored dot. More scannable than plain text.

- **Platform icons**: Custom SVG icons for X (Twitter), LinkedIn, and Instagram in the social handles section.

- **Skeleton loading**: Shimmer animation using a moving linear gradient. Five placeholder cards shown during generation.

- **Upgrade modal**: Scale-in entrance animation, ambient glow behind the modal, lightning bolt icon, "one-time" label next to price.

- **New CSS animations**: `slideInRight`, `scaleIn`, `shimmer`, `scoreReveal`, `glowPulse` added to globals.css.

---

## 4. CLI Generate Script

### `8aafa15` — `scripts/generate.ts`

**What**: CLI tool that runs the same pipeline as the web app, for prompt iteration.

**Logic**:
- **Shared code**: Imports from `src/lib/services/` — same `nameGenerator`, `brandScorer`, `domainChecker`, `socialChecker`, `trademarkScreener`, `competitorAnalyzer`. No duplicated prompts. Change a prompt in the service file and both the web app and the CLI use it.

- **Env loading**: Manually parses `.env` from project root (same file Next.js uses). Doesn't overwrite existing env vars, so you can also `export OPENAI_API_KEY=...` if preferred.

- **Lazy OpenAI clients**: All 4 AI services were updated to lazy-initialize their OpenAI client (same pattern as Stripe and DB). Prevents crash at import time when env vars aren't loaded yet.

- **Parallel validation**: For each generated name, brand score + domain + social + trademark + competitor checks all run in parallel via `Promise.all`.

- **Output modes**:
  - Default: Colored terminal output with ANSI codes. Score bars (`█░`), checkmarks/crosses for availability, risk level badges, competitor similarity bars.
  - `--json`: Raw JSON for piping to `jq` or other tools.

- **Options**: `--count=N` (names to generate), `--tlds=.com,.io` (which TLDs to check), `--industry=X` (for trademark/competitor context), `--no-validate` (skip checks, just generate names + scores).

- **Usage**: `npm run generate -- "Your SaaS idea"` or `npx tsx scripts/generate.ts "Your SaaS idea"`

---

## 5. Architecture & Logic Reference

### Data Flow

```
User types idea → IdeaInput → POST /api/generate
                                 ├─ Auth check (NextAuth session)
                                 ├─ Rate limit check (5/min)
                                 ├─ Tier limit check (3 or 50 gens)
                                 ├─ nameGenerator.generate(idea, count)
                                 │   └─ OpenAI GPT-4o-mini (temp 0.9, JSON mode)
                                 ├─ brandScorer.score(name, idea) × N in parallel
                                 │   └─ OpenAI GPT-4o-mini (temp 0.4, JSON mode)
                                 ├─ Save to DB (generations table)
                                 └─ Return names + scores + remaining count

User clicks name → ValidationPanel → POST /api/validate
                                       ├─ Auth + rate limit (10/min)
                                       ├─ domainChecker.check(name, tier.tlds)     ← mock
                                       ├─ socialChecker.check(name)                ← mock, pro only
                                       ├─ trademarkScreener.screen(name, industry) ← AI, pro only
                                       ├─ competitorAnalyzer.analyze(name, industry)← AI, pro only
                                       ├─ Save to DB (validations table)
                                       └─ Return results + tierLocked flags

User hits limit → UpgradePrompt → POST /api/stripe/checkout
                                    └─ Stripe Checkout Session ($29)
                                        └─ Redirect to Stripe

Stripe payment → POST /api/stripe/webhook
                   └─ checkout.session.completed
                       └─ Update user: tier=pro, limits=50/10
```

### Tech Stack Rationale

| Choice | Why |
|--------|-----|
| Next.js 15 App Router | Full-stack in one framework. API routes co-located with pages. RSC support. |
| Tailwind CSS v4 | `@theme` directive for design tokens. No config file needed. |
| NextAuth.js v4 | Handles Google OAuth, CSRF, session cookies. No custom auth code. |
| Drizzle + SQLite | Zero-config, no external DB. WAL mode for concurrent reads. Easy migration path to Turso/Postgres. |
| GPT-4o-mini | Cheap ($0.15/1M input), fast, good enough for name generation. JSON mode prevents parsing errors. |
| Stripe Checkout | Hosted payment page. No PCI compliance needed. Webhook for fulfillment. |
| Mock domain/social | Real WHOIS APIs cost money and have rate limits. Interface pattern means swapping to real APIs is a one-line import change. |

### File Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout (fonts, meta, SessionProvider)
│   ├── page.tsx                Landing page assembly
│   ├── globals.css             Design tokens, animations, utility classes
│   ├── generate/
│   │   ├── page.tsx            Main app page
│   │   └── loading.tsx         Loading skeleton
│   └── api/
│       ├── auth/[...nextauth]/ Google OAuth handler
│       ├── generate/           Name generation endpoint
│       ├── validate/           Validation endpoint
│       ├── session/            User info endpoint
│       └── stripe/
│           ├── checkout/       Create Stripe session
│           └── webhook/        Handle payment completion
├── components/
│   ├── SessionProvider.tsx     NextAuth client wrapper
│   ├── landing/                Navbar, Hero, TerminalDemo, Features, HowItWorks, Pricing, Footer
│   └── generate/               IdeaInput, NameList, BrandScore, ValidationPanel, SessionBanner, UpgradePrompt
├── lib/
│   ├── auth.ts                 NextAuth config + callbacks
│   ├── constants.ts            Tier definitions (single source of truth)
│   ├── hooks.ts                useScrollReveal
│   ├── rate-limit.ts           In-memory sliding window
│   ├── stripe.ts               Lazy Stripe client + checkout helper
│   ├── db/
│   │   ├── schema.ts           Drizzle schema (users, generations, validations)
│   │   ├── index.ts            Lazy DB singleton
│   │   └── init.ts             CLI table creation script
│   └── services/
│       ├── interfaces.ts       TypeScript interfaces (swappable)
│       ├── name-generator.ts   OpenAI — name generation
│       ├── brand-scorer.ts     OpenAI — 5-dimension scoring
│       ├── domain-checker.ts   Mock — domain availability
│       ├── social-checker.ts   Mock — X/LinkedIn/Instagram
│       ├── trademark-screener.ts OpenAI — risk assessment
│       └── competitor-analyzer.ts OpenAI — similar companies
scripts/
└── generate.ts                 CLI tool (same services as web app)
```

### Environment Variables

| Variable | Required | Used By |
|----------|----------|---------|
| `GOOGLE_CLIENT_ID` | Yes | NextAuth Google provider |
| `GOOGLE_CLIENT_SECRET` | Yes | NextAuth Google provider |
| `NEXTAUTH_SECRET` | Yes | Session encryption |
| `NEXTAUTH_URL` | Yes | OAuth callback URL |
| `OPENAI_API_KEY` | Yes | All AI services |
| `STRIPE_SECRET_KEY` | For payments | Stripe checkout + webhook |
| `STRIPE_WEBHOOK_SECRET` | For payments | Webhook signature verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Client-side (unused currently) |
| `NEXT_PUBLIC_BASE_URL` | For payments | Stripe success/cancel redirect URLs |
