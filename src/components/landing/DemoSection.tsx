"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_JOURNEYS, type DemoJourney, type DemoName } from "@/lib/demo-data";
import { useScrollReveal } from "@/lib/hooks";

function BrandScoreMini({ score }: { score: number }) {
  const color =
    score >= 80
      ? "var(--color-accent)"
      : score >= 60
        ? "var(--color-warning)"
        : "#ef4444";
  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-border)" strokeWidth="3" opacity="0.3" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${(score / 100) * 94.2} 94.2`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-[family-name:var(--font-mono)]">
        {score}
      </span>
    </div>
  );
}

function DomainBadge({ domain, available }: { domain: string; available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] px-2.5 py-1 rounded-lg border ${
        available
          ? "text-accent bg-accent/[0.06] border-accent/20"
          : "text-text-muted bg-surface border-border/40"
      }`}
    >
      <span className={`w-1 h-1 rounded-full ${available ? "bg-accent" : "bg-text-muted/40"}`} />
      {domain}
    </span>
  );
}

function DemoNameCard({
  name,
  index,
  isSelected,
  onSelect,
}: {
  name: DemoName;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left group relative overflow-hidden rounded-xl border transition-all duration-200 ${
        isSelected
          ? "bg-accent/[0.06] border-accent/30 shadow-[0_0_30px_-10px_var(--color-accent-glow)]"
          : "bg-surface/60 border-border/50 hover:bg-surface hover:border-border"
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-all duration-300 ${
          isSelected ? "bg-accent" : "bg-transparent group-hover:bg-border"
        }`}
      />
      <div className="flex items-center gap-4 py-4 px-5 pl-6">
        <span className="text-[11px] font-[family-name:var(--font-mono)] text-text-muted/50 w-5 shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5">
            <h3
              className={`text-base font-semibold tracking-tight transition-colors ${
                isSelected ? "text-accent" : "text-text-primary"
              }`}
            >
              {name.name}
            </h3>
            <span className="text-xs text-text-muted font-light truncate hidden sm:inline">
              {name.tagline}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{name.reasoning}</p>
        </div>
        <BrandScoreMini score={name.brandScore.overall} />
      </div>
    </button>
  );
}

function DemoValidationPanel({ name }: { name: DemoName }) {
  return (
    <div className="bg-surface/70 border border-border/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="relative p-6 pb-5 bg-gradient-to-b from-accent/[0.03] to-transparent">
        <div className="flex items-start gap-4">
          <BrandScoreMini score={name.brandScore.overall} />
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
          <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-border" />
            Brand Score
          </h4>
          <div className="space-y-2.5">
            {Object.entries(name.brandScore.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[11px] text-text-secondary w-24 capitalize">{key}</span>
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

        <div className="h-px bg-border/40" />

        {/* Domains */}
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-border" />
            Domain Availability
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {name.domains.map((d) => (
              <DomainBadge key={d.tld} domain={d.domain} available={d.available} />
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Gated features preview */}
        <div className="relative rounded-xl border border-dashed border-accent/30 bg-accent/[0.02] p-5 overflow-hidden">
          <div className="space-y-3 opacity-40 blur-[1px] pointer-events-none select-none">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-[2px] text-text-muted">Social Handles</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] bg-surface border border-border/50 px-2.5 py-1 rounded-lg text-text-muted">@{name.name.toLowerCase()} on X</span>
              <span className="text-[11px] bg-surface border border-border/50 px-2.5 py-1 rounded-lg text-text-muted">LinkedIn</span>
              <span className="text-[11px] bg-surface border border-border/50 px-2.5 py-1 rounded-lg text-text-muted">Instagram</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-[2px] text-text-muted">Trademark Risk</span>
            </div>
            <div className="h-2 bg-accent/20 rounded-full w-3/4" />
          </div>
          {/* CTA overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all"
            >
              Unlock full report — Get Pro
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoSection() {
  const [activeJourney, setActiveJourney] = useState<DemoJourney>(DEMO_JOURNEYS[0]);
  const [selectedName, setSelectedName] = useState<DemoName>(DEMO_JOURNEYS[0].names[0]);
  const ref = useScrollReveal();

  const handleJourneySelect = (journey: DemoJourney) => {
    setActiveJourney(journey);
    setSelectedName(journey.names[0]);
  };

  return (
    <section id="demo" className="py-[120px] px-6 bg-black relative max-[768px]:py-20 max-[768px]:px-5 max-[480px]:py-12 max-[480px]:px-4">
      {/* Subtle glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,var(--color-accent-glow)_0%,transparent_70%)] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div ref={ref} className="text-center mb-14 reveal max-[768px]:mb-10 max-[480px]:mb-8">
          <p className="font-[family-name:var(--font-mono)] text-xs font-normal tracking-[2px] uppercase text-accent mb-4 max-[480px]:text-[11px] max-[480px]:tracking-[1.5px]">
            Live Demo
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
            See it in action
          </h2>
          <p className="text-[17px] font-light text-text-secondary max-w-[520px] leading-[1.7] mx-auto max-[768px]:text-[15px]">
            Explore real sample reports. Pick an idea below and see what SaaSName generates.
          </p>
        </div>

        {/* Demo picker chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-[480px]:mb-8">
          {DEMO_JOURNEYS.map((journey) => (
            <button
              key={journey.id}
              onClick={() => handleJourneySelect(journey)}
              className={`font-[family-name:var(--font-mono)] text-[12px] tracking-wide px-4 py-2 rounded-lg border transition-all duration-200 ${
                activeJourney.id === journey.id
                  ? "text-accent bg-accent/10 border-accent/30 shadow-[0_0_20px_-5px_var(--color-accent-glow)]"
                  : "text-text-muted bg-surface border-border/50 hover:border-text-muted hover:text-text-secondary"
              }`}
            >
              {journey.label}
            </button>
          ))}
        </div>

        {/* Demo report label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase text-accent/60 bg-accent/[0.06] border border-accent/15 px-3 py-1 rounded-full">
            Sample Report
          </span>
          <span className="text-[12px] text-text-muted italic">
            &ldquo;{activeJourney.input}&rdquo;
          </span>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Name list */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] uppercase text-text-muted">
                Results
              </h3>
              <span className="text-[11px] text-text-muted font-[family-name:var(--font-mono)]">
                {activeJourney.names.length} names
              </span>
            </div>
            <div className="space-y-2.5">
              {activeJourney.names.map((name, i) => (
                <DemoNameCard
                  key={name.name}
                  name={name}
                  index={i}
                  isSelected={selectedName.name === name.name}
                  onSelect={() => setSelectedName(name)}
                />
              ))}
            </div>
          </div>

          {/* Validation panel */}
          <div className="lg:sticky lg:top-[80px] lg:self-start">
            <DemoValidationPanel name={selectedName} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14 max-[768px]:mt-10">
          <p className="text-text-muted text-sm mb-4">
            Ready to generate names for <span className="text-text-primary font-medium">your</span> idea?
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all"
          >
            Get Pro — $29 one-time
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
