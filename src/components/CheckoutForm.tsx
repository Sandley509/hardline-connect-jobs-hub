
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CheckoutFormProps {
  onBack: () => void;
}

const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order data
      const orderData = {
        items,
        total: getTotalPrice(),
        customer: formData,
        timestamp: new Date().toISOString()
      };

      // Here you would integrate with Stripe
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      toast({
        title: "Order Confirmed!",
        description: `Your order for $${getTotalPrice().toFixed(2)} has been processed successfully. You will receive a confirmation email shortly.`,
      });

      // Clear cart and redirect
      clearCart();
      console.log('Order processed:', orderData);
      
      // In a real implementation, you would redirect to a success page
      onBack();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Checkout Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={isProcessing}
              >
                Back to Cart
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutForm;
