import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { resolve } from "path";
import * as schema from "./schema";

let _db: BetterSQLite3Database<typeof schema> | null = null;

export function getDb() {
  if (!_db) {
    mkdirSync("data", { recursive: true });
    const sqlite = new Database("data/pikname.db");
    sqlite.pragma("journal_mode = WAL");
    _db = drizzle(sqlite, { schema });
    migrate(_db, { migrationsFolder: resolve("drizzle") });
  }
  return _db;
}

// Convenience export — callers can use `db` directly
export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
