"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import SessionBanner from "@/components/generate/SessionBanner";
import ValidationPanel from "@/components/generate/ValidationPanel";
import BrandScore from "@/components/generate/BrandScore";
import type { NameWithScore } from "@/app/generate/page";

interface Generation {
  id: string;
  ideaText: string;
  names: NameWithScore[];
  createdAt: number | null;
}

function formatDate(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function HistoryPage() {
  const { status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedName, setSelectedName] = useState<NameWithScore | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        // Auto-expand the most recent generation
        if (rows.length > 0) setExpandedId(rows[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="min-h-screen bg-black relative">
      <div className="ambient-glow" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between bg-black/70 backdrop-blur-[24px] border-b border-border/50">
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-lg font-bold text-text-primary no-underline tracking-tight"
        >
          SaaS<span className="text-accent">Name</span>
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

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-24">
        {/* Page header */}
        <div className="mb-10 animate-fade-up animate-fade-up-1">
          <h1 className="text-2xl font-bold tracking-tight">Generation History</h1>
          <p className="text-sm text-text-muted mt-1">
            All your past name generations — click any name to explore it.
          </p>
        </div>

        {/* Unauthenticated */}
        {status === "unauthenticated" && (
          <div className="text-center py-24 animate-fade-up">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface border border-border flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-muted">
                <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 18c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-text-muted mb-4">Sign in to view your history</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/history" })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && status !== "unauthenticated" && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-5 bg-surface/60 border border-border/50 rounded-xl space-y-3">
                <div className="skeleton-line h-4 w-64" />
                <div className="skeleton-line h-3 w-32" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && status === "authenticated" && generations.length === 0 && (
          <div className="text-center py-24 animate-fade-up">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface border border-border flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-muted">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-text-muted mb-4">No generations yet</p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Generate your first name
            </Link>
          </div>
        )}

        {/* Content */}
        {!loading && generations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
            {/* Left: generation list */}
            <div className="space-y-3 min-w-0">
              {generations.map((gen, gi) => {
                const isExpanded = expandedId === gen.id;
                return (
                  <div
                    key={gen.id}
                    className="bg-surface/60 border border-border/50 rounded-xl overflow-hidden transition-all duration-200 hover:border-border animate-fade-up"
                    style={{ animationDelay: `${gi * 0.05}s` }}
                  >
                    {/* Generation header */}
                    <button
                      className="w-full text-left px-5 py-4 flex items-center gap-4 group"
                      onClick={() => {
                        setExpandedId(isExpanded ? null : gen.id);
                        if (!isExpanded) setSelectedName(null);
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {gen.ideaText}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-text-muted font-[family-name:var(--font-mono)]">
                            {formatDate(gen.createdAt)} · {formatTime(gen.createdAt)}
                          </span>
                          <span className="text-[11px] text-text-muted">
                            {gen.names.length} names
                          </span>
                        </div>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className={`text-text-muted shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path d="M2 4.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Expanded names list */}
                    {isExpanded && (
                      <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-1.5">
                        {gen.names.map((name, ni) => {
                          const isSelected = selectedName?.name === name.name;
                          return (
                            <button
                              key={name.name}
                              onClick={() => setSelectedName(isSelected ? null : name)}
                              className={`w-full text-left group relative overflow-hidden rounded-lg border transition-all duration-150 ${
                                isSelected
                                  ? "bg-accent/[0.06] border-accent/30"
                                  : "bg-surface/40 border-border/30 hover:bg-surface hover:border-border/60"
                              }`}
                            >
                              <div
                                className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-all duration-200 ${
                                  isSelected ? "bg-accent" : "bg-transparent group-hover:bg-border"
                                }`}
                              />
                              <div className="flex items-center gap-3 py-3 px-4 pl-5">
                                <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-muted/50 w-4 shrink-0 tabular-nums">
                                  {String(ni + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className={`text-sm font-semibold tracking-tight ${isSelected ? "text-accent" : "text-text-primary"}`}>
                                    {name.name}
                                  </span>
                                  <span className="text-[11px] text-text-muted ml-2 hidden sm:inline truncate">
                                    {name.tagline}
                                  </span>
                                </div>
                                <BrandScore score={name.brandScore.overall} size="sm" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: sticky validation panel */}
            <div className="lg:sticky lg:top-[80px] lg:self-start">
              {selectedName ? (
                <ValidationPanel name={selectedName} />
              ) : (
                <div className="border border-dashed border-border/60 rounded-2xl p-10 text-center bg-surface/30">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface border border-border flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-muted">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-muted font-medium">Select a name</p>
                  <p className="text-xs text-text-muted/70 mt-1">
                    Click any name to see its brand score and checks
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
