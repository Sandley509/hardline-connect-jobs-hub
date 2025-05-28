
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
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/0d1120d5-eeac-4a96-b036-afdac05d35d1.png" 
                alt="Hardline Connect Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-teal-600 hidden sm:block">
                Hardline Connect
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-3 rounded-md hover:bg-teal-50">
                Home
              </Link>
              <Link to="/ip-pricing" className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-3 rounded-md hover:bg-teal-50">
                IP Servers
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-3 rounded-md hover:bg-teal-50">
                Shop
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-3 rounded-md hover:bg-teal-50">
                Services
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-3 rounded-md hover:bg-teal-50">
                Contact
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-3 rounded-md hover:bg-teal-50">
                Admin
              </Link>
            </nav>

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
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-md hover:bg-teal-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/ip-pricing" 
                  className="text-gray-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-md hover:bg-teal-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  IP Servers
                </Link>
                <Link 
                  to="/shop" 
                  className="text-gray-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-md hover:bg-teal-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link 
                  to="/services" 
                  className="text-gray-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-md hover:bg-teal-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-md hover:bg-teal-50 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-md hover:bg-teal-50 block"
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
                  className="text-teal-400 hover:text-teal-300 transition-colors"
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
