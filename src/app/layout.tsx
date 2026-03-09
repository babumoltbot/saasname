import type { Metadata } from "next";
import Script from "next/script";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PikName — AI-Powered Name Generator for Startups & Products",
  description:
    "Generate, validate, and secure the perfect name for your startup or product. Domain checks, trademark screening, social handle availability — all in one tool.",
  metadataBase: new URL("https://www.pikname.com"),
  openGraph: {
    type: "website",
    url: "https://www.pikname.com",
    title: "PikName — Stop guessing. Validate your startup name.",
    description:
      "AI-powered name generator for founders. Get name ideas, check domains, social handles, trademarks, and brand scores — all in one tool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PikName — Stop guessing. Validate your startup name.",
    description:
      "AI-powered name generator for founders. Get name ideas, check domains, social handles, trademarks, and brand scores — all in one tool.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[family-name:var(--font-display)] bg-black text-text-primary leading-relaxed overflow-x-hidden antialiased">
        <SessionProvider>{children}</SessionProvider>
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://trk.nagrao.dev/script.js"
            data-website-id="9a59fdb3-4798-46c8-9a9b-ce0acd5356f6"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
