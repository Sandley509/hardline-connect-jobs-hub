
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ActiveTab, Service, Product } from "@/types/adminServices";

interface ServiceProductTableProps {
  activeTab: ActiveTab;
  data: Service[] | Product[] | undefined;
  isLoading: boolean;
  onEdit: (item: Service | Product) => void;
  onDelete: (id: string) => void;
}

const ServiceProductTable = ({ 
  activeTab, 
  data, 
  isLoading, 
  onEdit, 
  onDelete 
}: ServiceProductTableProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {activeTab === 'services' ? 'Services' : 'Products'} List
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                {activeTab === 'products' && (
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                )}
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.category || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">${item.price.toFixed(2)}</td>
                  {activeTab === 'products' && (
                    <td className="py-3 px-4 text-gray-900">
                      {(item as Product).stock_quantity || 0}
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No {activeTab} found. Create your first {activeTab.slice(0, -1)} to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ServiceProductTable;
