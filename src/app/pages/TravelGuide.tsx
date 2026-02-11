import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { MapPin, DollarSign, Building2, Navigation, ChevronDown, Star, Plus, X, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getTravelGuides } from "../../services/firestoreService";
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { TravelGuide as TravelGuideType } from "../../types";

export function TravelGuide() {
  const { currentUser, userData } = useAuth();
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [expandedBudget, setExpandedBudget] = useState<string | null>(null);
  const [guides, setGuides] = useState<TravelGuideType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [placeInput, setPlaceInput] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [hotelInput, setHotelInput] = useState("");
  const [hotels, setHotels] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    place: "",
    description: "",
    budget: "",
    howToGo: "",
  });

  // Fetch travel guides from Firestore
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const data = await getTravelGuides();
        setGuides(data);
      } catch (error) {
        console.error("Error fetching travel guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Helper functions for managing places array
  const handleAddPlace = () => {
    if (placeInput.trim() && places.length < 10) {
      setPlaces([...places, placeInput.trim()]);
      setPlaceInput("");
    }
  };

  const handleRemovePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  // Helper functions for managing hotels array
  const handleAddHotel = () => {
    if (hotelInput.trim() && hotels.length < 10) {
      setHotels([...hotels, hotelInput.trim()]);
      setHotelInput("");
    }
  };

  const handleRemoveHotel = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("ভ্রমন গাইড তৈরি করতে আপনাকে লগইন করতে হবে!");
      return;
    }

    if (!formData.place.trim() || !formData.description.trim()) {
      alert("স্থানের নাম এবং বর্ণনা আবশ্যক!");
      return;
    }

    if (places.length === 0) {
      alert("অন্তত একটি ভ্রমণ স্থান যোগ করুন!");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "travelGuides"), {
        placeName: formData.place.trim(),
        description: formData.description.trim(),
        approximateBudget: formData.budget.trim() || "তথ্য নেই",
        budgetDescription: formData.budget.trim() || "তথ্য নেই",
        mustVisitPlaces: places,
        recommendedHotels: hotels,
        howToGo: formData.howToGo.trim() || "তথ্য নেই",
        sourceType: "manual",
        createdBy: currentUser.uid,
        creatorName: userData?.displayName || "Anonymous",
        status: "published",
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        createdAt: serverTimestamp(),
      });

      // Award points for creating a travel guide (+15 points)
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        "stats.travelGuidesCreated": increment(1),
        contributionPoints: increment(15),
        updatedAt: serverTimestamp(),
      });

      // Update leaderboard
      const leaderboardRef = doc(db, "leaderboard", currentUser.uid);
      await updateDoc(leaderboardRef, {
        totalPoints: increment(15),
        "breakdown.travelGuides": increment(1),
        updatedAt: serverTimestamp(),
      }).catch(async () => {
        // Create leaderboard entry if doesn't exist
        await setDoc(leaderboardRef, {
          displayName: userData?.displayName || "Anonymous",
          photoURL: userData?.photoURL || "",
          totalPoints: 15,
          breakdown: {
            restaurants: 0,
            hotels: 0,
            markets: 0,
            travelGuides: 1,
          },
          updatedAt: serverTimestamp(),
        });
      });

      alert("ভ্রমন গাইড সফলভাবে তৈরি হয়েছে! +15 পয়েন্ট!");

      // Reset form
      setFormData({
        place: "",
        description: "",
        budget: "",
        howToGo: "",
      });
      setPlaces([]);
      setHotels([]);
      setIsAddDialogOpen(false);

      // Refresh guides
      const data = await getTravelGuides();
      setGuides(data);
    } catch (error) {
      console.error("Error creating travel guide:", error);
      alert("ভ্রমন গাইড তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleGuide = (id: string) => {
    setExpandedGuide(expandedGuide === id ? null : id);
  };

  const toggleBudget = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBudget(expandedBudget === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">ভ্রমন গাইড</h1>
        <p className="text-white/90 text-sm">Travel Guide for Bangladesh</p>
      </div>

      {/* Travel Guides List */}
      <div className="px-4 pt-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : guides.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">এখনো কোন ভ্রমন গাইড নেই</p>
            {currentUser && (
              <p className="text-sm text-muted-foreground">প্রথম গাইড তৈরি করুন!</p>
            )}
          </Card>
        ) : (
          <>
            {guides.map((guide) => {
          const isExpanded = expandedGuide === guide.id;
          const isBudgetExpanded = expandedBudget === guide.id;

          return (
            <Card
              key={guide.id}
              className="p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleGuide(guide.id)}
            >
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-foreground">{guide.placeName}</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {guide.description}
                </p>
              </div>

              {/* Budget Preview */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">বাজেট:</span>
                  <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/30">
                    {guide.approximateBudget}
                  </Badge>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="space-y-4 mt-4 pt-4 border-t border-border">
                  {/* Budget Details Toggle */}
                  <div>
                    <button
                      onClick={(e) => toggleBudget(guide.id, e)}
                      className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isBudgetExpanded ? 'rotate-180' : ''
                        }`}
                      />
                      বাজেট বিস্তারিত দেখুন
                    </button>
                    {isBudgetExpanded && (
                      <div className="mt-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {guide.budgetDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Must Visit Places */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-travel" />
                      অবশ্যই ঘুরবেন
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.mustVisitPlaces.map((place, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 bg-travel/10 text-travel border-travel/30"
                        >
                          {place}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Hotels */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-hotels" />
                      প্রস্তাবিত হোটেল
                    </h3>
                    <div className="space-y-1.5">
                      {guide.recommendedHotels.map((hotel, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-hotels" />
                          <span className="text-xs text-foreground/80">{hotel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How to Go */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-transport" />
                      যেভাবে যাবেন
                    </h3>
                    <p className="text-xs text-foreground/80 leading-relaxed bg-muted/50 p-3 rounded-lg">
                      {guide.howToGo}
                    </p>
                  </div>

                  {/* Last Updated */}
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="text-accent">✓</span>
                      Last updated: {guide.lastUpdated}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
          </>
        )}

        {/* Add Guide Button (floating) */}
        {currentUser && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl z-20"
                size="icon"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>নতুন ভ্রমন গাইড তৈরি করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {/* Place Name */}
                <div>
                  <Label htmlFor="place">স্থানের নাম *</Label>
                  <Input
                    id="place"
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    placeholder="যেমন: কক্সবাজার, সুন্দরবন"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">বর্ণনা *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="স্থান সম্পর্কে সংক্ষিপ্ত বর্ণনা লিখুন"
                    className="min-h-[80px]"
                    required
                  />
                </div>

                {/* Budget */}
                <div>
                  <Label htmlFor="budget">আনুমানিক বাজেট</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="যেমন: ৫,০০০-১০,০০০ টাকা/জন (২-৩ দিন)"
                  />
                </div>

                {/* Must Visit Places */}
                <div>
                  <Label>অবশ্যই ঘুরবেন *</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={placeInput}
                      onChange={(e) => setPlaceInput(e.target.value)}
                      placeholder="স্থানের নাম লিখুন"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPlace();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddPlace} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {places.map((place, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {place}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemovePlace(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {places.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      অন্তত একটি স্থান যোগ করুন
                    </p>
                  )}
                </div>

                {/* Recommended Hotels */}
                <div>
                  <Label>প্রস্তাবিত হোটেল</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={hotelInput}
                      onChange={(e) => setHotelInput(e.target.value)}
                      placeholder="হোটেলের নাম লিখুন"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddHotel();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddHotel} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hotels.map((hotel, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {hotel}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveHotel(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* How to Go */}
                <div>
                  <Label htmlFor="howToGo">যেভাবে যাবেন</Label>
                  <Textarea
                    id="howToGo"
                    value={formData.howToGo}
                    onChange={(e) => setFormData({ ...formData, howToGo: e.target.value })}
                    placeholder="ঢাকা থেকে যাতায়াতের উপায় বর্ণনা করুন"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      তৈরি হচ্ছে...
                    </>
                  ) : (
                    "গাইড তৈরি করুন (+15 পয়েন্ট)"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* User Contribution Banner */}
        <Card className="mt-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Community Curated</h3>
              <p className="text-xs text-muted-foreground">
                Travel guides are created and verified by Pathik community members
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
