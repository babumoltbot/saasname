"use client";

import { useState, useEffect } from "react";
import type { NameWithScore } from "@/app/generate/page";
import type {
  DomainResult,
  SocialResult,
  TrademarkResult,
  Competitor,
} from "@/lib/services/interfaces";
import BrandScore from "./BrandScore";

interface Props {
  name: NameWithScore;
  generationId: string;
}

interface ValidationData {
  domains: DomainResult[] | null;
  socials: SocialResult[] | null;
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

function StatusPill({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase px-2 py-0.5 rounded-full ${
        available
          ? "text-accent bg-accent/10"
          : "text-warning bg-warning/10"
      }`}
    >
      <span className={`w-1 h-1 rounded-full ${available ? "bg-accent" : "bg-warning"}`} />
      {available ? "Open" : "Taken"}
    </span>
  );
}

export default function ValidationPanel({ name, generationId }: Props) {
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(false);

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

        {/* Domains */}
        {data.domains && (
          <div>
            <SectionLabel>Domains</SectionLabel>
            <div className="grid grid-cols-1 gap-1.5">
              {data.domains.map((d) => (
                <div
                  key={d.domain}
                  className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${
                    d.available ? "bg-accent/[0.04]" : "bg-surface-raised/50"
                  }`}
                >
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-secondary">
                    {d.domain}
                  </span>
                  <StatusPill available={d.available} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Socials */}
        {data.socials ? (
          <div>
            <SectionLabel>Social Handles</SectionLabel>
            <div className="grid grid-cols-1 gap-1.5">
              {data.socials.map((s) => (
                <div
                  key={s.platform}
                  className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${
                    s.available ? "bg-accent/[0.04]" : "bg-surface-raised/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={s.platform} />
                    <span className="text-xs text-text-secondary">
                      <span className="font-[family-name:var(--font-mono)] text-text-muted">
                        {s.handle}
                      </span>
                    </span>
                  </div>
                  <StatusPill available={s.available} />
                </div>
              ))}
            </div>
          </div>
        ) : data.tierLocked.socialHandles ? (
          <LockedSection label="Social Handles" />
        ) : null}

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
      <p className="text-xs text-text-muted">
        {label}
      </p>
      <p className="text-[10px] text-accent mt-1 font-medium">Upgrade to Pro to unlock</p>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const iconClass = "w-3.5 h-3.5 text-text-muted";

  if (platform === "twitter") {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="currentColor">
        <path d="M9.333 6.929L14.546 1H13.31L8.783 6.147L5.169 1H1L6.466 8.783L1 15h1.235l5.66-6.58L11.831 15H16L9.333 6.929zM7.641 7.62l-.656-.938L2.767 1.91h2.248l4.21 6.025l.656.937l5.474 7.83h-2.248L7.641 7.62z" />
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="currentColor">
        <path d="M4.532 14H1.87V5.312h2.662V14zM3.2 4.16C2.29 4.16 1.6 3.45 1.6 2.56c0-.89.7-1.56 1.6-1.56.9 0 1.6.67 1.6 1.56 0 .89-.7 1.6-1.6 1.6zM14.4 14h-2.66V9.78c0-1.01-.02-2.3-1.4-2.3-1.4 0-1.62 1.1-1.62 2.23V14H6.02V5.312h2.56v1.19h.04c.36-.68 1.23-1.4 2.53-1.4 2.7 0 3.2 1.78 3.2 4.1V14z" />
      </svg>
    );
  }
  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.44c1.753 0 1.96.007 2.652.038.64.029 1.147.174 1.554.371.42.203.777.475 1.132.83.355.355.627.712.83 1.132.197.407.342.915.371 1.554.031.692.038.9.038 2.635s-.007 1.943-.038 2.635c-.029.64-.174 1.147-.371 1.554a3.239 3.239 0 01-.83 1.132 3.239 3.239 0 01-1.132.83c-.407.197-.915.342-1.554.371-.692.031-.9.038-2.652.038s-1.96-.007-2.652-.038c-.64-.029-1.147-.174-1.554-.371a3.239 3.239 0 01-1.132-.83 3.239 3.239 0 01-.83-1.132c-.197-.407-.342-.915-.371-1.554C1.447 9.96 1.44 9.753 1.44 8s.007-1.96.038-2.652c.029-.64.174-1.147.371-1.554.203-.42.475-.777.83-1.132a3.239 3.239 0 011.132-.83c.407-.197.915-.342 1.554-.371C6.04 1.447 6.247 1.44 8 1.44zM8 4.16a3.84 3.84 0 100 7.68 3.84 3.84 0 000-7.68zm0 6.336A2.496 2.496 0 118 5.504 2.496 2.496 0 018 10.496zm4.992-6.48a.896.896 0 11-1.792 0 .896.896 0 011.792 0z" />
    </svg>
  );
}
