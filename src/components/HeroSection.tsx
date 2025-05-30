
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          Find Your Perfect Work From Home Job
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Connect with remote opportunities in customer service, sales, and interpretation
        </p>
        <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-3">
          Browse Opportunities
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
