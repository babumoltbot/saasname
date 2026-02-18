"use client";

import { useScrollReveal } from "@/lib/hooks";

const steps = [
  {
    num: "01",
    title: "Describe your idea",
    desc: "Tell us what your SaaS does in a sentence or two. Our AI understands context, audience, and tone to generate relevant names.",
  },
  {
    num: "02",
    title: "Review suggestions",
    desc: "Get a list of creative, brandable names. Each one comes with domain availability, social handle status, and a brand score.",
  },
  {
    num: "03",
    title: "Validate and ship",
    desc: "Run a full validation — trademark screening, competitor check, and memorability analysis. Export a PDF report and lock in your name.",
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="py-[120px] px-6 max-[768px]:py-20 max-[768px]:px-5 max-[480px]:py-[60px] max-[480px]:px-4">
      <div className="max-w-[900px] mx-auto">
        <div ref={ref} className="text-center mb-[72px] reveal max-[768px]:mb-10 max-[480px]:mb-8">
          <p className="font-[family-name:var(--font-mono)] text-xs font-normal tracking-[2px] uppercase text-accent mb-4 max-[480px]:text-[11px] max-[480px]:tracking-[1.5px]">
            How It Works
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
            Three steps to the
            <br />
            perfect SaaS name
          </h2>
          <p className="text-[17px] font-light text-text-secondary max-w-[520px] leading-[1.7] mx-auto max-[768px]:text-[15px]">
            From idea to validated name in under 60 seconds.
          </p>
        </div>

        <div className="flex flex-col relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-accent to-border max-[768px]:left-[19px] max-[480px]:left-[15px]" />

          {steps.map((s) => (
            <div key={s.num} className="flex items-start gap-8 py-9 max-[768px]:gap-5 max-[768px]:py-6 max-[480px]:gap-4 max-[480px]:py-5">
              <div className="shrink-0 w-12 h-12 flex items-center justify-center font-[family-name:var(--font-mono)] text-base font-bold text-accent bg-accent-dim border border-accent/20 rounded-full relative z-10 max-[768px]:w-10 max-[768px]:h-10 max-[768px]:text-sm max-[480px]:w-8 max-[480px]:h-8 max-[480px]:text-xs">
                {s.num}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 tracking-[-0.3px] max-[768px]:text-lg max-[480px]:text-base">
                  {s.title}
                </h3>
                <p className="text-[15px] text-text-secondary leading-[1.7] max-w-[480px] max-[768px]:text-sm max-[480px]:text-[13px]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
