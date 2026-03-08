import fs from "node:fs";
import path from "node:path";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";

const LOGS_DIR = process.env.AUDIT_LOG_DIR || path.join(process.cwd(), "logs");

let currentDate = "";
let currentStream: fs.WriteStream | null = null;

function getDateStr(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function getLogPath(dateStr: string): string {
  return path.join(LOGS_DIR, `audit-${dateStr}.log`);
}

function ensureStream(): fs.WriteStream {
  const today = getDateStr();

  if (currentStream && currentDate === today) {
    return currentStream;
  }

  // Date changed — close old stream and gzip the previous day's file
  if (currentStream) {
    const prevPath = getLogPath(currentDate);
    currentStream.end();
    currentStream = null;
    gzipFile(prevPath).catch(() => {});
  }

  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }

  currentDate = today;
  currentStream = fs.createWriteStream(getLogPath(today), { flags: "a" });
  return currentStream;
}

async function gzipFile(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) return;
  const gzPath = filePath + ".gz";
  if (fs.existsSync(gzPath)) return;
  await pipeline(
    createReadStream(filePath),
    createGzip(),
    createWriteStream(gzPath),
  );
  fs.unlinkSync(filePath);
}

export type AuditAction =
  | "sign_in"
  | "generate"
  | "validate"
  | "check_domains"
  | "checkout_created"
  | "payment_completed"
  | "pro_granted"
  | "pro_revoked"
  | "rate_limited"
  | "error";

interface AuditEntry {
  timestamp: string;
  action: AuditAction;
  user?: string;
  tier?: string;
  meta?: Record<string, unknown>;
}

export function audit(
  action: AuditAction,
  opts: { user?: string; tier?: string; meta?: Record<string, unknown> } = {},
) {
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action,
    ...opts,
  };

  try {
    const stream = ensureStream();
    stream.write(JSON.stringify(entry) + "\n");
  } catch {
    // Logging should never crash the app
  }

  // Async Slack notification (non-blocking, lazy import to avoid circular deps)
  import("./slack-notify").then(({ slackNotify }) => {
    slackNotify(action, opts);
  }).catch(() => {});
}

// Gzip any leftover un-gzipped log files from previous days on startup
export function gzipStaleLogFiles(): void {
  if (!fs.existsSync(LOGS_DIR)) return;
  const today = getDateStr();
  const files = fs.readdirSync(LOGS_DIR);
  for (const file of files) {
    if (file.endsWith(".log") && !file.includes(today)) {
      gzipFile(path.join(LOGS_DIR, file)).catch(() => {});
    }
  }
}

gzipStaleLogFiles();
