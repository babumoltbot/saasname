"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import IdeaInput from "@/components/generate/IdeaInput";
import NameList from "@/components/generate/NameList";
import ValidationPanel from "@/components/generate/ValidationPanel";
import SessionBanner from "@/components/generate/SessionBanner";
import UpgradePrompt from "@/components/generate/UpgradePrompt";
import type { GeneratedName, BrandScoreResult } from "@/lib/services/interfaces";

export interface NameWithScore extends GeneratedName {
  brandScore: BrandScoreResult;
}

interface GenerationResult {
  generationId: string;
  names: NameWithScore[];
  generationsRemaining: number;
}

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [selectedName, setSelectedName] = useState<NameWithScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleGenerate = async (idea: string) => {
    setError(null);
    setLoading(true);
    setSelectedName(null);

    try {
      const res = await fetch("/api/generate", {
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
        throw new Error(data.error || "Generation failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-black/80 backdrop-blur-[20px] border-b border-border">
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-lg font-bold text-text-primary no-underline"
        >
          SaaS<span className="text-accent">Name</span>
        </Link>
        <SessionBanner />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Generate & Validate Names
          </h1>
          <p className="text-text-secondary">
            Describe your SaaS idea and get AI-powered name suggestions with
            instant validation.
          </p>
        </div>

        <IdeaInput
          onSubmit={handleGenerate}
          loading={loading}
          sessionStatus={status}
        />

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <NameList
              names={result.names}
              generationId={result.generationId}
              selectedName={selectedName}
              onSelect={setSelectedName}
            />
            {selectedName && (
              <ValidationPanel
                name={selectedName}
                generationId={result.generationId}
              />
            )}
          </div>
        )}

        {result && (
          <p className="mt-6 text-center text-sm text-text-muted">
            {result.generationsRemaining} generation
            {result.generationsRemaining !== 1 ? "s" : ""} remaining
          </p>
        )}

        {showUpgrade && (
          <UpgradePrompt onClose={() => setShowUpgrade(false)} />
        )}
      </main>
    </div>
  );
}
