import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { MapPin, DollarSign, Building2, Navigation, ChevronDown, Star, Plus, X, Loader2, Edit2, Trash2, LogIn, User, LogOut, Shield, Search } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { signOut as firebaseSignOut } from "../../services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { getTravelGuides, updateTravelGuide, deleteTravelGuide } from "../../services/firestoreService";
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { TravelGuide as TravelGuideType } from "../../types";
import { toast } from "sonner";

export function TravelGuide() {
  const { currentUser, userData, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [expandedBudget, setExpandedBudget] = useState<string | null>(null);
  const [guides, setGuides] = useState<TravelGuideType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingGuide, setEditingGuide] = useState<TravelGuideType | null>(null);
  const [deletingGuide, setDeletingGuide] = useState<TravelGuideType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleEdit = (guide: TravelGuideType, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGuide(guide);
    setFormData({
      place: guide.placeName,
      description: guide.description,
      budget: guide.approximateBudget,
      howToGo: guide.howToGo,
    });
    setPlaces(guide.mustVisitPlaces || []);
    setHotels(guide.recommendedHotels || []);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide) return;

    if (!formData.place.trim() || !formData.description.trim()) {
      toast.error("স্থানের নাম এবং বর্ণনা আবশ্যক!");
      return;
    }

    if (places.length === 0) {
      toast.error("অন্তত একটি ভ্রমণ স্থান যোগ করুন!");
      return;
    }

    try {
      setSubmitting(true);
      await updateTravelGuide(editingGuide.id, {
        placeName: formData.place.trim(),
        description: formData.description.trim(),
        approximateBudget: formData.budget.trim() || "তথ্য নেই",
        budgetDescription: editingGuide.budgetDescription,
        mustVisitPlaces: places,
        recommendedHotels: hotels,
        howToGo: formData.howToGo.trim() || "তথ্য নেই",
      });

      toast.success("ভ্রমন গাইড সফলভাবে আপডেট হয়েছে!");
      setIsEditDialogOpen(false);
      setEditingGuide(null);

      // Reset form
      setFormData({
        place: "",
        description: "",
        budget: "",
        howToGo: "",
      });
      setPlaces([]);
      setHotels([]);

      // Refresh guides
      const data = await getTravelGuides();
      setGuides(data);
    } catch (error) {
      console.error("Error updating travel guide:", error);
      toast.error("আপডেট করতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (guide: TravelGuideType, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingGuide(guide);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingGuide) return;

    try {
      setSubmitting(true);
      await deleteTravelGuide(deletingGuide.id);
      toast.success("ভ্রমন গাইড সফলভাবে ডিলিট হয়েছে!");
      setIsDeleteDialogOpen(false);
      setDeletingGuide(null);

      // Refresh guides
      const data = await getTravelGuides();
      setGuides(data);
    } catch (error) {
      console.error("Error deleting travel guide:", error);
      toast.error("ডিলিট করতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
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
      <div className="bg-gradient-to-br from-accent to-accent/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="header-pattern-travel" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-pattern-travel)" />
          </svg>
        </div>
        {/* Header Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/header1.svg)' }}
        />
        <div className="relative flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">ভ্রমন গাইড</h1>
            <p className="text-white/90 text-sm">Travel Guide for Bangladesh</p>
          </div>
          
          <div className="flex items-center gap-2">
            {authLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            ) : currentUser && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage src={userData.photoURL || ""} alt={userData.displayName} />
                      <AvatarFallback className="bg-white/90 text-accent">{getInitials(userData.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">Points:</span>
                        <span className="text-xs font-semibold text-primary">{userData.contributionPoints}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>প্রোফাইল</span></Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer"><Shield className="mr-2 h-4 w-4" /><span>Admin Dashboard</span></Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /><span>লগ আউট</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-white text-accent hover:bg-white/90 shadow-md">
                <Link to="/auth"><LogIn className="mr-2 h-4 w-4" />লগইন</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-6 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by place name or location..."
            className="pl-10 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Travel Guides List */}
      <div className="px-4 pt-2 space-y-4">
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
            {guides
              .filter((guide) => {
                const query = searchQuery.toLowerCase();
                return (
                  guide.place.toLowerCase().includes(query) ||
                  guide.places.some((p) => p.toLowerCase().includes(query))
                );
              })
              .map((guide) => {
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

                  {/* Creator/Admin Actions */}
                  {(userData?.role === 'admin' || (guide as any).createdBy === currentUser?.uid) && (
                    <div className="flex gap-2 pt-3 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs flex-1"
                        onClick={(e) => handleEdit(guide, e)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 text-xs flex-1"
                        onClick={(e) => handleDelete(guide, e)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ভ্রমন গাইড এডিট করুন</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              {/* Place Name */}
              <div>
                <Label htmlFor="edit-place">স্থানের নাম *</Label>
                <Input
                  id="edit-place"
                  required
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  placeholder="যেমন: কক্সবাজার, সুন্দরবন"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="edit-description">বর্ণনা *</Label>
                <Textarea
                  id="edit-description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="স্থান সম্পর্কে বিস্তারিত বর্ণনা দিন"
                  className="min-h-[100px]"
                />
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="edit-budget">আনুমানিক বাজেট</Label>
                <Input
                  id="edit-budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="যেমন: ৳15,000 - ৳20,000"
                />
              </div>

              {/* Must Visit Places */}
              <div>
                <Label>ভ্রমণীয় স্থান * (অন্তত ১টি)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={placeInput}
                    onChange={(e) => setPlaceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPlace())}
                    placeholder="যেমন: ইনানী বিচ, সেন্ট মার্টিন"
                  />
                  <Button type="button" onClick={handleAddPlace} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {places.map((place, idx) => (
                    <Badge key={idx} variant="secondary" className="pl-2 pr-1">
                      {place}
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(idx)}
                        className="ml-1 hover:text-destructive"
                        aria-label="Remove place"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommended Hotels */}
              <div>
                <Label>রেকমেন্ডেড হোটেল (ঐচ্ছিক)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={hotelInput}
                    onChange={(e) => setHotelInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHotel())}
                    placeholder="যেমন: সী শেল রিসোর্ট"
                  />
                  <Button type="button" onClick={handleAddHotel} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotels.map((hotel, idx) => (
                    <Badge key={idx} variant="secondary" className="pl-2 pr-1">
                      {hotel}
                      <button
                        type="button"
                        onClick={() => handleRemoveHotel(idx)}
                        className="ml-1 hover:text-destructive"
                        aria-label="Remove hotel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* How to Go */}
              <div>
                <Label htmlFor="edit-howToGo">যেভাবে যাবেন</Label>
                <Textarea
                  id="edit-howToGo"
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
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  "আপডেট করুন"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>নিশ্চিত করুন</AlertDialogTitle>
              <AlertDialogDescription>
                আপনি কি নিশ্চিত যে আপনি "{deletingGuide?.placeName}" ভ্রমন গাইড ডিলিট করতে চান? 
                এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ডিলিট হচ্ছে...
                  </>
                ) : (
                  "ডিলিট করুন"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
