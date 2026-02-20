# Generate Flow — End-to-End Request Trace

What happens when a user types an idea and clicks "Generate Names" on `/generate`.

---

## 1. User Submits Idea

**File**: `src/app/generate/page.tsx`

- User types idea into `<IdeaInput>` component
- Clicks "Generate Names" button
- `handleGenerate(idea)` is called
- Sets state: `loading=true`, `selectedName=null`, `error=null`

**File**: `src/components/generate/IdeaInput.tsx`

- `handleSubmit()` fires on form submit
- Checks `sessionStatus`:
  - If `"unauthenticated"` → calls `signIn("google", { callbackUrl: "/generate" })` and **stops here** (user redirected to Google OAuth, then back to `/generate`)
  - If `"authenticated"` → calls `onSubmit(idea.trim())` which triggers `handleGenerate` in the parent

---

## 2. API Request — Name Generation

**File**: `src/app/generate/page.tsx` → `handleGenerate()`

```
fetch("/api/generate", {
  method: "POST",
  body: JSON.stringify({ idea })
})
```

---

## 3. Server: `/api/generate` Route Handler

**File**: `src/app/api/generate/route.ts`

### Step 3a: Authentication Check

```
getServerSession(authOptions)
```

- **File**: `src/lib/auth.ts` — NextAuth config with Google provider
- Reads session cookie, decrypts JWT, returns `session.user.email`
- If no session → **401 "Sign in required"**

### Step 3b: User Lookup

```
db.query.users.findFirst({ where: eq(users.email, session.user.email) })
```

- **File**: `src/lib/db/index.ts` — lazy-initialized Drizzle client
- **File**: `src/lib/db/schema.ts` — `users` table schema
- Queries SQLite for the user record
- If not found → **404 "User not found"**

### Step 3c: Rate Limit Check

```
rateLimit(`generate:${dbUser.id}`, 5)
```

- **File**: `src/lib/rate-limit.ts`
- In-memory sliding window: 5 requests per 60 seconds per user
- Key format: `generate:{userId}`
- If exceeded → **429 "Rate limit exceeded"**

### Step 3d: Generation Limit Check

```
if (dbUser.generationsUsed >= dbUser.generationsLimit)
```

- Free tier: limit is 3, Pro tier: limit is 50
- If exceeded → **403 `{ error: "Generation limit reached", upgrade: true }`**
- Client sees `upgrade: true` → shows `<UpgradePrompt>` modal

### Step 3e: Input Validation

```
if (!idea || idea.length < 10) → 400
```

### Step 3f: Determine Tier Config

```
const tier = TIERS[dbUser.tier]
const count = tier.namesPerGeneration  // free=5, pro=10
```

- **File**: `src/lib/constants.ts` — tier definitions

### Step 3g: Call Name Generator

```
const names = await nameGenerator.generate(idea, count)
```

- **File**: `src/lib/services/name-generator.ts`
- Creates OpenAI chat completion:
  - **Model**: `gpt-4o-mini`
  - **Temperature**: `0.9` (high creativity)
  - **Response format**: `json_object`
  - **System prompt**: Instructs the model to generate short, brandable, spellable SaaS names
  - **User message**: `Generate {count} SaaS name ideas for: {idea}`
- Parses JSON response → array of `{ name, tagline, reasoning }`

### Step 3h: Score Each Name (Parallel)

```
const namesWithScores = await Promise.all(
  names.map(n => brandScorer.score(n.name, idea))
)
```

- **File**: `src/lib/services/brand-scorer.ts`
- For **each name**, creates an OpenAI chat completion:
  - **Model**: `gpt-4o-mini`
  - **Temperature**: `0.4` (more consistent)
  - **System prompt**: Score on 5 dimensions (memorability, pronounceability, uniqueness, relevance, length), compute weighted average
- All names scored **in parallel** via `Promise.all`
- Returns `{ overall: 0-100, breakdown: {...}, summary: "..." }`

### Step 3i: Save to Database

```
db.insert(generations).values({
  userId: dbUser.id,
  ideaText: idea,
  names: namesWithScores,  // stored as JSON
})
```

- **File**: `src/lib/db/schema.ts` — `generations` table
- Names + scores stored as JSON blob in the `names` column

### Step 3j: Increment Usage Counter

```
db.update(users).set({
  generationsUsed: dbUser.generationsUsed + 1,
  updatedAt: new Date(),
})
```

### Step 3k: Return Response

