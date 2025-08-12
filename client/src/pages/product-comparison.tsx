import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { 
  TrendingUp, 
  MapPin, 
  Star, 
  Lightbulb, 
  ArrowUpDown,
  Filter
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ProductComparison() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  const { data: provinces } = useQuery({
    queryKey: ["/api/locations/provinces"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/products/categories"],
  });

  const { data: comparisonData, isLoading: loadingComparison } = useQuery({
    queryKey: ["/api/products/price-comparison", categoryId, selectedProvince],
    enabled: !!categoryId,
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

  const getCategoryName = (id: string) => {
    const category = categories?.find((cat: any) => cat.id === id);
    return category?.nameKinyarwanda || category?.name || 'Product';
  };

  const getBadgeColor = (recommendation: string) => {
    switch (recommendation) {
      case 'best_value':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'good_deal':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'premium':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIndicatorColor = (recommendation: string) => {
    switch (recommendation) {
      case 'best_value':
        return 'bg-green-500';
      case 'good_deal':
        return 'bg-blue-500';
      case 'premium':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance < 0) return 'text-green-600';
    if (variance > 5) return 'text-red-600';
    return 'text-gray-500';
  };

  const sortedProducts = comparisonData?.products ? [...comparisonData.products].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(a.product.pricePerUnit) - parseFloat(b.product.pricePerUnit);
      case 'rating':
        return parseFloat(b.farmer.rating || '0') - parseFloat(a.farmer.rating || '0');
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      default:
        return 0;
    }
  }) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gupima Ibiciro - {getCategoryName(categoryId || '')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered price comparison ikoresha TF-IDF vectorization na cosine similarity
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Intara
                </label>
                <Select onValueChange={setSelectedProvince} value={selectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Byose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Byose</SelectItem>
                    {provinces?.map((province: any) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.nameKinyarwanda || province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ArrowUpDown className="inline h-4 w-4 mr-1" />
                  Gutondeka
                </label>
                <Select onValueChange={setSortBy} value={sortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Igiciro</SelectItem>
                    <SelectItem value="rating">Amanota</SelectItem>
                    <SelectItem value="distance">Intera</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-end">
                {comparisonData?.analysis && (
                  <div className="bg-rwanda-green/10 p-4 rounded-lg w-full">
                    <p className="text-sm text-rwanda-green font-medium">
                      AI Analysis: {comparisonData.analysis.totalOptions} options found
                    </p>
                    <p className="text-xs text-gray-600">
                      Average price: {comparisonData.analysis.averagePrice} RWF
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Comparison Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Ibyuya by'igupima (AI Analysis)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingComparison ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-gray-200 rounded-full" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                          </div>
                          <div className="w-20 h-6 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sortedProducts.length > 0 ? (
                  <div className="space-y-4">
                    {sortedProducts.map((item: any, index: number) => (
                      <div 
                        key={item.product.id} 
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getBadgeColor(item.recommendation)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${getIndicatorColor(item.recommendation)}`} />
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {item.farmer.user.firstName} {item.farmer.user.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {item.farmer.farmName || 'Farm'} • 
                                {item.distance && ` ${item.distance.toFixed(1)}km •`}
                                <span className="ml-1 inline-flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                  {parseFloat(item.farmer.rating || '0').toFixed(1)}
                                </span>
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-white">
                                  {item.recommendation === 'best_value' && '🏆 Ibiciro byiza cyane'}
                                  {item.recommendation === 'good_deal' && '💚 Icyemezo cyiza'}
                                  {item.recommendation === 'premium' && '⭐ Ubunyangamugayo bukomeye'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-rwanda-green">
                              {parseFloat(item.product.pricePerUnit).toLocaleString()} RWF
                            </p>
                            <p className={`text-sm ${getVarianceColor(parseFloat(item.priceVariance))}`}>
                              {parseFloat(item.priceVariance) > 0 ? '+' : ''}{item.priceVariance}%
                              {parseFloat(item.priceVariance) === 0 ? ' rusange' : 
                               parseFloat(item.priceVariance) < 0 ? ' hasi' : ' hejuru'}
                            </p>
                            <p className="text-xs text-gray-500">
                              AI Score: {Math.round(parseFloat(item.similarityScore) * 100)}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <p>{item.product.description}</p>
                            <p>Available: {item.product.availableQuantity} {item.product.unit}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4 mr-1" />
                              Location
                            </Button>
                            <Button size="sm" className="bg-rwanda-green hover:bg-emerald-700">
                              Gura
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comparisonData?.analysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Smart Recommendation
                      </h4>
                      <p className="text-blue-800 text-sm">
                        {comparisonData.analysis.aiRecommendation}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Best Value:</span>
                        <span className="font-medium">{comparisonData.analysis.bestValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Options Found:</span>
                        <span className="font-medium">{comparisonData.analysis.totalOptions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Price:</span>
                        <span className="font-medium">{comparisonData.analysis.averagePrice} RWF</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      AI analysis will appear here once data is loaded.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ML Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ML Algorithms Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">TF-IDF Vectorization</h4>
                    <p className="text-xs text-green-700">
                      Analyzes product descriptions and features for similarity matching
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Cosine Similarity</h4>
                    <p className="text-xs text-blue-700">
                      Calculates similarity scores between products and farmers
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Location Analysis</h4>
                    <p className="text-xs text-purple-700">
                      Factors in distance and regional pricing patterns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Price Trends
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Map View
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Save Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
