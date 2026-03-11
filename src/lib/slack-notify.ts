/**
 * Slack webhook notifications for production events.
 *
 * Two channels configured via env:
 *   SLACK_WEBHOOK_HIGH — revenue, errors, new users
 *   SLACK_WEBHOOK_LOW  — routine activity (generations, checkouts, rate limits)
 *
 * Fires async (non-blocking) — failures are silently ignored so they
 * never affect the user-facing request.
 */

import type { AuditAction } from "./audit-log";

const HIGH_WEBHOOK = process.env.SLACK_WEBHOOK_HIGH;
const LOW_WEBHOOK = process.env.SLACK_WEBHOOK_LOW;

const HIGH_ACTIONS: Set<AuditAction> = new Set([
  "sign_in",           // new users (early traction signal)
  "payment_completed", // revenue
  "pro_granted",       // tier change
  "pro_revoked",       // tier change
  "error",             // something broke
  "stripe_bypass",     // user hit checkout with Stripe unconfigured
]);

const LOW_ACTIONS: Set<AuditAction> = new Set([
  "generate",          // name generation
  "checkout_created",  // started checkout flow
  "rate_limited",      // abuse / overuse signal
]);

// Skip: validate, check_domains — too noisy, no actionable value

const EMOJI: Partial<Record<AuditAction, string>> = {
  sign_in: ":wave:",
  payment_completed: ":moneybag:",
  pro_granted: ":star:",
  pro_revoked: ":no_entry_sign:",
  error: ":rotating_light:",
  generate: ":sparkles:",
  checkout_created: ":credit_card:",
  rate_limited: ":snail:",
  stripe_bypass: ":construction:",
};

function formatMessage(
  action: AuditAction,
  opts: { user?: string; tier?: string; meta?: Record<string, unknown> },
): string {
  const emoji = EMOJI[action] || ":memo:";
  const parts = [`${emoji} *${action}*`];

  if (opts.user) parts.push(`\`${opts.user}\``);

  // Add useful context from meta
  if (opts.meta) {
    const extras: string[] = [];
    if (opts.meta.isNew) extras.push("new user");
    if (opts.meta.aiProvider) extras.push(`provider: ${opts.meta.aiProvider}`);
    if (opts.meta.amount) extras.push(`$${opts.meta.amount}`);
    if (opts.meta.action) extras.push(`action: ${opts.meta.action}`);
    if (opts.meta.error) extras.push(`error: ${opts.meta.error}`);
    if (extras.length) parts.push(`(${extras.join(", ")})`);
  }

  return parts.join(" ");
}

function sendWebhook(url: string, text: string): void {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }).catch(() => {
    // Never let Slack failures affect the app
  });
}

export function slackNotify(
  action: AuditAction,
  opts: { user?: string; tier?: string; meta?: Record<string, unknown> } = {},
): void {
  const text = formatMessage(action, opts);

  if (HIGH_WEBHOOK && HIGH_ACTIONS.has(action)) {
    sendWebhook(HIGH_WEBHOOK, text);
  }

  if (LOW_WEBHOOK && LOW_ACTIONS.has(action)) {
    sendWebhook(LOW_WEBHOOK, text);
  }
}
