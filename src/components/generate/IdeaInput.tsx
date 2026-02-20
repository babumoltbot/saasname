"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

interface Props {
  onSubmit: (idea: string) => void;
  loading: boolean;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
  compact?: boolean;
}

export default function IdeaInput({ onSubmit, loading, sessionStatus, compact }: Props) {
  const [idea, setIdea] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;

    if (sessionStatus === "unauthenticated") {
      signIn("google", { callbackUrl: "/generate" });
      return;
    }

    onSubmit(idea.trim());
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <div className="flex-1 relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe a different idea..."
            rows={1}
            className="w-full px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-text-primary bg-surface border border-border rounded-xl outline-none resize-none focus:border-accent/50 transition-all placeholder:text-text-muted"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !idea.trim()}
          className="shrink-0 px-5 py-3 text-sm font-semibold text-black bg-accent rounded-xl hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Regenerate
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto animate-fade-up animate-fade-up-2">
      <div
        className={`relative rounded-2xl border transition-all duration-300 ${
          focused
            ? "border-accent/40 shadow-[0_0_60px_-15px_var(--color-accent-glow)] bg-surface"
            : "border-border/60 bg-surface/70 hover:border-border"
        }`}
      >
        {/* Terminal-style header bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-[11px] font-[family-name:var(--font-mono)] text-text-muted tracking-wide">
            describe your idea
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3">
            <span className="text-accent font-[family-name:var(--font-mono)] text-sm mt-0.5 select-none shrink-0">$</span>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="A tool that helps consultants schedule LinkedIn posts with AI-generated content..."
              className="w-full font-[family-name:var(--font-mono)] text-sm text-text-primary bg-transparent outline-none resize-none min-h-[100px] placeholder:text-text-muted/60 leading-relaxed"
              disabled={loading}
            />
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-surface-raised/30 rounded-b-2xl">
          <span className="text-[11px] text-text-muted font-[family-name:var(--font-mono)]">
            {idea.length > 0 ? `${idea.trim().split(/\s+/).length} words` : "min. 10 characters"}
          </span>
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-accent rounded-lg hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : sessionStatus === "unauthenticated" ? (
              <>
                Sign in & Generate
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            ) : (
              <>
                Generate Names
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
