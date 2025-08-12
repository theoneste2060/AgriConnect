import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import LocationSearch from "@/components/location-search";
import FarmerCard from "@/components/farmer-card";
import PriceComparison from "@/components/price-comparison";
import { ChevronDown, Sprout, Brain, TrendingUp, Gem } from "lucide-react";

export default function Landing() {
  const sampleFarmers = [
    {
      id: "farm1",
      name: "Jean Baptiste",
      location: "Gasabo, Kigali • 2.3km imbere",
      rating: 4.8,
      products: [
        { name: "Inkoko (kg)", price: 4500 },
        { name: "Amagi (30)", price: 3000 }
      ],
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      id: "farm2",
      name: "Marie Claire",
      location: "Kicukiro, Kigali • 3.7km imbere",
      rating: 4.6,
      products: [
        { name: "Inkoko (kg)", price: 4200 },
        { name: "Amagi (30)", price: 2800 }
      ],
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      id: "farm3",
      name: "Emmanuel",
      location: "Nyarugenge, Kigali • 1.8km imbere",
      rating: 5.0,
      products: [
        { name: "Inkoko (kg)", price: 4800 },
        { name: "Amagi (30)", price: 3200 }
      ],
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Guhuza Abahinzi n'Abakiriya mu Rwanda
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Ikoresha ubuhanga bwa AI kugira ngo ubone abahinzi bari hafi yawe, ugenzure ibiciro, kandi ugure ibicuruzwa byiza cyane
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-rwanda-green text-white px-8 py-4 text-lg hover:bg-emerald-700"
                onClick={() => window.location.href = '/api/login'}
              >
                <Sprout className="mr-2 h-5 w-5" />
                Shakisha Abahinzi
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white text-rwanda-green px-8 py-4 text-lg border-2 border-white hover:bg-gray-100"
                onClick={() => window.location.href = '/api/login'}
              >
                Andikisha nk'Umuhinzi
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Location Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shakisha Abahinzi bari hafi yawe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gukoresha AI kugira ngo ubone abahinzi bari hafi yawe mu ntara, akarere, n'umurenge
            </p>
          </div>
          <LocationSearch />
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ubuhanga bwa AI bukoresha
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dukoresha tekinorogi ya AI kugira ngo tugufashe guhitamo neza no gusura isoko
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-rwanda-green rounded-xl flex items-center justify-center mb-6">
                  <Brain className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ibitekerezo by'ubwenge</h3>
                <p className="text-gray-600 mb-6">
                  AI igufasha guhitamo abahinzi bakwiye kandi ibicuruzwa byiza byane bitewe ku biciro n'ubunyangamugayo
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium">AI Model: TF-IDF + Cosine Similarity</p>
                  <p className="text-xs text-gray-500 mt-1">Gupima ibicuruzwa bifitanye isano</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-rwanda-teal rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gupima Ibiciro</h3>
                <p className="text-gray-600 mb-6">
                  Reba ibiciro by'abahinzi batandukanye kandi umenye uko wahitamo neza mu gihe runaka
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium">Machine Learning Analysis</p>
                  <p className="text-xs text-gray-500 mt-1">Gutekereza ku biciro mu gihe kizaza</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-rwanda-amber rounded-xl flex items-center justify-center mb-6">
                  <Gem className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gutekereza ku byifuzwa</h3>
                <p className="text-gray-600 mb-6">
                  Tekinorogi ya ML ifasha abahinzi gutekereza ku byifuzwa by'isoko n'ibihe bifata
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium">Scikit-learn Models</p>
                  <p className="text-xs text-gray-500 mt-1">Amakuru y'ibihe n'isoko</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Farmers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Abahinzi b'ibanze mu Rwanda
              </h2>
              <p className="text-xl text-gray-600">
                Shakisha abahinzi bakora neza bari hafi yawe
              </p>
            </div>
            <Button 
              className="bg-rwanda-green text-white hover:bg-emerald-700"
              onClick={() => window.location.href = '/api/login'}
            >
              Reba byose
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleFarmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Gupima Ibiciro Ahantu Hatandukanye
              </h2>
              <p className="text-xl text-gray-600">
                AI igufasha gusanga ibiciro byiza cyane mu Rwanda yose
              </p>
            </div>
            <PriceComparison />
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Igenzura ry'isoko n'amakuru
            </h2>
            <p className="text-xl text-gray-600">
              Abahinzi n'abayobozi bongeye gukoresha amakuru ya AI kugira ngo bafashe ibyemezo byiza
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gray-50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Dashboard y'umuhinzi</h3>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Ibyifuzwa vya Leo</h4>
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">+12%</span>
                      </div>
                      <div className="text-3xl font-bold text-rwanda-green mb-2">45,000 RWF</div>
                      <p className="text-sm text-gray-600">Urupapuro rw'ibyifuzwa bya AI</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Imiterere y'Ibiciro</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Inkoko (kg)</span>
                          <span className="font-semibold">4,500 RWF</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Amagi (30)</span>
                          <span className="font-semibold">3,000 RWF</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Ifumbire (kg)</span>
                          <span className="font-semibold">800 RWF</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Dashboard y'umuyobozi</h3>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Amakuru y'isoko</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-rwanda-green">1,247</div>
                          <p className="text-sm text-gray-600">Abahinzi</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-rwanda-teal">5,691</div>
                          <p className="text-sm text-gray-600">Abakiriya</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">ML Model Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Prediction Accuracy</span>
                          <span className="font-semibold text-green-600">94.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Recommendation CTR</span>
                          <span className="font-semibold text-blue-600">87.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Model Confidence</span>
                          <span className="font-semibold text-purple-600">91.8%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-rwanda-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tangira ubu - Injira mu mugambi w'AgriConnect
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Guhuza abahinzi n'abakiriya muri Rwanda hagamijwe kongera umusaruro, kugabanya ibiciro, no kongera ubunyangamugayo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
            <Button 
              size="lg"
              className="bg-white text-rwanda-green px-8 py-4 font-semibold hover:bg-gray-100"
              onClick={() => window.location.href = '/api/login'}
            >
              <Sprout className="mr-2 h-5 w-5" />
              Ndi Umuhinzi
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-emerald-700"
              onClick={() => window.location.href = '/api/login'}
            >
              Ndi Umukiriya
            </Button>
          </div>
          
          <div className="mt-8 text-emerald-100">
            <p className="text-sm">
              Koresha Google OAuth 2.0 kugira ngo winjire vuba kandi byizewe
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="text-rwanda-green h-6 w-6" />
                <span className="text-xl font-bold">AgriConnect Rwanda</span>
              </div>
              <p className="text-gray-400 mb-4">
                Guhuza abahinzi n'abakiriya mu Rwanda ukoresheje ubuhanga bwa AI
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Amahuza</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Abahinzi</a></li>
                <li><a href="#" className="hover:text-white">Ibicuruzwa</a></li>
                <li><a href="#" className="hover:text-white">Isoko</a></li>
                <li><a href="#" className="hover:text-white">Ubuyobozi</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ubufasha</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Uko bikora</a></li>
                <li><a href="#" className="hover:text-white">Ubufasha</a></li>
                <li><a href="#" className="hover:text-white">Kwandikisha</a></li>
                <li><a href="#" className="hover:text-white">Gufunga</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ubuhanga</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="text-sm">ReactJS + TypeScript</li>
                <li className="text-sm">Node.js + Express</li>
                <li className="text-sm">Machine Learning (Scikit-learn)</li>
                <li className="text-sm">Google Maps API</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgriConnect Rwanda. Uburenganzira byose birahagaritswe. Ikigo cy'ubuhanga n'ubushakashatsi ku buhinzi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
