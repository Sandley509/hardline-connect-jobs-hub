
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
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Professional Font */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                Hardline Connect
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="text-muted-foreground hover:text-primary font-medium transition-colors">
                Services
              </Link>
              <Link to="/ip-pricing" className="text-muted-foreground hover:text-primary font-medium transition-colors">
                IP Pricing
              </Link>
              <Link to="/shop" className="text-muted-foreground hover:text-primary font-medium transition-colors">
                Shop
              </Link>
              <Link to="/blog" className="text-muted-foreground hover:text-primary font-medium transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary font-medium transition-colors">
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
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 font-medium transition-colors shadow-sm"
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
                className="text-muted-foreground hover:text-primary p-2 transition-colors"
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
            <div className="md:hidden bg-card border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  to="/services" 
                  className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Services
                </Link>
                <Link 
                  to="/ip-pricing" 
                  className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  IP Pricing
                </Link>
                <Link 
                  to="/shop" 
                  className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Shop
                </Link>
                <Link 
                  to="/blog" 
                  className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Blog
                </Link>
                <Link 
                  to="/contact" 
                  className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
                
                {/* Mobile Auth Section */}
                <div className="border-t border-border pt-4 mt-4">
                  {user ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
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
                        className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <LogOut className="h-5 w-5 inline mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        className="block mx-3 my-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 text-center transition-colors"
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
