import Link from "next/link";

export const metadata = {
  title: "Terms of Service | PikName",
  description: "Terms of Service for PikName — AI-powered name generator and validator.",
};

export default function TermsPage() {
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
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: March 12, 2026</p>

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of PikName
          (&ldquo;PikName&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
          including our website, applications, and related services.
        </p>
        <p>
          By accessing or using PikName, you agree to these Terms. If you do not agree, do not use the Service.
        </p>

        <h2>1. What PikName Does</h2>
        <p>
          PikName is a self-serve web-based software tool that helps users generate startup, business,
          brand, or product name ideas using AI-assisted suggestions and related validation signals such
          as domain checks and brand-oriented scoring.
        </p>
        <p>
          Certain features displayed on the site may be marked as &ldquo;Soon&rdquo; or otherwise
          described as not yet generally available. Those features are not part of the purchased service
          until they are actually released.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old, or the age of majority in your jurisdiction, to purchase
          and use the paid Service.
        </p>

        <h2>3. Account and Access</h2>
        <p>
          You may be required to create an account or provide certain information to use some parts of the Service.
        </p>
        <p>You are responsible for:</p>
        <ul>
          <li>keeping your login credentials secure</li>
          <li>all activity under your account</li>
          <li>providing accurate information</li>
          <li>using the Service lawfully</li>
        </ul>
        <p>
          We may suspend or terminate access if we reasonably believe you have violated these Terms or
          used the Service abusively.
        </p>

        <h2>4. Paid Plans and Billing</h2>
        <p>
          PikName may offer paid access to premium features, credits, or usage-based entitlements.
        </p>
        <p>
          At the time of purchase, the pricing, included usage, and plan details shown on the checkout or
          pricing page will control. For example, a one-time payment may include a stated number of name
          generations or reports.
        </p>
        <p>
          All payments are processed by third-party payment providers. We do not store your full payment
          card details.
        </p>

        <h2>5. Refunds</h2>
        <p>
          Please review our <Link href="/refunds" className="text-accent hover:underline">Refund Policy</Link> for details.
        </p>
        <p>
          Because PikName is a digital product with immediate access and usage, purchases are generally
          non-refundable except where required by law or where we determine that a refund is appropriate
          due to technical failure, duplicate charge, or billing error.
        </p>

        <h2>6. Permitted Use</h2>
        <p>You may use PikName only for lawful internal business or personal evaluation purposes.</p>
        <p>You may not:</p>
        <ul>
          <li>copy, resell, sublicense, or commercially exploit the Service without permission</li>
          <li>reverse engineer, scrape, or systematically extract data from the Service</li>
          <li>use bots or automation to overload or interfere with the Service</li>
          <li>use the Service for unlawful, infringing, deceptive, or harmful activities</li>
          <li>attempt to bypass plan limits, credits, rate limits, or security protections</li>
        </ul>

        <h2>7. AI-Generated Output and User Responsibility</h2>
        <p>
          PikName generates suggestions and informational outputs using automated systems. You are solely
          responsible for evaluating whether any suggested name is suitable for your intended use.
        </p>
        <p>You must independently verify, as applicable:</p>
        <ul>
          <li>trademark availability</li>
          <li>domain availability</li>
          <li>social handle availability</li>
          <li>company name or business registration availability</li>
          <li>legal and regulatory compliance in your jurisdiction</li>
          <li>market conflicts or competitor confusion</li>
        </ul>
        <p>
          PikName does not guarantee that any generated name is unique, available, non-infringing,
          legally registrable, or fit for a particular purpose.
        </p>

        <h2>8. No Legal, Trademark, or Professional Advice</h2>
        <p>
          The Service is provided for informational and creative ideation purposes only. Nothing on
          PikName constitutes legal advice, trademark advice, intellectual property advice, business
          advice, or professional advice.
        </p>
        <p>
          Any references to trademarks, conflict risk, or competitor similarity are general informational
          signals only and are not a substitute for professional review by a qualified attorney or advisor.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          PikName and all related branding, software, text, graphics, interfaces, and content owned by us
          are protected by applicable intellectual property laws.
        </p>
        <p>
          Subject to these Terms, we grant you a limited, non-exclusive, non-transferable right to use
          the Service.
        </p>
        <p>
          You retain rights, if any, in the input you submit. Subject to applicable law and third-party
          rights, you may use the generated outputs for your internal evaluation and branding exploration.
          However, you are solely responsible for verifying that your use of any output does not infringe
          the rights of others.
        </p>

        <h2>10. Service Availability and Changes</h2>
        <p>
          We may modify, improve, suspend, or discontinue any part of the Service at any time, including
          features, pricing, limits, or availability.
        </p>
        <p>We do not guarantee uninterrupted or error-free operation.</p>

        <h2>11. Third-Party Services</h2>
        <p>
          The Service may link to or rely on third-party providers, including domain registrars, payment
          processors, analytics providers, hosting providers, or AI infrastructure providers.
        </p>
        <p>We are not responsible for third-party products or services.</p>

        <h2>12. Disclaimers</h2>
        <p className="uppercase text-xs leading-relaxed">
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
          of any kind, whether express, implied, or statutory, including implied warranties of
          merchantability, fitness for a particular purpose, title, non-infringement, or accuracy.
        </p>
        <p>We do not warrant that:</p>
        <ul>
          <li>outputs will be accurate, complete, or error-free</li>
          <li>any suggested name will be available or protectable</li>
          <li>the Service will meet your specific needs</li>
          <li>the Service will always be secure or uninterrupted</li>
        </ul>

        <h2>13. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, PikName and its owners, affiliates, and service
          providers will not be liable for any indirect, incidental, special, consequential, exemplary,
          or punitive damages, or for any loss of profits, revenue, goodwill, data, business opportunity,
          or business interruption.
        </p>
        <p>
          To the maximum extent permitted by law, our total liability arising out of or relating to the
          Service will not exceed the amount you paid us for the Service in the 12 months before the
          event giving rise to the claim.
        </p>

        <h2>14. Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless PikName and its affiliates, owners, and service
          providers from claims, liabilities, damages, losses, and expenses arising out of:
        </p>
        <ul>
          <li>your use of the Service</li>
          <li>your violation of these Terms</li>
          <li>your infringement of any rights of another person or entity</li>
          <li>your use of generated names or outputs in commerce</li>
        </ul>

        <h2>15. Termination</h2>
        <p>You may stop using the Service at any time.</p>
        <p>
          We may suspend or terminate your access at any time if you violate these Terms, pose risk to
          the Service, or if we discontinue the Service.
        </p>
        <p>
          Sections that by nature should survive termination will survive, including ownership,
          disclaimers, limitations of liability, indemnity, and dispute provisions.
        </p>

        <h2>16. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles.
        </p>
        <p>
          The courts located in Collin County, Texas will have exclusive jurisdiction, except where
          applicable law requires otherwise.
        </p>

        <h2>17. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. The updated version will be posted on this page
          with a revised &ldquo;Last updated&rdquo; date. Continued use of the Service after changes
          become effective constitutes acceptance of the updated Terms.
        </p>

        <h2>18. Contact</h2>
        <p>
          For questions about these Terms, contact us at:
        </p>
        <p>
          support@pikname.com<br />
          Kingsbridge Consultancy LLC<br />
          4596 Mackey Ct, Plano, TX 75024
        </p>
      </article>
    </main>
  );
}
