#!/usr/bin/env node
/**
 * WhoisXML API stub server for bulk testing domain availability checks
 * without incurring real API costs.
 *
 * Emulates: https://domain-availability.whoisxmlapi.com/api/v1
 *
 * Usage:
 *   node scripts/whoisxml-stub.mjs [port]        # default port 8765
 *
 * Then set in .env.local:
 *   WHOISXML_API_BASE_URL=http://localhost:8765/api/v1
 *
 * Availability logic (override via STUB_MODE env var):
 *   random   (default) — random availability, ~50% available
 *   available           — all domains available
 *   taken               — all domains taken
 *   realistic           — .com always taken, others ~70% available
 */

import http from "http";
import { URL } from "url";

const PORT = parseInt(process.argv[2] ?? process.env.PORT ?? "8765", 10);
const MODE = process.env.STUB_MODE ?? "random";
const LATENCY_MS = parseInt(process.env.STUB_LATENCY_MS ?? "50", 10); // simulate network delay

function isAvailable(domain) {
  switch (MODE) {
    case "available":
      return true;
    case "taken":
      return false;
    case "realistic": {
      const tld = "." + domain.split(".").slice(1).join(".");
      if (tld === ".com") return false; // .com always taken in realistic mode
      // Deterministic per domain so repeated checks are consistent
      const hash = [...domain].reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return hash % 10 < 7; // ~70% available
    }
    case "random":
    default:
      return Math.random() > 0.5;
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Only handle the WhoisXML endpoint path
  if (!url.pathname.startsWith("/api/v1")) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const domainName = url.searchParams.get("domainName");
  if (!domainName) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "domainName is required" }));
    return;
  }

  const available = isAvailable(domainName);

  const body = JSON.stringify({
    DomainInfo: {
      domainName,
      domainAvailability: available ? "AVAILABLE" : "UNAVAILABLE",
    },
  });

  console.log(`[stub] ${domainName} → ${available ? "AVAILABLE" : "UNAVAILABLE"} (mode: ${MODE})`);

  setTimeout(() => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(body);
  }, LATENCY_MS);
});

server.listen(PORT, () => {
  console.log(`WhoisXML stub running on http://localhost:${PORT}/api/v1`);
  console.log(`Mode: ${MODE} | Latency: ${LATENCY_MS}ms`);
  console.log(`\nSet in .env.local:\n  WHOISXML_API_BASE_URL=http://localhost:${PORT}/api/v1`);
});
