
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category
      };
      
      setProducts(prev => [...prev, product]);
      setNewProduct({ name: '', description: '', price: '', category: '' });
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Product Management
        </h3>
        <Button
          onClick={() => setIsAddingProduct(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isAddingProduct && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-md font-medium mb-3">Add New Product</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
            />
            <Input
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
            />
            <div className="md:col-span-2">
              <Textarea
                placeholder="Product description"
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
              Add Product
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm font-medium text-green-600">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No products added yet. Click "Add Product" to get started.</p>
        )}
      </div>
    </Card>
  );
};

export default ProductManager;
