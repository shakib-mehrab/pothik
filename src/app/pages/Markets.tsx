import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { MapPin, Clock, Star, Edit, Trash2, Plus } from "lucide-react";

interface Market {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  location: string;
  specialty: string[];
  openingHours: string;
  priceRange: string;
  description: string;
  lastUpdated: string;
  category: "shopping" | "wholesale" | "hotels";
}

export function Markets() {
  const [activeTab, setActiveTab] = useState("shopping");

  const markets: Market[] = [
    {
      id: "new-market",
      nameBangla: "নিউ মার্কেট",
      nameEnglish: "New Market",
      location: "Azimpur, Dhaka",
      specialty: ["Clothing", "Accessories", "Shoes", "Sarees"],
      openingHours: "10:00 AM - 9:00 PM",
      priceRange: "৳৳",
      description: "One of Dhaka's oldest shopping destinations for clothing and accessories",
      lastUpdated: "Feb 2026",
      category: "shopping"
    },
    {
      id: "bashundhara-city",
      nameBangla: "বসুন্ধরা সিটি",
      nameEnglish: "Bashundhara City",
      location: "Panthapath, Dhaka",
      specialty: ["Fashion", "Electronics", "Food Court", "Entertainment"],
      openingHours: "10:00 AM - 10:00 PM",
      priceRange: "৳৳৳",
      description: "Largest shopping mall in South Asia with everything under one roof",
      lastUpdated: "Feb 2026",
      category: "shopping"
    },
    {
      id: "jamuna-future-park",
      nameBangla: "যমুনা ফিউচার পার্ক",
      nameEnglish: "Jamuna Future Park",
      location: "Baridhara, Dhaka",
      specialty: ["International Brands", "Cinema", "Food", "Kids Zone"],
      openingHours: "10:00 AM - 10:00 PM",
      priceRange: "৳৳৳",
      description: "Modern shopping complex with international and local brands",
      lastUpdated: "Feb 2026",
      category: "shopping"
    },
    {
      id: "kawran-bazar",
      nameBangla: "কারওয়ান বাজার",
      nameEnglish: "Kawran Bazar",
      location: "Tejgaon, Dhaka",
      specialty: ["Vegetables", "Fish", "Meat", "Wholesale"],
      openingHours: "3:00 AM - 12:00 PM",
      priceRange: "৳",
      description: "Largest wholesale kitchen market in Dhaka",
      lastUpdated: "Feb 2026",
      category: "wholesale"
    },
    {
      id: "gulshan-electronics",
      nameBangla: "গুলশান ইলেকট্রনিক্স",
      nameEnglish: "Multiplan Center",
      location: "Elephant Road, Dhaka",
      specialty: ["Computers", "Laptops", "Gadgets", "Accessories"],
      openingHours: "10:00 AM - 8:00 PM",
      priceRange: "৳৳",
      description: "Hub for electronics and computer equipment",
      lastUpdated: "Feb 2026",
      category: "wholesale"
    },
    {
      id: "hotel-61",
      nameBangla: "হোটেল ৬১",
      nameEnglish: "Hotel 61",
      location: "Uttara, Sector 3",
      specialty: ["Budget Rooms", "Restaurant", "WiFi"],
      openingHours: "24/7",
      priceRange: "৳1,500 - ৳3,000/night",
      description: "Clean budget hotel in Uttara with good amenities",
      lastUpdated: "Feb 2026",
      category: "hotels"
    },
    {
      id: "hotel-sarina",
      nameBangla: "হোটেল সারিনা",
      nameEnglish: "Hotel Sarina",
      location: "Banani, Dhaka",
      specialty: ["Mid-range", "Pool", "Restaurant", "Conference"],
      openingHours: "24/7",
      priceRange: "৳4,500 - ৳8,000/night",
      description: "Comfortable mid-range hotel with pool and dining",
      lastUpdated: "Feb 2026",
      category: "hotels"
    },
    {
      id: "radisson-blu",
      nameBangla: "র‍্যাডিসন ব্লু",
      nameEnglish: "Radisson Blu",
      location: "Airport Road, Dhaka",
      specialty: ["Luxury", "Spa", "Multiple Restaurants", "Airport Transfer"],
      openingHours: "24/7",
      priceRange: "৳12,000 - ৳25,000/night",
      description: "5-star luxury hotel near airport",
      lastUpdated: "Feb 2026",
      category: "hotels"
    }
  ];

  const filteredMarkets = markets.filter(m => m.category === activeTab);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">হাট-বাজার</h1>
        <p className="text-white/90 text-sm">Markets, Shopping & Hotels Directory</p>
      </div>

      {/* Tabs */}
      <div className="sticky top-[120px] z-10 bg-background px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
              <TabsTrigger value="wholesale">Wholesale</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button 
          size="sm" 
          className="w-full bg-primary text-primary-foreground"
          onClick={() => alert('Add new place (feature coming soon!)')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'shopping' ? 'Shopping Center' : activeTab === 'wholesale' ? 'Wholesale Market' : 'Hotel'}
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pt-2">
        <div className="space-y-4">
          {filteredMarkets.map((market) => (
            <Card key={market.id} className="p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{market.nameBangla}</h3>
                    <p className="text-sm text-muted-foreground">{market.nameEnglish}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {market.category !== "hotels" && (
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                        {market.priceRange}
                      </Badge>
                    )}
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                        onClick={() => alert('Edit market details (feature coming soon!)')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => alert('Delete market (feature coming soon!)')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {market.location}
                </div>

                {/* Hours */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {market.openingHours}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm mb-3 text-foreground/80">{market.description}</p>

              {/* Specialties */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">
                  {market.category === "hotels" ? "Amenities:" : "Specialty:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {market.specialty.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Range for Hotels */}
              {market.category === "hotels" && (
                <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tariff Range:</span>
                    <span className="text-sm font-semibold text-primary">{market.priceRange}</span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                  ✓ Verified by Pathik
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Updated: {market.lastUpdated}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* User Contribution Banner */}
        <Card className="mt-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Community Verified</h3>
              <p className="text-xs text-muted-foreground">
                All prices and information are manually updated by Pathik travelers
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}