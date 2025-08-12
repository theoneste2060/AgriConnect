import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/header";
import { Sprout, Plus, Package, TrendingUp, Users, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isUnauthorizedError } from "@/lib/authUtils";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  nameKinyarwanda: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.string().min(1, "Price is required"),
  availableQuantity: z.number().min(0),
  minOrderQuantity: z.number().min(1),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function FarmerDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const { data: farmer, isLoading: loadingFarmer } = useQuery({
    queryKey: ["/api/farmers/me"],
    enabled: isAuthenticated,
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["/api/products/farmer", farmer?.id],
    enabled: !!farmer?.id,
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["/api/orders/farmer"],
    enabled: isAuthenticated,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/products/categories"],
  });

  const { data: demandPredictions } = useQuery({
    queryKey: ["/api/ml/demand-predictions"],
    enabled: isAuthenticated,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      nameKinyarwanda: "",
      description: "",
      categoryId: "",
      unit: "kg",
      pricePerUnit: "",
      availableQuantity: 0,
      minOrderQuantity: 1,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest("POST", "/api/products", {
        ...data,
        pricePerUnit: parseFloat(data.pricePerUnit),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      setIsProductDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer"] });
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
        description: "Failed to create product. Please try again.",
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

  if (isLoading || loadingFarmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Sprout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create Your Farmer Profile
              </h2>
              <p className="text-gray-600 mb-8">
                Set up your farm profile to start selling your products on AgriConnect Rwanda
              </p>
              <Button className="bg-rwanda-green hover:bg-emerald-700">
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount), 0) || 0;
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard y'umuhinzi
              </h1>
              <p className="text-gray-600 mt-1">
                Murakaza neza, {user?.firstName}! Igenzura ibicuruzwa byawe n'amategeko
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{farmer.rating || "0.0"}</span>
                <span className="text-gray-500 ml-1">({farmer.totalRatings || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalRevenue.toLocaleString()} RWF
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {products?.length || 0}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {farmer.rating || "0.0"}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ibicuruzwa byawe</CardTitle>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-rwanda-green hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Ongeraho Icyurutwa
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Ongeraho Icyurutwa Gishya</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Fresh Chicken" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="nameKinyarwanda"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Izina mu Kinyarwanda</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Inkoko Nshya" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories?.map((cat: any) => (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="unit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unit</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="kg">kg</SelectItem>
                                      <SelectItem value="piece">piece</SelectItem>
                                      <SelectItem value="tray">tray (30 eggs)</SelectItem>
                                      <SelectItem value="bag">bag</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="pricePerUnit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (RWF)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="4500" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Describe your product..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="availableQuantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Available Quantity</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="minOrderQuantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Min Order Qty</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex space-x-4">
                            <Button type="submit" className="flex-1 bg-rwanda-green hover:bg-emerald-700">
                              {createProductMutation.isPending ? "Creating..." : "Create Product"}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsProductDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingProducts ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product: any) => (
                      <div key={product.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            {product.nameKinyarwanda && (
                              <p className="text-sm text-gray-600">{product.nameKinyarwanda}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              {product.availableQuantity} {product.unit} available
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-rwanda-green">
                              {parseFloat(product.pricePerUnit).toLocaleString()} RWF
                            </p>
                            <p className="text-sm text-gray-500">per {product.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Ntabicuruzwa byawe. Tangira wongeraho icyurutwa cyawe cya mbere!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            {/* Demand Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Demand Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                {demandPredictions && demandPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {demandPredictions.slice(0, 3).map((prediction: any) => (
                      <div key={prediction.id} className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            Expected Demand
                          </span>
                          <span className="text-sm text-green-600">
                            {Math.round(parseFloat(prediction.confidenceScore) * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {parseFloat(prediction.predictedDemand).toLocaleString()} RWF
                        </p>
                        <p className="text-sm text-gray-600">Next 7 days</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    AI predictions will appear here once you have more data.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-3 border rounded">
                        <div className="h-3 bg-gray-200 rounded mb-1" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customer.firstName} {order.customer.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {parseFloat(order.totalAmount).toLocaleString()} RWF
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    No orders yet. Orders will appear here when customers place them.
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
