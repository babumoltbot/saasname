import Link from "next/link";
import TerminalDemo from "./TerminalDemo";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-[100px] pb-20 relative overflow-hidden lg:px-10 max-[480px]:pt-20 max-[480px]:pb-10 max-[480px]:px-4">
      {/* Radial glow — positioned to the right to follow the terminal */}
      <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-[radial-gradient(circle,var(--color-accent-glow)_0%,transparent_70%)] opacity-40 pointer-events-none max-[768px]:w-[400px] max-[768px]:h-[400px] max-[768px]:right-[-20%] max-[768px]:top-[-5%]" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative">
        {/* Left — Text content */}
        <div>
          <div className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-accent bg-accent-dim border border-accent/20 px-4 py-1.5 rounded-full mb-8 animate-fade-up animate-fade-up-1 max-[480px]:text-[11px] max-[480px]:px-3 max-[480px]:mb-6">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot" />
            AI Startup Name Generator
          </div>

          <h1 className="text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.05] tracking-[-2px] mb-6 animate-fade-up animate-fade-up-2 max-[768px]:text-[clamp(32px,8vw,44px)] max-[768px]:tracking-[-1px] max-[480px]:mb-5">
            Stop guessing.
            <br />
            <span className="block h-[1.1em] overflow-hidden">
              <span className="flex flex-col animate-ticker">
                <span className="h-[1.1em] flex items-center text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
                  Validate it.
                </span>
                <span className="h-[1.1em] flex items-center text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
                  Check domains.
                </span>
                <span className="h-[1.1em] flex items-center text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
                  Secure handles.
                </span>
                <span className="h-[1.1em] flex items-center text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
                  Ship faster.
                </span>
              </span>
            </span>
          </h1>

          <p className="text-[clamp(15px,2vw,18px)] text-text-secondary font-light max-w-[460px] mb-10 leading-[1.7] animate-fade-up animate-fade-up-3 max-[768px]:mb-8 max-[480px]:mb-7">
            Describe your startup idea. Get brandable name suggestions. Validate domains, trademarks, and social handles — in seconds.
          </p>

          <div className="flex gap-4 items-center animate-fade-up animate-fade-up-4 max-[480px]:flex-col max-[480px]:items-stretch">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all"
            >
              Generate Names
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-medium text-text-primary border border-border rounded-lg no-underline hover:border-text-muted hover:bg-surface transition-all"
            >
              See a Live Demo
            </a>
          </div>
        </div>

        {/* Right — Terminal demo */}
        <div className="animate-fade-up animate-fade-up-5 max-[768px]:mt-4">
          <TerminalDemo />
        </div>
      </div>
    </section>
  );
}
