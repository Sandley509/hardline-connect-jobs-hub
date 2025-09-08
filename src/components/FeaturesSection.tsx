import { Shield, Zap, Globe, Eye, Server, Smartphone } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "AES-256 encryption ensures your data remains completely secure and private, meeting the same standards used by governments and military organizations worldwide."
    },
    {
      icon: Zap,
      title: "Lightning-Fast Speeds",
      description: "Our optimized global network delivers blazing-fast connections without compromising security. Stream, browse, and download at maximum speeds."
    },
    {
      icon: Globe,
      title: "75+ Global Servers",
      description: "Access content from anywhere with our extensive network spanning 75+ countries. Bypass geo-restrictions and enjoy true internet freedom."
    },
    {
      icon: Eye,
      title: "Strict No-Logs Policy",
      description: "We never track, collect, or store your online activity. Your privacy is our priority, guaranteed by our independently audited no-logs policy."
    },
    {
      icon: Server,
      title: "Kill Switch Protection",
      description: "Automatic kill switch instantly disconnects your internet if VPN connection drops, ensuring your real IP address is never exposed."
    },
    {
      icon: Smartphone,
      title: "Multi-Device Support",
      description: "Protect up to 10 devices simultaneously across all platforms. Windows, Mac, iOS, Android, and Linux - we've got you covered."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Enterprise-Grade Security
            <span className="block text-primary">For Everyone</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the most advanced VPN technology designed to keep you safe, secure, and anonymous online. Built by security experts, trusted by millions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-8 shadow-professional hover:shadow-professional-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-8 bg-muted/30 rounded-2xl px-8 py-6 border border-border">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">99.9% Uptime</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">24/7 Support</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-foreground">5M+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;