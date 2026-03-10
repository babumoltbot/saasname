"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import SessionBanner from "@/components/generate/SessionBanner";
import ValidationPanel from "@/components/generate/ValidationPanel";
import NameList from "@/components/generate/NameList";
import type { NameWithScore } from "@/app/generate/page";

interface Generation {
  id: string;
  ideaText: string;
  names: NameWithScore[];
  createdAt: string | null;
}

function formatDate(ts: string | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const { status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGen, setActiveGen] = useState<Generation | null>(null);
  const [selectedName, setSelectedName] = useState<NameWithScore | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/generations")
      .then((r) => r.json())
      .then((rows) => {
        setGenerations(rows);
        if (rows.length > 0) {
          setActiveGen(rows[0]);
          if (rows[0].names.length > 0) setSelectedName(rows[0].names[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const handleGenSelect = (gen: Generation) => {
    setActiveGen(gen);
    setSelectedName(gen.names.length > 0 ? gen.names[0] : null);
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="ambient-glow" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between bg-black/70 backdrop-blur-[24px] border-b border-border/50">
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-lg font-bold text-text-primary no-underline tracking-tight"
        >
          Pik<span className="text-accent">Name</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/generate"
            className="text-[11px] font-[family-name:var(--font-mono)] tracking-wide uppercase text-text-muted hover:text-accent transition-colors"
          >
            + New
          </Link>
          <SessionBanner />
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-6 pb-24 max-[480px]:pt-4 max-[480px]:px-4">
        {/* Unauthenticated */}
        {status === "unauthenticated" && (
          <div className="text-center py-24 animate-fade-up">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-accent mb-3">History</p>
            <h1 className="text-2xl font-bold tracking-[-1px] mb-4">Generation History</h1>
            <p className="text-sm text-text-muted mb-6">Sign in to view your history</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/history" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign in with Google
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && status !== "unauthenticated" && (
          <div className="space-y-3 mt-4">
            <div className="flex gap-2 overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="shrink-0 px-4 py-2 bg-surface/60 border border-border/50 rounded-lg">
                  <div className="skeleton-line h-3 w-28" />
                </div>
              ))}
            </div>
            <div className="space-y-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-4 bg-surface/60 border border-border/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="skeleton-line h-5 w-32" />
                      <div className="skeleton-line h-3 w-48" />
                    </div>
                    <div className="skeleton-line w-10 h-10 !rounded-full shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && status === "authenticated" && generations.length === 0 && (
          <div className="text-center py-24 animate-fade-up">
            <p className="text-sm text-text-muted mb-4">No generations yet</p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Generate your first name
            </Link>
          </div>
        )}

        {/* Content */}
        {!loading && generations.length > 0 && activeGen && (
          <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
            {/* Generation switcher — compact pill row */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1 scrollbar-thin max-[480px]:gap-1.5 max-[480px]:mb-4">
              {generations.map((gen) => {
                const isActive = activeGen.id === gen.id;
                const ideaPreview = gen.ideaText.length > 40
                  ? gen.ideaText.slice(0, 40) + "..."
                  : gen.ideaText;
                return (
                  <button
                    key={gen.id}
                    onClick={() => handleGenSelect(gen)}
                    className={`shrink-0 text-left rounded-lg border px-3.5 py-2 transition-all duration-200 max-[480px]:px-3 max-[480px]:py-1.5 ${
                      isActive
                        ? "bg-accent/[0.08] border-accent/30 text-text-primary"
                        : "bg-surface/60 border-border/50 text-text-muted hover:text-text-secondary hover:border-border"
                    }`}
                  >
                    <span className={`text-[13px] font-medium leading-snug line-clamp-1 max-[480px]:text-[12px]`}>
                      {ideaPreview}
                    </span>
                    <span className="text-[10px] text-text-muted font-[family-name:var(--font-mono)] mt-0.5 block">
                      {formatDate(gen.createdAt)} · {gen.names.length} names
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Name list + validation panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
              <NameList
                names={activeGen.names}
                generationId={activeGen.id}
                selectedName={selectedName}
                onSelect={setSelectedName}
              />
              <div className="lg:sticky lg:top-[72px] lg:self-start">
                {selectedName ? (
                  <ValidationPanel name={selectedName} />
                ) : (
                  <div className="border border-dashed border-border/60 rounded-2xl p-10 text-center bg-surface/30">
                    <p className="text-sm text-text-muted font-medium">Select a name</p>
                    <p className="text-xs text-text-muted/70 mt-1">
                      Click any name to see its brand score and checks
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
