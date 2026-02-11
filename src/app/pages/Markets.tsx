import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { MapPin, Clock, Star, Navigation, Plus, X, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getMarkets, submitMarket } from "../../services/firestoreService";
import { Market } from "../../types";

export function Markets() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"brands" | "local" | "budget" | "others">("brands");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    howToGo: "",
    reviews: "",
  });

  // Fetch markets from Firestore
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const data = await getMarkets(activeTab);
        setMarkets(data);
      } catch (error) {
        console.error("Error fetching markets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [activeTab]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("আপনাকে লগইন করতে হবে!");
      return;
    }

    try {
      setSubmitting(true);
      await submitMarket(formData, currentUser.uid, activeTab, specialties);
      alert("বাজার সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদনের পর এটি তালিকায় দেখা যাবে।");
      setIsAddDialogOpen(false);
      // Reset form
      setFormData({
        name: "",
        location: "",
        howToGo: "",
        reviews: "",
      });
      setSpecialties([]);
    } catch (error) {
      console.error("Error submitting market:", error);
      alert("বাজার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
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
                <Label className="text-xs font-medium">নাম *</Label>
                <Input
                  required
                  placeholder="যেমন: নিউ মার্কেট"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label className="text-xs font-medium">রিভিউ</Label>
                <Textarea
                  placeholder="আপনার অভিজ্ঞতা লিখুন..."
                  value={formData.reviews}
                  onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                  className="mt-1 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full bg-primary h-9 text-sm" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    জমা দিচ্ছি...
                  </>
                ) : (
                  "সংরক্ষণ করুন"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Markets Grid - 2 Columns with Collapsible Cards */}
      <div className="px-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 items-start">
              {markets.map((market) => {
            const isExpanded = expandedCard === market.id;

            return (
              <Card
                key={market.id}
                className="p-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => toggleCard(market.id)}
              >
                {/* Always Visible - Header */}
                <div className="mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{market.name}</h3>
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
        {markets.length === 0 && (
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
          </>
        )}
      </div>
    </div>
  );
}
