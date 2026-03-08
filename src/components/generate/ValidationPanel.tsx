"use client";

import { useState, useEffect } from "react";
import type { NameWithScore } from "@/app/generate/page";
import BrandScore from "./BrandScore";
import { TIERS, DIRECT_CHECK_TLDS } from "@/lib/constants";

interface Props {
  name: NameWithScore;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
      <span className="w-4 h-px bg-border" />
      {children}
    </h4>
  );
}


interface DomainState {
  status: "idle" | "loading" | "available" | "taken" | "error";
  checkedAt?: Date;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ValidationPanel({ name }: Props) {
  const tlds = TIERS.pro.tlds;

  const [domainStates, setDomainStates] = useState<Record<string, DomainState>>({});

  // Load cached results when name changes
  useEffect(() => {
    setDomainStates({});
    fetch(`/api/check-domains?name=${encodeURIComponent(name.name)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.cached?.length) return;
        const fromCache: Record<string, DomainState> = {};
        for (const row of data.cached) {
          const tld = "." + row.domain.split(".").slice(1).join(".");
          fromCache[tld] = {
            status: row.available ? "available" : "taken",
            checkedAt: new Date(row.checkedAt),
          };
        }
        setDomainStates(fromCache);
      })
      .catch(() => {});
  }, [name.name]);

  async function checkAllDomains() {
    const checkable = [...tlds].filter((tld) => DIRECT_CHECK_TLDS.includes(tld));
    // Only check TLDs that haven't been checked yet
    const unchecked = checkable.filter((tld) => {
      const s = domainStates[tld]?.status;
      return !s || s === "idle" || s === "error";
    });
    if (unchecked.length === 0) return;

    // Set all to loading
    setDomainStates((prev) => {
      const next = { ...prev };
      for (const tld of unchecked) next[tld] = { status: "loading" };
      return next;
    });

    try {
      const res = await fetch("/api/check-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.name, tlds: unchecked }),
      });
      const data = await res.json();
      if (data.domains) {
        setDomainStates((prev) => {
          const next = { ...prev };
          for (const d of data.domains) {
            const tld = "." + d.domain.split(".").slice(1).join(".");
            next[tld] = {
              status: d.available ? "available" : "taken",
              checkedAt: d.checkedAt ? new Date(d.checkedAt) : new Date(),
            };
          }
          return next;
        });
      }
    } catch {
      setDomainStates((prev) => {
        const next = { ...prev };
        for (const tld of unchecked) next[tld] = { status: "error" };
        return next;
      });
    }
  }

  return (
    <div className="animate-slide-in-right bg-surface/70 border border-border/50 rounded-2xl overflow-hidden">
      {/* Header with score */}
      <div className="relative p-6 pb-5 bg-gradient-to-b from-accent/[0.03] to-transparent">
        <div className="flex items-start gap-4">
          <BrandScore score={name.brandScore.overall} size="lg" animated />
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-2xl font-bold tracking-tight">{name.name}</h3>
            <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
              {name.brandScore.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-5">
        {/* Brand breakdown */}
        <div>
          <SectionLabel>Brand Score</SectionLabel>
          <div className="space-y-3">
            {Object.entries(name.brandScore.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[13px] text-text-secondary w-28 capitalize">
                  {key}
                </span>
                <div className="flex-1 h-2 bg-border/50 rounded-full overflow-hidden">
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
                <span className="text-sm text-text-secondary font-[family-name:var(--font-mono)] w-8 text-right tabular-nums">
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
          {(() => {
            const slug = name.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const checkable = [...tlds].filter((tld) => DIRECT_CHECK_TLDS.includes(tld));
            const external = [...tlds].filter((tld) => !DIRECT_CHECK_TLDS.includes(tld));
            const registrarUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(slug)}`;

            return (
              <div className="space-y-3">
                {/* Checkable TLDs — show status + single Check All button */}
                {checkable.length > 0 && (() => {
                  const allChecked = checkable.every((tld) => {
                    const s = domainStates[tld]?.status;
                    return s === "available" || s === "taken";
                  });
                  const anyLoading = checkable.some((tld) => domainStates[tld]?.status === "loading");
                  const anyError = checkable.some((tld) => domainStates[tld]?.status === "error");

                  return (
                    <div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {checkable.map((tld) => {
                          const domain = slug + tld;
                          const state = domainStates[tld] ?? { status: "idle" };
                          const { status, checkedAt } = state;
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
                              <div className="min-w-0">
                                <span className="font-[family-name:var(--font-mono)] text-sm text-text-primary">
                                  {domain}
                                </span>
                                {checkedAt && (
                                  <span className="block text-xs text-text-muted font-[family-name:var(--font-mono)] mt-0.5">
                                    {timeAgo(checkedAt)}
                                  </span>
                                )}
                              </div>
                              {status === "loading" && (
                                <span className="text-xs font-[family-name:var(--font-mono)] text-text-muted animate-pulse">
                                  Checking...
                                </span>
                              )}
                              {(status === "available" || status === "taken") && (
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase px-2.5 py-1 rounded-full ${
                                    status === "available"
                                      ? "text-accent bg-accent/10"
                                      : "text-warning bg-warning/10"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${status === "available" ? "bg-accent" : "bg-warning"}`} />
                                  {status === "available" ? "Open" : "Taken"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {!allChecked && (
                        <button
                          onClick={checkAllDomains}
                          disabled={anyLoading}
                          className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 px-4 rounded-lg bg-accent/10 border border-accent/30 text-accent text-[13px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase hover:bg-accent/20 hover:border-accent/50 transition-all duration-150 disabled:opacity-50"
                        >
                          {anyLoading ? (
                            <>
                              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Checking...
                            </>
                          ) : anyError ? "Retry check" : "Check all"}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* External TLDs — badges with registrar link */}
                {external.length > 0 && (
                  <div className="rounded-xl bg-surface/40 border border-border/40 p-4">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {external.map((tld) => (
                        <span key={tld} className="font-[family-name:var(--font-mono)] text-[13px] text-text-muted bg-surface border border-dashed border-border/30 px-2.5 py-1 rounded-lg">
                          {slug}{tld}
                        </span>
                      ))}
                    </div>
                    <a
                      href={registrarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-accent/10 border border-accent/30 text-accent text-[13px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase hover:bg-accent/20 hover:border-accent/50 transition-all duration-150"
                    >
                      Check availability
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Socials — Coming Soon */}
        <ComingSoonSection
          label="Social Handles"
          description="Instant availability check on X, LinkedIn, and Instagram."
        />

        {/* Trademark — Coming Soon */}
        <ComingSoonSection
          label="Trademark Screening"
          description="Screen against USPTO and international trademark databases for conflicts."
        />

        {/* Competitors — Coming Soon */}
        <ComingSoonSection
          label="Competitor Analysis"
          description="Find companies with similar names using live web data."
        />
      </div>
    </div>
  );
}


function ComingSoonSection({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-dashed border-border/40 bg-surface/20">
      <div className="flex items-center gap-2.5 mb-2">
        <SectionLabel>{label}</SectionLabel>
        <span className="text-[11px] font-semibold font-[family-name:var(--font-mono)] tracking-widest uppercase text-text-muted bg-surface-raised px-1.5 py-0.5 rounded -mt-3">
          Coming Soon
        </span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
