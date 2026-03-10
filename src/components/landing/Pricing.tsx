"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/hooks";

const included = [
  { label: "50 name generations" },
  { label: "10 names per generation" },
  { label: ".com, .io, .app, .dev domains" },
  { label: "Social handle verification", soon: true },
  { label: "Trademark screening", soon: true },
  { label: "Competitor analysis", soon: true },
];

export default function Pricing() {
  const ref = useScrollReveal();

  return (
    <section
      id="pricing"
      className="py-20 lg:py-32 px-6 lg:px-10 max-[480px]:py-14 max-[480px]:px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — Price + CTA */}
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-accent mb-4">
                Pricing
              </p>
              <h2 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px] leading-[1.15] mb-4">
                One price.
                <br />
                Full power.
              </h2>
              <p className="text-[15px] lg:text-[16px] font-light text-text-secondary leading-[1.7] mb-10 max-w-[380px] max-[480px]:mb-8">
                No subscriptions. No hidden fees. Pay once, name forever.
              </p>

              <div className="mb-8 max-[480px]:mb-6">
                <span className="text-[clamp(48px,8vw,64px)] font-bold tracking-[-3px] leading-none text-text-primary">
                  $29
                </span>
                <span className="text-text-muted text-[15px] ml-2 align-baseline">
                  one-time
                </span>
              </div>

              <Link
                href="/generate"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[15px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all max-[480px]:w-full"
              >
                Get Pro
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <p className="mt-4 text-sm text-text-muted">
                Not sure yet?{" "}
                <a href="#demo" className="text-accent hover:underline">
                  Try the demo first
                </a>
              </p>
            </div>

            {/* Right — What's included */}
            <div className="bg-surface border border-border rounded-2xl p-8 lg:p-9 max-[480px]:p-6">
              <h3 className="font-[family-name:var(--font-mono)] text-[12px] tracking-[2px] uppercase text-text-muted mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-border" />
                What&apos;s included
              </h3>
              <ul className="space-y-4">
                {included.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-[15px] text-text-secondary max-[480px]:text-sm">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="var(--color-accent)">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 111.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.soon && (
                        <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[1px] uppercase text-text-muted bg-surface-raised border border-border/60 px-1.5 py-0.5 rounded-full leading-none">
                          Soon
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
