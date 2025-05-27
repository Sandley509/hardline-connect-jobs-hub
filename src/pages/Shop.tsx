
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartIcon from "@/components/CartIcon";
import CartModal from "@/components/CartModal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Headphones, Router, ShoppingCart } from "lucide-react";

const Shop = () => {
  const [showCart, setShowCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const headsets = [
    {
      id: "headset-1",
      name: "Logitech Usb headset",
      price: 89.99,
      image: "/logitech.webp",
      stripeProductId: "prod_headset_pro_123", // Replace with real Stripe product ID
      features: ["Noise Cancellation", "USB Connection", "Comfortable Padding", "Adjustable Microphone"]
    },
    {
      id: "headsert-2",
      name: "Jabara usb headset",
      price: 129.99,
      image: "/jabra.jpg",
      stripeProductId: "prod_headset_elite_456", // Replace with real Stripe product ID
      features: ["Superior Audio Quality", "All-Day Comfort", "Quick Disconnect", "Warranty Included"]
    },
    {
      id: "headset-3",
      name: "Remote Work Essential",
      price: 59.99,
      image: "/placeholder.svg",
      stripeProductId: "prod_headset_essential_789", // Replace with real Stripe product ID
      features: ["Crystal Clear Audio", "Lightweight Design", "Plug & Play", "Compatible with All Devices"]
    }
  ];

  const routers = [
    {
      id: "router-1",
      name: "GL.iNet GL-MT300N-V2",
      price: 29.99,
      image: "/glinetmt300.webp",
      stripeProductId: "prod_router_mt300_123", // Replace with real Stripe product ID
      features: ["Mini Travel Router", "OpenWrt Pre-installed", "300Mbps WiFi", "Portable Design"]
    },
    {
      id: "router-2",
      name: "GL.iNet GL-AXT1800",
      price: 89.99,
      image: "/glinetaxt.webp",
      stripeProductId: "prod_router_axt1800_456", // Replace with real Stripe product ID
      features: ["WiFi 6 Router", "1800Mbps Speed", "VPN Client & Server", "Gigabit Ports"]
    },
    {
      id: "router-3",
      name: "GL.iNet GL-MT1300",
      price: 69.99,
      image: "/mt1300.jpg",
      stripeProductId: "prod_router_mt1300_789", // Replace with real Stripe product ID
      features: ["Beryl Travel Router", "AC1300 WiFi", "VPN Ready", "Compact Design"]
    }
  ];

  const handleAddToCart = (item: any, category: 'headset' | 'router') => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category
    });
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
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
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Remote Work Equipment Store
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Professional headsets and reliable routers for your remote work setup
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Headsets Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <Headphones className="h-8 w-8 mr-3 text-purple-600" />
            Professional Headsets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {headsets.map((headset, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img src={headset.image} alt={headset.name} className="w-full h-58 object-cover rounded-lg mb-4" />
                  <CardTitle className="text-lg">{headset.name}</CardTitle>
                  <div className="text-2xl font-bold text-green-600">${headset.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {headset.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToCart(headset, 'headset')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Routers Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <Router className="h-8 w-8 mr-3 text-blue-600" />
            GL.iNet Routers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {routers.map((router, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img src={router.image} alt={router.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <CardTitle className="text-lg">{router.name}</CardTitle>
                  <div className="text-2xl font-bold text-green-600">${router.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {router.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handleAddToCart(router, 'router')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Contact us for personalized recommendations for your remote work setup
          </p>
          <Button size="lg" variant="outline">
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
