import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Star, 
  ShoppingCart, 
  Plus, 
  Minus,
  MessageCircle
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ProductDetails() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [notes, setNotes] = useState("");

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      setQuantity(1);
      setDeliveryAddress("");
      setDeliveryPhone("");
      setNotes("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (!deliveryAddress || !deliveryPhone) {
      toast({
        title: "Error",
        description: "Please provide delivery address and phone number.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = parseFloat(product.pricePerUnit) * quantity;
    
    orderMutation.mutate({
      farmerId: product.farmerId,
      totalAmount: totalAmount.toString(),
      deliveryAddress,
      deliveryPhone,
      notes,
      items: [{
        productId: product.id,
        quantity,
        unitPrice: parseFloat(product.pricePerUnit),
      }]
    });
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= product.minOrderQuantity && newQuantity <= product.availableQuantity) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading || loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Product not found
            </h3>
            <p className="text-gray-600">
              The product you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = parseFloat(product.pricePerUnit) * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image and Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="h-24 w-24 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    {product.nameKinyarwanda && (
                      <p className="text-lg text-gray-600">
                        {product.nameKinyarwanda}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-rwanda-green">
                      {parseFloat(product.pricePerUnit).toLocaleString()} RWF
                    </span>
                    <span className="text-gray-600">per {product.unit}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge variant={product.isAvailable ? "default" : "destructive"}>
                      {product.isAvailable ? "Available" : "Out of Stock"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {product.availableQuantity} {product.unit} available
                    </span>
                  </div>

                  {product.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{product.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Farmer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">
                      {product.farmer?.user?.firstName} {product.farmer?.user?.lastName}
                    </span>
                  </div>
                  
                  {product.farmer?.farmName && (
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{product.farmer.farmName}</span>
                    </div>
                  )}

                  {product.farmer?.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                      <span>{parseFloat(product.farmer.rating).toFixed(1)}</span>
                      <span className="text-gray-600 ml-1">
                        ({product.farmer.totalRatings} reviews)
                      </span>
                    </div>
                  )}

                  {product.farmer?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{product.farmer.phone}</span>
                    </div>
                  )}

                  <Button variant="outline" className="w-full mt-4">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Farmer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quantity Selection */}
                <div>
                  <Label>Quantity ({product.unit})</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= product.minOrderQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-16 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(1)}
                      disabled={quantity >= product.availableQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Min order: {product.minOrderQuantity} {product.unit}
                  </p>
                </div>

                {/* Delivery Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea
                      id="deliveryAddress"
                      placeholder="Enter your full delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryPhone">Phone Number</Label>
                    <Input
                      id="deliveryPhone"
                      placeholder="078XXXXXXX"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for delivery"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <span>{parseFloat(product.pricePerUnit).toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{quantity} {product.unit}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-rwanda-green">
                        {totalPrice.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!product.isAvailable || orderMutation.isPending}
                  className="w-full bg-rwanda-green hover:bg-emerald-700"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {orderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-gray-600 text-center">
                    <a href="/login" className="text-rwanda-green hover:underline">
                      Sign in
                    </a> to place an order
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}