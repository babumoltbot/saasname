"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_JOURNEYS, type DemoJourney, type DemoName } from "@/lib/demo-data";
import { DIRECT_CHECK_TLDS } from "@/lib/constants";
import { useScrollReveal } from "@/lib/hooks";

function CopyIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-[family-name:var(--font-mono)]">
        {score}
      </span>
    </div>
  );
}

function DemoNameCard({
  name,
  index,
  isSelected,
  onSelect,
  copied,
  onCopy,
}: {
  name: DemoName;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(); }}
      className={`w-full text-left group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-accent/[0.06] border-accent/30 shadow-[0_0_24px_-8px_var(--color-accent-glow)]"
          : "bg-surface/60 border-border/50 hover:bg-surface hover:border-border"
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-all duration-300 ${
          isSelected ? "bg-accent" : "bg-transparent group-hover:bg-border"
        }`}
      />
      <div className="flex items-center gap-4 py-3.5 px-5 pl-6 max-[480px]:py-3 max-[480px]:px-4 max-[480px]:pl-5 max-[480px]:gap-3">
        <span className="text-xs font-[family-name:var(--font-mono)] text-text-muted w-5 shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5">
            <h3
              className={`text-[17px] font-semibold tracking-tight transition-colors ${
                isSelected ? "text-accent" : "text-text-primary"
              }`}
            >
              {name.name}
            </h3>
            <span className="text-sm text-text-muted font-light truncate hidden sm:inline">
              {name.tagline}
            </span>
          </div>
          <p className="text-[13px] text-text-secondary mt-0.5 line-clamp-1">
            {name.reasoning}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Copy name"
        >
          {copied ? <CheckIcon className="text-accent" /> : <CopyIcon />}
        </button>
        <BrandScoreMini score={name.brandScore.overall} />
      </div>
    </div>
  );
}

