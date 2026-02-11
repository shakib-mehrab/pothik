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
import { Checkbox } from "../components/ui/checkbox";
import { MapPin, Star, Navigation, Plus, X, ChevronDown, Facebook, Heart, FileText, Loader2, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getHotels, submitHotel, updateHotel, deleteHotel } from "../../services/firestoreService";
import { Hotel } from "../../types";
import { toast } from "sonner";

export function Hotels() {
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState<Hotel["category"]>("hotel");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [documentInput, setDocumentInput] = useState("");
  const [documents, setDocuments] = useState<string[]>(["এনআইডি"]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<Hotel | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    howToGo: "",
    coupleFriendly: false,
    facebookPage: "",
    reviews: "",
  });

  // Fetch hotels from Firestore
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await getHotels(activeTab);
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [activeTab]);

  const tabConfig = [
    { value: "hotel" as const, label: "হোটেল" },
    { value: "resort" as const, label: "রিসোর্ট" },
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleAddDocument = () => {
    if (documentInput.trim() && !documents.includes(documentInput.trim())) {
      setDocuments([...documents, documentInput.trim()]);
      setDocumentInput("");
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("আপনাকে লগইন করতে হবে!");
      return;
    }

    try {
      setSubmitting(true);
      await submitHotel(formData, currentUser.uid, activeTab, documents, userData?.displayName, userData?.role === 'admin');
      toast.success("হোটেল/রিসোর্ট সফলভাবে জমা হয়েছে!", {
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
        coupleFriendly: false,
        facebookPage: "",
        reviews: "",
      });
      setDocuments(["এনআইডি"]);
    } catch (error) {
      console.error("Error submitting hotel:", error);
      toast.error("হোটেল/রিসোর্ট জমা দিতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (hotel: Hotel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHotel(hotel);
    setActiveTab(hotel.category);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      howToGo: hotel.howToGo,
      coupleFriendly: hotel.coupleFriendly || false,
      facebookPage: hotel.facebookPage || "",
      reviews: hotel.reviews || "",
    });
    setDocuments(hotel.documentsNeeded || ["এনআইডি"]);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;

    try {
      setSubmitting(true);
      await updateHotel(editingHotel.id, formData, activeTab, documents);
      toast.success("হোটেল/রিসোর্ট সফলভাবে আপডেট হয়েছে!");
      setIsEditDialogOpen(false);
      setEditingHotel(null);
      // Refresh list
      const data = await getHotels();
      setHotels(data);
      // Reset form
      setFormData({
        name: "",
        location: "",
        howToGo: "",
        coupleFriendly: false,
        facebookPage: "",
        reviews: "",
      });
      setDocuments(["এনআইডি"]);
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast.error("আপডেট করতে সমস্যা হয়েছে।", {
        description: "আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (hotel: Hotel, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingHotel(hotel);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingHotel) return;

    try {
      setSubmitting(true);
      await deleteHotel(deletingHotel.id);
      toast.success("হোটেল/রিসোর্ট সফলভাবে ডিলিট হয়েছে!");
      setIsDeleteDialogOpen(false);
      setDeletingHotel(null);
      // Refresh list
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error("Error deleting hotel:", error);
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
      <div className="bg-gradient-to-br from-hotels to-hotels/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">হোটেল / রিসোর্ট</h1>
        <p className="text-white/90 text-sm">Hotels & Resorts Directory</p>
      </div>

      {/* Tabs */}
      <div className="sticky top-[104px] z-10 bg-background px-4 pt-6 pb-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Hotel["category"])} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted h-auto">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm py-2.5 data-[state=active]:bg-hotels data-[state=active]:text-hotels-foreground"
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
              className="w-full mt-3 bg-hotels text-hotels-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              নতুন যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
            <DialogHeader>
              <DialogTitle className="text-base">
                নতুন {activeTab === "hotel" ? "হোটেল" : "রিসোর্ট"} যোগ করুন
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <Label className="text-xs font-medium">নাম *</Label>
                <Input
                  required
                  placeholder="যেমন: হোটেল ৬১"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">অবস্থান *</Label>
                <Input
                  required
                  placeholder="যেমন: উত্তরা, সেক্টর ৩, ঢাকা"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">যেভাবে যাবেন</Label>
                <Textarea
                  placeholder="যেমন: মেট্রো: উত্তরা সেন্টার স্টেশন, হেঁটে ৫ মিনিট"
                  value={formData.howToGo}
                  onChange={(e) => setFormData({ ...formData, howToGo: e.target.value })}
                  className="mt-1 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="coupleFriendly"
                  checked={formData.coupleFriendly}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, coupleFriendly: checked as boolean })
                  }
                />
                <Label htmlFor="coupleFriendly" className="text-xs font-medium cursor-pointer">
                  কাপল ফ্রেন্ডলি (Couple Friendly)
                </Label>
              </div>

              <div>
                <Label className="text-xs font-medium">প্রয়োজনীয় কাগজপত্র</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="যেমন: পাসপোর্ট, বিবাহ সনদ"
                    value={documentInput}
                    onChange={(e) => setDocumentInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDocument();
                      }
                    }}
                    className="h-9 text-sm"
                  />
                  <Button type="button" onClick={handleAddDocument} size="sm" className="h-9 px-3 text-xs">
                    যোগ
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {documents.map((doc, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-0.5">
                      {doc}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveDocument(idx)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium">ফেসবুক পেজ *</Label>
                <Input
                  required
                  placeholder="যেমন: facebook.com/hotel61"
                  value={formData.facebookPage}
                  onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
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

              <Button type="submit" className="w-full bg-hotels text-hotels-foreground h-9 text-sm" disabled={submitting}>
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
            <DialogTitle className="text-base">হোটেল/রিসোর্ট এডিট করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3 pt-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Hotel["category"])}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hotel">হোটেল</TabsTrigger>
                <TabsTrigger value="resort">রিসোর্ট</TabsTrigger>
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
              <Label className="text-xs font-medium">Facebook পেজ</Label>
              <Input
                value={formData.facebookPage}
                onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-couple-friendly"
                checked={formData.coupleFriendly}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, coupleFriendly: checked === true })
                }
              />
              <Label htmlFor="edit-couple-friendly" className="text-xs font-medium cursor-pointer">
                Couple Friendly
              </Label>
            </div>

            <div>
              <Label className="text-xs font-medium">প্রয়োজনীয় কাগজপত্র</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDocument())}
                  placeholder="যেমন: এনআইডি, পাসপোর্ট"
                  className="h-9 text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddDocument}
                  size="sm"
                  variant="outline"
                  className="px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {documents.map((doc, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                    {doc}
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="ml-1 hover:text-destructive"
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
                className="mt-1 text-sm min-h-[80px]"
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-hotels text-hotels-foreground" 
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
              আপনি কি নিশ্চিত যে আপনি \"{deletingHotel?.name}\" ডিলিট করতে চান? 
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

      {/* Hotels/Resorts Grid - 2 Columns with Collapsible Cards */}
      <div className="px-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-hotels" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 items-start">
              {hotels.map((hotel) => {
            const isExpanded = expandedCard === hotel.id;

            return (
              <Card
                key={hotel.id}
                className="p-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => toggleCard(hotel.id)}
              >
                {/* Always Visible - Header */}
                <div className="mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{hotel.name}</h3>
                  {hotel.coupleFriendly && (
                    <div className="flex items-center gap-1 mt-1">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-[10px] text-muted-foreground">কাপল ফ্রেন্ডলি</span>
                    </div>
                  )}
                </div>

                {/* Always Visible - Location */}
                <div className="flex items-start gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{hotel.location}</p>
                </div>

                {/* Always Visible - Documents */}
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {hotel.documentsNeeded.slice(0, 2).map((doc, idx) => (
                      <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 leading-4 bg-blue-50 text-blue-700 border-blue-200">
                        <FileText className="w-2.5 h-2.5 mr-0.5" />
                        {doc}
                      </Badge>
                    ))}
                    {hotel.documentsNeeded.length > 2 && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 leading-4">
                        +{hotel.documentsNeeded.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-border/50">
                    {/* How to Go */}
                    {hotel.howToGo && (
                      <div className="flex items-start gap-1">
                        <Navigation className="w-3 h-3 text-hotels flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-foreground">{hotel.howToGo}</p>
                      </div>
                    )}

                    {/* All Documents when expanded */}
                    {hotel.documentsNeeded.length > 2 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">সকল কাগজপত্র:</p>
                        <div className="flex flex-wrap gap-1">
                          {hotel.documentsNeeded.slice(2).map((doc, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 leading-4 bg-blue-50 text-blue-700 border-blue-200">
                              <FileText className="w-2.5 h-2.5 mr-0.5" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Facebook Page */}
                    {hotel.facebookPage && (
                      <div className="flex items-center gap-1">
                        <Facebook className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <a
                          href={`https://${hotel.facebookPage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {hotel.facebookPage}
                        </a>
                      </div>
                    )}

                    {/* Reviews */}
                    {hotel.reviews && (
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-[10px] text-muted-foreground mb-1">রিভিউ:</p>
                        <p className="text-[11px] text-foreground/80">{hotel.reviews}</p>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {userData?.role === 'admin' && (
                      <div className="flex gap-2 pt-2 border-t border-border/50">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs flex-1"
                          onClick={(e) => handleEdit(hotel, e)}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs flex-1"
                          onClick={(e) => handleDelete(hotel, e)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                  <span className="text-[9px] bg-hotels/10 text-hotels px-1.5 py-0.5 rounded font-medium">
                    ✓ Verified
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">{hotel.lastUpdated}</span>
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
        {hotels.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">এই বিভাগে কোনো তথ্য নেই</p>
          </Card>
        )}

        {/* User Contribution Banner */}
        <Card className="mt-6 bg-gradient-to-r from-hotels/20 to-hotels/10 border-hotels/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-hotels flex items-center justify-center flex-shrink-0">
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
