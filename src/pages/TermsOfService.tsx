import Layout from "@/components/Layout";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last Updated: December 8, 2025</p>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-lg text-foreground mb-4">
                  Please read these Terms of Service ("Terms") carefully before using the Hardline Connect website and VPN service (the "Service").
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-foreground font-medium">
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                  </p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Use of the Service</h2>
                <p className="text-foreground mb-4">
                  Hardline Connect grants you a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes.
                </p>
                <p className="text-foreground mb-4">
                  <strong>You agree not to use the Service for:</strong>
                </p>
                <ul className="space-y-2 text-foreground ml-6">
                  <li>• Any illegal or fraudulent activity</li>
                  <li>• Transmitting any material that constitutes copyright infringement</li>
                  <li>• Spamming, phishing, or distributing malware</li>
                  <li>• Attempting to gain unauthorized access to any network or system</li>
                  <li>• Any activity that violates the laws of your jurisdiction</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Account Registration</h2>
                <p className="text-foreground">
                  You must provide accurate and complete information when creating an account. You are solely responsible for the activity that occurs under your account and for keeping your password secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Payments and Billing</h2>
                <p className="text-foreground">
                  Subscription fees are billed in advance on a recurring basis. You can cancel your subscription at any time through your account dashboard. Refunds are handled on a case-by-case basis as outlined in our Money-Back Guarantee.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Our Warranties and Disclaimers</h2>
                <p className="text-foreground">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Hardline Connect does not warrant that the Service will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
                <p className="text-foreground">
                  Hardline Connect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
                <p className="text-foreground">
                  We reserve the right to modify these Terms at any time. We will provide notice of changes by updating the "Last Updated" date and posting the new Terms on this site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Governing Law</h2>
                <p className="text-foreground">
                  These Terms shall be governed by the laws of Delaware, USA, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Us</h2>
                <p className="text-foreground">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-foreground mt-2">
                  <strong>Email:</strong> support@hardlineconnect.store
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;