function DemoValidationPanel({ name }: { name: DemoName }) {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const checkable = name.domains.filter((d) => DIRECT_CHECK_TLDS.includes(d.tld));
  const external = name.domains.filter((d) => !DIRECT_CHECK_TLDS.includes(d.tld));
  const slug = name.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const registrarUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(slug)}`;

  function copyNameDetails() {
    const scoreLines = Object.entries(name.brandScore.breakdown)
      .map(([key, val]) => `  ${key}: ${val}/100`)
      .join("\n");
    const domainLines = name.domains
      .filter((d) => d.available !== undefined)
      .map((d) => `  ${d.domain}: ${d.available ? "Available" : "Taken"}`)
      .join("\n");
    let text = `**${name.name}** — ${name.brandScore.summary}\n\nBrand Score: ${name.brandScore.overall}/100\n${scoreLines}`;
    if (domainLines) text += `\n\nDomains:\n${domainLines}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-surface border border-border/60 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <BrandScoreMini score={name.brandScore.overall} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight">{name.name}</h3>
              <button
                onClick={copyNameDetails}
                className="shrink-0 p-1 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-all"
                title="Copy name details"
              >
                {copied ? <CheckIcon className="text-accent" /> : <CopyIcon />}
              </button>
            </div>
            <p className={`text-[13px] text-text-secondary mt-0.5 leading-snug ${
              summaryExpanded ? "" : "line-clamp-2"
            }`}>
              {name.brandScore.summary}
            </p>
            <button
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="text-[12px] text-accent font-[family-name:var(--font-mono)] mt-1 hover:underline"
            >
              {summaryExpanded ? "less" : "more"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4 space-y-4">
        {/* Brand breakdown */}
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-border" />
            Brand Score
          </h4>
          <div className="space-y-2.5">
            {Object.entries(name.brandScore.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[13px] text-text-secondary w-28 capitalize">{key}</span>
                <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
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
                <span className="text-[13px] text-text-muted font-[family-name:var(--font-mono)] w-7 text-right tabular-nums">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Domains */}
        <div>
          <h4 className="font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] uppercase text-text-muted mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-border" />
            Domain Availability
          </h4>
          <div className="space-y-2">
            {/* Checkable TLDs */}
            {checkable.map((d) => (
              <div
                key={d.tld}
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                  d.available === true
                    ? "bg-accent/[0.04]"
                    : d.available === false
                      ? "bg-surface-raised/50"
                      : "bg-surface/40"
                }`}
              >
                <div className="min-w-0">
                  <span className="font-[family-name:var(--font-mono)] text-sm text-text-primary">
                    {d.domain}
                  </span>
                  {d.checkedAgo && (
                    <span className="block text-[11px] text-text-muted font-[family-name:var(--font-mono)] mt-0.5">
                      {d.checkedAgo}
                    </span>
                  )}
                </div>
                {d.available !== undefined && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold font-[family-name:var(--font-mono)] tracking-wide uppercase px-2.5 py-1 rounded-full ${
                      d.available
                        ? "text-accent bg-accent/10"
                        : "text-warning bg-warning/10"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${d.available ? "bg-accent" : "bg-warning"}`} />
                    {d.available ? "Open" : "Taken"}
                  </span>
                )}
              </div>
            ))}

            {/* External TLDs */}
            {external.length > 0 && (
              <div className="rounded-xl bg-surface-raised/30 border border-border/30 p-4 mt-2">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {external.map((d) => (
                    <span
                      key={d.tld}
                      className="font-[family-name:var(--font-mono)] text-[13px] bg-surface border border-dashed border-border/40 px-2.5 py-1 rounded-lg text-text-muted/70"
                    >
                      {d.domain}
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
        </div>

        <div className="h-px bg-border/40" />

        {/* Gated features preview */}
        <div className="relative rounded-xl border border-dashed border-accent/30 bg-accent/[0.02] p-5 overflow-hidden">
          <div className="space-y-3 opacity-40 blur-[1px] pointer-events-none select-none">
            <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-[2px] text-text-muted">
              Social Handles
            </span>
            <div className="flex gap-2">
              <span className="text-[13px] bg-surface border border-border/50 px-2.5 py-1 rounded-lg text-text-muted">
                @{name.name.toLowerCase()} on X
              </span>
              <span className="text-[13px] bg-surface border border-border/50 px-2.5 py-1 rounded-lg text-text-muted">
                LinkedIn
              </span>
              <span className="text-[13px] bg-surface border border-border/50 px-2.5 py-1 rounded-lg text-text-muted">
                Instagram
              </span>
            </div>
            <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-[2px] text-text-muted block mt-2">
              Trademark Risk
            </span>
            <div className="h-2 bg-accent/20 rounded-full w-3/4" />
          </div>
          {/* CTA overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all"
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
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const headerRef = useScrollReveal();

  const handleJourneySelect = (journey: DemoJourney) => {
    setActiveJourney(journey);
    setSelectedName(journey.names[0]);
  };

  function copyAllNames() {
    const text = activeJourney.names
      .map((n, i) => `${i + 1}. **${n.name}** — ${n.tagline}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  function copyName(name: DemoName) {
    navigator.clipboard.writeText(`${name.name} — ${name.tagline}`);
    setCopiedName(name.name);
    setTimeout(() => setCopiedName(null), 1500);
  }

  return (
    <section
      id="demo"
      className="py-20 lg:py-32 px-6 lg:px-10 bg-surface border-t border-border relative max-[480px]:py-14 max-[480px]:px-4"
    >
      {/* Subtle glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,var(--color-accent-glow)_0%,transparent_70%)] opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 reveal max-[768px]:mb-10 max-[480px]:mb-8">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-accent mb-4">
            Live Demo
          </p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
            See it in action
          </h2>
          <p className="text-[15px] lg:text-[17px] font-light text-text-secondary max-w-[480px] leading-[1.7] mx-auto">
            Explore real sample reports. Pick an idea below and see what PikName generates.
          </p>
        </div>

        {/* Demo picker chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-[480px]:mb-6 max-[480px]:gap-1.5">
          {DEMO_JOURNEYS.map((journey) => (
            <button
              key={journey.id}
              onClick={() => handleJourneySelect(journey)}
              className={`font-[family-name:var(--font-mono)] text-[13px] tracking-wide px-4 py-2.5 rounded-lg border transition-all duration-200 max-[480px]:text-xs max-[480px]:px-3 max-[480px]:py-2 ${
                activeJourney.id === journey.id
                  ? "text-accent bg-accent/10 border-accent/30 shadow-[0_0_16px_-4px_var(--color-accent-glow)]"
                  : "text-text-muted bg-black border-border/50 hover:border-text-muted hover:text-text-secondary"
              }`}
            >
              {journey.label}
            </button>
          ))}
        </div>

        {/* Report label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] uppercase text-accent/60 bg-accent/[0.06] border border-accent/15 px-3 py-1 rounded-full">
            Sample Report
          </span>
          <span className="text-sm text-text-muted italic">
            &ldquo;{activeJourney.input}&rdquo;
          </span>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 max-[768px]:gap-4">
          {/* Name list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-mono)] text-[12px] tracking-[2px] uppercase text-text-muted">
                Results
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyAllNames}
                  className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-mono)] text-text-muted hover:text-accent transition-colors"
                  title="Copy all names"
                >
                  {copiedAll ? <CheckIcon /> : <CopyIcon />}
                  {copiedAll ? "Copied!" : "Copy all"}
                </button>
                <span className="text-[12px] text-text-muted font-[family-name:var(--font-mono)]">
                  {activeJourney.names.length} names
                </span>
              </div>
            </div>
            <div className="space-y-2 max-[768px]:max-h-[340px] max-[768px]:overflow-y-auto max-[768px]:pr-1">
              {activeJourney.names.map((name, i) => (
                <DemoNameCard
                  key={name.name}
                  name={name}
                  index={i}
                  isSelected={selectedName.name === name.name}
                  onSelect={() => setSelectedName(name)}
                  copied={copiedName === name.name}
                  onCopy={() => copyName(name)}
                />
              ))}
            </div>
          </div>

          {/* Validation panel */}
          <div className="lg:sticky lg:top-[80px] lg:self-start">
            <DemoValidationPanel key={selectedName.name} name={selectedName} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14 max-[768px]:mt-10">
          <p className="text-text-muted text-sm mb-4">
            Ready to generate names for <span className="text-text-primary font-medium">your</span> idea?
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all"
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
