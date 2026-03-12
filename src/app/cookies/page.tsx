import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | PikName",
  description: "Cookie Policy for PikName — how we use cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-surface-primary">
      <nav className="sticky top-0 z-50 bg-surface-primary/95 backdrop-blur-sm border-b border-border py-3 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="font-[family-name:var(--font-mono)] text-sm font-bold text-text-primary no-underline tracking-tight"
          >
            Pik<span className="text-accent">Name</span>
          </Link>
        </div>
      </nav>
      <article className="max-w-3xl mx-auto px-6 py-16 prose-legal">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Cookie Policy</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: March 12, 2026</p>

        <p>
          PikName uses cookies and similar technologies to operate the website, keep users signed in,
          understand product usage, improve performance, and maintain security.
        </p>

        <h2>Types of cookies we may use</h2>

        <h3>Essential cookies</h3>
        <p>These are necessary for the website and core product functions to work.</p>

        <h3>Analytics cookies</h3>
        <p>These help us understand how visitors use PikName so we can improve the service.</p>

        <h3>Preference cookies</h3>
        <p>These remember settings and preferences.</p>

        <h2>Your choices</h2>
        <p>
          You can usually control cookies through your browser settings. Where required by law, we will
          request your consent before setting non-essential cookies.
        </p>
        <p>
          To learn more or request assistance, contact{" "}
          <a href="mailto:support@pikname.com" className="text-accent hover:underline">support@pikname.com</a>.
        </p>
      </article>
    </main>
  );
}
