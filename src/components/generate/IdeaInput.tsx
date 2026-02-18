"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

interface Props {
  onSubmit: (idea: string) => void;
  loading: boolean;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
}

export default function IdeaInput({ onSubmit, loading, sessionStatus }: Props) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;

    if (sessionStatus === "unauthenticated") {
      signIn("google", { callbackUrl: "/generate" });
      return;
    }

    onSubmit(idea.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your SaaS idea... e.g., A tool that helps consultants schedule LinkedIn posts with AI-generated content"
        className="w-full p-5 font-[family-name:var(--font-mono)] text-sm text-text-primary bg-surface border border-border rounded-xl outline-none resize-vertical min-h-[120px] focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)] transition-all placeholder:text-text-muted"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !idea.trim()}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-black bg-accent rounded-lg hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </>
        ) : sessionStatus === "unauthenticated" ? (
          <>
            Sign in with Google to Generate
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10m0 0L9 4m4 4L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ) : (
          <>
            Generate Names
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10m0 0L9 4m4 4L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
