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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-accent-dim rounded-full text-accent text-2xl">
          &#9889;
        </div>
        <h3 className="text-xl font-bold mb-2">
          You&apos;ve hit the free limit
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          Upgrade to Pro for 50 generations, all TLDs, social handles, trademark
          screening, and competitor analysis.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3.5 text-base font-semibold text-black bg-accent rounded-lg hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Upgrade to Pro — $29"}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
