#!/usr/bin/env npx tsx
/**
 * Grant Pro access to a user by email (for beta testers / friends).
 *
 * Usage:
 *   npx tsx scripts/grant-pro.ts friend@example.com
 *   npx tsx scripts/grant-pro.ts friend@example.com --generations=10
 *   npx tsx scripts/grant-pro.ts friend@example.com --revoke
 *
 * Options:
 *   --generations=N   Max generations allowed (default: 10)
 *   --names=N         Names per generation (default: 10, pro default)
 *   --revoke          Revert user back to free tier
 *
 * If the user hasn't signed in yet, a row is pre-created. When they sign in
 * via Google, their profile and googleId will be backfilled automatically.
 */

import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { users } from "../src/lib/db/schema";

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith("--"));

if (!email) {
  console.error("Usage: npx tsx scripts/grant-pro.ts <email> [--generations=N] [--names=N] [--revoke]");
  process.exit(1);
}

const revoke = args.includes("--revoke");
const generationsLimit = Number(args.find((a) => a.startsWith("--generations="))?.split("=")[1]) || 10;
const namesPerGeneration = Number(args.find((a) => a.startsWith("--names="))?.split("=")[1]) || 10;

const db = getDb();

const user = db.select().from(users).where(eq(users.email, email)).get();

if (!user && revoke) {
  console.error(`No user found with email: ${email} — nothing to revoke.`);
  process.exit(1);
}

if (!user) {
  db.insert(users)
    .values({
      email,
      tier: "pro",
      generationsUsed: 0,
      generationsLimit,
      namesPerGeneration,
    })
    .run();

  console.log(`Pre-created Pro account for ${email}`);
  console.log(`  Generations: ${generationsLimit}`);
  console.log(`  Names/gen:   ${namesPerGeneration}`);
  console.log(`  They'll get Pro access as soon as they sign in with Google.`);
  process.exit(0);
}

if (revoke) {
  db.update(users)
    .set({
      tier: "free",
      generationsLimit: 1,
      namesPerGeneration: 5,
      generationsUsed: 0,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .run();

  console.log(`Revoked Pro access for ${email} (back to free tier).`);
} else {
  db.update(users)
    .set({
      tier: "pro",
      generationsLimit,
      namesPerGeneration,
      generationsUsed: 0,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .run();

  console.log(`Granted Pro access to ${email}`);
  console.log(`  Generations: ${generationsLimit}`);
  console.log(`  Names/gen:   ${namesPerGeneration}`);
}
