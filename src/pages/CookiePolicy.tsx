import Layout from "@/components/Layout";

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
              <p className="text-muted-foreground">Last Updated: December 8, 2025</p>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-lg text-foreground mb-4">
                  This Cookie Policy explains what cookies are, how Hardline Connect uses them, and your choices regarding them.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
                <p className="text-foreground">
                  Cookies are small text files that are placed on your device by websites you visit. They are widely used to make websites work more efficiently and provide information to the site owners.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
                <p className="text-foreground mb-4">
                  We use cookies for essential functions and to understand how our website is performing. We do not use cookies to track your browsing activity outside of our website.
                </p>
                <ul className="space-y-4 text-foreground ml-6">
                  <li>
                    <strong>Strictly Necessary Cookies:</strong> These are required for the basic functions of our website, such as managing your login session and shopping cart. The website cannot function properly without these cookies.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are popular and how visitors move around the site. All information these cookies collect is aggregated and anonymous.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Third-Party Cookies</h2>
                <p className="text-foreground mb-4">
                  We use a few trusted third-party services that may also set cookies:
                </p>
                <ul className="space-y-2 text-foreground ml-6">
                  <li>
                    <strong>Google Analytics:</strong> To understand how our website is used in an anonymous, aggregated way.
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> Cookies are essential for processing your transaction securely.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Cookie Choices</h2>
                <p className="text-foreground">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                </p>
              </section>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">Cookie Preferences</h3>
                <p className="text-foreground mb-4">
                  You can manage your cookie preferences at any time by contacting us or adjusting your browser settings.
                </p>
                <p className="text-foreground">
                  <strong>Contact us:</strong> support@hardlineconnect.store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;