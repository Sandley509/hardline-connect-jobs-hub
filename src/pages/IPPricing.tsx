
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Shield, Zap, Globe } from "lucide-react";

const IPPricing = () => {
  const pricingPlans = [
    {
      name: "Basic IP",
      price: "$15",
      period: "/month",
      popular: false,
      features: [
        "1 Dedicated IP Address",
        "USA Location",
        "99.9% Uptime",
        "24/7 Support",
        "Basic DDoS Protection"
      ],
      icon: <Server className="h-8 w-8" />
    },
    {
      name: "Professional IP",
      price: "$35",
      period: "/month",
      popular: true,
      features: [
        "3 Dedicated IP Addresses",
        "USA Multi-Location",
        "99.99% Uptime",
        "Priority Support",
        "Advanced DDoS Protection",
        "Free SSL Certificate"
      ],
      icon: <Shield className="h-8 w-8" />
    },
    {
      name: "Enterprise IP",
      price: "$75",
      period: "/month",
      popular: false,
      features: [
        "10 Dedicated IP Addresses",
        "USA Premium Locations",
        "99.99% Uptime SLA",
        "Dedicated Support Manager",
        "Enterprise DDoS Protection",
        "Free SSL Certificates",
        "Custom Configuration"
      ],
      icon: <Zap className="h-8 w-8" />
    },
    {
      name: "Custom Solution",
      price: "Contact",
      period: "for pricing",
      popular: false,
      features: [
        "Unlimited IP Addresses",
        "Global Locations",
        "Custom SLA",
        "White-label Solution",
        "API Access",
        "Bulk Discounts Available"
      ],
      icon: <Globe className="h-8 w-8" />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            USA IP Server Resale Pricing
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Premium dedicated IP addresses for your business needs
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose Our IP Servers?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get reliable, high-performance dedicated IP addresses with premium USA locations, 
            perfect for businesses requiring consistent connectivity and security.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''} hover:shadow-lg transition-shadow`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {plan.icon}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.price === "Contact" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-green-600" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Advanced DDoS protection</li>
                <li>• Secure tunnel protocols</li>
                <li>• Regular security updates</li>
                <li>• Traffic encryption</li>
                <li>• Firewall protection</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-6 w-6 mr-2 text-blue-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• High-speed connections</li>
                <li>• Low latency networks</li>
                <li>• 99.99% uptime guarantee</li>
                <li>• Redundant infrastructure</li>
                <li>• Real-time monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to get started?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today for custom pricing and bulk discounts
          </p>
          <div className="space-x-4">
            <Button size="lg">Contact Sales</Button>
            <Button size="lg" variant="outline">View Documentation</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IPPricing;
