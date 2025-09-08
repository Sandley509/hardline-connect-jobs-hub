import { Button } from "@/components/ui/button";
import { Shield, Lock, Zap, Globe } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="h-4 w-4 mr-2" />
                Military-Grade Protection
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Unbreakable Privacy.
                <span className="text-primary block">Unmatched Speed.</span>
                <span className="text-muted-foreground">Anywhere.</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Hardline Connect's military-grade encryption shields your online activity from hackers, ISPs, and surveillance. Experience true digital freedom without compromise.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">256-bit AES</div>
                  <div className="text-sm text-muted-foreground">Encryption</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Lightning Fast</div>
                  <div className="text-sm text-muted-foreground">Connections</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">75+ Countries</div>
                  <div className="text-sm text-muted-foreground">Worldwide</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">No-Log Policy</div>
                  <div className="text-sm text-muted-foreground">Guaranteed</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 h-auto shadow-professional">
                Get Protected Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2">
                View Pricing
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                30-day money-back guarantee
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                No setup fees
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 backdrop-blur-sm border border-border shadow-professional-lg">
              {/* Mock Interface */}
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Connection Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                      Protected
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Your IP:</span>
                      <span className="text-sm font-mono">192.168.xxx.xxx</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm">Singapore</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Speed:</span>
                      <span className="text-sm text-primary font-semibold">850 Mbps</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-4/5"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Upload: 120 Mbps</span>
                      <span>Download: 850 Mbps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/20">
              <Lock className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;