"use client";

import type { NameWithScore } from "@/app/generate/page";
import BrandScore from "./BrandScore";

interface Props {
  names: NameWithScore[];
  generationId: string;
  selectedName: NameWithScore | null;
  onSelect: (name: NameWithScore) => void;
}

export default function NameList({ names, selectedName, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-accent mb-4">
        Generated Names
      </h2>
      {names.map((name) => (
        <button
          key={name.name}
          onClick={() => onSelect(name)}
          className={`w-full text-left p-5 rounded-xl border transition-all ${
            selectedName?.name === name.name
              ? "bg-accent-dim border-accent/40"
              : "bg-surface border-border hover:border-text-muted hover:bg-surface-raised"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {name.name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">{name.tagline}</p>
              <p className="text-xs text-text-muted mt-2">{name.reasoning}</p>
            </div>
            <BrandScore score={name.brandScore.overall} size="sm" />
          </div>
        </button>
      ))}
    </div>
  );
}
