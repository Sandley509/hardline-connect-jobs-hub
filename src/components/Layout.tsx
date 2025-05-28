
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartIcon from './CartIcon';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-orange-600">
                Hardline Connect
              </Link>
              <div className="hidden md:flex space-x-6">
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
            </div>
            
            <div className="flex items-center space-x-4">
              <CartIcon />
              
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
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;