```json
{
  "generationId": "uuid",
  "names": [
    {
      "name": "CalendarIQ",
      "tagline": "Smart scheduling for consultants",
      "reasoning": "Combines calendar with IQ...",
      "brandScore": {
        "overall": 85,
        "breakdown": { "memorability": 88, "pronounceability": 82, ... },
        "summary": "Strong, memorable name..."
      }
    },
    ...
  ],
  "generationsRemaining": 2
}
```

---

## 4. Client Receives Names

**File**: `src/app/generate/page.tsx`

- `setResult(data)` — stores generation result in state
- `setLoading(false)` — hides skeleton loading
- UI renders `<NameList>` with staggered card animations

**File**: `src/components/generate/NameList.tsx`

- Maps over `names` array
- Each card shows: rank number, name, tagline, reasoning, `<BrandScore>` gauge
- Cards animate in with `name-card-enter` class (staggered `animationDelay`)

**File**: `src/components/generate/BrandScore.tsx`

- SVG circle gauge using `strokeDasharray` / `strokeDashoffset`
- Color-coded: green (80+), orange (60-79), red (<60)

---

## 5. User Clicks a Name → Validation

**File**: `src/components/generate/NameList.tsx`

- `onClick={() => onSelect(name)}` → sets `selectedName` in parent

**File**: `src/app/generate/page.tsx`

- `selectedName` state change triggers `<ValidationPanel>` to render

**File**: `src/components/generate/ValidationPanel.tsx`

- `useEffect` on `[name.name, generationId]` fires API call:

```
fetch("/api/validate", {
  method: "POST",
  body: JSON.stringify({ name: name.name, generationId, industry: "technology" })
})
```

---

## 6. Server: `/api/validate` Route Handler

**File**: `src/app/api/validate/route.ts`

### Step 6a: Auth + Rate Limit

- Same pattern as `/api/generate`
- Rate limit: 10 requests per 60 seconds per user

### Step 6b: Determine Tier Features

```
const tier = TIERS[dbUser.tier]
```

- **File**: `src/lib/constants.ts`
- Free tier: `socialHandles=false`, `trademarkScreening=false`, `competitorAnalysis=false`
- Pro tier: all `true`

### Step 6c: Run All Checks in Parallel

```
const [domains, socials, trademark, competitors] = await Promise.all([
  domainChecker.check(name, [...tier.tlds]),              // always runs
  tier.features.socialHandles ? socialChecker.check(name) : null,    // pro only
  tier.features.trademarkScreening ? trademarkScreener.screen(name, industry) : null,  // pro only
  tier.features.competitorAnalysis ? competitorAnalyzer.analyze(name, industry) : null, // pro only
])
```

#### Domain Check (always)
- **File**: `src/lib/services/domain-checker.ts`
- **Mock implementation** — simulates WHOIS lookup
- Free tier checks: `[".com"]`
- Pro tier checks: `[".com", ".io", ".app", ".dev"]`
- `.com` → 30% chance available, others → 60% chance
- Returns: `[{ domain: "calendariq.com", tld: ".com", available: true }, ...]`

#### Social Handle Check (pro only)
- **File**: `src/lib/services/social-checker.ts`
- **Mock implementation** — simulates API checks
- Checks: X (Twitter), LinkedIn, Instagram
- ~50% chance available per platform
- Returns: `[{ platform: "twitter", handle: "@calendariq", available: true }, ...]`

#### Trademark Screening (pro only)
- **File**: `src/lib/services/trademark-screener.ts`
- **OpenAI GPT-4o-mini** (temp 0.3)
- Analyzes for known trademarks, similar-sounding names, registered combinations
- Returns: `{ riskLevel: "clear"|"caution"|"high-risk", details: "...", similarMarks: [...] }`

#### Competitor Analysis (pro only)
- **File**: `src/lib/services/competitor-analyzer.ts`
- **OpenAI GPT-4o-mini** (temp 0.3)
- Finds companies with similar names, rates similarity 0-100
- Returns: `[{ name: "Calendly", url: "...", description: "...", similarity: 72 }, ...]`

### Step 6d: Save to Database

```
db.insert(validations).values({
  generationId, name, domains, socials, trademark, competitors
})
```

- **File**: `src/lib/db/schema.ts` — `validations` table
- All fields stored as JSON

### Step 6e: Return Response

```json
{
  "id": "uuid",
  "name": "CalendarIQ",
  "domains": [{ "domain": "calendariq.com", "tld": ".com", "available": true }, ...],
  "socials": [{ "platform": "twitter", "handle": "@calendariq", "available": true }, ...],
  "trademark": { "riskLevel": "clear", "details": "...", "similarMarks": [] },
  "competitors": [{ "name": "Calendly", "similarity": 72, ... }],
  "tierLocked": {
    "socialHandles": false,
    "trademarkScreening": false,
    "competitorAnalysis": false
  }
}
```

