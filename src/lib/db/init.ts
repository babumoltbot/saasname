import Database from "better-sqlite3";
import { resolve } from "path";
import { mkdirSync } from "fs";

const dbPath = resolve("data/saasname.db");
mkdirSync("data", { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    image TEXT,
    google_id TEXT UNIQUE,
    tier TEXT NOT NULL DEFAULT 'free',
    generations_used INTEGER NOT NULL DEFAULT 0,
    generations_limit INTEGER NOT NULL DEFAULT 3,
    names_per_generation INTEGER NOT NULL DEFAULT 5,
    stripe_customer_id TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS generations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    idea_text TEXT NOT NULL,
    names TEXT NOT NULL,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS validations (
    id TEXT PRIMARY KEY,
    generation_id TEXT NOT NULL REFERENCES generations(id),
    name TEXT NOT NULL,
    domains TEXT,
    socials TEXT,
    trademark TEXT,
    competitors TEXT,
    brand_score INTEGER,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS domain_checks (
    domain TEXT PRIMARY KEY,
    available INTEGER NOT NULL,
    checked_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feature_interest (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    feature TEXT NOT NULL,
    created_at INTEGER
  );
`);

console.log("Database initialized at", dbPath);
sqlite.close();
