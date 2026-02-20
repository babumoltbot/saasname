"use client";

import { useState } from "react";
import type { NameWithScore } from "@/app/generate/page";
import BrandScore from "./BrandScore";

interface Props {
  name: NameWithScore;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
      <span className="w-4 h-px bg-border" />
      {children}
    </h4>
  );
}


export default function ValidationPanel({ name }: Props) {
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

        {/* Trademark — Coming Soon */}
        <ComingSoonSection
          label="Trademark Screening"
          description="Screen against USPTO and international trademark databases for conflicts."
          feature="trademark_screening"
          notified={!!notified["trademark_screening"]}
          onNotify={() => notifyInterest("trademark_screening")}
        />

        {/* Competitors — Coming Soon */}
        <ComingSoonSection
          label="Competitor Analysis"
          description="Find companies with similar names using live web data."
          feature="competitor_analysis"
          notified={!!notified["competitor_analysis"]}
          onNotify={() => notifyInterest("competitor_analysis")}
        />
      </div>
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
