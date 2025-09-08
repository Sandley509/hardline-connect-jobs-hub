import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Globe, 
  Server, 
  Eye, 
  Key,
  Award,
  Clock,
  Users
} from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bank-Level Encryption",
      description: "AES-256 encryption protects all your data in transit and at rest"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Zero-Log Policy", 
      description: "We don't track, store, or share your browsing activity"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Server Network",
      description: "50+ server locations worldwide for optimal performance"
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Secure Infrastructure",
      description: "Built on Supabase with enterprise-grade security standards"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "No Data Collection",
      description: "Your personal information stays private and secure"
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Multi-Factor Authentication",
      description: "Additional security layers to protect your account"
    }
  ];

  const certifications = [
    { name: "PCI DSS Compliant", icon: <Award className="h-5 w-5" /> },
    { name: "TLS 1.3 Encryption", icon: <Lock className="h-5 w-5" /> },
    { name: "SOC 2 Type II", icon: <Shield className="h-5 w-5" /> },
    { name: "GDPR Compliant", icon: <Users className="h-5 w-5" /> }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Your Security & Privacy Matter
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Hardline Connect implements military-grade security protocols to ensure your data, 
              browsing activity, and personal information remain completely private and protected.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-2 px-4 py-2">
                  {cert.icon}
                  {cert.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Encryption & Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">End-to-End Encryption</h4>
                    <p className="text-sm text-muted-foreground">All communications encrypted with AES-256</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Secure Payment Processing</h4>
                    <p className="text-sm text-muted-foreground">Powered by Stripe with PCI DSS compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Database Security</h4>
                    <p className="text-sm text-muted-foreground">Row-Level Security (RLS) protects user data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">No Activity Logging</h4>
                    <p className="text-sm text-muted-foreground">We don't track or store your browsing history</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Anonymous Connections</h4>
                    <p className="text-sm text-muted-foreground">Your real IP address is never exposed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">GDPR Compliant</h4>
                    <p className="text-sm text-muted-foreground">Full compliance with EU privacy regulations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Security Principles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Security Principles</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              At Hardline Connect, security isn't an afterthought—it's the foundation of everything we build.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Network Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Military-Grade Encryption</h4>
                    <p className="text-sm text-muted-foreground">We use AES-256 encryption to secure your internet traffic, the same standard trusted by governments and security experts worldwide.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secure Protocols</h4>
                    <p className="text-sm text-muted-foreground">We support multiple VPN protocols including WireGuard® and OpenVPN to provide a blend of speed and impenetrable security.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Network Lock (Kill Switch)</h4>
                    <p className="text-sm text-muted-foreground">Our application includes a kill switch feature that blocks all internet traffic if your VPN connection drops unexpectedly, preventing data leaks.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Infrastructure Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">No-Logs Policy</h4>
                    <p className="text-sm text-muted-foreground">We do not track or record any information regarding your VPN usage. We have designed our systems to be incapable of storing connection logs.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">RAM-Only Servers</h4>
                    <p className="text-sm text-muted-foreground">Where possible, our servers run on volatile memory (RAM). This means all data is wiped clean with every reboot, leaving no trace of user activity.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Physical Security</h4>
                    <p className="text-sm text-muted-foreground">Our servers are hosted in top-tier, ISO-certified data centers with 24/7 monitoring, biometric access controls, and robust physical security.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Account & Access Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Hashed Passwords</h4>
                    <p className="text-sm text-muted-foreground">Your account password is hashed using bcrypt, making it unreadable to us and anyone else.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-muted-foreground">We offer 2FA to add an extra layer of security to your Hardline Connect account.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secure Payment Processing</h4>
                    <p className="text-sm text-muted-foreground">All payments are processed by PCI-DSS compliant third-party processors. We never store your full payment card information on our servers.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Vulnerability Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">
                    We are committed to transparency. If you discover a vulnerability in our service, we encourage you to report it to us responsibly.
                  </p>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-foreground font-medium">
                      <strong>Security Contact:</strong> security@hardlineconnect.store
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      We work quickly to address all valid security concerns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Indicators */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Trusted by Thousands of Remote Workers</h3>
                <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">50,000+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    30-Day Money-Back Guarantee
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Secured by Stripe
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Secure Your Connection?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of remote workers who trust Hardline Connect for their security needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="/services">Get Protected Now</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Contact Security Team</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Security;