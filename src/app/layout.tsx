import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaSName — AI-Powered Name Validator for Founders",
  description:
    "Generate, validate, and secure the perfect name for your SaaS. Domain checks, trademark screening, social handle availability — all in one tool.",
  openGraph: {
    type: "website",
    url: "https://saasname.nagrao.dev",
    title: "SaaSName — Stop guessing. Validate your SaaS name.",
    description:
      "AI-powered name generator for founders. Get name ideas, check domains, social handles, trademarks, and brand scores — all in one tool.",
    images: ["https://saasname.nagrao.dev/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSName — Stop guessing. Validate your SaaS name.",
    description:
      "AI-powered name generator for founders. Get name ideas, check domains, social handles, trademarks, and brand scores — all in one tool.",
    images: ["https://saasname.nagrao.dev/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
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
      </body>
    </html>
  );
}
