import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { Package, MapPin, Phone, User, Calendar, CreditCard } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function OrderDetails() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading: loadingOrder } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: isAuthenticated && !!orderId,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Gutegereza';
      case 'confirmed':
        return 'Byemejwe';
      case 'delivered':
        return 'Byatanzwe';
      case 'cancelled':
        return 'Byahagaritswe';
      default:
        return status;
    }
  };

  if (isLoading || loadingOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-600">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
                <p className="text-gray-600 mt-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString('en-RW')}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Farmer Information</h4>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {order.farmer?.user?.firstName} {order.farmer?.user?.lastName}
                  </p>
                  {order.farmer?.farmName && (
                    <p className="text-gray-600">{order.farmer.farmName}</p>
                  )}
                  {order.farmer?.phone && (
                    <p className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.farmer.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
                <div className="space-y-2">
                  {order.deliveryAddress && (
                    <p className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {order.deliveryAddress}
                    </p>
                  )}
                  {order.deliveryPhone && (
                    <p className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.deliveryPhone}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-gray-600">
                      <strong>Notes:</strong> {order.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product?.name}</h4>
                      <p className="text-gray-600">
                        {item.quantity} {item.product?.unit} × {parseFloat(item.unitPrice).toLocaleString()} RWF
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-rwanda-green">
                        {parseFloat(item.totalPrice).toLocaleString()} RWF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No items found for this order.</p>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-xl font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-rwanda-green flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                {parseFloat(order.totalAmount).toLocaleString()} RWF
              </span>
            </div>
            
            <div className="mt-6 flex gap-4">
              {order.status === 'pending' && (
                <Button variant="destructive">
                  Cancel Order
                </Button>
              )}
              <Button variant="outline" className="flex-1">
                Contact Farmer
              </Button>
              <Button className="bg-rwanda-green hover:bg-emerald-700">
                Reorder Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}