import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | PikName",
  description: "Privacy Policy for PikName — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: March 12, 2026</p>

        <p>
          This Privacy Policy explains how PikName (&ldquo;PikName&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, shares, and protects personal
          information when you use our website and services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following categories of information:</p>

        <h3>a. Information you provide directly</h3>
        <ul>
          <li>name</li>
          <li>email address</li>
          <li>account credentials</li>
          <li>payment-related information provided during checkout</li>
          <li>support messages or other communications</li>
          <li>prompts, descriptions, answers, preferences, or other content you submit to generate naming results</li>
        </ul>

        <h3>b. Usage and device information</h3>
        <ul>
          <li>IP address</li>
          <li>browser type and version</li>
          <li>device identifiers</li>
          <li>operating system</li>
          <li>referral URLs</li>
          <li>pages viewed</li>
          <li>time spent on pages</li>
          <li>interactions with our website or product</li>
          <li>log and diagnostic data</li>
        </ul>

        <h3>c. Payment information</h3>
        <p>
          Payments are processed by third-party payment processors. We generally do not store full card
          numbers or full payment credentials on our servers.
        </p>

        <h3>d. Cookies and similar technologies</h3>
        <p>
          We may use cookies, pixels, local storage, and similar technologies for authentication,
          security, analytics, preferences, and service performance.
        </p>

        <h2>2. How We Use Information</h2>
        <p>We use information to:</p>
        <ul>
          <li>provide, operate, and maintain the Service</li>
          <li>create and manage user accounts</li>
          <li>process payments and deliver purchased access</li>
          <li>generate outputs based on your inputs</li>
          <li>improve our models, product quality, and user experience</li>
          <li>monitor performance, reliability, and security</li>
          <li>prevent fraud, abuse, and misuse</li>
          <li>communicate with you about purchases, updates, and support</li>
          <li>comply with legal obligations</li>
          <li>enforce our Terms and other policies</li>
        </ul>

        <h2>3. AI Inputs and Outputs</h2>
        <p>
          If you submit business ideas, descriptions, prompts, or branding preferences into PikName, we
          process that content to generate naming suggestions and related outputs.
        </p>
        <p>
          Do not submit confidential, sensitive, or highly regulated personal information unless you are
          comfortable doing so and it is necessary for your use case.
        </p>

        <h2>4. Legal Bases for Processing</h2>
        <p>
          Where applicable law requires a legal basis, we process personal information on one or more of
          the following bases:
        </p>
        <ul>
          <li>performance of a contract</li>
          <li>legitimate interests</li>
          <li>consent</li>
          <li>compliance with legal obligations</li>
        </ul>

        <h2>5. How We Share Information</h2>
        <p>We may share information with:</p>
        <ul>
          <li>payment processors</li>
          <li>hosting and infrastructure providers</li>
          <li>analytics providers</li>
          <li>customer support tools</li>
          <li>fraud prevention and security providers</li>
          <li>AI or model infrastructure providers</li>
          <li>legal or regulatory authorities when required</li>
          <li>a buyer, investor, or successor in connection with a merger, financing, acquisition, or sale of assets</li>
        </ul>
        <p>We do not sell personal information in exchange for money.</p>

        <h2>6. Data Retention</h2>
        <p>We retain information for as long as reasonably necessary to:</p>
        <ul>
          <li>provide the Service</li>
          <li>maintain business and tax records</li>
          <li>resolve disputes</li>
          <li>enforce agreements</li>
          <li>comply with legal obligations</li>
        </ul>
        <p>
          Retention periods may vary depending on the type of data and the purpose for which it was collected.
        </p>

        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have rights to:</p>
        <ul>
          <li>access personal information</li>
          <li>correct inaccurate information</li>
          <li>delete personal information</li>
          <li>object to certain processing</li>
          <li>restrict certain processing</li>
          <li>withdraw consent where processing is based on consent</li>
          <li>request portability of your data</li>
        </ul>
        <p>
          To exercise these rights, contact us at support@pikname.com.
        </p>

        <h2>8. International Transfers</h2>
        <p>
          Your information may be processed in countries other than your own. Where required, we take
          reasonable steps to provide appropriate safeguards for cross-border transfers.
        </p>

        <h2>9. Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational safeguards designed to protect
          personal information. However, no method of transmission or storage is completely secure, and we
          cannot guarantee absolute security.
        </p>

        <h2>10. Children</h2>
        <p>
          The Service is not directed to children under 13, or a higher minimum age where required by
          local law. We do not knowingly collect personal information from children in violation of
          applicable law.
        </p>

        <h2>11. Third-Party Links and Services</h2>
        <p>
          Our website may contain links to third-party websites or services. We are not responsible for
          the privacy practices of those third parties.
        </p>

        <h2>12. Cookies</h2>
        <p>
          We may use essential cookies to operate the Service and non-essential cookies for analytics and
          product improvement. Where required by law, we will ask for consent before using non-essential
          cookies. See our <Link href="/cookies" className="text-accent hover:underline">Cookie Policy</Link> for
          more details.
        </p>

        <h2>13. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the updated version on this
          page with a revised &ldquo;Last updated&rdquo; date.
        </p>

        <h2>14. Contact</h2>
        <p>
          If you have questions or requests relating to this Privacy Policy, contact us at:
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
