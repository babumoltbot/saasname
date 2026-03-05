# SaaSName — Free Tier Replacement Strategy

## Problem

The current Free tier (3 generations, 5 names, .com only) is likely to serve casual users fully without converting them to Pro. Since SaaSName is a one-time-use tool for most founders, a functional free tier bleeds API costs with low conversion upside.

---

## Proposed Solution: Cached Demo Mode

Replace the Free tier with a set of **pre-run, cached demo journeys**. Users can explore the full product experience at zero ongoing cost to you.

### How It Works

- Curate **5–8 realistic demo inputs** (e.g. "AI scheduling tool for consultants", "expense tracker for freelancers", "client portal for agencies")
- Run each one-time through the full pipeline: AI name generation → domain checks → social handles → trademark screening → brand score
- Cache and serve these results statically to all unauthenticated/free users
- No API calls on every visit — runs once, serves forever

---

## Implementation Tasks

### 1. Remove the Free Tier from Pricing

- Delete the Free plan card from the pricing section
- Replace the "Get Started" CTA with a **"See a Live Demo →"** button that scrolls to the demo section
- Reframe: not "limited free plan" but "try before you buy"

### 2. Build the Demo Picker UI

- Show a list of pre-selected demo inputs (chips or a dropdown)
- On selection, load the cached result instantly
- Label clearly as **"Demo Report"** or **"Sample Run"** — don't hide it, but make it look great
- The goal is to impress, not to disclaim

### 3. Gate the PDF Export

- In demo mode, show the PDF report as a **blurred or watermarked preview**
- Add a CTA overlay: "Unlock your full PDF report — Get Pro for $29"
- This is a high-converting trigger since PDF export is an explicit Pro feature

### 4. Update the Hero / Try It Section

- Replace the free generation form with the demo picker for logged-out users
- Keep the form functional but require Pro purchase (or add a single free real run — see note below)

---

## Optional: One Real Generation Hook

Some indie SaaS founders suggest allowing **one real, uncached generation** (no card required) to create genuine user investment before the paywall hits.

**Pros:** User gets personalized results, higher emotional stakes, stronger conversion signal  
**Cons:** Casual/one-time users may get full value from a single run and never pay

**Recommendation:** Given SaaSName's one-time-use nature, skip this for now. Start with pure cached demos and measure conversion. Add the one-free-run hook only if demo-to-paid conversion is low.

---

## Demo Input Suggestions

| Input | Why It's Good |
|---|---|
| "AI scheduling tool for consultants" | Broad, relatable |
| "Expense tracker for freelancers" | Common indie SaaS idea |
| "Client portal for agencies" | B2B, professional |
| "Habit tracker with AI coaching" | Consumer + AI angle |
| "Invoice generator for contractors" | High purchase intent audience |
| "SEO audit tool for small businesses" | Developer/founder adjacent |

---

## Pricing Section — After Change

**Before:**
- Free — $0
- Pro — $29 one-time

**After:**
- ~~Free tier~~ → replaced with Demo Mode (no plan card)
- Pro — $29 one-time (only paid option)
- Add a line under Pro: *"Not sure yet? [Try the demo →](#demo)"*

---

## Summary

| | Current Free Tier | Cached Demo Mode |
|---|---|---|
| API cost per visitor | Yes | No (one-time) |
| Shows full product quality | Partial | Yes |
| Converts casual users | No | N/A — they use demo |
| Converts serious founders | Low | Higher (full preview + PDF gate) |
| Implementation complexity | Already built | Low–Medium |
