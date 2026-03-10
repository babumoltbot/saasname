"use client";

import { useScrollReveal } from "@/lib/hooks";

const features = [
  {
    title: "AI Name Generation",
    desc: "Describe your idea and get creative, brandable name suggestions powered by AI — tailored with a few quick questions.",
  },
  {
    title: "Brand Score",
    desc: "Instant memorability score across pronunciation, uniqueness, relevance, and domain fit for every name.",
  },
  {
    title: "Domain Quick-Check",
    desc: "One-click availability check across .com, .io, .app, and .dev — jump straight to a registrar to secure it.",
  },
  {
    title: "Social Handle Check",
    desc: "Verify availability on X, LinkedIn, and Instagram before someone else grabs your name.",
    comingSoon: true,
  },
  {
    title: "Trademark Screening",
    desc: "Catch potential legal conflicts before they become expensive problems down the road.",
    comingSoon: true,
  },
  {
    title: "Competitor Analysis",
    desc: "See if similar names exist in your space. Avoid confusion and stand out from day one.",
    comingSoon: true,
  },
];

export default function Features() {
  const introRef = useScrollReveal();
  const listRef = useScrollReveal();

  return (
    <section
      id="features"
      className="py-20 lg:py-32 px-6 lg:px-10 bg-surface border-t border-border max-[480px]:py-14 max-[480px]:px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:gap-20">
          {/* Left — Section intro (sticky on desktop) */}
          <div ref={introRef} className="reveal lg:sticky lg:top-[100px] lg:self-start">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-accent mb-4">
              Features
            </p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
              Everything you need to name your startup
            </h2>
            <p className="text-[15px] lg:text-[16px] font-light text-text-secondary leading-[1.7]">
              One tool replaces hours of manual Googling, WHOIS lookups, and trademark searches.
            </p>
          </div>

          {/* Right — Feature list */}
          <div ref={listRef} className="stagger-parent divide-y divide-border">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex items-start gap-5 py-7 first:pt-0 last:pb-0 max-[480px]:py-5 max-[480px]:gap-4"
              >
                <span className="font-[family-name:var(--font-mono)] text-sm text-accent font-bold mt-0.5 shrink-0 w-6 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-[17px] font-semibold tracking-[-0.3px] max-[480px]:text-base">
                      {f.title}
                    </h3>
                    {f.comingSoon && (
                      <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[1.5px] uppercase text-text-muted bg-surface-raised border border-border/60 px-2 py-0.5 rounded-full leading-none shrink-0">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] lg:text-[15px] text-text-secondary leading-[1.65]">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
