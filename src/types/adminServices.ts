
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
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

export interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock_quantity: string;
  image_url: string;
}

export type ActiveTab = 'services' | 'products';
