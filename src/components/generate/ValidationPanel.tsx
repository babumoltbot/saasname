"use client";

import { useState, useEffect } from "react";
import type { NameWithScore } from "@/app/generate/page";
import type {
  TrademarkResult,
  Competitor,
} from "@/lib/services/interfaces";
import BrandScore from "./BrandScore";

interface Props {
  name: NameWithScore;
  generationId: string;
}

interface ValidationData {
  trademark: TrademarkResult | null;
  competitors: Competitor[] | null;
  tierLocked: {
    socialHandles: boolean;
    trademarkScreening: boolean;
    competitorAnalysis: boolean;
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
      <span className="w-4 h-px bg-border" />
      {children}
    </h4>
  );
}


export default function ValidationPanel({ name, generationId }: Props) {
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notified, setNotified] = useState<Record<string, boolean>>({});

  async function notifyInterest(feature: string) {
    if (notified[feature]) return;
    setNotified((prev) => ({ ...prev, [feature]: true }));
    await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature }),
    }).catch(() => {});
  }

  useEffect(() => {
    setData(null);
    setLoading(true);

    fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.name,
        generationId,
        industry: "technology",
      }),
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [name.name, generationId]);

  if (loading) {
    return (
      <div className="bg-surface/70 border border-border/50 rounded-2xl p-6 space-y-5 animate-scale-in">
        <div className="flex items-center gap-4">
          <div className="skeleton-line w-[96px] h-[96px] !rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="skeleton-line h-6 w-32" />
            <div className="skeleton-line h-3 w-full" />
            <div className="skeleton-line h-3 w-3/4" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton-line h-3 w-24" />
            <div className="skeleton-line h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-slide-in-right bg-surface/70 border border-border/50 rounded-2xl overflow-hidden">
      {/* Header with score */}
      <div className="relative p-6 pb-5 bg-gradient-to-b from-accent/[0.03] to-transparent">
        <div className="flex items-start gap-4">
          <BrandScore score={name.brandScore.overall} size="lg" animated />
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-xl font-bold tracking-tight">{name.name}</h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {name.brandScore.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-5">
        {/* Brand breakdown */}
        <div>
          <SectionLabel>Brand Score</SectionLabel>
          <div className="space-y-2.5">
            {Object.entries(name.brandScore.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[11px] text-text-secondary w-24 capitalize">
                  {key}
                </span>
                <div className="flex-1 h-1 bg-border/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${val}%`,
                      background:
                        val >= 80
                          ? "var(--color-accent)"
                          : val >= 60
                          ? "var(--color-warning)"
                          : "#ef4444",
                    }}
                  />
                </div>
                <span className="text-[10px] text-text-muted font-[family-name:var(--font-mono)] w-6 text-right tabular-nums">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/40" />

        {/* Domains — Coming Soon */}
        <ComingSoonSection
          label="Domain Availability"
          description="Real-time WHOIS lookup across .com, .io, .app, .dev and more."
          feature="domain_check"
          notified={!!notified["domain_check"]}
          onNotify={() => notifyInterest("domain_check")}
        />

        {/* Socials — Coming Soon */}
        <ComingSoonSection
          label="Social Handles"
          description="Instant availability check on X, LinkedIn, and Instagram."
          feature="social_handles"
          notified={!!notified["social_handles"]}
          onNotify={() => notifyInterest("social_handles")}
        />

        {/* Trademark */}
        {data.trademark ? (
          <div>
            <SectionLabel>Trademark</SectionLabel>
            <div
              className={`p-3.5 rounded-xl border text-sm ${
                data.trademark.riskLevel === "clear"
                  ? "bg-accent/[0.04] border-accent/15"
                  : data.trademark.riskLevel === "caution"
                  ? "bg-warning/[0.04] border-warning/15"
                  : "bg-red-500/[0.04] border-red-500/15"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    data.trademark.riskLevel === "clear"
                      ? "bg-accent"
                      : data.trademark.riskLevel === "caution"
                      ? "bg-warning"
                      : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    data.trademark.riskLevel === "clear"
                      ? "text-accent"
                      : data.trademark.riskLevel === "caution"
                      ? "text-warning"
                      : "text-red-400"
                  }`}
                >
                  {data.trademark.riskLevel === "clear"
                    ? "All Clear"
                    : data.trademark.riskLevel === "caution"
                    ? "Proceed with Caution"
                    : "High Risk"}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {data.trademark.details}
              </p>
              {data.trademark.similarMarks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {data.trademark.similarMarks.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] font-[family-name:var(--font-mono)] text-text-muted bg-surface-raised px-2 py-0.5 rounded"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : data.tierLocked.trademarkScreening ? (
          <LockedSection label="Trademark Screening" />
        ) : null}

        {/* Competitors */}
        {data.competitors && data.competitors.length > 0 ? (
          <div>
            <SectionLabel>Competitors</SectionLabel>
            <div className="space-y-1.5">
              {data.competitors.map((c) => (
                <div
                  key={c.name}
                  className="p-3 bg-surface-raised/40 rounded-xl border border-border/30"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{c.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-warning"
                          style={{ width: `${c.similarity}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted font-[family-name:var(--font-mono)] tabular-nums">
                        {c.similarity}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : data.tierLocked.competitorAnalysis ? (
          <LockedSection label="Competitor Analysis" />
        ) : null}
      </div>
    </div>
  );
}

function LockedSection({ label }: { label: string }) {
  return (
    <div className="p-5 border border-dashed border-border/40 rounded-xl text-center bg-surface/30">
      <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-surface border border-border/50 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-text-muted">
          <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-[10px] text-accent mt-1 font-medium">Upgrade to Pro to unlock</p>
    </div>
  );
}

function ComingSoonSection({
  label,
  description,
  notified,
  onNotify,
}: {
  label: string;
  description: string;
  feature: string;
  notified: boolean;
  onNotify: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-dashed border-border/40 bg-surface/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SectionLabel>{label}</SectionLabel>
            <span className="text-[9px] font-semibold font-[family-name:var(--font-mono)] tracking-widest uppercase text-text-muted bg-surface-raised px-1.5 py-0.5 rounded -mt-3">
              Coming Soon
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">{description}</p>
        </div>
        <button
          onClick={onNotify}
          disabled={notified}
          className={`shrink-0 text-[10px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            notified
              ? "border-accent/20 text-accent bg-accent/5 cursor-default"
              : "border-border/50 text-text-muted bg-surface hover:border-accent/40 hover:text-accent cursor-pointer"
          }`}
        >
          {notified ? "✓ Noted" : "Notify me"}
        </button>
      </div>
    </div>
  );
}
