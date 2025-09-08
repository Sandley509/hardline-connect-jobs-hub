import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      description: "Perfect for individuals getting started with VPN protection",
      monthlyPrice: 12.99,
      yearlyPrice: 4.99,
      yearlyDiscount: 62,
      features: [
        "5 simultaneous connections",
        "75+ server locations",
        "256-bit AES encryption",
        "No-logs policy",
        "Kill switch protection",
        "24/7 customer support",
        "30-day money-back guarantee"
      ],
      popular: false
    },
    {
      name: "Professional",
      description: "Best value for families and small teams",
      monthlyPrice: 15.99,
      yearlyPrice: 6.99,
      yearlyDiscount: 56,
      features: [
        "10 simultaneous connections",
        "75+ server locations",
        "256-bit AES encryption",
        "No-logs policy",
        "Kill switch protection",
        "Dedicated IP available",
        "Priority customer support",
        "Streaming optimized servers",
        "30-day money-back guarantee"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "Advanced features for businesses and power users",
      monthlyPrice: 24.99,
      yearlyPrice: 12.99,
      yearlyDiscount: 48,
      features: [
        "Unlimited connections",
        "75+ server locations",
        "256-bit AES encryption",
        "No-logs policy",
        "Kill switch protection",
        "Dedicated IP included",
        "24/7 priority support",
        "Business-grade security",
        "Team management dashboard",
        "Advanced threat protection",
        "30-day money-back guarantee"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs. All plans include our core security features with a 30-day money-back guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-8 ${
                plan.popular
                  ? 'border-primary shadow-professional-lg scale-105 bg-card'
                  : 'border-border shadow-professional bg-card hover:shadow-professional-lg'
              } transition-all duration-300 hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-foreground">${plan.yearlyPrice}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">${plan.monthlyPrice}/month</span>
                    <span className="ml-2 text-green-600 font-semibold">Save {plan.yearlyDiscount}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Billed annually at ${(plan.yearlyPrice * 12).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
                } h-12 font-semibold`}
              >
                Get {plan.name} Plan
              </Button>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">30-Day</div>
              <div className="text-sm text-muted-foreground">Money-Back Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">No Logs</div>
              <div className="text-sm text-muted-foreground">Independently Audited</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;