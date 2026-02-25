import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { MapPin, Star, Navigation, Plus, Utensils, Loader2, User, Edit2, Trash2, LogIn, LogOut, Shield, Search, ChevronDown } from "lucide-react";
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
import { EngagementSection } from "../components/EngagementSection";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { getRestaurants, submitRestaurant, updateRestaurant, deleteRestaurant } from "../../services/firestoreService";
import { Restaurant } from "../../types";
import { toast } from "sonner";

export function Restaurants() {
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

  const handleAddClick = () => {
    if (!currentUser) {
      toast.error("আপনাকে লগইন করতে হবে!", {
        description: "নতুন রেস্টুরেন্ট যোগ করতে প্রথমে লোগইন করুন।",
        action: {
          label: "লগইন করুন",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }
    setIsAddDialogOpen(true);
  };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [deletingRestaurant, setDeletingRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    howToGo: "",
    bestItem: "",
    reviews: "",
  });

  // Fetch restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("আপনাকে লগইন করতে হবে!");
      return;
    }

    try {
      setSubmitting(true);
      await submitRestaurant(formData, currentUser.uid, userData?.displayName, userData?.role === 'admin');
      toast.success("রেস্টুরেন্ট সফলভাবে জমা হয়েছে!", {
        description: userData?.role === 'admin' 
          ? "এটি তালিকায় যুক্ত হয়ে গেছে।" 
          : "অ্যাডমিন অনুমোদনের পর এটি তালিকায় দেখা যাবে।",
      });
      setIsAddDialogOpen(false);
      // Reset form
      setFormData({
        name: "",
        location: "",
        howToGo: "",
        bestItem: "",
        reviews: "",
      });
      // Refresh restaurants list
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Error submitting restaurant:", error);
      toast.error("রেস্টুরেন্ট জমা দিতে সমস্যা হয়েছে", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      location: restaurant.location,
      howToGo: restaurant.howToGo,
      bestItem: restaurant.bestItem || "",
      reviews: restaurant.reviews || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurant) return;

    try {
      setSubmitting(true);
      await updateRestaurant(editingRestaurant.id, formData);
      toast.success("রেস্টুরেন্ট সফলভাবে আপডেট হয়েছে!");
      setIsEditDialogOpen(false);
      setEditingRestaurant(null);
      // Refresh list
      const data = await getRestaurants();
      setRestaurants(data);
      // Reset form
      setFormData({
        name: "",
        location: "",
        howToGo: "",
        bestItem: "",
        reviews: "",
      });
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error("আপডেট করতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingRestaurant(restaurant);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingRestaurant) return;

    try {
      setSubmitting(true);
      await deleteRestaurant(deletingRestaurant.id);
      toast.success("রেস্টুরেন্ট সফলভাবে ডিলিট হয়েছে!");
      setIsDeleteDialogOpen(false);
      setDeletingRestaurant(null);
      // Refresh list
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("ডিলিট করতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-food to-food/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="header-pattern-restaurants" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-pattern-restaurants)" />
          </svg>
        </div>
        {/* Header Image */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30 header-image-1" />
        <div className="relative flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">খাই দাই</h1>
            <p className="text-white/90 text-sm">Restaurants Directory</p>
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
                      <AvatarFallback className="bg-white/90 text-food">{getInitials(userData.displayName)}</AvatarFallback>
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
              <Button asChild size="sm" className="bg-white text-food hover:bg-white/90 shadow-md">
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
            placeholder="Search by name or location..."
            className="pl-10 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Add Button */}
      <div className="sticky top-[104px] z-10 bg-background px-4 pb-3">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="w-full bg-food text-food-foreground"
              onClick={(e) => {
                e.preventDefault();
                handleAddClick();
              }}
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

              <Button type="submit" className="w-full bg-food text-food-foreground h-9 text-sm" disabled={submitting}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-base">রেস্টুরেন্ট এডিট করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3 pt-2">
            <div>
              <Label className="text-xs font-medium">নাম *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium">অবস্থান *</Label>
              <Input
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium">যেভাবে যাবেন *</Label>
              <Textarea
                required
                value={formData.howToGo}
                onChange={(e) => setFormData({ ...formData, howToGo: e.target.value })}
                className="mt-1 text-sm min-h-[60px]"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-xs font-medium">বেস্ট আইটেম</Label>
              <Input
                value={formData.bestItem}
                onChange={(e) => setFormData({ ...formData, bestItem: e.target.value })}
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium">রিভিউ</Label>
              <Textarea
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                className="mt-1 text-sm min-h-[80px]"
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-food text-food-foreground" 
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
              আপনি কি নিশ্চিত যে আপনি "{deletingRestaurant?.name}" ডিলিট করতে চান? 
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

      {/* Restaurants Grid - 2 Columns with Collapsible Cards */}
      <div className="px-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-food" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 items-start">{restaurants
              .filter((restaurant) => {
                const query = searchQuery.toLowerCase();
                return (
                  restaurant.name.toLowerCase().includes(query) ||
                  restaurant.location.toLowerCase().includes(query)
                );
              })
              .map((restaurant) => {
            return (
              <Card
                key={restaurant.id}
                className="p-2 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header - Always Visible */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">{restaurant.name}</h3>
                    <div className="flex items-start gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{restaurant.location}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => toggleCard(restaurant.id)}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCard === restaurant.id ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </div>

                {/* Expandable Content */}
                {expandedCard === restaurant.id && (
                  <>
                    {/* Best Item */}
                    {restaurant.bestItem && (
                      <div className="mb-0.5">
                        <p className="text-[10px] text-muted-foreground">বেস্ট আইটেম:</p>
                        <p className="text-[11px] text-foreground/80 line-clamp-2">{restaurant.bestItem}</p>
                      </div>
                    )}

                    {/* How to Go */}
                    {restaurant.howToGo && (
                      <div className="mb-0.5">
                        <div className="flex items-start gap-1">
                          <Navigation className="w-3 h-3 text-food flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-foreground line-clamp-2">{restaurant.howToGo}</p>
                        </div>
                      </div>
                    )}

                    {/* Reviews */}
                    {restaurant.reviews && (
                      <div className="mb-0.5 bg-muted/50 rounded p-1">
                        <p className="text-[10px] text-muted-foreground">রিভিউ:</p>
                        <p className="text-[11px] text-foreground/80 line-clamp-2">{restaurant.reviews}</p>
                      </div>
                    )}

                    {/* Engagement Section */}
                    <div className="mb-0.5">
                      <EngagementSection contentType="restaurants" contentId={restaurant.id} />
                    </div>

                    {/* Admin Actions */}
                    {userData?.role === 'admin' && (
                      <div className="flex gap-2 mb-1 pb-1 border-b border-border/50">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] flex-1 px-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(restaurant, e);
                          }}
                        >
                          <Edit2 className="w-3 h-3 mr-0.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-6 text-[10px] flex-1 px-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(restaurant, e);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-0.5" />
                          Delete
                        </Button>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-food/10 text-food px-1.5 py-0.5 rounded font-medium">
                        ✓ Verified
                      </span>
                      <span className="text-[9px] text-muted-foreground">{restaurant.lastUpdated}</span>
                    </div>
                  </>
                )}
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
          </>
        )}
      </div>
    </div>
  );
}
