// Legacy init script — kept for quick local setup.
// Production deployments use auto-migration via drizzle-orm/migrator (see src/lib/db/index.ts).

import { resolve } from "path";
import { mkdirSync } from "fs";

const dbPath = resolve("data/pikname.db");
mkdirSync("data", { recursive: true });

// Just trigger the DB singleton which runs migrate() automatically
const { getDb } = require("./index");
getDb();

console.log("Database initialized at", dbPath);
