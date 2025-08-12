import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export default function LocationSearch() {
  const [, setLocation] = useLocation();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: provinces } = useQuery({
    queryKey: ["/api/locations/provinces"],
  });

  const { data: districts } = useQuery({
    queryKey: ["/api/locations/districts", selectedProvince],
    enabled: !!selectedProvince,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/products/categories"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedProvince) params.append("provinceId", selectedProvince);
    if (selectedDistrict) params.append("districtId", selectedDistrict);
    if (selectedCategory) params.append("productCategory", selectedCategory);
    
    // Navigate to home page with filters or search results
    setLocation(`/?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-50 shadow-lg">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Province Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intara
              </label>
              <Select onValueChange={setSelectedProvince} value={selectedProvince}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hitamo Intara" />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.map((province: any) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.nameKinyarwanda || province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* District Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Akarere
              </label>
              <Select 
                onValueChange={setSelectedDistrict} 
                value={selectedDistrict}
                disabled={!selectedProvince}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hitamo Akarere" />
                </SelectTrigger>
                <SelectContent>
                  {districts?.map((district: any) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.nameKinyarwanda || district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Product Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ibicuruzwa
              </label>
              <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Byose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Byose</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameKinyarwanda || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full mt-6 bg-rwanda-green text-white py-4 font-semibold text-lg hover:bg-emerald-700"
          >
            <Search className="mr-2 h-5 w-5" />
            Shakisha Abahinzi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
