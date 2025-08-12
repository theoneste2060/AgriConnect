import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Lightbulb } from "lucide-react";

export default function PriceComparison() {
  const [selectedCategory, setSelectedCategory] = useState("eggs");
  const [selectedProvince, setSelectedProvince] = useState("all");

  const { data: categories } = useQuery({
    queryKey: ["/api/products/categories"],
  });

  const { data: provinces } = useQuery({
    queryKey: ["/api/locations/provinces"],
  });

  const { data: comparisonData } = useQuery({
    queryKey: ["/api/products/price-comparison", selectedCategory],
    enabled: !!selectedCategory,
  });

  const getBadgeColor = (recommendation: string) => {
    switch (recommendation) {
      case 'best_value':
        return 'bg-green-50 border-green-200';
      case 'good_deal':
        return 'bg-blue-50 border-blue-200';
      case 'premium':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
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

  return (
    <Card className="shadow-lg overflow-hidden">
      <div className="bg-rwanda-green text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Ugereranije Ibiciro - AI Analysis
            </h3>
            <p className="text-emerald-100">
              Imiterere ya AI ikoresha cosine similarity algorithm
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-emerald-100" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-emerald-100 mb-2">Icyurutwa</label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nameKinyarwanda || category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm text-emerald-100 mb-2">Intara</label>
            <Select onValueChange={setSelectedProvince} value={selectedProvince}>
              <SelectTrigger className="bg-white text-gray-900">
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
        </div>
      </div>
      
      <CardContent className="p-6">
        {comparisonData?.products ? (
          <div className="space-y-4">
            {comparisonData.products.map((item: any, index: number) => (
              <div 
                key={item.product.id} 
                className={`flex items-center justify-between p-4 border rounded-lg ${getBadgeColor(item.recommendation)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getIndicatorColor(item.recommendation)}`} />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.farmer.user.firstName} {item.farmer.user.lastName} - {item.farmer.farmName || 'Farm'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.recommendation === 'best_value' && 'Ibiciro byiza cyane'} 
                      {item.recommendation === 'good_deal' && 'Icyongereza cyiza'}
                      {item.recommendation === 'premium' && 'Ubunyangamugayo bukomeye'}
                      {item.distance && ` • ${item.distance?.toFixed(1)}km`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-rwanda-green">
                    {parseFloat(item.product.pricePerUnit).toLocaleString()} RWF
                  </p>
                  <p className={`text-sm ${getVarianceColor(parseFloat(item.priceVariance))}`}>
                    {parseFloat(item.priceVariance) > 0 ? '+' : ''}{item.priceVariance}% 
                    {parseFloat(item.priceVariance) === 0 ? ' imiterere rusange' : 
                     parseFloat(item.priceVariance) < 0 ? ' ruta imiterere' : ' kuruta imiterere'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sample data for when no comparison data is available */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">Marie Claire - Kicukiro</p>
                  <p className="text-sm text-gray-600">Ibiciro byiza cyane • 3.7km</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-rwanda-green">2,800 RWF</p>
                <p className="text-sm text-green-600">-7% ruta imiterere</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">Jean Baptiste - Gasabo</p>
                  <p className="text-sm text-gray-600">Imiterere y'isoko • 2.3km</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-700">3,000 RWF</p>
                <p className="text-sm text-gray-500">Imiterere rusange</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">Emmanuel - Nyarugenge</p>
                  <p className="text-sm text-gray-600">Ubunyangamugayo bukomeye • 1.8km</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">3,200 RWF</p>
                <p className="text-sm text-red-600">+7% kuruta imiterere</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            Igitekerezo cya AI
          </h4>
          <p className="text-blue-800">
            {comparisonData?.analysis?.aiRecommendation || 
             "AI iragusaba gusanga umuhinzi utanga ibiciro byiza, ingaruka nziza, n'aho hari hafi yawe."}
          </p>
          {comparisonData?.analysis && (
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Average Price: </span>
                <span className="text-blue-700">{comparisonData.analysis.averagePrice} RWF</span>
              </div>
              <div>
                <span className="font-medium">Best Value: </span>
                <span className="text-blue-700">{comparisonData.analysis.bestValue}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
