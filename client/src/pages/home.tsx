import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import LocationSearch from "@/components/location-search";
import FarmerCard from "@/components/farmer-card";
import { Sprout, MapPin, ShoppingCart, TrendingUp } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ["/api/ml/recommendations"],
    enabled: isAuthenticated,
  });

  const { data: nearbyFarmers, isLoading: loadingFarmers } = useQuery({
    queryKey: ["/api/farmers/search"],
    enabled: isAuthenticated,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="h-12 w-12 text-rwanda-green mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Welcome Section */}
      <section className="py-12 bg-gradient-to-r from-rwanda-green to-rwanda-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Murakaza neza, {user?.firstName || 'User'}!
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Shakisha abahinzi bakwiye kandi ugure ibicuruzwa byiza ku biciro byiza
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Shakisha Abahinzi</h3>
                  <p className="text-sm text-emerald-100">Bari hafi yawe</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Gupima Ibiciro</h3>
                  <p className="text-sm text-emerald-100">Gukoresha AI</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Gura vuba</h3>
                  <p className="text-sm text-emerald-100">Byashyizweho nyuma</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shakisha Abahinzi bari hafi yawe
            </h2>
            <p className="text-xl text-gray-600">
              Gukoresha AI kugira ngo ubone abahinzi bakwiye
            </p>
          </div>
          <LocationSearch />
        </div>
      </section>

      {/* AI Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ibitekerezo bya AI kuri wewe
              </h2>
              <p className="text-xl text-gray-600">
                Hateguwe ku gukoresha amakuru yawe kandi uko ukora
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.slice(0, 3).map((rec: any) => (
                <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{rec.product.name}</h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {Math.round(parseFloat(rec.similarityScore) * 100)}% match
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{rec.product.farmer.user.firstName} - {rec.product.farmer.farmName}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-rwanda-green">
                        {parseFloat(rec.product.pricePerUnit).toLocaleString()} RWF
                      </span>
                      <Button size="sm" className="bg-rwanda-green hover:bg-emerald-700">
                        Reba
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Farmers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Abahinzi bari hafi yawe
              </h2>
              <p className="text-xl text-gray-600">
                Shakisha ibicuruzwa byiza biri hafi yawe
              </p>
            </div>
          </div>

          {loadingFarmers ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : nearbyFarmers && nearbyFarmers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nearbyFarmers.slice(0, 6).map((farmer: any) => (
                <FarmerCard key={farmer.id} farmer={farmer} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nta bahinzi babonetse
                </h3>
                <p className="text-gray-600 mb-6">
                  Gerageza gushakisha mu ntara cyangwa akarere katandukanye
                </p>
                <Button className="bg-rwanda-green hover:bg-emerald-700">
                  Shakisha
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ibyiza bishobora
            </h2>
            <p className="text-xl text-gray-600">
              Koresha ibiranguzo vuba kugira ngo ugere ku kintu ushaka
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-rwanda-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Inkoko</h3>
                <p className="text-gray-600 text-sm">Shakisha inkoko nziza</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-rwanda-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Amagi</h3>
                <p className="text-gray-600 text-sm">Amagi mashya buri munsi</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-rwanda-amber rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ifumbire</h3>
                <p className="text-gray-600 text-sm">Ifumbire y'ibinyabuzima</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Hafi yawe</h3>
                <p className="text-gray-600 text-sm">Abahinzi b'aha karyonje</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
