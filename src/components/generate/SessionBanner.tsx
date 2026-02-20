"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SessionBanner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full skeleton-line" />
        <div className="w-20 h-3 skeleton-line hidden sm:block" />
      </div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-surface"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-text-muted">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      {session.user?.image ? (
        <img
          src={session.user.image}
          alt=""
          className="w-7 h-7 rounded-full ring-1 ring-border"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
          {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
        </div>
      )}
      <span className="text-sm text-text-secondary hidden sm:inline max-w-[140px] truncate">
        {session.user?.name || session.user?.email}
      </span>
      <button
        onClick={() => signOut()}
        className="text-[11px] text-text-muted hover:text-text-secondary transition-colors px-2 py-1 rounded hover:bg-surface"
      >
        Sign out
      </button>
    </div>
  );
}
