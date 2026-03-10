"use client";

import { useScrollReveal } from "@/lib/hooks";

const steps = [
  {
    num: "01",
    title: "Describe your idea",
    desc: "Tell us what your product does in a sentence or two. Our AI understands context, audience, and tone.",
  },
  {
    num: "02",
    title: "Refine with quick questions",
    desc: "Answer a few optional questions about your target audience, vibe, and preferences so the AI generates names that truly fit.",
  },
  {
    num: "03",
    title: "Review suggestions",
    desc: "Get a list of creative, brandable names — each with domain availability, social handle status, and a brand score.",
  },
  {
    num: "04",
    title: "Validate and ship",
    desc: "Run a full validation — trademark screening, competitor check, and memorability analysis. Lock in your name.",
  },
];

export default function HowItWorks() {
  const headerRef = useScrollReveal();
  const terminalRef = useScrollReveal();

  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-32 px-6 lg:px-10 max-[480px]:py-14 max-[480px]:px-4"
    >
      <div className="max-w-[860px] mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-14 reveal max-[768px]:mb-10 max-[480px]:mb-8">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[2px] uppercase text-accent mb-4">
            How It Works
          </p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-1px] leading-[1.15] mb-5">
            Four steps to the
            <br />
            perfect name
          </h2>
          <p className="text-[15px] lg:text-[17px] font-light text-text-secondary max-w-[460px] leading-[1.7] mx-auto">
            From idea to validated name in under 60 seconds.
          </p>
        </div>

        {/* Terminal window with steps */}
        <div ref={terminalRef} className="reveal">
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.06)]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              <span className="flex-1 text-center font-[family-name:var(--font-mono)] text-xs text-text-muted">
                pikname --how-it-works
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-6 lg:p-8 max-[480px]:p-4">
              <div className="space-y-6 lg:space-y-8 max-[480px]:space-y-5">
                {steps.map((s) => (
                  <div key={s.num}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-accent font-[family-name:var(--font-mono)] text-sm">→</span>
                      <span className="font-[family-name:var(--font-mono)] text-sm text-accent font-bold">
                        Step {s.num}
                      </span>
                      <span className="text-[16px] lg:text-[17px] font-semibold text-text-primary tracking-[-0.2px]">
                        {s.title}
                      </span>
                    </div>
                    <p className="text-[14px] lg:text-[15px] text-text-secondary leading-[1.65] ml-[52px] max-w-[520px] max-[480px]:ml-[40px]">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Blinking cursor */}
              <div className="mt-8 max-[480px]:mt-6">
                <span className="font-[family-name:var(--font-mono)] text-sm text-accent">$</span>{" "}
                <span className="inline-block w-2 h-4 bg-accent align-text-bottom animate-blink" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
