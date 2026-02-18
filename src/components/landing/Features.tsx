"use client";

import { useScrollReveal } from "@/lib/hooks";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7 5.1 17.2l.9-5.5-4-3.9 5.5-.8L10 2z" stroke="#3cff8a" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI Name Generation",
    desc: "Describe your SaaS idea and get creative, brandable name suggestions powered by AI.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#3cff8a" strokeWidth="1.5" />
        <path d="M10 2a8 8 0 000 16" stroke="#3cff8a" strokeWidth="1.5" />
        <path d="M2 10h16M10 2c2.2 1.8 3.5 4.8 3.5 8s-1.3 6.2-3.5 8c-2.2-1.8-3.5-4.8-3.5-8s1.3-6.2 3.5-8z" stroke="#3cff8a" strokeWidth="1.5" />
      </svg>
    ),
    title: "Domain Availability",
    desc: "Instantly check .com, .io, .app, and .dev domains. No more switching between registrar tabs.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M17 6v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6m14 0l-7 5-7-5m14 0a2 2 0 00-2-2H5a2 2 0 00-2 2" stroke="#3cff8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Social Handle Check",
    desc: "Verify availability on X, LinkedIn, and Instagram before someone else grabs your name.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M16 8.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2.5" stroke="#3cff8a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 12l2 2 4-4" stroke="#3cff8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Trademark Screening",
    desc: "Catch potential legal conflicts before they become expensive problems down the road.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 15V5a2 2 0 012-2h8a2 2 0 012 2v10" stroke="#3cff8a" strokeWidth="1.5" />
        <path d="M2 15h16M6 7h8M6 10h5" stroke="#3cff8a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Competitor Analysis",
    desc: "See if similar names exist in your space. Avoid confusion and stand out from day one.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v14M6 7l4-4 4 4" stroke="#3cff8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="13" width="14" height="4" rx="1" stroke="#3cff8a" strokeWidth="1.5" />
      </svg>
    ),
    title: "Brand Score & PDF Report",
    desc: "Get a memorability score and export a polished PDF report to share with co-founders.",
  },
];

export default function Features() {
  const ref = useScrollReveal();

  return (
    <section id="features" className="py-[120px] px-6 bg-surface border-t border-b border-border max-[768px]:py-20 max-[768px]:px-5 max-[480px]:py-[60px] max-[480px]:px-4">
      <div className="max-w-[1100px] mx-auto">
        <div ref={ref} className="text-center mb-[72px] reveal max-[768px]:mb-10 max-[480px]:mb-8">
          <p className="font-[family-name:var(--font-mono)] text-xs font-normal tracking-[2px] uppercase text-accent mb-4 max-[480px]:text-[11px] max-[480px]:tracking-[1.5px]">
            Features
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
            Everything you need to
            <br />
            name your startup
          </h2>
          <p className="text-[17px] font-light text-text-secondary max-w-[520px] leading-[1.7] mx-auto max-[768px]:text-[15px]">
            One tool replaces hours of manual Googling, WHOIS lookups, and
            trademark searches.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden max-[768px]:grid-cols-1 max-[768px]:rounded-[10px]">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface p-10 px-8 hover:bg-surface-raised transition-colors max-[768px]:p-7 max-[768px]:px-6 max-[480px]:p-6 max-[480px]:px-5"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-accent-dim rounded-[10px] mb-5 text-lg max-[480px]:w-9 max-[480px]:h-9 max-[480px]:mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold mb-2 tracking-[-0.3px] max-[480px]:text-[15px]">
                {f.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-[480px]:text-[13px]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
