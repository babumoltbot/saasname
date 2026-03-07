# Rebrand: SaaSName → PikName

Domain registered: **pikname.com**

## Files Changed

| Area | Files |
|---|---|
| **Package name** | `package.json`, `package-lock.json` |
| **Database path** | `src/lib/db/index.ts`, `src/lib/db/init.ts`, `drizzle.config.ts` + renamed `data/saasname.db` → `data/pikname.db` |
| **Metadata/SEO** | `src/app/layout.tsx` (title, OG, Twitter), `index.html` (all meta tags) |
| **URLs** | `CNAME`, `src/app/layout.tsx`, `index.html` — all `saasname.nagrao.dev` → `pikname.com` |
| **UI text** | `src/components/landing/TerminalDemo.tsx`, `src/components/landing/DemoSection.tsx` |
| **Stripe** | `src/lib/stripe.ts` — product name → "PikName Pro" |
| **CLI** | `scripts/generate.ts` |
| **Docs** | `CLAUDE.md`, `README.md`, `docs/BUILD_LOG.md`, `docs/free-tier-strategy.md` |
