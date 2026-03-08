"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import IdeaInput from "@/components/generate/IdeaInput";
import ClarificationQuestions from "@/components/generate/ClarificationQuestions";
import NameList from "@/components/generate/NameList";
import ValidationPanel from "@/components/generate/ValidationPanel";
import SessionBanner from "@/components/generate/SessionBanner";
import UpgradePrompt from "@/components/generate/UpgradePrompt";
import type { GeneratedName, BrandScoreResult, ClarificationQuestion, Clarification } from "@/lib/services/interfaces";

export interface NameWithScore extends GeneratedName {
  brandScore: BrandScoreResult;
}

interface GenerationResult {
  generationId: string;
  names: NameWithScore[];
  generationsRemaining: number;
}

type Phase = "input" | "questions" | "generating" | "results";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [selectedName, setSelectedName] = useState<NameWithScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [phase, setPhase] = useState<Phase>("input");
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([]);
  const [currentIdea, setCurrentIdea] = useState("");

  const handleIdeaSubmit = async (idea: string) => {
    setError(null);
    setLoading(true);
    setSelectedName(null);
    setCurrentIdea(idea);

    try {
      const res = await fetch("/api/generate/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.upgrade) {
          setShowUpgrade(true);
          return;
        }
        throw new Error(data.error || "Failed to get questions");
      }

      if (data.questions?.length > 0) {
        setQuestions(data.questions);
        setPhase("questions");
      } else {
        // No questions returned, go straight to generation
        await generateNames(idea, []);
      }
    } catch (err: any) {
      setError(err.message);
      setPhase("input");
    } finally {
      setLoading(false);
    }
  };

  const generateNames = async (idea: string, clarifications: Clarification[]) => {
    setError(null);
    setLoading(true);
    setPhase("generating");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, clarifications }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.upgrade) {
          setShowUpgrade(true);
          setPhase("input");
          return;
        }
        throw new Error(data.error || "Generation failed");
      }

      setResult(data);
      if (data.names?.length > 0) setSelectedName(data.names[0]);
      setPhase("results");
    } catch (err: any) {
      setError(err.message);
      setPhase("input");
    } finally {
      setLoading(false);
    }
  };

  const handleClarificationsSubmit = (clarifications: Clarification[]) => {
    generateNames(currentIdea, clarifications);
  };

  const handleSkipQuestions = () => {
    generateNames(currentIdea, []);
  };

  const handleNewGeneration = async (idea: string) => {
    setResult(null);
    setPhase("input");
    await handleIdeaSubmit(idea);
  };

  const isLoadingQuestions = loading && phase === "input";
  const isGenerating = phase === "generating";
  const showHero = phase === "input" && !result && !loading;
  const showCompactHeader = phase !== "input" || loading;

  return (
    <div className="min-h-screen bg-black relative">
      {/* Ambient background glow */}
      <div className="ambient-glow" />
      <div className="fixed top-[40%] left-[-15%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between bg-black/70 backdrop-blur-[24px] border-b border-border/50">
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-lg font-bold text-text-primary no-underline tracking-tight"
        >
          Pik<span className="text-accent">Name</span>
        </Link>

        {/* Center status indicator */}
        {result && (
          <div className="hidden md:flex items-center gap-2 text-xs text-text-muted font-[family-name:var(--font-mono)]">
            <span className="status-dot" />
            {result.generationsRemaining} generation{result.generationsRemaining !== 1 ? "s" : ""} remaining
          </div>
        )}

        <div className="flex items-center gap-4">
          <Link
            href="/history"
            className="text-[11px] font-[family-name:var(--font-mono)] tracking-wide uppercase text-text-muted hover:text-accent transition-colors hidden sm:inline"
          >
            History
          </Link>
          <SessionBanner />
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Hero section — only shows before first generation */}
        {showHero && (
          <div className="text-center mb-14 animate-fade-up animate-fade-up-1">
            <div className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-accent bg-accent-dim border border-accent/20 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
              <span className="status-dot" />
              AI Startup Name Generator
            </div>
            <h1 className="text-[clamp(32px,5vw,52px)] font-bold tracking-[-1.5px] leading-[1.1] mb-4">
              Name your next
              <br />
              <span className="text-accent font-[family-name:var(--font-mono)]">big thing</span>
            </h1>
            <p className="text-text-secondary text-base max-w-md mx-auto leading-relaxed">
              Describe your idea. Get AI-generated brandable names with brand
              scores and instant domain availability checks.
            </p>
          </div>
        )}

        {/* Compact header when results exist */}
        {showCompactHeader && (
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Name Generator
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {isLoadingQuestions
                ? "Analyzing your idea..."
                : isGenerating
                  ? "Generating names..."
                  : phase === "questions"
                    ? "Answer a few optional questions to get better names"
                    : `${result?.names.length} names generated`}
            </p>
          </div>
        )}

        {/* Input area — show in input phase or results phase (compact) */}
        {(phase === "input" || phase === "results") && (
          <div className={result ? "mb-10" : "mb-0"}>
            <IdeaInput
              onSubmit={result ? handleNewGeneration : handleIdeaSubmit}
              loading={loading}
              sessionStatus={status}
              compact={!!result}
            />
          </div>
        )}

        {/* Loading state for questions */}
        {isLoadingQuestions && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border/60 bg-surface/70 p-8">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-text-muted font-[family-name:var(--font-mono)]">
                  Preparing clarification questions...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Clarification questions phase */}
        {phase === "questions" && (
          <div className="mt-8">
            <ClarificationQuestions
              questions={questions}
              onSubmit={handleClarificationsSubmit}
              onSkip={handleSkipQuestions}
              loading={loading}
            />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto animate-scale-in">
            <div className="flex items-start gap-3 p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <div>
                <p className="text-red-600 text-sm font-medium">Generation failed</p>
                <p className="text-red-600/70 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state for name generation */}
        {isGenerating && (
          <div className="mt-12 max-w-2xl mx-auto space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 bg-surface/60 border border-border/50 rounded-xl"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="skeleton-line h-5 w-32" />
                    <div className="skeleton-line h-3 w-48" />
                  </div>
                  <div className="skeleton-line w-12 h-12 !rounded-full shrink-0" />
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-text-muted font-[family-name:var(--font-mono)] mt-6">
              Generating names with GPT-4o...
            </p>
          </div>
        )}

        {/* Results area */}
        {phase === "results" && result && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <NameList
              names={result.names}
              generationId={result.generationId}
              selectedName={selectedName}
              onSelect={setSelectedName}
            />
            <div className="lg:sticky lg:top-[80px] lg:self-start">
              {selectedName ? (
                <ValidationPanel
                  name={selectedName}
                />
              ) : (
                <div className="border border-dashed border-border/60 rounded-2xl p-10 text-center bg-surface/30">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface border border-border flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-muted">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-muted font-medium">Select a name</p>
                  <p className="text-xs text-text-muted/70 mt-1">
                    Click on a name to see its brand score and domain availability
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showUpgrade && (
          <UpgradePrompt onClose={() => setShowUpgrade(false)} />
        )}
      </main>
    </div>
  );
}
