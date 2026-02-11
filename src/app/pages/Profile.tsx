import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import {
  User,
  Mail,
  Trophy,
  Edit2,
  Loader2,
  Utensils,
  Hotel,
  ShoppingBag,
  MapPin,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Users
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { getUserTours } from "../../services/firestoreService";
import { Tour } from "../../types";

interface ContributionItem {
  id: string;
  type: "restaurant" | "hotel" | "market" | "travelGuide";
  name: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
  points?: number;
}

export function Profile() {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);

  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  // Calculate stats from contributions
  const stats = {
    restaurantsSubmitted: contributions.filter(c => c.type === "restaurant").length,
    hotelsSubmitted: contributions.filter(c => c.type === "hotel").length,
    marketsSubmitted: contributions.filter(c => c.type === "market").length,
    travelGuidesCreated: contributions.filter(c => c.type === "travelGuide").length,
    totalContributions: contributions.length,
    approvedContributions: contributions.filter(c => c.status === "approved").length,
    totalPoints: contributions.reduce((sum, c) => sum + (c.points || 0), 0)
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || "",
        photoURL: userData.photoURL || "",
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!currentUser) {
        setLoadingContributions(false);
        return;
      }

      try {
        setLoadingContributions(true);
        const items: ContributionItem[] = [];

        // Fetch restaurants WITHOUT orderBy to avoid index requirement
        const restaurantsQuery = query(
          collection(db, "restaurants"),
          where("submittedBy", "==", currentUser.uid),
          limit(20)
        );
        const restaurantsSnapshot = await getDocs(restaurantsQuery);
        restaurantsSnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: "restaurant",
            name: data.name,
            status: data.status || "pending",
            submittedAt: data.submittedAt,
            points: data.status === "approved" ? 10 : 0,
          });
        });

        // Fetch hotels WITHOUT orderBy
        const hotelsQuery = query(
          collection(db, "hotels"),
          where("submittedBy", "==", currentUser.uid),
          limit(20)
        );
        const hotelsSnapshot = await getDocs(hotelsQuery);
        hotelsSnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: "hotel",
            name: data.name,
            status: data.status || "pending",
            submittedAt: data.submittedAt,
            points: data.status === "approved" ? 10 : 0,
          });
        });

        // Fetch markets WITHOUT orderBy
        const marketsQuery = query(
          collection(db, "markets"),
          where("submittedBy", "==", currentUser.uid),
          limit(20)
        );
        const marketsSnapshot = await getDocs(marketsQuery);
        marketsSnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: "market",
            name: data.name,
            status: data.status || "pending",
            submittedAt: data.submittedAt,
            points: data.status === "approved" ? 10 : 0,
          });
        });

        // Fetch travel guides WITHOUT orderBy
        const guidesQuery = query(
          collection(db, "travelGuides"),
          where("createdBy", "==", currentUser.uid),
          limit(20)
        );
        const guidesSnapshot = await getDocs(guidesQuery);
        guidesSnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: "travelGuide",
            name: data.placeName,
            status: "approved", // Travel guides are auto-approved
            submittedAt: data.createdAt,
            points: 15,
          });
        });

        // Sort by date in JavaScript instead of Firestore
        items.sort((a, b) => {
          const dateA = a.submittedAt?.toDate?.() || new Date(0);
          const dateB = b.submittedAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setContributions(items);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoadingContributions(false);
      }
    };

    fetchContributions();
  }, [currentUser]);

  useEffect(() => {
    const fetchTours = async () => {
      if (!currentUser) {
        setLoadingTours(false);
        return;
      }

      try {
        setLoadingTours(true);
        const data = await getUserTours(currentUser.uid);
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoadingTours(false);
      }
    };

    fetchTours();
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !userData) return;

    try {
      setUpdating(true);

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL || null,
      });

      // Update Firestore user document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        photoURL: formData.photoURL || "",
        updatedAt: serverTimestamp(),
      });

      // Update leaderboard if exists
      const leaderboardRef = doc(db, "leaderboard", currentUser.uid);
      try {
        await updateDoc(leaderboardRef, {
          displayName: formData.displayName,
          photoURL: formData.photoURL || "",
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        // Leaderboard entry might not exist yet
        console.log("Leaderboard entry not found");
      }

      alert("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      setIsEditDialogOpen(false);

      // Reload to refresh auth context
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("আপনি কি লগআউট করতে চান?")) {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Error signing out:", error);
        alert("লগআউট করতে সমস্যা হয়েছে।");
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Utensils className="w-4 h-4" />;
      case "hotel":
        return <Hotel className="w-4 h-4" />;
      case "market":
        return <ShoppingBag className="w-4 h-4" />;
      case "travelGuide":
        return <MapPin className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "text-food bg-food/10 border-food/30";
      case "hotel":
        return "text-hotels bg-hotels/10 border-hotels/30";
      case "market":
        return "text-primary bg-primary/10 border-primary/30";
      case "travelGuide":
        return "text-travel bg-travel/10 border-travel/30";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "restaurant":
        return "রেস্তোরাঁ";
      case "hotel":
        return "হোটেল";
      case "market":
        return "মার্কেট";
      case "travelGuide":
        return "ভ্রমন গাইড";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            অনুমোদিত
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            পেন্ডিং
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            প্রত্যাখ্যাত
          </Badge>
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-white mb-1">প্রোফাইল</h1>
          <p className="text-white/90 text-sm">Profile</p>
        </div>

        <div className="px-4 pt-6">
          <Card className="p-8 text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">প্রোফাইল দেখতে লগইন করুন</p>
            <Button onClick={() => navigate("/auth")} className="bg-primary">
              লগইন করুন
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">প্রোফাইল</h1>
        <p className="text-white/90 text-sm">Profile</p>
      </div>

      {/* Profile Card */}
      <div className="px-4 pt-6 pb-4">
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1 truncate">{userData?.displayName || "Anonymous"}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <Mail className="w-3 h-3" />
                {currentUser.email}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {stats.totalPoints} পয়েন্ট
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {stats.approvedContributions}/{stats.totalContributions} অনুমোদিত
                </Badge>
                {userData?.role === "admin" && (
                  <Badge className="bg-accent text-white">Admin</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Edit2 className="w-4 h-4 mr-2" />
                প্রোফাইল এডিট করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw]">
              <DialogHeader>
                <DialogTitle>প্রোফাইল এডিট করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="displayName">নাম *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="আপনার নাম লিখুন"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="photoURL">ছবির URL (ঐচ্ছিক)</Label>
                  <Input
                    id="photoURL"
                    value={formData.photoURL}
                    onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    imgur.com বা অন্য কোন ইমেজ হোস্টিং সাইট ব্যবহার করুন
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? (
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
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold mb-3">অবদান পরিসংখ্যান</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-food" />
              <span className="text-xs text-muted-foreground">রেস্তোরাঁ</span>
            </div>
            <p className="text-2xl font-bold">{stats.restaurantsSubmitted}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Hotel className="w-4 h-4 text-hotels" />
              <span className="text-xs text-muted-foreground">হোটেল</span>
            </div>
            <p className="text-2xl font-bold">{stats.hotelsSubmitted}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">মার্কেট</span>
            </div>
            <p className="text-2xl font-bold">{stats.marketsSubmitted}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-travel" />
              <span className="text-xs text-muted-foreground">ভ্রমন গাইড</span>
            </div>
            <p className="text-2xl font-bold">{stats.travelGuidesCreated}</p>
          </Card>
        </div>
      </div>

      {/* Contribution History */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold mb-3">অবদানের ইতিহাস</h3>
        {loadingContributions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : contributions.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">এখনো কোন অবদান নেই</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {contributions.map((item) => (
              <Card key={`${item.type}-${item.id}`} className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTypeName(item.type)} • {item.submittedAt?.toDate?.().toLocaleDateString("bn-BD") || "—"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(item.status)}
                    {item.status === "approved" && (
                      <span className="text-xs font-semibold text-green-600">+{item.points}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tour History */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold mb-3">ট্যুর ইতিহাস</h3>
        {loadingTours ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : tours.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">এখনো কোন ট্যুর নেই</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => navigate("/tour-planner")}
            >
              <MapPin className="w-4 h-4 mr-1" />
              ট্যুর প্ল্যান করুন
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {tours.map((tour) => {
              const totalExpense = tour.expenses.reduce((sum, e) => sum + e.amount, 0);
              const isActive = tour.isActive;
              
              return (
                <Card
                  key={tour.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate("/tour-planner")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-travel/10">
                      <MapPin className="w-4 h-4 text-travel" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{tour.name}</p>
                        {isActive && (
                          <Badge variant="default" className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700">
                            Active
                          </Badge>
                        )}
                        {tour.convertedToGuide && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            Shared
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {tour.startDate ? new Date(tour.startDate).toLocaleDateString("bn-BD") : "—"}
                          {" - "}
                          {tour.endDate ? new Date(tour.endDate).toLocaleDateString("bn-BD") : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Users className="w-3 h-3" />
                        <span>{tour.members.length} জন</span>
                        <span className="mx-1">•</span>
                        <span>৳{totalExpense} খরচ</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-4">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          লগআউট
        </Button>
      </div>
    </div>
  );
}
