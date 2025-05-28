
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package, Wrench } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  image_url: string;
  created_at: string;
}

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    image_url: ''
  });

  // Fetch services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          created_by: user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      resetForm();
      toast({ title: "Service created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error creating service", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('products')
        .insert({
          ...productData,
          created_by: user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
      toast({ title: "Product created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error creating product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Update mutations
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      resetForm();
      toast({ title: "Service updated successfully" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
      toast({ title: "Product updated successfully" });
    }
  });

  // Delete mutations
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: "Service deleted successfully" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Product deleted successfully" });
    }
  });

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

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('services')}
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
            onClick={() => setActiveTab('products')}
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

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'services' ? 'Service' : 'Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                {activeTab === 'products' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <Input
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Services/Products List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {activeTab === 'services' ? 'Services' : 'Products'} List
          </h3>
          
          {(activeTab === 'services' ? servicesLoading : productsLoading) ? (
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
                  {(activeTab === 'services' ? services : products)?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-gray-600">{item.category || '-'}</td>
                      <td className="py-3 px-4 text-gray-900">${item.price.toFixed(2)}</td>
                      {activeTab === 'products' && (
                        <td className="py-3 px-4 text-gray-900">
                          {'stock_quantity' in item ? item.stock_quantity : 0}
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
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {(activeTab === 'services' ? services?.length === 0 : products?.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No {activeTab} found. Create your first {activeTab.slice(0, -1)} to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
