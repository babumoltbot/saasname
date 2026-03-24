import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Names | PikName",
  robots: { index: false, follow: false },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
