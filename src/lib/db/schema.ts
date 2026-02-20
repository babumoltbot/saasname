import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  googleId: text("google_id").unique(),
  tier: text("tier", { enum: ["free", "pro"] }).notNull().default("free"),
  generationsUsed: integer("generations_used").notNull().default(0),
  generationsLimit: integer("generations_limit").notNull().default(3),
  namesPerGeneration: integer("names_per_generation").notNull().default(5),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  ideaText: text("idea_text").notNull(),
  names: text("names", { mode: "json" }).notNull(), // JSON array of generated names
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const validations = sqliteTable("validations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  generationId: text("generation_id").notNull().references(() => generations.id),
  name: text("name").notNull(),
  domains: text("domains", { mode: "json" }), // JSON
  socials: text("socials", { mode: "json" }), // JSON
  trademark: text("trademark", { mode: "json" }), // JSON
  competitors: text("competitors", { mode: "json" }), // JSON
  brandScore: integer("brand_score"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const featureInterest = sqliteTable("feature_interest", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  feature: text("feature").notNull(), // e.g. "domain_check", "social_handles"
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
