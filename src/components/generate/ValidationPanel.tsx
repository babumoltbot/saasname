"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { NameWithScore } from "@/app/generate/page";
import BrandScore from "./BrandScore";
import { TIERS } from "@/lib/constants";

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


type DomainStatus = "idle" | "loading" | "available" | "taken" | "error";

export default function ValidationPanel({ name }: Props) {
  const { data: session } = useSession();
  const tier = (session as any)?.tier ?? "free";
  const tlds = TIERS[tier as keyof typeof TIERS]?.tlds ?? TIERS.free.tlds;

  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const [domainStatus, setDomainStatus] = useState<Record<string, DomainStatus>>({});

  // Reset domain checks when name changes
  useEffect(() => {
    setDomainStatus({});
  }, [name.name]);

  async function checkDomain(tld: string) {
    setDomainStatus((prev) => ({ ...prev, [tld]: "loading" }));
    try {
      const res = await fetch("/api/check-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.name, tld }),
      });
      const data = await res.json();
      setDomainStatus((prev) => ({
        ...prev,
        [tld]: data.domain?.available ? "available" : "taken",
      }));
    } catch {
      setDomainStatus((prev) => ({ ...prev, [tld]: "error" }));
    }
  }

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

        {/* Domains */}
        <div>
          <SectionLabel>Domain Availability</SectionLabel>
          <div className="grid grid-cols-1 gap-1.5">
            {tlds.map((tld) => {
              const slug = name.name.toLowerCase().replace(/[^a-z0-9]/g, "");
              const domain = slug + tld;
              const status = domainStatus[tld] ?? "idle";
              return (
                <div
                  key={tld}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                    status === "available"
                      ? "bg-accent/[0.04]"
                      : status === "taken"
                      ? "bg-surface-raised/50"
                      : "bg-surface/40"
                  }`}
                >
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-secondary">
                    {domain}
                  </span>
                  {status === "idle" && (
                    <button
                      onClick={() => checkDomain(tld)}
                      className="text-[10px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase px-2 py-0.5 rounded border border-border/50 text-text-muted hover:border-accent/40 hover:text-accent transition-all duration-150"
                    >
                      Check
                    </button>
                  )}
                  {status === "loading" && (
                    <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-muted animate-pulse">
                      Checking...
                    </span>
                  )}
                  {(status === "available" || status === "taken") && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase px-2 py-0.5 rounded-full ${
                        status === "available"
                          ? "text-accent bg-accent/10"
                          : "text-warning bg-warning/10"
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${status === "available" ? "bg-accent" : "bg-warning"}`} />
                      {status === "available" ? "Open" : "Taken"}
                    </span>
                  )}
                  {status === "error" && (
                    <button
                      onClick={() => checkDomain(tld)}
                      className="text-[10px] font-[family-name:var(--font-mono)] text-red-400 hover:text-red-300 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
