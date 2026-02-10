import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { MapPin, Clock, Star, Navigation, Plus, X, ChevronDown } from "lucide-react";

interface Market {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  location: string;
  howToGo: string;
  specialty: string[];
  openingHours: string;
  priceRange: string;
  description: string;
  lastUpdated: string;
  category: "brands" | "local" | "budget" | "others";
}

export function Markets() {
  const [activeTab, setActiveTab] = useState<Market["category"]>("brands");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nameBangla: "",
    nameEnglish: "",
    location: "",
    howToGo: "",
    openingHours: "",
    priceRange: "",
    description: "",
  });

  const markets: Market[] = [
    {
      id: "bashundhara-city",
      nameBangla: "বসুন্ধরা সিটি",
      nameEnglish: "Bashundhara City",
      location: "Panthapath, Dhaka",
      howToGo: "মেট্রো: কারওয়ান বাজার স্টেশন, বাস: Panthapath",
      specialty: ["ফ্যাশন", "ইলেকট্রনিক্স", "ফুড কোর্ট"],
      openingHours: "10:00 AM - 10:00 PM",
      priceRange: "৳৳৳",
      description: "দক্ষিণ এশিয়ার বৃহত্তম শপিং মল",
      lastUpdated: "Feb 2026",
      category: "brands"
    },
    {
      id: "jamuna-future-park",
      nameBangla: "যমুনা ফিউচার পার্ক",
      nameEnglish: "Jamuna Future Park",
      location: "Baridhara, Dhaka",
      howToGo: "বাস: Kuril Bishwa Road, রিকশা: Baridhara থেকে",
      specialty: ["আন্তর্জাতিক ব্র্যান্ড", "সিনেমা", "খেলার জায়গা"],
      openingHours: "10:00 AM - 10:00 PM",
      priceRange: "৳৳৳",
      description: "আধুনিক শপিং কমপ্লেক্স",
      lastUpdated: "Feb 2026",
      category: "brands"
    },
    {
      id: "new-market",
      nameBangla: "নিউ মার্কেট",
      nameEnglish: "New Market",
      location: "Azimpur, Dhaka",
      howToGo: "মেট্রো: শাহবাগ/ঢাকা বিশ্ববিদ্যালয়, বাস: Azimpur",
      specialty: ["পোশাক", "জুতা", "শাড়ি"],
      openingHours: "10:00 AM - 9:00 PM",
      priceRange: "৳৳",
      description: "ঢাকার পুরাতন শপিং গন্তব্য",
      lastUpdated: "Feb 2026",
      category: "local"
    },
    {
      id: "chandni-chawk",
      nameBangla: "চাঁদনী চক",
      nameEnglish: "Chandni Chawk",
      location: "Gulshan 1, Dhaka",
      howToGo: "বাস: Gulshan 1, সিএনজি/রিকশা",
      specialty: ["শাড়ি", "পার্টি পোশাক", "গহনা"],
      openingHours: "10:00 AM - 9:00 PM",
      priceRange: "৳৳",
      description: "মহিলা পোশাক ও গহনার জন্য জনপ্রিয়",
      lastUpdated: "Feb 2026",
      category: "local"
    },
    {
      id: "hawkers-market",
      nameBangla: "হকার্স মার্কেট",
      nameEnglish: "Hawkers Market (Mohakhali)",
      location: "Mohakhali, Dhaka",
      howToGo: "বাস: Mohakhali Bus Stand, মেট্রো আসছে শীঘ্রই",
      specialty: ["সস্তা পোশাক", "জুতা", "ব্যাগ"],
      openingHours: "11:00 AM - 9:00 PM",
      priceRange: "৳",
      description: "সাশ্রয়ী মূল্যে ফ্যাশন পণ্য",
      lastUpdated: "Feb 2026",
      category: "budget"
    },
    {
      id: "gausia-market",
      nameBangla: "গাউসিয়া মার্কেট",
      nameEnglish: "Gausia Market",
      location: "New Market Area, Dhaka",
      howToGo: "মেট্রো: শাহবাগ, হেঁটে ১০ মিনিট",
      specialty: ["যুব ফ্যাশন", "জিন্স", "টি-শার্ট"],
      openingHours: "10:00 AM - 9:00 PM",
      priceRange: "৳",
      description: "তরুণদের পছন্দের শপিং স্পট",
      lastUpdated: "Feb 2026",
      category: "budget"
    },
    {
      id: "elephant-road",
      nameBangla: "এলিফ্যান্ট রোড",
      nameEnglish: "Elephant Road Market",
      location: "Elephant Road, Dhaka",
      howToGo: "মেট্রো: শাহবাগ, বাস: Elephant Road",
      specialty: ["ইলেকট্রনিক্স", "কম্পিউটার", "মোবাইল"],
      openingHours: "10:00 AM - 8:00 PM",
      priceRange: "৳৳",
      description: "ইলেকট্রনিক্স পণ্যের কেন্দ্র",
      lastUpdated: "Feb 2026",
      category: "others"
    },
    {
      id: "islampur",
      nameBangla: "ইসলামপুর",
      nameEnglish: "Islampur",
      location: "Old Dhaka",
      howToGo: "বাস: Sadarghat/Gulistan, রিকশা",
      specialty: ["কাপড়", "পাইকারি বাজার", "সেলাই সামগ্রী"],
      openingHours: "9:00 AM - 7:00 PM",
      priceRange: "৳",
      description: "কাপড়ের পাইকারি বাজার",
      lastUpdated: "Feb 2026",
      category: "others"
    },
  ];

  const filteredMarkets = markets.filter(m => m.category === activeTab);

  const tabConfig = [
    { value: "brands" as const, label: "ব্র্যান্ড ও মল" },
    { value: "local" as const, label: "স্থানীয়" },
    { value: "budget" as const, label: "সাশ্রয়ী" },
    { value: "others" as const, label: "অন্যান্য" },
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleAddSpecialty = () => {
    if (specialtyInput.trim()) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission (will connect to backend later)
    console.log({ ...formData, specialty: specialties, category: activeTab });
    alert("বাজার যুক্ত হয়েছে! (Backend integration pending)");
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      nameBangla: "",
      nameEnglish: "",
      location: "",
      howToGo: "",
      openingHours: "",
      priceRange: "",
      description: "",
    });
    setSpecialties([]);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">হাট-বাজার</h1>
        <p className="text-white/90 text-sm">Markets & Shopping Directory</p>
      </div>

      {/* Tabs */}
      <div className="sticky top-[104px] z-10 bg-background px-4 pt-6 pb-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Market["category"])} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted h-auto">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Add Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="w-full mt-3 bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              নতুন যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
            <DialogHeader>
              <DialogTitle className="text-base">নতুন বাজার যোগ করুন</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <Label className="text-xs font-medium">নাম (বাংলা) *</Label>
                <Input
                  required
                  placeholder="যেমন: নিউ মার্কেট"
                  value={formData.nameBangla}
                  onChange={(e) => setFormData({ ...formData, nameBangla: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">Name (English)</Label>
                <Input
                  placeholder="e.g., New Market"
                  value={formData.nameEnglish}
                  onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">অবস্থান *</Label>
                <Input
                  required
                  placeholder="যেমন: আজিমপুর, ঢাকা"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">যেভাবে যাবেন *</Label>
                <Textarea
                  required
                  placeholder="যেমন: মেট্রো: শাহবাগ স্টেশন, বাস: Azimpur"
                  value={formData.howToGo}
                  onChange={(e) => setFormData({ ...formData, howToGo: e.target.value })}
                  className="mt-1 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-xs font-medium">বিশেষত্ব *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="যেমন: পোশাক"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                    className="h-9 text-sm"
                  />
                  <Button type="button" onClick={handleAddSpecialty} size="sm" className="h-9 px-3 text-xs">
                    যোগ
                  </Button>
                </div>
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {specialties.map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-0.5">
                        {spec}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveSpecialty(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium">খোলার সময়</Label>
                <Input
                  placeholder="যেমন: 10:00 AM - 9:00 PM"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">মূল্য পরিসীমা</Label>
                <Input
                  placeholder="যেমন: ৳৳"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">বিবরণ</Label>
                <Textarea
                  placeholder="সংক্ষিপ্ত বিবরণ..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full bg-primary h-9 text-sm">
                সংরক্ষণ করুন
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Markets Grid - 2 Columns with Collapsible Cards */}
      <div className="px-4 pt-2">
        <div className="grid grid-cols-2 gap-3 items-start">
          {filteredMarkets.map((market) => {
            const isExpanded = expandedCard === market.id;

            return (
              <Card
                key={market.id}
                className="p-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => toggleCard(market.id)}
              >
                {/* Always Visible - Header */}
                <div className="mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{market.nameBangla}</h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{market.nameEnglish}</p>
                </div>

                {/* Always Visible - Location */}
                <div className="flex items-start gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{market.location}</p>
                </div>

                {/* Always Visible - Specialties (compact) */}
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {market.specialty.slice(0, 2).map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 leading-4">
                        {item}
                      </Badge>
                    ))}
                    {market.specialty.length > 2 && (
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 leading-4">
                        +{market.specialty.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-border/50">
                    {/* How to Go */}
                    <div className="flex items-start gap-1">
                      <Navigation className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-foreground">{market.howToGo}</p>
                    </div>

                    {/* Opening Hours & Price */}
                    <div className="flex items-center justify-between gap-2">
                      {market.openingHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-[10px] text-muted-foreground">{market.openingHours}</span>
                        </div>
                      )}
                      {market.priceRange && (
                        <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/30 px-1.5 py-0">
                          {market.priceRange}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {market.description && (
                      <p className="text-[11px] text-foreground/80">{market.description}</p>
                    )}

                    {/* All Specialties when expanded */}
                    {market.specialty.length > 2 && (
                      <div className="flex flex-wrap gap-1">
                        {market.specialty.slice(2).map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 leading-4">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                  <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                    ✓ Verified
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">{market.lastUpdated}</span>
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
        {filteredMarkets.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">এই বিভাগে কোনো তথ্য নেই</p>
          </Card>
        )}

        {/* User Contribution Banner */}
        <Card className="mt-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
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
