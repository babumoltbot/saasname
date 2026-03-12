import Link from "next/link";

export const metadata = {
  title: "Contact | PikName",
  description: "Get in touch with the PikName team for support or questions.",
};

export default function ContactPage() {
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
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Contact</h1>
        <p className="text-sm text-text-muted mb-10">Need help with PikName?</p>

        <p>
          Email us at: <a href="mailto:support@pikname.com" className="text-accent hover:underline">support@pikname.com</a>
        </p>
        <p>We aim to respond within 2 business days.</p>

        <h2>For purchase issues, please include:</h2>
        <ul>
          <li>the email used at checkout</li>
          <li>your order date</li>
          <li>your payment receipt or transaction ID</li>
          <li>a brief description of the issue</li>
        </ul>
      </article>
    </main>
  );
}
