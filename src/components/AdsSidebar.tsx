
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdsSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Business Services Ad */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-0">
          <img 
            src="/lovable-uploads/5df24894-f9e6-487b-af0a-38044f25840c.png" 
            alt="Start Your Business in the USA" 
            className="w-full h-auto object-cover"
          />
        </CardContent>
      </Card>

      {/* Website Referral Ad */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-0">
          <img 
            src="/lovable-uploads/8fb561d9-baff-41b0-97c0-8a25ddb61747.png" 
            alt="Get $200 Cash for Website Referrals" 
            className="w-full h-auto object-cover"
          />
        </CardContent>
      </Card>

      {/* Website Development Ad */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-0">
          <img 
            src="/lovable-uploads/50868bd1-dc05-4488-9f14-d891e7a5b688.png" 
            alt="Website Design & Development" 
            className="w-full h-auto object-cover"
          />
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Need Help?</h3>
          <p className="text-sm opacity-90 mb-4">
            Contact us for job assistance or business services
          </p>
          <Button className="bg-white text-teal-600 hover:bg-gray-100 w-full">
            Contact Us
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsSidebar;
