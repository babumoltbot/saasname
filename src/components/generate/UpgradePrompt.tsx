"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function UpgradePrompt({ onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="animate-scale-in relative bg-surface border border-border rounded-2xl p-8 max-w-sm mx-4 text-center overflow-hidden">
        {/* Ambient glow behind modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[radial-gradient(ellipse,var(--color-accent-glow)_0%,transparent_70%)] opacity-30 pointer-events-none" />

        <div className="relative">
          <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-accent/10 border border-accent/20 rounded-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>

          <h3 className="text-lg font-bold mb-2 tracking-tight">
            You&apos;ve used all free generations
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Unlock 50 generations, all TLDs, social handle checks, trademark screening, and competitor analysis.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold text-black bg-accent rounded-xl hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirecting to Stripe...
                </span>
              ) : (
                <>Upgrade to Pro — $29 <span className="text-black/50 font-normal">one-time</span></>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm text-text-muted hover:text-text-secondary transition-colors rounded-xl hover:bg-surface-raised"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
