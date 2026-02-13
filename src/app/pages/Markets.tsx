import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
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
import { MapPin, Clock, Star, Navigation, Plus, X, Loader2, Edit2, Trash2, LogIn, User, LogOut, Shield, Search, ChevronDown } from "lucide-react";
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
import { getMarkets, submitMarket, updateMarket, deleteMarket } from "../../services/firestoreService";
import { Market } from "../../types";
import { toast } from "sonner";

export function Markets() {
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
  const [activeTab, setActiveTab] = useState<"brands" | "local" | "budget" | "others">("brands");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [deletingMarket, setDeletingMarket] = useState<Market | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const toggleSpecialties = (marketId: string) => {
    setExpandedSpecialties(prev =>
      prev.includes(marketId)
        ? prev.filter(id => id !== marketId)
        : [...prev, marketId]
    );
  };

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
      toast.error("আপনাকে লগইন করতে হবে!");
      return;
    }

    try {
      setSubmitting(true);
      await submitMarket(formData, currentUser.uid, activeTab, specialties, userData?.displayName, userData?.role === 'admin');
      toast.success("বাজার সফলভাবে জমা হয়েছে!", {
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
        reviews: "",
      });
      setSpecialties([]);
    } catch (error) {
      console.error("Error submitting market:", error);
      toast.error("বাজার জমা দিতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (market: Market, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMarket(market);
    setActiveTab(market.category);
    setFormData({
      name: market.name,
      location: market.location,
      howToGo: market.howToGo,
      reviews: market.reviews || "",
    });
    setSpecialties(market.specialty || []);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarket) return;

    try {
      setSubmitting(true);
      await updateMarket(editingMarket.id, formData, activeTab, specialties);
      toast.success("বাজার সফলভাবে আপডেট হয়েছে!");
      setIsEditDialogOpen(false);
      setEditingMarket(null);
      // Refresh list
      const data = await getMarkets();
      setMarkets(data);
      // Reset form
      setFormData({
        name: "",
        location: "",
        howToGo: "",
        reviews: "",
      });
      setSpecialties([]);
    } catch (error) {
      console.error("Error updating market:", error);
      toast.error("আপডেট করতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (market: Market, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingMarket(market);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingMarket) return;

    try {
      setSubmitting(true);
      await deleteMarket(deletingMarket.id);
      toast.success("বাজার সফলভাবে ডিলিট হয়েছে!");
      setIsDeleteDialogOpen(false);
      setDeletingMarket(null);
      // Refresh list
      const data = await getMarkets();
      setMarkets(data);
    } catch (error) {
      console.error("Error deleting market:", error);
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
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="header-pattern-markets" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-pattern-markets)" />
          </svg>
        </div>
        {/* Header Image */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30 header-image-1" />
        <div className="relative flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">হাট-বাজার</h1>
            <p className="text-white/90 text-sm">Markets & Shopping Directory</p>
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
                      <AvatarFallback className="bg-white/90 text-primary">{getInitials(userData.displayName)}</AvatarFallback>
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
              <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 shadow-md">
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

      {/* Tabs */}
      <div className="sticky top-[104px] z-10 bg-background px-4 pb-3">
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-base">বাজার এডিট করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3 pt-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-4 text-xs">
                <TabsTrigger value="brands" className="text-xs">ব্র্যান্ড শপ</TabsTrigger>
                <TabsTrigger value="local" className="text-xs">লোকাল</TabsTrigger>
                <TabsTrigger value="budget" className="text-xs">বাজেট</TabsTrigger>
                <TabsTrigger value="others" className="text-xs">অন্যান্য</TabsTrigger>
              </TabsList>
            </Tabs>

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
              <Label className="text-xs font-medium">বিশেষত্ব</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                  placeholder="যেমন: জুতা, জামা, ইলেকট্রনিক্স"
                  className="h-9 text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddSpecialty}
                  size="sm"
                  variant="outline"
                  className="px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {specialties.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(index)}
                      className="ml-1 hover:text-destructive"
                      aria-label="Remove specialty"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">রিভিউ</Label>
              <Textarea
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
              আপনি কি নিশ্চিত যে আপনি \"{deletingMarket?.name}\" ডিলিট করতে চান? 
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

      {/* Markets Grid - 2 Columns with Collapsible Cards */}
      <div className="px-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 items-start">
              {markets
                .filter((market) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    market.name.toLowerCase().includes(query) ||
                    market.location.toLowerCase().includes(query)
                  );
                })
                .map((market) => {
            return (
              <Card
                key={market.id}
                className="p-2 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header - Always Visible */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">{market.name}</h3>
                    {/* Specialties */}
                    {market.specialty.length > 0 && (
                      <div className="mt-0.5">
                        <div className="flex flex-wrap gap-1">
                          {(expandedSpecialties.includes(market.id)
                            ? market.specialty
                            : market.specialty.slice(0, 3)
                          ).map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 leading-4">
                              {item}
                            </Badge>
                          ))}
                          {market.specialty.length > 3 && !expandedSpecialties.includes(market.id) && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0 leading-4 cursor-pointer bg-primary/10 hover:bg-primary/20"
                              onClick={() => toggleSpecialties(market.id)}
                            >
                              +{market.specialty.length - 3} more
                            </Badge>
                          )}
                          {expandedSpecialties.includes(market.id) && market.specialty.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0 leading-4 cursor-pointer bg-primary/10 hover:bg-primary/20"
                              onClick={() => toggleSpecialties(market.id)}
                            >
                              show less
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{market.location}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => toggleCard(market.id)}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCard === market.id ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </div>

                {/* Expandable Content */}
                {expandedCard === market.id && (
                  <>
                    {/* How to Go */}
                    {market.howToGo && (
                      <div className="mb-0.5">
                        <div className="flex items-start gap-1">
                          <Navigation className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-foreground line-clamp-2">{market.howToGo}</p>
                        </div>
                      </div>
                    )}

                    {/* Engagement Section */}
                    <div className="mb-0.5">
                      <EngagementSection contentType="markets" contentId={market.id} />
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
                            handleEdit(market, e);
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
                            handleDelete(market, e);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-0.5" />
                          Delete
                        </Button>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                        ✓ Verified
                      </span>
                      <span className="text-[9px] text-muted-foreground">{market.lastUpdated}</span>
                    </div>
                  </>
                )}
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
