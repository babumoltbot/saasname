import Link from "next/link";
import TerminalDemo from "./TerminalDemo";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-[120px] pb-20 relative max-[768px]:min-h-auto max-[768px]:px-5 max-[768px]:pt-[110px] max-[768px]:pb-[60px] max-[480px]:px-4 max-[480px]:pt-24 max-[480px]:pb-12">
      {/* Radial glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,var(--color-accent-glow)_0%,transparent_70%)] opacity-40 pointer-events-none max-[768px]:w-[400px] max-[768px]:h-[400px] max-[768px]:top-[-10%]" />

      <div className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-accent bg-accent-dim border border-accent/20 px-4 py-1.5 rounded-full mb-8 animate-fade-up animate-fade-up-1 max-[768px]:mb-6 max-[480px]:text-[11px] max-[480px]:px-3 max-[480px]:py-[5px] max-[480px]:mb-5">
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot" />
        AI-Powered Name Validation
      </div>

      <h1 className="text-[clamp(42px,7vw,80px)] font-bold leading-[1.05] tracking-[-2px] max-w-[800px] mb-3 animate-fade-up animate-fade-up-2 max-[768px]:text-4xl max-[768px]:tracking-[-1px] max-[768px]:leading-[1.1] max-[480px]:text-[30px] max-[480px]:tracking-[-0.5px]">
        Stop guessing.
        <br />
        <span className="block h-[1.1em] overflow-hidden relative">
          <span className="flex flex-col animate-ticker">
            <span className="flex items-center justify-center h-[1.1em] text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
              Validate it.
            </span>
            <span className="flex items-center justify-center h-[1.1em] text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
              Check domains.
            </span>
            <span className="flex items-center justify-center h-[1.1em] text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
              Secure handles.
            </span>
            <span className="flex items-center justify-center h-[1.1em] text-accent font-[family-name:var(--font-mono)] font-bold whitespace-nowrap">
              Ship faster.
            </span>
          </span>
        </span>
      </h1>

      <p className="text-[clamp(16px,2.2vw,20px)] font-light text-text-secondary max-w-[540px] mt-5 mb-10 animate-fade-up animate-fade-up-3 max-[768px]:text-base max-[768px]:mt-4 max-[768px]:mb-8 max-[480px]:text-[15px] max-[480px]:mt-3 max-[480px]:mb-7">
        Generate name ideas for your SaaS, then instantly validate domains,
        trademarks, social handles, and competitive landscape.
      </p>

      <div className="flex gap-4 items-center animate-fade-up animate-fade-up-4 max-[768px]:flex-col max-[768px]:w-full max-[768px]:max-w-[320px] max-[480px]:max-w-full">
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-8 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-semibold text-black bg-accent rounded-lg no-underline hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all max-[768px]:w-full max-[768px]:justify-center"
        >
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
        </Link>
        <a
          href="#features"
          className="inline-flex items-center gap-2 px-8 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-medium text-text-primary bg-transparent border border-border rounded-lg no-underline hover:border-text-muted hover:bg-surface transition-all max-[768px]:w-full max-[768px]:justify-center"
        >
          See How It Works
        </a>
      </div>

      <TerminalDemo />
    </section>
  );
}
