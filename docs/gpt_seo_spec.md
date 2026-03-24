# Pikname Programmatic SEO Page Generator Spec

## 🎯 Objective

Generate SEO-optimized landing pages for Pikname to capture top-of-funnel traffic for "name ideas" and "name generator" queries across industries and styles.

---

## 📦 Output Requirement

For each page, generate:

* URL slug
* Title tag
* Meta description
* H1
* Intro paragraph
* 50–100 name ideas
* CTA section
* FAQ section
* Internal links

---

## 🔗 URL Structure

Use the following patterns:

1. `/names/{industry}`
2. `/names/{industry}/{modifier}`

Examples:

* /names/ai
* /names/ai/startup
* /names/fintech
* /names/ecommerce/catchy

---

## 🏷️ Title Tag Format

{Modifier?} {Industry} Name Ideas + Generator (100+ Examples)

Examples:

* AI Startup Name Ideas + Generator (100+ Examples)
* Catchy Ecommerce Store Name Ideas + Generator

---

## 📝 Meta Description

Generate a compelling meta description:

Format:
Discover 100+ {modifier?} {industry} name ideas. Generate unique, brandable names instantly with our AI-powered name generator.

---

## 🧱 Page Content Structure

### 1. H1

{Modifier?} {Industry} Name Ideas

---

### 2. Intro Paragraph (2–3 sentences)

Guidelines:

* Mention keyword naturally
* Mention "100+ name ideas"
* Mention "AI-powered generator"
* Keep it human and simple

---

### 3. Name Ideas List

Generate 50–100 names using a mix of:

#### Pattern 1: Prefix + Core + Suffix

Examples:

* NeoDataLab
* FinFlowly
* ShopBase

#### Pattern 2: Compound words

Examples:

* BrightCart
* UrbanNest
* QuickFund

#### Pattern 3: Invented brand names

Examples:

* Zyntra
* Velora
* Nexify

#### Pattern 4: Real-word + twist

Examples:

* PixelForge
* GrowthPilot
* LaunchGrid

---

### Industry-specific word bank (IMPORTANT)

Use relevant words per industry:

AI:

* data, neural, mind, brain, logic, intel

Fintech:

* pay, fund, capital, flow, finance

Ecommerce:

* cart, shop, store, mart, buy

Healthcare:

* care, health, med, life, clinic

Edtech:

* learn, edu, skill, academy

---

### 4. CTA Section

Include:

Header:
Generate Custom Names for Your Idea

Text:
Use our AI-powered name generator to create unique names tailored to your business.

Include:

* Input field (placeholder text)
* Generate button

---

### 5. FAQ Section (3 questions minimum)

#### Q1: What makes a good {industry} name?

Answer:

* Short
* Easy to pronounce
* Relevant
* Brandable

#### Q2: How do I check domain availability?

Answer:

* Use domain registrars (Namecheap, GoDaddy)

#### Q3: Can I trademark these names?

Answer:

* Depends on jurisdiction

---

### 6. Internal Links Section

Add 3–5 links to other pages:

Examples:

* AI Names
* Fintech Names
* Startup Name Ideas
* Brand Name Generator

---

## 🧠 Content Rules

* Avoid duplicate intros across pages (vary wording slightly)
* Keep tone simple and helpful
* Do NOT overuse keywords (no keyword stuffing)
* Names should be pronounceable and brandable
* Avoid gibberish or random strings

---

## ⚙️ Generation Inputs

Your system should accept:

* industry (required)
* modifier (optional)

Example input:
{
"industry": "ai",
"modifier": "futuristic"
}

---

## 📈 Scaling Instructions

* Generate 20–50 pages per batch
* Ensure unique content per page
* Store generated names for reuse if needed
* Prioritize high-intent industries first:

  * ai
  * fintech
  * ecommerce
  * saas

---

## 🚫 Avoid

* Duplicate pages
* Thin content (must include 50+ names)
* Keyword stuffing
* Overly long paragraphs

---

## ✅ Success Criteria

Each page should:

* Target a clear keyword
* Provide real value (actual name ideas)
* Include a working CTA
* Be indexable by search engines

---

## 🔥 Example Input/Output

Input:
{
"industry": "ai",
"modifier": "futuristic"
}

Output:

* /names/ai/futuristic
* Title: Futuristic AI Name Ideas + Generator (100+ Examples)
* 50–100 relevant names
* Full structured page

---

## END OF SPEC
