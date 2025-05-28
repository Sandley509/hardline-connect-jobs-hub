
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartIcon from "@/components/CartIcon";
import CartModal from "@/components/CartModal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Headphones, Router } from "lucide-react";

const Shop = () => {
  const [showCart, setShowCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const headsets = [
    {
      id: "headset-1",
      name: "Logitech USB Headset",
      price: 89.99,
      image: "/logitech.webp",
      stripeProductId: "prod_headset_pro_123",
      features: ["Noise Cancellation", "USB Connection", "Comfortable Padding", "Adjustable Microphone"],
      description: "Professional-grade headset perfect for remote work and video calls."
    },
    {
      id: "headset-2",
      name: "Jabra USB Headset",
      price: 129.99,
      image: "/jabra.jpg",
      stripeProductId: "prod_headset_elite_456",
      features: ["Superior Audio Quality", "All-Day Comfort", "Quick Disconnect", "Warranty Included"],
      description: "Premium headset with crystal-clear audio for professional communication."
    },
    {
      id: "headset-3",
      name: "Spark 06",
      price: 59.99,
      image: "/spark06.jpg",
      stripeProductId: "prod_headset_essential_789",
      features: ["Crystal Clear Audio", "Lightweight Design","Noise cancellation", "Plug & Play", "Compatible with All Devices"],
      description: "Budget-friendly option that doesn't compromise on quality."
    }
  ];

  const routers = [
    {
      id: "router-1",
      name: "GL.iNet GL-MT300N-V2",
      price: 47.99,
      image: "/glinetmt300.webp",
      stripeProductId: "prod_router_mt300_123",
      features: ["Mini Travel Router", "OpenWrt Pre-installed", "300Mbps WiFi", "Portable Design"],
      description: "Compact travel router perfect for secure connections on the go."
    },
    {
      id: "router-2",
      name: "GL.iNet GL-AXT1800",
      price: 149.99,
      image: "/glinetaxt.webp",
      stripeProductId: "prod_router_axt1800_456",
      features: ["WiFi 6 Router", "1800Mbps Speed", "VPN Client & Server", "Gigabit Ports"],
      description: "High-performance WiFi 6 router with advanced VPN capabilities."
    },
    {
      id: "router-3",
      name: "GL.iNet GL-MT1300",
      price: 139.99,
      image: "/mt1300.jpg",
      stripeProductId: "prod_router_mt1300_789",
      features: ["Beryl Travel Router", "AC1300 WiFi", "VPN Ready", "Compact Design"],
      description: "Reliable travel router with excellent VPN support and performance."
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
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-purple-600 to-blue-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Remote Work Equipment Store
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Professional headsets and reliable routers for your remote work setup
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Headsets Section */}
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Headphones className="h-6 w-6 md:h-8 md:w-8 mr-3 text-purple-600" />
              Professional Headsets
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Crystal-clear audio quality for your video calls and remote meetings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {headsets.map((headset) => (
              <ProductCard
                key={headset.id}
                product={headset}
                onAddToCart={() => handleAddToCart(headset, 'headset')}
              />
            ))}
          </div>
        </section>

        {/* Routers Section */}
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Router className="h-6 w-6 md:h-8 md:w-8 mr-3 text-teal-600" />
              GL.iNet Routers
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Secure, reliable networking solutions for remote work and travel
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {routers.map((router) => (
              <ProductCard
                key={router.id}
                product={router}
                onAddToCart={() => handleAddToCart(router, 'router')}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-gray-50 to-teal-50 rounded-2xl p-8 md:p-12 shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Need Help Choosing?
          </h3>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our experts are here to help you find the perfect equipment for your remote work setup. 
            Get personalized recommendations based on your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/contact')}
              className="px-6 md:px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-base md:text-lg"
            >
              Contact Support
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="px-6 md:px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-colors font-medium text-base md:text-lg"
            >
              View Services
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Shop;
