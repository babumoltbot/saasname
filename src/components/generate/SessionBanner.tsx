"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SessionBanner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-8 bg-border rounded animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt=""
          className="w-7 h-7 rounded-full"
        />
      )}
      <span className="text-sm text-text-secondary hidden sm:inline">
        {session.user?.name || session.user?.email}
      </span>
      <button
        onClick={() => signOut()}
        className="text-xs text-text-muted hover:text-text-secondary transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
