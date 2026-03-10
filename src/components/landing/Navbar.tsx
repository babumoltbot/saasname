"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 px-6 lg:px-10 py-4 lg:py-5 flex items-center justify-between bg-black/80 backdrop-blur-[20px] border-b transition-colors duration-300 ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-mono)] text-lg font-bold text-text-primary no-underline tracking-tight"
      >
        Pik<span className="text-accent">Name</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-8 items-center">
        <a href="#features" className="text-[15px] text-text-secondary no-underline hover:text-text-primary transition-colors">
          Features
        </a>
        <a href="#how-it-works" className="text-[15px] text-text-secondary no-underline hover:text-text-primary transition-colors">
          How It Works
        </a>
        <a href="#demo" className="text-[15px] text-text-secondary no-underline hover:text-text-primary transition-colors">
          Demo
        </a>
        <a href="#pricing" className="text-[15px] text-text-secondary no-underline hover:text-text-primary transition-colors">
          Pricing
        </a>
        <Link
          href="/generate"
          className="text-[15px] font-medium text-black bg-accent px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity no-underline"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center gap-3">
        <Link
          href="/generate"
          className="text-sm font-medium text-black bg-accent px-4 py-2 rounded-lg hover:opacity-90 transition-opacity no-underline"
        >
          Get Started
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface border-b border-border px-6 py-4 flex flex-col gap-3 md:hidden">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-[15px] text-text-secondary no-underline py-1.5">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-[15px] text-text-secondary no-underline py-1.5">How It Works</a>
          <a href="#demo" onClick={() => setMenuOpen(false)} className="text-[15px] text-text-secondary no-underline py-1.5">Demo</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-[15px] text-text-secondary no-underline py-1.5">Pricing</a>
        </div>
      )}
    </nav>
  );
}
