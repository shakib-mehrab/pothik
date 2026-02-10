import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { MapPin, Star, Navigation, Plus, ChevronDown, Utensils } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  location: string;
  howToGo: string;
  bestItem: string;
  reviews: string;
  lastUpdated: string;
}

export function Restaurants() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    howToGo: "",
    bestItem: "",
    reviews: "",
  });

  const restaurants: Restaurant[] = [
    {
      id: "sultans-dine",
      name: "সুলতানস ডাইন",
      location: "ধানমন্ডি ২, ঢাকা",
      howToGo: "মেট্রো: শাহবাগ, রিকশা/উবার",
      bestItem: "কাচ্চি বিরিয়ানি, টেহারি",
      reviews: "ভালো মানের কাচ্চি। দাম একটু বেশি কিন্তু স্বাদ ভালো।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "haji-biryani",
      name: "হাজী বিরিয়ানি",
      location: "নাজিরাবাজার, পুরান ঢাকা",
      howToGo: "বাস: গুলিস্তান, রিকশা",
      bestItem: "মটন বিরিয়ানি, বোরহানি",
      reviews: "পুরান ঢাকার বিখ্যাত বিরিয়ানি। লাইন থাকে প্রায়ই।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "star-kabab",
      name: "স্টার কাবাব",
      location: "ধানমন্ডি, ঢাকা",
      howToGo: "মেট্রো: শাহবাগ স্টেশন",
      bestItem: "বিফ কাবাব, নান, চিকেন রোস্ট",
      reviews: "সাশ্রয়ী মূল্যে ভালো খাবার। পরিচ্ছন্ন পরিবেশ।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "khanas",
      name: "খানাস",
      location: "গুলশান ১, ঢাকা",
      howToGo: "বাস: গুলশান, সিএনজি",
      bestItem: "মোগলাই পরোটা, খিচুড়ি, চিকেন রেজালা",
      reviews: "বাঙালি খাবারের জন্য দুর্দান্ত। পরিবার বান্ধব।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "fakruddin",
      name: "ফখরুদ্দিন",
      location: "ঢাকা-চট্টগ্রাম হাইওয়ে, কাঞ্চন ব্রিজ",
      howToGo: "চট্টগ্রাম যাওয়ার পথে কাঞ্চন ব্রিজ",
      bestItem: "বিরিয়ানি, চিকেন ফ্রাই",
      reviews: "হাইওয়েতে খাওয়ার জন্য ভালো। দ্রুত সার্ভিস।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "spaghetti-jazz",
      name: "স্প্যাগেটি জ্যাজ",
      location: "উত্তরা, সেক্টর ৭, ঢাকা",
      howToGo: "মেট্রো: উত্তরা সাউথ স্টেশন",
      bestItem: "পাস্তা, পিজা, ক্যাফে লাতে",
      reviews: "ইতালিয়ান খাবারের জন্য ভালো। আরামদায়ক পরিবেশ।",
      lastUpdated: "Feb 2026"
    }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission (will connect to backend later)
    console.log(formData);
    alert("রেস্টুরেন্ট যুক্ত হয়েছে! (Backend integration pending)");
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      name: "",
      location: "",
      howToGo: "",
      bestItem: "",
      reviews: "",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-food to-food/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">খাই দাই</h1>
        <p className="text-white/90 text-sm">Restaurants Directory</p>
      </div>

      {/* Add Button */}
      <div className="sticky top-[104px] z-10 bg-background px-4 pt-6 pb-3">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="w-full bg-food text-food-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              নতুন রেস্টুরেন্ট যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
            <DialogHeader>
              <DialogTitle className="text-base">নতুন রেস্টুরেন্ট যোগ করুন</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <Label className="text-xs font-medium">নাম *</Label>
                <Input
                  required
                  placeholder="যেমন: সুলতানস ডাইন"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">অবস্থান *</Label>
                <Input
                  required
                  placeholder="যেমন: ধানমন্ডি ২, ঢাকা"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">যেভাবে যাবেন *</Label>
                <Textarea
                  required
                  placeholder="যেমন: মেট্রো: শাহবাগ স্টেশন, হেঁটে ৫ মিনিট"
                  value={formData.howToGo}
                  onChange={(e) => setFormData({ ...formData, howToGo: e.target.value })}
                  className="mt-1 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-xs font-medium">বেস্ট আইটেম</Label>
                <Input
                  placeholder="যেমন: কাচ্চি বিরিয়ানি, টেহারি"
                  value={formData.bestItem}
                  onChange={(e) => setFormData({ ...formData, bestItem: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">রিভিউ</Label>
                <Textarea
                  placeholder="আপনার অভিজ্ঞতা লিখুন..."
                  value={formData.reviews}
                  onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                  className="mt-1 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full bg-food text-food-foreground h-9 text-sm">
                সংরক্ষণ করুন
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Restaurants Grid - 2 Columns with Collapsible Cards */}
      <div className="px-4 pt-2">
        <div className="grid grid-cols-2 gap-3 items-start">
          {restaurants.map((restaurant) => {
            const isExpanded = expandedCard === restaurant.id;

            return (
              <Card
                key={restaurant.id}
                className="p-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => toggleCard(restaurant.id)}
              >
                {/* Always Visible - Header */}
                <div className="mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{restaurant.name}</h3>
                </div>

                {/* Always Visible - Location */}
                <div className="flex items-start gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{restaurant.location}</p>
                </div>

                {/* Always Visible - Best Item */}
                {restaurant.bestItem && (
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 leading-4 bg-food/10 text-food">
                      <Utensils className="w-2.5 h-2.5 mr-0.5" />
                      {restaurant.bestItem.split(',')[0]}
                    </Badge>
                  </div>
                )}

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-border/50">
                    {/* How to Go */}
                    {restaurant.howToGo && (
                      <div className="flex items-start gap-1">
                        <Navigation className="w-3 h-3 text-food flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-foreground">{restaurant.howToGo}</p>
                      </div>
                    )}

                    {/* All Best Items when expanded */}
                    {restaurant.bestItem && (
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">বেস্ট আইটেম:</p>
                        <p className="text-[11px] text-foreground/80">{restaurant.bestItem}</p>
                      </div>
                    )}

                    {/* Reviews */}
                    {restaurant.reviews && (
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-[10px] text-muted-foreground mb-1">রিভিউ:</p>
                        <p className="text-[11px] text-foreground/80">{restaurant.reviews}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                  <span className="text-[9px] bg-food/10 text-food px-1.5 py-0.5 rounded font-medium">
                    ✓ Verified
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">{restaurant.lastUpdated}</span>
                    <ChevronDown
                      className={`w-3 h-3 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {restaurants.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">কোনো রেস্টুরেন্ট নেই</p>
          </Card>
        )}

        {/* User Contribution Banner */}
        <Card className="mt-6 bg-gradient-to-r from-food/20 to-food/10 border-food/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-food flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Community Verified</h3>
              <p className="text-xs text-muted-foreground">
                All information is manually updated by Pathik travelers
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
