#!/usr/bin/env npx tsx
/**
 * List all users in the database with details.
 *
 * Usage:
 *   npx tsx scripts/list-users.ts
 *   npx tsx scripts/list-users.ts --pro       # Pro users only
 *   npx tsx scripts/list-users.ts --free      # Free users only
 */

import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { users } from "../src/lib/db/schema";

const args = process.argv.slice(2);
const filterPro = args.includes("--pro");
const filterFree = args.includes("--free");

const db = getDb();

let query = db.select().from(users);
if (filterPro) query = query.where(eq(users.tier, "pro")) as typeof query;
if (filterFree) query = query.where(eq(users.tier, "free")) as typeof query;

const rows = query.all();

if (rows.length === 0) {
  console.log("No users found.");
  process.exit(0);
}

for (const u of rows) {
  const created = u.createdAt ? new Date(u.createdAt).toISOString() : "—";
  const updated = u.updatedAt ? new Date(u.updatedAt).toISOString() : "—";

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Email:       ${u.email}`);
  console.log(`  Name:        ${u.name ?? "—"}`);
  console.log(`  Tier:        ${u.tier}`);
  console.log(`  Generations: ${u.generationsUsed} / ${u.generationsLimit}`);
  console.log(`  Names/gen:   ${u.namesPerGeneration}`);
  console.log(`  Stripe:      ${u.stripeCustomerId ?? "—"}`);
  console.log(`  Created:     ${created}`);
  console.log(`  Updated:     ${updated}`);
}

console.log(`\n${"─".repeat(60)}`);
console.log(`Total: ${rows.length} user${rows.length !== 1 ? "s" : ""}`);
