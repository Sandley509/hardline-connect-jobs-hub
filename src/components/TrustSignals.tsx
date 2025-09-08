import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Award, Users, CheckCircle, Lock } from "lucide-react";

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Secured by Stripe",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      text: "SSL Encrypted",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: "PCI Compliant",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: "30-Day Guarantee",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Trusted Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "50+", label: "Server Locations" }
  ];

  const testimonials = [
    {
      text: "Hardline Connect transformed my remote work setup. The security and speed are unmatched.",
      author: "Sarah M., Digital Marketer",
      company: "Tech Startup"
    },
    {
      text: "Finally found a VPN service that actually delivers on its promises. Great customer support too.",
      author: "Mike L., Software Developer", 
      company: "Fortune 500"
    },
    {
      text: "The job board helped me land my dream remote position. The platform is incredibly user-friendly.",
      author: "Jessica R., UX Designer",
      company: "Design Agency"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Trusted & Secure Platform
            </h3>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {trustBadges.map((badge, index) => (
                <Badge key={index} className={`${badge.color} flex items-center gap-2 px-3 py-2`}>
                  {badge.icon}
                  {badge.text}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Your data and payments are protected by industry-leading security standards
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="text-yellow-400">★</div>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-sm">{testimonial.author}</div>
                <div className="text-xs text-muted-foreground">{testimonial.company}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Partners */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Trusted Payment Partners
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">STRIPE</div>
              <div className="text-xl font-semibold">VISA</div>
              <div className="text-xl font-semibold">MASTERCARD</div>
              <div className="text-xl font-semibold">PAYPAL</div>
              <div className="text-xl font-semibold">AMEX</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustSignals;