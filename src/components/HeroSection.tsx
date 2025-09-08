
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white py-24 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-white" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight">
              Find Your Perfect Work From Home Job
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Connect with remote opportunities in customer service, sales, and interpretation
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Browse Opportunities
            </Button>
          </div>
          
          {/* Enhanced Visual Element */}
          <div className="relative lg:order-last">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white/60 rounded"></div>
                  </div>
                  <div className="h-4 bg-white/40 rounded w-24"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-white/30 rounded flex-1"></div>
                  <div className="h-3 bg-green-400/60 rounded w-16"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="h-3 bg-white/30 rounded flex-1"></div>
                  <div className="h-3 bg-blue-400/60 rounded w-20"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="h-3 bg-white/30 rounded flex-1"></div>
                  <div className="h-3 bg-purple-400/60 rounded w-12"></div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="h-2 bg-white/20 rounded mb-2"></div>
                  <div className="text-xs text-white/60">Active</div>
                </div>
                <div className="text-center">
                  <div className="h-2 bg-green-400/60 rounded mb-2"></div>
                  <div className="text-xs text-white/60">Complete</div>
                </div>
                <div className="text-center">
                  <div className="h-2 bg-blue-400/60 rounded mb-2"></div>
                  <div className="text-xs text-white/60">Pending</div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                  <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                  <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                </div>
                <div className="h-8 bg-white/20 rounded-lg w-20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white/60 rounded"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
