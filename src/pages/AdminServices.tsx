
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminServices } from "@/hooks/useAdminServices";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import ServiceProductTabs from "@/components/admin/ServiceProductTabs";
import ServiceProductForm from "@/components/admin/ServiceProductForm";
import ServiceProductTable from "@/components/admin/ServiceProductTable";
import { ActiveTab, Service, Product, FormData } from "@/types/adminServices";

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    image_url: ''
  });

  // Services hooks
  const {
    services,
    servicesLoading,
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  } = useAdminServices();

  // Products hooks
  const {
    products,
    productsLoading,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation
  } = useAdminProducts();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock_quantity: '',
      image_url: ''
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      ...(activeTab === 'products' && {
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        image_url: formData.image_url
      })
    };

    if (editingItem) {
      if (activeTab === 'services') {
        updateServiceMutation.mutate({ id: editingItem.id, ...data });
      } else {
        updateProductMutation.mutate({ id: editingItem.id, ...data });
      }
    } else {
      if (activeTab === 'services') {
        createServiceMutation.mutate(data);
      } else {
        createProductMutation.mutate(data);
      }
    }
    resetForm();
  };

  const handleEdit = (item: Service | Product) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || '',
      stock_quantity: 'stock_quantity' in item ? item.stock_quantity.toString() : '',
      image_url: 'image_url' in item ? item.image_url || '' : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      if (activeTab === 'services') {
        deleteServiceMutation.mutate(id);
      } else {
        deleteProductMutation.mutate(id);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Services & Products Management</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === 'services' ? 'Service' : 'Product'}
          </Button>
        </div>

        <ServiceProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {showAddForm && (
          <ServiceProductForm
            activeTab={activeTab}
            formData={formData}
            setFormData={setFormData}
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        <ServiceProductTable
          activeTab={activeTab}
          data={activeTab === 'services' ? services : products}
          isLoading={activeTab === 'services' ? servicesLoading : productsLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
