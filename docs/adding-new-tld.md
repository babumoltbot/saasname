# Adding Support for a New TLD

## Checklist

```
src/lib/constants.ts
  DIRECT_CHECK_TLDS → add ".newTld"
  TIERS.free.tlds   → add if free tier should see it
  TIERS.pro.tlds    → add if pro tier should see it
```

## How it works

`DIRECT_CHECK_TLDS` controls whether a TLD gets a live availability check (WhoisXML API) or falls back to an external Namecheap link. TLDs in the list show per-row status + the "Check all" button; TLDs outside it show as badges with a registrar redirect.

The POST `/api/check-domains` validates that every requested TLD is in the user's tier's `tlds` list — if not, it returns 403. So a TLD must be in both `DIRECT_CHECK_TLDS` and the relevant tier(s) for the full flow to work.

## What requires no changes

- "Check all" button logic — automatically picks up new TLDs from `DIRECT_CHECK_TLDS`
- Domain row rendering — generated from the tier's `tlds` list
- DB cache (`domainChecks` table) — works for any domain string
- Landing page `DemoSection` — also reads `DIRECT_CHECK_TLDS` for its display logic
- `domain-checker.ts` service — calls WhoisXML generically, should work for any TLD (verify once)
