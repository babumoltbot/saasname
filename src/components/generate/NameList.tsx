"use client";

import { useState } from "react";
import type { NameWithScore } from "@/app/generate/page";
import BrandScore from "./BrandScore";

interface Props {
  names: NameWithScore[];
  generationId: string;
  selectedName: NameWithScore | null;
  onSelect: (name: NameWithScore) => void;
}

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

export default function NameList({ names, selectedName, onSelect }: Props) {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function copyToClipboard(text: string, key?: string) {
    navigator.clipboard.writeText(text);
    if (key) {
      setCopiedName(key);
      setTimeout(() => setCopiedName(null), 1500);
    }
  }

  function copyAllNames() {
    const text = names
      .map((n, i) => `${i + 1}. **${n.name}** — ${n.tagline}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-mono)] text-[12px] tracking-[2px] uppercase text-text-muted">
          Results
        </h2>
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
            {names.length} names
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {names.map((name, i) => {
          const isSelected = selectedName?.name === name.name;
          return (
            <div
              key={name.name}
              onClick={() => onSelect(name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(name); }}
              className={`name-card-enter w-full text-left group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-accent/[0.06] border-accent/30 shadow-[0_0_24px_-8px_var(--color-accent-glow)]"
                  : "bg-surface/60 border-border/50 hover:bg-surface hover:border-border"
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Active indicator bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-all duration-300 ${
                  isSelected ? "bg-accent" : "bg-transparent group-hover:bg-border"
                }`}
              />

              <div className="flex items-center gap-4 py-3.5 px-5 pl-6 max-[480px]:py-3 max-[480px]:px-4 max-[480px]:pl-5 max-[480px]:gap-3">
                {/* Rank number */}
                <span className="text-xs font-[family-name:var(--font-mono)] text-text-muted w-5 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Name info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2.5">
                    <h3 className={`text-[17px] font-semibold tracking-tight transition-colors max-[480px]:text-[15px] ${
                      isSelected ? "text-accent" : "text-text-primary"
                    }`}>
                      {name.name}
                    </h3>
                    <span className="text-sm text-text-muted font-light truncate hidden sm:inline">
                      {name.tagline}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-0.5 line-clamp-1 max-[480px]:text-[12px]">
                    {name.reasoning}
                  </p>
                </div>

                {/* Copy button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(`${name.name} — ${name.tagline}`, name.name);
                  }}
                  className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Copy name"
                >
                  {copiedName === name.name ? <CheckIcon className="text-accent" /> : <CopyIcon />}
                </button>

                {/* Score */}
                <BrandScore score={name.brandScore.overall} size="sm" animated />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
