import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

interface FarmerCardProps {
  farmer: {
    id: string;
    name?: string;
    user?: {
      firstName: string;
      lastName: string;
    };
    farmName?: string;
    location?: string;
    rating?: number;
    products?: Array<{
      name: string;
      price: number;
    }>;
    image?: string;
    provinceId?: string;
    districtId?: string;
  };
}

export default function FarmerCard({ farmer }: FarmerCardProps) {
  const farmerName = farmer.name || 
    (farmer.user ? `${farmer.user.firstName} ${farmer.user.lastName}` : 'Unknown Farmer');
  const farmerRating = farmer.rating || 0;

  // Sample products if none provided
  const products = farmer.products || [
    { name: "Inkoko (kg)", price: 4500 },
    { name: "Amagi (30)", price: 3000 }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-current text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-current text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200">
        {farmer.image ? (
          <img 
            src={farmer.image} 
            alt={`${farmerName} farm`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rwanda-green/20 to-rwanda-teal/20">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-rwanda-green mx-auto mb-2" />
              <p className="text-rwanda-green font-medium">Rwanda Farm</p>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{farmerName}</h3>
          <div className="flex items-center">
            <div className="flex">
              {renderStars(farmerRating)}
            </div>
            <span className="text-sm text-gray-600 ml-2">{farmerRating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          {farmer.location || `${farmer.districtId || 'District'}, ${farmer.provinceId || 'Province'} • 2.3km imbere`}
        </p>
        
        <div className="space-y-2 mb-4">
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{product.name}</span>
              <span className="font-semibold text-rwanda-green">
                {product.price.toLocaleString()} RWF
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-rwanda-green text-white hover:bg-emerald-700">
            Gura
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-rwanda-green text-rwanda-green hover:bg-emerald-50"
          >
            Reba
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
