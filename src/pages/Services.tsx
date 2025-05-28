
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartIcon from "@/components/CartIcon";
import CartModal from "@/components/CartModal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FileText, Keyboard, Users, CheckCircle } from "lucide-react";

const Services = () => {
  const [showCart, setShowCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const services = [
    {
      id: "resume-service",
      name: "Professional Resume Writing",
      price: 20.00,
      image: "/placeholder.svg",
      icon: FileText,
      stripeProductId: "prod_resume_service_123",
      features: [
        "Professional resume review and rewrite", 
        "ATS-optimized formatting", 
        "Industry-specific keywords", 
        "24-hour turnaround",
        "1 revision included"
      ]
    },
    {
      id: "typing-test",
      name: "Typing Test Assistance",
      price: 30.00,
      image: "/placeholder.svg",
      icon: Keyboard,
      stripeProductId: "prod_typing_test_456",
      features: [
        "Professional typing test completion", 
        "High accuracy guarantee", 
        "Fast turnaround time", 
        "Screen sharing session",
        "Practice tips included"
      ]
    },
    {
      id: "interview-proxy",
      name: "Interview ",
      price: 40.00,
      image: "/placeholder.svg",
      icon: Users,
      stripeProductId: "prod_interview_proxy_789",
      features: [
        "Professional interview representation", 
        "Industry expert on your behalf", 
        "Pre-interview consultation", 
        "Success guarantee",
        "Confidential service"
      ]
    }
  ];

  const handleAddToCart = (service: any) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      image: service.image,
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <IconComponent className="h-16 w-16 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg text-center">{service.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600 text-center">${service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
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
