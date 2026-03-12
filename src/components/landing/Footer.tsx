import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 px-6 lg:px-10 border-t border-border max-[480px]:py-8 max-[480px]:px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center max-[480px]:flex-col max-[480px]:gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-[family-name:var(--font-mono)] text-sm font-bold text-text-primary no-underline tracking-tight"
            >
              Pik<span className="text-accent">Name</span>
            </Link>
            <span className="w-px h-3.5 bg-border" />
            <span className="text-sm text-text-muted">
              Built by founders, for founders.
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="#features"
              className="text-sm text-text-muted no-underline hover:text-text-secondary transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-text-muted no-underline hover:text-text-secondary transition-colors"
            >
              Pricing
            </a>
          </div>
        </div>
        <div className="flex justify-center gap-4 flex-wrap text-xs text-text-muted">
          <Link href="/terms" className="no-underline hover:text-text-secondary transition-colors">Terms</Link>
          <span className="text-border">·</span>
          <Link href="/privacy" className="no-underline hover:text-text-secondary transition-colors">Privacy</Link>
          <span className="text-border">·</span>
          <Link href="/refunds" className="no-underline hover:text-text-secondary transition-colors">Refunds</Link>
          <span className="text-border">·</span>
          <Link href="/cookies" className="no-underline hover:text-text-secondary transition-colors">Cookies</Link>
          <span className="text-border">·</span>
          <Link href="/contact" className="no-underline hover:text-text-secondary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
