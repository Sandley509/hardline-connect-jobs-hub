
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartIcon from './CartIcon';
import CartModal from './CartModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Increased size */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl md:text-3xl font-bold text-orange-600">
                Hardline Connect
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="text-gray-700 hover:text-orange-600">
                Services
              </Link>
              <Link to="/ip-pricing" className="text-gray-700 hover:text-orange-600">
                IP Pricing
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-orange-600">
                Shop
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-orange-600">
                Blog
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600">
                Contact
              </Link>
            </div>
            
            {/* Desktop Auth & Cart */}
            <div className="hidden md:flex items-center space-x-4">
              <CartIcon onClick={() => setIsCartOpen(true)} />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center text-gray-700 hover:text-orange-600"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-gray-700 hover:text-orange-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-orange-600"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button and cart */}
            <div className="md:hidden flex items-center space-x-4">
              <CartIcon onClick={() => setIsCartOpen(true)} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-orange-600 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  to="/services" 
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={closeMobileMenu}
                >
                  Services
                </Link>
                <Link 
                  to="/ip-pricing" 
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={closeMobileMenu}
                >
                  IP Pricing
                </Link>
                <Link 
                  to="/shop" 
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={closeMobileMenu}
                >
                  Shop
                </Link>
                <Link 
                  to="/blog" 
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={closeMobileMenu}
                >
                  Blog
                </Link>
                <Link 
                  to="/contact" 
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
                
                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {user ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                        onClick={closeMobileMenu}
                      >
                        <User className="h-5 w-5 inline mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600"
                      >
                        <LogOut className="h-5 w-5 inline mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        className="block mx-3 my-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-center"
                        onClick={closeMobileMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <main>{children}</main>
      
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Layout;
