
import { Package, Wrench } from "lucide-react";
import { ActiveTab } from "@/types/adminServices";

interface ServiceProductTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const ServiceProductTabs = ({ activeTab, onTabChange }: ServiceProductTabsProps) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      <button
        onClick={() => onTabChange('services')}
        className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
          activeTab === 'services' 
            ? 'bg-white text-orange-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Wrench className="h-4 w-4" />
        <span>Services</span>
      </button>
      <button
        onClick={() => onTabChange('products')}
        className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
          activeTab === 'products' 
            ? 'bg-white text-orange-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Package className="h-4 w-4" />
        <span>Products</span>
      </button>
    </div>
  );
};

export default ServiceProductTabs;
