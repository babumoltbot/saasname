"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/hooks";

const proFeatures: { label: string; comingSoon?: boolean }[] = [
  { label: "50 name generations" },
  { label: "10 names per generation" },
  { label: ".com, .io, .app, .dev domains" },
  { label: "Social handle verification", comingSoon: true },
  { label: "Trademark screening", comingSoon: true },
  { label: "Competitor analysis", comingSoon: true },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="var(--color-accent)">
      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 111.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
    </svg>
  );
}

export default function Pricing() {
  const ref = useScrollReveal();

  return (
    <section id="pricing" className="py-[120px] px-6 bg-black max-[768px]:py-20 max-[768px]:px-5 max-[480px]:py-12 max-[480px]:px-4">
      <div className="max-w-[480px] mx-auto">
        <div ref={ref} className="text-center mb-16 reveal max-[768px]:mb-10 max-[480px]:mb-6">
          <p className="font-[family-name:var(--font-mono)] text-xs font-normal tracking-[2px] uppercase text-accent mb-4 max-[480px]:text-[11px] max-[480px]:tracking-[1.5px]">
            Pricing
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
            One price. Full power.
          </h2>
          <p className="text-[17px] font-light text-text-secondary max-w-[520px] leading-[1.7] mx-auto max-[768px]:text-[15px]">
            No subscriptions. No hidden fees. Pay once, name forever.
          </p>
        </div>

        {/* Pro — single card */}
        <div className="bg-surface border border-accent rounded-2xl p-10 px-9 relative hover:translate-y-[-2px] transition-all bg-gradient-to-b from-accent/[0.04] to-surface max-[768px]:p-8 max-[768px]:px-6 max-[480px]:p-7 max-[480px]:px-5 max-[480px]:rounded-xl">
          <div className="font-[family-name:var(--font-mono)] text-[13px] font-bold tracking-[1px] uppercase text-accent mb-4 max-[480px]:text-xs">
            Pro
          </div>
          <div className="text-[52px] font-bold tracking-[-2px] leading-none mb-1 max-[768px]:text-[44px] max-[480px]:text-[40px]">
            $29
          </div>
          <div className="text-sm text-text-muted mb-8 max-[480px]:text-[13px] max-[480px]:mb-6">
            One-time payment
          </div>
          <ul className="list-none mb-9 space-y-2 max-[480px]:mb-7">
            {proFeatures.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm text-text-secondary max-[480px]:text-[13px]">
                <CheckIcon />
                <span className="flex items-center gap-2">
                  {f.label}
                  {f.comingSoon && (
                    <span className="font-[family-name:var(--font-mono)] text-[8px] font-bold tracking-[1px] uppercase text-text-muted bg-surface border border-border/60 px-1.5 py-0.5 rounded-full leading-none">
                      Soon
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/generate"
            className="w-full inline-flex justify-center items-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all"
          >
            Get Pro
          </Link>
          <p className="text-center mt-4 text-sm text-text-muted">
            Not sure yet?{" "}
            <a href="#demo" className="text-accent hover:underline">
              Try the demo
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
