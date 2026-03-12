import Link from "next/link";

export const metadata = {
  title: "Refund Policy | PikName",
  description: "Refund Policy for PikName — when and how refunds are handled.",
};

export default function RefundsPage() {
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
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Refund Policy</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: March 12, 2026</p>

        <p>Thank you for using PikName.</p>
        <p>
          PikName is a digital software product that provides immediate access to paid features after
          purchase. Because access is provided instantly and usage can begin immediately, purchases are
          generally non-refundable except as described below or where required by law.
        </p>

        <h2>Eligible refund situations</h2>
        <p>We may issue a refund, in whole or in part, in situations such as:</p>
        <ul>
          <li>duplicate charges</li>
          <li>accidental double payment</li>
          <li>technical failure that prevented access to the purchased service</li>
          <li>material mismatch between the purchased plan and what was delivered</li>
          <li>billing errors</li>
        </ul>

        <h2>Not normally eligible for refund</h2>
        <p>Refunds are generally not available where:</p>
        <ul>
          <li>you changed your mind after purchase</li>
          <li>you used all or part of the purchased credits, generations, or outputs</li>
          <li>you are dissatisfied with generated names or subjective creative results</li>
          <li>a generated name is unavailable as a domain, handle, trademark, or company registration</li>
          <li>a feature was clearly marked as &ldquo;Soon&rdquo;, unavailable, beta, or not yet released at the time of purchase</li>
        </ul>

        <h2>Request window</h2>
        <p>
          To request a refund, contact us within 7 days of purchase at support@pikname.com and include:
        </p>
        <ul>
          <li>the email used for purchase</li>
          <li>date of purchase</li>
          <li>payment receipt or transaction reference</li>
          <li>a brief explanation of the issue</li>
        </ul>

        <h2>Review process</h2>
        <p>
          Refund requests are reviewed case by case. If approved, refunds are returned to the original
          payment method where possible.
        </p>

        <h2>Chargebacks</h2>
        <p>
          Before initiating a card chargeback, please contact us first so we can attempt to resolve the
          issue quickly.
        </p>
      </article>
    </main>
  );
}
