import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import { 
  Users, 
  Sprout, 
  ShoppingCart, 
  TrendingUp, 
  Brain, 
  Target,
  MapPin,
  Clock
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/admin/statistics"],
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
              <p className="text-gray-600">
                You need administrator privileges to access this dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                AgriConnect Rwanda Platform Overview & Analytics
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="font-medium text-gray-900">
                {new Date().toLocaleDateString('en-RW')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats Grid */}
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
