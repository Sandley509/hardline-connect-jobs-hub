import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last Updated: December 8, 2025</p>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-lg text-foreground mb-4">
                  <strong>Welcome to Hardline Connect.</strong> Your privacy is not just a policy for us; it's our core mission. 
                  This Privacy Policy explains how Hardline Connect ("we," "us," or "our") collects, uses, and protects the very 
                  limited information you share with us when you use our website and VPN services.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-foreground font-medium">
                    We are committed to a strict <strong>no-logs policy</strong>. We do not monitor, track, or store your online activities.
                  </p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Do Not Collect</h2>
                <p className="text-foreground mb-4">
                  We are designed to protect your privacy. We <strong>DO NOT</strong> log or store:
                </p>
                <ul className="space-y-2 text-foreground ml-6">
                  <li>• Your original IP address</li>
                  <li>• Your connection timestamps</li>
                  <li>• Your session duration</li>
                  <li>• Your browsing history</li>
                  <li>• Your network traffic</li>
                  <li>• Your DNS queries</li>
                  <li>• Any data about the applications, services, or websites you use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect (Minimal & Necessary)</h2>
                <p className="text-foreground mb-4">To create and maintain your account, we collect:</p>
                <ul className="space-y-3 text-foreground ml-6">
                  <li>
                    <strong>Account Information:</strong> Your email address and a hashed password for authentication.
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Our secure third-party payment processors (e.g., Stripe, PayPal) 
                    handle all transactions. We do not store your full credit card details on our servers.
                  </li>
                  <li>
                    <strong>Communication:</strong> Any correspondence you have with our support team.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <ul className="space-y-2 text-foreground ml-6">
                  <li>• To provide, maintain, and improve our Services</li>
                  <li>• To authenticate your access to the Service</li>
                  <li>• To process your transactions</li>
                  <li>• To respond to your customer support requests</li>
                  <li>• To send you essential service-related announcements (e.g., policy changes, security updates)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Sharing Your Information</h2>
                <p className="text-foreground">
                  We do not sell, rent, or trade your personal information. We will only share data if required by law 
                  in a jurisdiction that has authority over our company, and only if the request is valid and follows due process.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
                <p className="text-foreground">
                  We implement robust security measures, including encryption and secure servers, to protect your account 
                  information from unauthorized access, alteration, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
                <p className="text-foreground">
                  You can access, correct, or delete your personal information directly through your account settings or 
                  by contacting us. You can also request a copy of the personal data we hold about you.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Changes to This Policy</h2>
                <p className="text-foreground">
                  We may update this policy to reflect changes in our practices. We will notify you of any significant 
                  changes by posting the new policy on this site and updating the "Last Updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Us</h2>
                <p className="text-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-foreground mt-2">
                  <strong>Email:</strong> privacy@hardlineconnect.store
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;