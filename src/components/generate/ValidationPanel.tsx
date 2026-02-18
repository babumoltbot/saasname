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
      <div className="bg-surface border border-border rounded-xl p-6 h-fit animate-pulse">
        <div className="h-6 bg-border rounded w-3/4 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-border rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-fit space-y-6 max-[1024px]:col-span-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BrandScore score={name.brandScore.overall} size="lg" />
        <div>
          <h3 className="text-xl font-bold">{name.name}</h3>
          <p className="text-sm text-text-secondary">
            {name.brandScore.summary}
          </p>
        </div>
      </div>

      {/* Brand breakdown */}
      <div>
        <h4 className="font-[family-name:var(--font-mono)] text-xs tracking-[1.5px] uppercase text-text-muted mb-3">
          Brand Score Breakdown
        </h4>
        <div className="space-y-2">
          {Object.entries(name.brandScore.breakdown).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-28 capitalize">
                {key}
              </span>
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${val}%` }}
                />
              </div>
              <span className="text-xs text-text-muted font-[family-name:var(--font-mono)] w-8 text-right">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Domains */}
      {data.domains && (
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-xs tracking-[1.5px] uppercase text-text-muted mb-3">
            Domain Availability
          </h4>
          <div className="space-y-2">
            {data.domains.map((d) => (
              <div
                key={d.domain}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-[family-name:var(--font-mono)] text-text-secondary">
                  {d.domain}
                </span>
                <span
                  className={
                    d.available ? "text-accent" : "text-warning"
                  }
                >
                  {d.available ? "Available" : "Taken"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Socials */}
      {data.socials ? (
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-xs tracking-[1.5px] uppercase text-text-muted mb-3">
            Social Handles
          </h4>
          <div className="space-y-2">
            {data.socials.map((s) => (
              <div
                key={s.platform}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-text-secondary capitalize">
                  {s.platform === "twitter" ? "X (Twitter)" : s.platform}{" "}
                  <span className="text-text-muted font-[family-name:var(--font-mono)]">
                    {s.handle}
                  </span>
                </span>
                <span
                  className={
                    s.available ? "text-accent" : "text-warning"
                  }
                >
                  {s.available ? "Available" : "Taken"}
                </span>
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
          <h4 className="font-[family-name:var(--font-mono)] text-xs tracking-[1.5px] uppercase text-text-muted mb-3">
            Trademark Screening
          </h4>
          <div
            className={`p-3 rounded-lg border text-sm ${
              data.trademark.riskLevel === "clear"
                ? "bg-accent/5 border-accent/20 text-accent"
                : data.trademark.riskLevel === "caution"
                ? "bg-warning/5 border-warning/20 text-warning"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            <div className="font-semibold capitalize mb-1">
              {data.trademark.riskLevel === "clear"
                ? "Clear"
                : data.trademark.riskLevel === "caution"
                ? "Caution"
                : "High Risk"}
            </div>
            <p className="text-text-secondary text-xs">
              {data.trademark.details}
            </p>
            {data.trademark.similarMarks.length > 0 && (
              <div className="mt-2 text-xs text-text-muted">
                Similar marks:{" "}
                {data.trademark.similarMarks.join(", ")}
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
          <h4 className="font-[family-name:var(--font-mono)] text-xs tracking-[1.5px] uppercase text-text-muted mb-3">
            Similar Competitors
          </h4>
          <div className="space-y-2">
            {data.competitors.map((c) => (
              <div
                key={c.name}
                className="p-3 bg-surface-raised rounded-lg border border-border"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-text-muted text-xs">
                    {c.similarity}% similar
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
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
  );
}

function LockedSection({ label }: { label: string }) {
  return (
    <div className="p-4 border border-dashed border-border rounded-lg text-center">
      <p className="text-sm text-text-muted">
        {label} — <span className="text-accent">Upgrade to Pro</span>
      </p>
    </div>
  );
}
