export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-border max-[480px]:py-8 max-[480px]:px-4">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center max-[768px]:flex-col max-[768px]:gap-4">
        <span className="text-[13px] text-text-muted max-[480px]:text-xs">
          Built by founders, for founders.
        </span>
        <div className="flex gap-6 max-[480px]:gap-5">
          <a
            href="#features"
            className="text-[13px] text-text-muted no-underline hover:text-text-secondary transition-colors max-[480px]:text-xs"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-[13px] text-text-muted no-underline hover:text-text-secondary transition-colors max-[480px]:text-xs"
          >
            Pricing
          </a>
        </div>
      </div>
    </footer>
  );
}
