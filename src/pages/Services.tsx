
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartIcon from "@/components/CartIcon";
import CartModal from "@/components/CartModal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FileText, Keyboard, Users, CheckCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Services = () => {
  const [showCart, setShowCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Fetch services from database
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }

      return data || [];
    }
  });

  // Icon mapping for services
  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('resume') || name.includes('cv')) return FileText;
    if (name.includes('typing') || name.includes('test')) return Keyboard;
    if (name.includes('interview') || name.includes('proxy')) return Users;
    return FileText; // default icon
  };

  const handleAddToCart = (service: any) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      image: "/placeholder.svg",
      category: 'service' as any
    });
    toast({
      title: "Added to Cart",
      description: `${service.name} has been added to your cart.`,
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Layout>
      {/* Fixed Cart Icon */}
      <div className="fixed top-20 right-4 z-50">
        <CartIcon onClick={() => setShowCart(true)} />
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Remote Work Services
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Get expert help with resumes, typing tests, and interview preparation
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 mr-3 text-green-600" />
            Our Professional Services
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
              <p className="text-gray-400">Please check back later for new services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComponent = getServiceIcon(service.name);
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <IconComponent className="h-16 w-16 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg text-center">{service.name}</CardTitle>
                      <div className="text-3xl font-bold text-green-600 text-center">${service.price}</div>
                    </CardHeader>
                    <CardContent>
                      {service.description && (
                        <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                      )}
                      <div className="mb-6">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Professional service</span>
                        </div>
                        <div className="flex items-start mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Fast turnaround</span>
                        </div>
                        <div className="flex items-start mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Quality guarantee</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleAddToCart(service)}
                      >
                        Order Service
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Need Custom Service?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Contact us for personalized assistance with your remote work needs
          </p>
          <Button size="lg" variant="outline">
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
