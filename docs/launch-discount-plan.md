# Plan: Launch Discount — $29 → $19

## Context
PikName just launched at $29 one-time. To drive early conversions while anchoring perceived value at $29, add a launch discount that charges $19. The discount should feel time-limited/special but be controlled via an env var so it can be turned off later.

## Approach
Add a `LAUNCH_DISCOUNT_CENTS` env var (default: unset = no discount). When set, Stripe charges the discounted amount and all UI shows strikethrough $29 with the discount price. When removed, everything reverts to $29 automatically.

## Files to modify

### 1. `src/lib/stripe.ts` — Apply discount to Stripe checkout
- Read `LAUNCH_DISCOUNT_CENTS` env var (e.g. `1900` for $19)
- If set, use it as `unit_amount`; otherwise default to `2900`
- Update product description to mention launch pricing

### 2. `src/components/landing/Pricing.tsx` — Landing page pricing card
- Fetch discount info (pass via a shared constant or inline env check)
- Show strikethrough `$29` with `$19` next to it
- Add a "Launch discount" badge/label

### 3. `src/components/generate/UpgradePrompt.tsx` — Upgrade modal
- Same strikethrough treatment: `~~$29~~ $19`
- Button text: "Upgrade to Pro — ~~$29~~ $19 one-time"

### 4. `src/components/landing/DemoSection.tsx` — Demo CTA button
- Update "Get Pro — $29 one-time" with discount display

### 5. `.env.example` — Add new env var
- `LAUNCH_DISCOUNT_CENTS=1900`

### 6. `CLAUDE.md` — Document the env var

## Shared discount config
Create a small helper in `src/lib/constants.ts`:
```ts
export const PRICE_CENTS = 2900;
export const DISCOUNT_CENTS = process.env.LAUNCH_DISCOUNT_CENTS
  ? parseInt(process.env.LAUNCH_DISCOUNT_CENTS, 10)
  : null;
```

Since `Pricing.tsx`, `UpgradePrompt.tsx`, and `DemoSection.tsx` are client components, they can't read `process.env` at runtime. Options:
- Use `NEXT_PUBLIC_LAUNCH_DISCOUNT_CENTS` so it's available client-side
- This is fine since the discount price is not sensitive

So: `NEXT_PUBLIC_LAUNCH_DISCOUNT_CENTS` in env, read in constants.ts, import in UI components.

## UI treatment
- Strikethrough original price in muted text: `<span className="line-through text-text-muted">$29</span>`
- Discount price in accent/bold: `<span className="text-accent font-bold">$19</span>`
- Small "Launch offer" badge near the price (mono font, uppercase, accent border — matches existing badge style)

## Verification
1. Set `NEXT_PUBLIC_LAUNCH_DISCOUNT_CENTS=1900` in `.env`
2. `npm run dev` — check landing page pricing card shows ~~$29~~ $19 with badge
3. Check upgrade modal shows discounted price
4. Check DemoSection CTA shows discounted price
5. Click through to Stripe checkout — verify $19 charge amount
6. Unset the env var, restart — verify everything shows $29 with no discount UI
7. `npm run build` — verify no type errors
