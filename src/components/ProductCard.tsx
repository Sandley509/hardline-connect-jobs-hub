
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  features: string[];
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </CardTitle>
          <div className="flex items-center justify-between mb-3">
            <div className="text-3xl font-bold text-green-600">
              ${product.price}
            </div>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-xs text-gray-600">(4.8)</span>
            </div>
          </div>
          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-3 mb-6">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-105" 
          onClick={onAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
