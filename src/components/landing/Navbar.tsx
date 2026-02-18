"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 px-10 py-5 flex items-center justify-between bg-black/80 backdrop-blur-[20px] border-b transition-colors duration-300 ${
        scrolled ? "border-border" : "border-transparent"
      } max-[768px]:px-5 max-[768px]:py-4 max-[480px]:px-4 max-[480px]:py-3.5`}
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-mono)] text-lg font-bold text-text-primary no-underline tracking-tight"
      >
        SaaS<span className="text-accent">Name</span>
      </Link>
      <div className="flex gap-8 items-center max-[768px]:gap-4">
        <a
          href="#features"
          className="text-sm text-text-secondary no-underline hover:text-text-primary transition-colors max-[768px]:hidden"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-sm text-text-secondary no-underline hover:text-text-primary transition-colors max-[768px]:hidden"
        >
          How It Works
        </a>
        <a
          href="#pricing"
          className="text-sm text-text-secondary no-underline hover:text-text-primary transition-colors max-[768px]:hidden"
        >
          Pricing
        </a>
        <Link
          href="/generate"
          className="text-[13px] font-medium text-black bg-accent px-5 py-2 rounded-md hover:opacity-85 transition-opacity no-underline max-[480px]:px-3.5 max-[480px]:py-1.5 max-[480px]:text-xs"
        >
          Try Free
        </Link>
      </div>
    </nav>
  );
}
