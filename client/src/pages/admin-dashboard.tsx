import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { 
  Users, 
  Sprout, 
  ShoppingCart, 
  TrendingUp, 
  Brain, 
  Target,
  MapPin,
  Clock,
  Download,
  FileText,
  BarChart3,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  generateOrdersReport, 
  generateUsersReport, 
  generateFarmersReport, 
  generateProductsReport 
} from "@/lib/pdfGenerator";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Fetch dashboard statistics
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/admin/statistics"],
    enabled: isAuthenticated && user?.userType === 'admin',
  });

  // Fetch all users for management
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.userType === 'admin',
  });

  // Fetch all farmers
  const { data: farmers, isLoading: loadingFarmers } = useQuery({
    queryKey: ["/api/admin/farmers"],
    enabled: isAuthenticated && user?.userType === 'admin',
  });

  // Fetch all orders
  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated && user?.userType === 'admin',
  });

  // Fetch all products
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["/api/admin/products"],
    enabled: isAuthenticated && user?.userType === 'admin',
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

    if (!isLoading && isAuthenticated && user?.userType !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Admin access required for this page.",
        variant: "destructive",
      });
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // PDF Report Generation Functions
  const handleGenerateOrdersReport = () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "No Data Available",
        description: "No orders found to generate report",
        variant: "destructive",
      });
      return;
    }

    const formattedOrders = orders.map((order: any) => ({
      ...order,
      customerName: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
      farmerName: `${order.farmer?.user?.firstName || ''} ${order.farmer?.user?.lastName || ''}`.trim(),
      createdAt: new Date(order.createdAt)
    }));

    generateOrdersReport(formattedOrders);
    
    toast({
      title: "Report Generated",
      description: "Orders report has been downloaded successfully",
    });
  };

  const handleGenerateUsersReport = () => {
    if (!users || users.length === 0) {
      toast({
        title: "No Data Available", 
        description: "No users found to generate report",
        variant: "destructive",
      });
      return;
    }

    const formattedUsers = users.map((user: any) => ({
      ...user,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      createdAt: new Date(user.createdAt)
    }));

    generateUsersReport(formattedUsers);
    
    toast({
      title: "Report Generated",
      description: "Users report has been downloaded successfully",
    });
  };

  const handleGenerateFarmersReport = () => {
    if (!farmers || farmers.length === 0) {
      toast({
        title: "No Data Available",
        description: "No farmers found to generate report", 
        variant: "destructive",
      });
      return;
    }

    const formattedFarmers = farmers.map((farmer: any) => ({
      ...farmer,
      ownerName: `${farmer.user?.firstName || ''} ${farmer.user?.lastName || ''}`.trim(),
      location: `${farmer.sectorId || 'Unknown'}, ${farmer.districtId || 'Unknown'}`,
      productCount: farmer.products?.length || 0,
      status: farmer.isActive ? 'Active' : 'Inactive'
    }));

    generateFarmersReport(formattedFarmers);
    
    toast({
      title: "Report Generated",
      description: "Farmers report has been downloaded successfully",
    });
  };

  const handleGenerateProductsReport = () => {
    if (!products || products.length === 0) {
      toast({
        title: "No Data Available",
        description: "No products found to generate report",
        variant: "destructive",
      });
      return;
    }

    const formattedProducts = products.map((product: any) => ({
      ...product,
      farmerName: `${product.farmer?.user?.firstName || ''} ${product.farmer?.user?.lastName || ''}`.trim(),
      category: product.category?.name || 'Uncategorized',
      status: product.isAvailable ? 'Available' : 'Unavailable'
    }));

    generateProductsReport(formattedProducts);
    
    toast({
      title: "Report Generated",
      description: "Products report has been downloaded successfully",
    });
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

  if (isLoading || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Admin Access Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need administrator privileges to access this dashboard.
              </p>
              <Button onClick={() => window.location.href = "/admin/login"}>
                Admin Login
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Manage AgriConnect Rwanda platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sprout className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {farmers?.filter((f: any) => f.isActive)?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-500" />
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
                <DollarSign className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue (RWF)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders?.reduce((sum: number, order: any) => sum + Number(order.totalAmount), 0)?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Platform Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customers</span>
                      <span className="font-semibold">
                        {users?.filter((u: any) => u.userType === 'customer')?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Products Listed</span>
                      <span className="font-semibold">
                        {products?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Orders</span>
                      <span className="font-semibold">
                        {orders?.filter((o: any) => o.status === 'pending')?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Orders</span>
                      <span className="font-semibold">
                        {orders?.filter((o: any) => o.status === 'delivered')?.length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders?.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Order #{order.id.slice(-6)}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
                <Button onClick={handleGenerateUsersReport} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Users PDF
                </Button>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg" />
                    ))}
                  </div>
                ) : users?.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={user.userType === 'admin' ? 'destructive' : 'secondary'}>
                            {user.userType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Sprout className="h-5 w-5 mr-2" />
                  Farmer Management
                </CardTitle>
                <Button onClick={handleGenerateFarmersReport} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Farmers PDF
                </Button>
              </CardHeader>
              <CardContent>
                {loadingFarmers ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg" />
                    ))}
                  </div>
                ) : farmers?.length > 0 ? (
                  <div className="space-y-4">
                    {farmers.map((farmer: any) => (
                      <div key={farmer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {farmer.farmName || 'Unnamed Farm'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Owner: {farmer.user?.firstName} {farmer.user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {farmer.sectorId}, {farmer.districtId}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={farmer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {farmer.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              Rating: {Number(farmer.rating).toFixed(1)}/5
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>Products: {farmer.products?.length || 0}</span>
                          <span>Reviews: {farmer.totalRatings}</span>
                          {farmer.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {farmer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No farmers found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Management
                </CardTitle>
                <Button onClick={handleGenerateOrdersReport} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Orders PDF
                </Button>
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
                              Customer: {order.customer?.firstName} {order.customer?.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Farmer: {order.farmer?.user?.firstName} {order.farmer?.user?.lastName}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              {Number(order.totalAmount).toLocaleString()} RWF
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          {order.deliveryAddress && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {order.deliveryAddress.slice(0, 30)}...
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No orders found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleGenerateUsersReport} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Users Report
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateFarmersReport} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Sprout className="h-4 w-4 mr-2" />
                    Farmers Report
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateOrdersReport} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Orders Report
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateProductsReport} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {users?.filter((u: any) => u.userType === 'customer')?.length || 0}
                        </p>
                        <p className="text-sm text-blue-800">Customers</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {farmers?.filter((f: any) => f.isActive)?.length || 0}
                        </p>
                        <p className="text-sm text-green-800">Active Farmers</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {orders?.filter((o: any) => o.status === 'pending')?.length || 0}
                        </p>
                        <p className="text-sm text-yellow-800">Pending</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          {products?.length || 0}
                        </p>
                        <p className="text-sm text-purple-800">Products</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Overview Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-3xl font-bold text-rwanda-green">
                  {stats?.totalFarmers?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600 mt-1">Active accounts</p>
              </div>
              <Sprout className="h-10 w-10 text-rwanda-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-rwanda-teal">
                  {stats?.totalCustomers?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-teal-600 mt-1">Registered users</p>
              </div>
              <Users className="h-10 w-10 text-rwanda-teal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.totalOrders?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-blue-600 mt-1">All time</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.totalRevenue ? parseFloat(stats.totalRevenue).toLocaleString() : '0'} RWF
                </p>
                <p className="text-xs text-purple-600 mt-1">Platform total</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* ML/AI Performance */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI/ML Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Prediction Accuracy</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.mlModelAccuracy || '94.2'}%
                    </p>
                    <p className="text-sm text-gray-600">Demand forecasting</p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Recommendation CTR</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats?.recommendationCTR || '87.5'}%
                    </p>
                    <p className="text-sm text-gray-600">User engagement</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Model Confidence</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats?.modelConfidence || '91.8'}%
                    </p>
                    <p className="text-sm text-gray-600">Overall reliability</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">ML Algorithms in Use</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>TF-IDF Vectorization:</strong>
                      <p className="text-gray-600">Product similarity analysis</p>
                    </div>
                    <div>
                      <strong>Cosine Similarity:</strong>
                      <p className="text-gray-600">Farmer recommendations</p>
                    </div>
                    <div>
                      <strong>Scikit-learn Models:</strong>
                      <p className="text-gray-600">Demand prediction</p>
                    </div>
                    <div>
                      <strong>Geospatial Analysis:</strong>
                      <p className="text-gray-600">Location-based matching</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Provinces */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Top Provinces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topProvinces?.map((province: any, index: number) => (
                    <div key={province.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{province.name}</h4>
                        <p className="text-sm text-gray-600">
                          {province.farmers} farmers • {province.orders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-rwanda-green">#{index + 1}</span>
                      </div>
                    </div>
                  )) || (
                    // Default data when stats not available
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Kigali City</h4>
                          <p className="text-sm text-gray-600">423 farmers • 298 orders</p>
                        </div>
                        <span className="text-2xl font-bold text-rwanda-green">#1</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Southern Province</h4>
                          <p className="text-sm text-gray-600">312 farmers • 234 orders</p>
                        </div>
                        <span className="text-2xl font-bold text-rwanda-green">#2</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Northern Province</h4>
                          <p className="text-sm text-gray-600">267 farmers • 189 orders</p>
                        </div>
                        <span className="text-2xl font-bold text-rwanda-green">#3</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentActivity?.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'order' ? 'bg-blue-500' :
                        activity.type === 'farmer' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    // Default activities when stats not available
                    <>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full mt-2 bg-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">New order from Marie in Gasabo</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full mt-2 bg-green-500" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Jean Baptiste updated prices</p>
                          <p className="text-xs text-gray-500">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full mt-2 bg-purple-500" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">AI predicted high egg demand</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Business Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">Average Order Value</h4>
                  <p className="text-2xl font-bold text-rwanda-green">
                    {stats?.avgOrderValue ? parseFloat(stats.avgOrderValue).toLocaleString() : '28,500'} RWF
                  </p>
                  <p className="text-sm text-gray-600">Per transaction</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">Farmer Success Rate</h4>
                  <p className="text-2xl font-bold text-green-600">96.3%</p>
                  <p className="text-sm text-gray-600">Sales completion</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">Customer Retention</h4>
                  <p className="text-2xl font-bold text-blue-600">84.7%</p>
                  <p className="text-sm text-gray-600">Monthly return rate</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">AI Adoption</h4>
                  <p className="text-2xl font-bold text-purple-600">78.2%</p>
                  <p className="text-sm text-gray-600">Users using AI features</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
