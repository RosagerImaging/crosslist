export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            Crosslist (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <h3 className="text-xl font-medium mb-2">Account Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Email address</li>
            <li>Account credentials</li>
            <li>Profile information</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Marketplace Connections</h3>
          <p className="mb-2">
            When you connect marketplace accounts (eBay, Poshmark, Etsy, etc.),
            we collect and store:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>OAuth access tokens and refresh tokens</li>
            <li>Marketplace account identifiers</li>
            <li>Listing data, inventory information, and sales data</li>
            <li>Buyer communication and order information</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Usage Data</h3>
          <ul className="list-disc pl-6">
            <li>Log data and analytics</li>
            <li>Device and browser information</li>
            <li>Feature usage patterns</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            How We Use Your Information
          </h2>
          <p className="mb-2">We use the information we collect to:</p>
          <ul className="list-disc pl-6">
            <li>
              Provide and maintain our crosslisting and inventory management
              services
            </li>
            <li>
              Automate listing creation and optimization across marketplaces
            </li>
            <li>
              Enable AI-powered features for sourcing, pricing, and customer
              service
            </li>
            <li>Communicate with you about your account and our services</li>
            <li>Analyze usage to improve our platform</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Sharing Your Information
          </h2>
          <p className="mb-2">
            We do not sell your personal information. We may share your
            information with:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Marketplace platforms</strong>: To perform actions on your
              behalf (creating listings, responding to messages, etc.)
            </li>
            <li>
              <strong>Service providers</strong>: Third-party services that help
              us operate our platform (hosting, analytics, AI services)
            </li>
            <li>
              <strong>Legal requirements</strong>: When required by law or to
              protect our rights
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            information, including:
          </p>
          <ul className="list-disc pl-6">
            <li>Encrypted data transmission (HTTPS/TLS)</li>
            <li>Encrypted storage of sensitive credentials</li>
            <li>Secure OAuth 2.0 authentication for marketplace connections</li>
            <li>Regular security audits and updates</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the internet is 100% secure.
            We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Revoke marketplace connections at any time</li>
            <li>Export your data</li>
            <li>Opt out of certain data collection</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Marketplace-Specific Information
          </h2>

          <h3 className="text-xl font-medium mb-2">eBay Integration</h3>
          <p className="mb-4">
            When you connect your eBay account, we access your eBay data through
            their official API. We only request the minimum permissions
            necessary to provide our services. You can revoke our access at any
            time through eBay&apos;s account settings or through our platform.
          </p>

          <h3 className="text-xl font-medium mb-2">Other Marketplaces</h3>
          <p>
            Similar policies apply to all marketplace integrations (Poshmark,
            Etsy, Mercari, etc.). We only access data necessary for our services
            and respect each platform&apos;s terms of service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to maintain your
            session, remember your preferences, and analyze usage patterns. You
            can control cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or
            as needed to provide services. When you delete your account, we will
            delete or anonymize your personal information within 30 days, except
            where we must retain it for legal compliance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Children&apos;s Privacy
          </h2>
          <p>
            Our service is not intended for users under 18. We do not knowingly
            collect information from children. If you believe we have collected
            information from a child, please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by email or through our platform.
            Continued use of our service after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> privacy@crosslist.app
            <br />
            <strong>Support:</strong> support@crosslist.app
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            California Privacy Rights
          </h2>
          <p>
            California residents have additional rights under the California
            Consumer Privacy Act (CCPA), including the right to know what
            personal information we collect, the right to delete personal
            information, and the right to opt out of the sale of personal
            information (we do not sell personal information).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">GDPR Compliance</h2>
          <p>
            For users in the European Economic Area (EEA), we comply with the
            General Data Protection Regulation (GDPR). You have additional
            rights including data portability, the right to object to
            processing, and the right to lodge a complaint with a supervisory
            authority.
          </p>
        </section>
      </div>
    </div>
  );
}
