import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient } from "@/lib/queryClient";

export default function CustomerDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Fetch user's orders
  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && user?.userType === 'customer',
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ["/api/ml/recommendations"],
    enabled: isAuthenticated && user?.userType === 'customer',
  });

  // Fetch available products
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["/api/products"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Session Expired",
        description: "Please sign in to access your dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/customer/login";
      }, 500);
      return;
    }

    if (!isLoading && isAuthenticated && user?.userType !== 'customer') {
      toast({
        title: "Access Denied",
        description: "Customer access required for this page.",
        variant: "destructive",
      });
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Customer Access Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in as a customer to access this dashboard.
              </p>
              <Button onClick={() => window.location.href = "/customer/login"}>
                Sign In as Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Muraho, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Welcome to your AgriConnect Rwanda customer dashboard
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-rwanda-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders?.filter((o: any) => ['pending', 'confirmed'].includes(o.status))?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders?.filter((o: any) => o.status === 'delivered')?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recommendations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recommendations?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg" />
                    ))}
                  </div>
                ) : orders?.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Farmer: {order.farmer?.user?.firstName} {order.farmer?.user?.lastName}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              {Number(order.totalAmount).toLocaleString()} RWF
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          {order.deliveryAddress && (
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {order.deliveryAddress.slice(0, 30)}...
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start exploring products to place your first order</p>
                    <Button onClick={() => window.location.href = "/"}>
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRecommendations ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
                    ))}
                  </div>
                ) : recommendations?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec: any) => (
                      <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                            {rec.product?.imageUrl ? (
                              <img 
                                src={rec.product.imageUrl} 
                                alt={rec.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {rec.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {rec.product?.farmer?.farmName}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-rwanda-green">
                              {Number(rec.product?.pricePerUnit).toLocaleString()} RWF
                            </span>
                            <Badge variant="secondary">
                              {Math.round(Number(rec.similarityScore) * 100)}% match
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600">Browse products to get personalized recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Browse Products Tab */}
          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Available Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingProducts ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
                    ))}
                  </div>
                ) : products?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                      <Card key={product.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by {product.farmer?.user?.firstName} {product.farmer?.user?.lastName}
                          </p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-rwanda-green">
                              {Number(product.pricePerUnit).toLocaleString()} RWF
                            </span>
                            <span className="text-sm text-gray-600">
                              per {product.unit}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Available: {product.availableQuantity}</span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {Number(product.farmer?.rating).toFixed(1)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                    <p className="text-gray-600">Check back later for new products</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}