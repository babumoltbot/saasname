# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

AI-powered name generator and validator for software products. Users describe their idea, get AI-generated names, then validate them across domains, brand scoring, trademark risk, social handles, and competitors. Landing page has a cached demo mode (no API calls) showing sample reports. Pro tier ($29 one-time) unlocks 50 gens, 10 names, all checks.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Apply Drizzle schema migrations
npm run db:init      # Initialize database
npm run generate -- "idea" --count=10 --tlds=.com,.io  # CLI name generator (--provider=anthropic to override)
npx tsx scripts/list-users.ts          # List all users (--pro or --free to filter)
npx tsx scripts/grant-pro.ts <email>   # Grant Pro access (--generations=N, --revoke)
node scripts/screenshots.mjs                  # Screenshot all pages (unauthenticated)
node scripts/screenshots.mjs <session-token>  # Screenshot all pages (authenticated)
```

### Visual QA with Screenshots
To visually check all pages, run the screenshot script (requires `npx playwright install chromium` once). Pass a `next-auth.session-token` cookie value to test authenticated pages (generate with results, history with data). Get the cookie from DevTools → Application → Cookies → localhost:3000. Screenshots are saved to `screenshots/` (gitignored).

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (dark theme, accent green #3cff8a, fonts: Sora/Space Mono)
- **SQLite** via better-sqlite3 + **Drizzle ORM** (DB at `data/saasname.db`, WAL mode)
- **NextAuth v4** (Google OAuth)
- **OpenAI** or **Anthropic** via `AI_PROVIDER` env var (see `src/lib/ai-client.ts`). OpenAI: gpt-4o / gpt-4o-mini. Anthropic: claude-sonnet-4-6 / claude-haiku-4-5. Models overridable via env vars.
- **Stripe** (one-time $29 checkout + webhook)
- **WhoisXML API** for domain checks (or Porkbun redirect fallback via `NEXT_PUBLIC_DOMAIN_CHECK_MODE`)

## Architecture

### Routing & Pages
- `/` — Landing page (server component, composed from `src/components/landing/`)
- `/generate` — Main generator UI (client component, terminal-style input → name cards → validation panel)
- `/history` — Past generations with expandable results
- `/api/generate` — POST: Generate names, saves to DB (with `aiProvider`), increments usage
- `/api/validate` — POST: Run domain/social/trademark/competitor checks on a name
- `/api/check-domains` — GET (cached lookup) / POST (WhoisXML API call, caches result)
- `/api/stripe/checkout` — POST: Create Stripe checkout session
- `/api/stripe/webhook` — POST: Handle `checkout.session.completed`, upgrade user tier

### Service Layer (`src/lib/services/`)
Each service is a module exporting an object with methods, reused by both API routes and the CLI script (`scripts/generate.ts`). All AI services use `chatCompletion()` from `src/lib/ai-client.ts` (supports OpenAI and Anthropic):
- `name-generator.ts` — "primary" model prompt engineering for brandable names
- `brand-scorer.ts` — "fast" model scoring (memorability, pronounceability, uniqueness, relevance, length)
- `domain-checker.ts` — WhoisXML API integration
- `social-checker.ts` — Currently mocked (returns random availability)
- `trademark-screener.ts` — "fast" model risk assessment (Pro only)
- `competitor-analyzer.ts` — "fast" model similarity analysis (Pro only)
- `interfaces.ts` — Shared TypeScript interfaces

### Database (`src/lib/db/`)
Drizzle ORM with lazy-initialized singleton (Proxy pattern). Five tables: `users`, `generations`, `validations`, `domainChecks` (global cache), `featureInterest`.

### Key Patterns
- **Tier gating**: Checked in every relevant API route. Constants in `src/lib/constants.ts`.
- **Rate limiting**: In-memory Map, 60-second windows, per-user-per-action (`src/lib/rate-limit.ts`).
- **API route pattern**: Get session → find user → check rate limit → check tier limits → execute → update usage → return JSON.
- **Domain check caching**: Results stored globally in `domainChecks` table, shared across all users.
- **Audit logging**: `src/lib/audit-log.ts` writes NDJSON to daily files in `logs/` (configurable via `AUDIT_LOG_DIR`). Previous days' files are auto-gzipped. Actions logged: `sign_in`, `generate` (includes `aiProvider`), `validate`, `check_domains`, `checkout_created`, `payment_completed`, `pro_granted`, `pro_revoked`, `rate_limited`, `error`.
- `next.config.ts` uses `serverExternalPackages: ["better-sqlite3"]` for native bindings.
- Path alias: `@/*` maps to `./src/*`.

## Environment Variables

Copy `.env.example` to `.env`. Required: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Optional: `AI_PROVIDER` (openai|anthropic, default openai), `WHOISXML_API_KEY`, `NEXT_PUBLIC_DOMAIN_CHECK_MODE` (api|redirect).