`tierLocked` tells the client which sections to show as locked (free) or unlocked (pro).

---

## 7. Client Renders Validation

**File**: `src/components/generate/ValidationPanel.tsx`

Renders sections in order:
1. **Header**: Name + overall brand score gauge (large) + summary text
2. **Brand Score Breakdown**: 5 progress bars (memorability, pronounceability, uniqueness, relevance, length)
3. **Domains**: List with green "Open" / orange "Taken" status pills
4. **Social Handles**: Platform icons + handle + status pills (or locked section)
5. **Trademark**: Risk level badge (green/orange/red) + details + similar marks tags (or locked section)
6. **Competitors**: Cards with name, description, similarity progress bar (or locked section)

Locked sections show a lock icon and "Upgrade to Pro to unlock" text.

---

## Visual Summary

```
┌─────────────────────────────────────────────────────────┐
│  User types idea → clicks "Generate Names"              │
│  src/components/generate/IdeaInput.tsx                   │
└──────────────────────┬──────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Authenticated? │
              └───┬─────────┬───┘
                  │ No      │ Yes
          ┌───────▼──┐  ┌───▼──────────────────────────┐
          │ Google   │  │ POST /api/generate            │
          │ OAuth    │  │ src/app/api/generate/route.ts │
          └──────────┘  └───┬──────────────────────────┘
                            │
         ┌──────────────────┼──────────────────────┐
         │                  │                      │
    ┌────▼─────┐    ┌──────▼──────┐    ┌──────────▼──────────┐
    │ Auth     │    │ Rate limit  │    │ Generation limit     │
    │ check    │    │ 5/min       │    │ free=3, pro=50       │
    │ auth.ts  │    │ rate-limit  │    │ constants.ts         │
    └────┬─────┘    └──────┬──────┘    └──────────┬──────────┘
         │                 │                      │
         └────────┬────────┘                      │
                  │ All pass                      │ Exceeded
                  │                        ┌──────▼──────────┐
         ┌────────▼──────────┐             │ 403 + upgrade   │
         │ nameGenerator     │             │ → UpgradePrompt │
         │ .generate()       │             └─────────────────┘
         │ name-generator.ts │
         │ GPT-4o-mini       │
         │ temp=0.9          │
         └────────┬──────────┘
                  │ N names
         ┌────────▼──────────┐
         │ brandScorer       │
         │ .score() × N      │  ← parallel
         │ brand-scorer.ts   │
         │ GPT-4o-mini       │
         │ temp=0.4          │
         └────────┬──────────┘
                  │
         ┌────────▼──────────┐
         │ Save to DB        │
         │ generations table │
         │ db/schema.ts      │
         └────────┬──────────┘
                  │
         ┌────────▼──────────┐
         │ Return to client  │
         │ names + scores    │
         └────────┬──────────┘
                  │
    ┌─────────────▼─────────────────┐
    │  User clicks a name           │
    │  NameList.tsx → onSelect()    │
    └─────────────┬─────────────────┘
                  │
    ┌─────────────▼─────────────────┐
    │  POST /api/validate           │
    │  src/app/api/validate/route.ts│
    └─────────────┬─────────────────┘
                  │
    ┌─────────────▼──────────────────────────────┐
    │  Promise.all (parallel)                     │
    ├─────────────────────────────────────────────┤
    │  domainChecker.check()   ← always           │
    │  domain-checker.ts (mock)                   │
    ├─────────────────────────────────────────────┤
    │  socialChecker.check()   ← pro only         │
    │  social-checker.ts (mock)                   │
    ├─────────────────────────────────────────────┤
    │  trademarkScreener.screen() ← pro only      │
    │  trademark-screener.ts (GPT-4o-mini)        │
    ├─────────────────────────────────────────────┤
    │  competitorAnalyzer.analyze() ← pro only     │
    │  competitor-analyzer.ts (GPT-4o-mini)       │
    └─────────────┬──────────────────────────────┘
                  │
    ┌─────────────▼─────────────────┐
    │  Save to DB                   │
    │  validations table            │
    └─────────────┬─────────────────┘
                  │
    ┌─────────────▼─────────────────┐
    │  Render ValidationPanel       │
    │  ValidationPanel.tsx          │
    │  Brand score + domains +      │
    │  socials + trademark +        │
    │  competitors                  │
    └───────────────────────────────┘
```
