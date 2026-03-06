# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

AI-powered name generator and validator for software products. Users describe their idea, get AI-generated names (GPT-4o), then validate them across domains, brand scoring, trademark risk, social handles, and competitors. Landing page has a cached demo mode (no API calls) showing sample reports. Pro tier ($29 one-time) unlocks 50 gens, 10 names, all checks.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Apply Drizzle schema migrations
npm run db:init      # Initialize database
npm run generate -- "idea" --count=10 --tlds=.com,.io  # CLI name generator
npx tsx scripts/list-users.ts          # List all users (--pro or --free to filter)
npx tsx scripts/grant-pro.ts <email>   # Grant Pro access (--generations=N, --revoke)
```

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (dark theme, accent green #3cff8a, fonts: Sora/Space Mono)
- **SQLite** via better-sqlite3 + **Drizzle ORM** (DB at `data/saasname.db`, WAL mode)
- **NextAuth v4** (Google OAuth)
- **OpenAI** (gpt-4o for generation, gpt-4o-mini for scoring/trademark/competitors)
- **Stripe** (one-time $29 checkout + webhook)
- **WhoisXML API** for domain checks (or Porkbun redirect fallback via `NEXT_PUBLIC_DOMAIN_CHECK_MODE`)

## Architecture

### Routing & Pages
- `/` — Landing page (server component, composed from `src/components/landing/`)
- `/generate` — Main generator UI (client component, terminal-style input → name cards → validation panel)
- `/history` — Past generations with expandable results
- `/api/generate` — POST: Generate names (GPT-4o), saves to DB, increments usage
- `/api/validate` — POST: Run domain/social/trademark/competitor checks on a name
- `/api/check-domains` — GET (cached lookup) / POST (WhoisXML API call, caches result)
- `/api/stripe/checkout` — POST: Create Stripe checkout session
- `/api/stripe/webhook` — POST: Handle `checkout.session.completed`, upgrade user tier

### Service Layer (`src/lib/services/`)
Each service is a module exporting an object with methods, reused by both API routes and the CLI script (`scripts/generate.ts`):
- `name-generator.ts` — GPT-4o prompt engineering for brandable names
- `brand-scorer.ts` — GPT-4o-mini scoring (memorability, pronounceability, uniqueness, relevance, length)
- `domain-checker.ts` — WhoisXML API integration
- `social-checker.ts` — Currently mocked (returns random availability)
- `trademark-screener.ts` — GPT-4o-mini risk assessment (Pro only)
- `competitor-analyzer.ts` — GPT-4o-mini similarity analysis (Pro only)
- `interfaces.ts` — Shared TypeScript interfaces

### Database (`src/lib/db/`)
Drizzle ORM with lazy-initialized singleton (Proxy pattern). Five tables: `users`, `generations`, `validations`, `domainChecks` (global cache), `featureInterest`.

### Key Patterns
- **Tier gating**: Checked in every relevant API route. Constants in `src/lib/constants.ts`.
- **Rate limiting**: In-memory Map, 60-second windows, per-user-per-action (`src/lib/rate-limit.ts`).
- **API route pattern**: Get session → find user → check rate limit → check tier limits → execute → update usage → return JSON.
- **Domain check caching**: Results stored globally in `domainChecks` table, shared across all users.
- `next.config.ts` uses `serverExternalPackages: ["better-sqlite3"]` for native bindings.
- Path alias: `@/*` maps to `./src/*`.

## Environment Variables

Copy `.env.example` to `.env`. Required: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Optional: `WHOISXML_API_KEY`, `NEXT_PUBLIC_DOMAIN_CHECK_MODE` (api|redirect).
