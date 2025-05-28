
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartModal from "@/components/CartModal";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/0d1120d5-eeac-4a96-b036-afdac05d35d1.png" 
                alt="Hardline Connect Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-orange-600 hidden sm:block">
                Hardline Connect
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-md hover:bg-orange-50">
                Home
              </Link>
              <Link to="/ip-pricing" className="text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-md hover:bg-orange-50">
                IP Servers
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-md hover:bg-orange-50">
                Shop
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-md hover:bg-orange-50">
                Services
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-md hover:bg-orange-50">
                Contact
              </Link>
              {!user && (
                <Link to="/admin" className="text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-md hover:bg-orange-50">
                  Admin
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative hover:bg-orange-50"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="hover:bg-orange-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="hover:bg-orange-50"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/signup')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden pb-4 border-t border-gray-200 mt-4">
              <div className="flex flex-col space-y-2 pt-4">
                {/* Mobile Cart */}
                <button 
                  onClick={() => {
                    setShowCart(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Cart
                  </span>
                  {totalItems > 0 && (
                    <span className="bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/ip-pricing" 
                  className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  IP Servers
                </Link>
                <Link 
                  to="/shop" 
                  className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link 
                  to="/services" 
                  className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Mobile User Actions */}
                {user ? (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors py-3 px-4 rounded-md hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md block text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-orange-600 transition-colors py-3 px-4 rounded-md hover:bg-orange-50 block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <img 
                src="/lovable-uploads/0d1120d5-eeac-4a96-b036-afdac05d35d1.png" 
                alt="Hardline Connect Logo" 
                className="h-8 w-auto"
              />
              <p className="text-lg font-semibold">Hardline Connect</p>
            </div>
            <p className="text-gray-300">Your gateway to remote opportunities</p>
            <p className="text-gray-300">Contact: (786) 858-5864</p>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400">
                Website developed by{" "}
                <a 
                  href="https://isedigitalsolutions.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  ISE Digital Solutions
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
