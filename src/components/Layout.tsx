
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Hardline Connect
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/ip-pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                IP Servers
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-blue-600 transition-colors">
                Shop
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/ip-pricing" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  IP Servers
                </Link>
                <Link 
                  to="/shop" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link 
                  to="/services" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
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
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Hardline Connect</p>
            <p className="text-gray-300">Your gateway to remote opportunities</p>
            <p className="mt-4">Contact: (786) 858-5864</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
