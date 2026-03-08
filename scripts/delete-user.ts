#!/usr/bin/env npx tsx
/**
 * Delete a user and all their related data from the local DB.
 *
 * Usage:
 *   npx tsx scripts/delete-user.ts user@example.com
 *
 * Deletes (in FK order): validations → generations → featureInterest → user
 */

import { eq, inArray } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { users, generations, validations, featureInterest } from "../src/lib/db/schema";

const email = process.argv.slice(2).find((a) => !a.startsWith("--"));

if (!email) {
  console.error("Usage: npx tsx scripts/delete-user.ts <email>");
  process.exit(1);
}

const db = getDb();

const user = db.select().from(users).where(eq(users.email, email)).get();

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

// Get generation IDs for cascading deletes
const gens = db.select({ id: generations.id }).from(generations).where(eq(generations.userId, user.id)).all();
const genIds = gens.map((g) => g.id);

let deletedValidations = 0;
if (genIds.length > 0) {
  const result = db.delete(validations).where(inArray(validations.generationId, genIds)).run();
  deletedValidations = result.changes;
}

const deletedGenerations = db.delete(generations).where(eq(generations.userId, user.id)).run().changes;
const deletedFeatureInterest = db.delete(featureInterest).where(eq(featureInterest.userId, user.id)).run().changes;
db.delete(users).where(eq(users.id, user.id)).run();

console.log(`Deleted user: ${email} (${user.name || "no name"})`);
console.log(`  Validations:      ${deletedValidations}`);
console.log(`  Generations:      ${deletedGenerations}`);
console.log(`  Feature interest: ${deletedFeatureInterest}`);
