import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { CheckCircle, XCircle, Loader2, MapPin, Utensils, Hotel, ShoppingBag } from "lucide-react";
import { getPendingSubmissions } from "../../../services/firestoreService";
import { doc, updateDoc, serverTimestamp, increment, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAuth } from "../../../contexts/AuthContext";

type SubmissionType = "all" | "restaurant" | "hotel" | "market";

interface PendingItem {
  id: string;
  name: string;
  location: string;
  submittedBy: string;
  submittedAt: any;
  type: string;
  [key: string]: any;
}

export function ReviewQueue() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SubmissionType>("all");
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<PendingItem[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const type = activeTab === "all" ? undefined : activeTab;
      const data: any = await getPendingSubmissions(type as any);

      // Add type field to each submission
      const typedData = data.map((item: any) => {
        let itemType = "unknown";
        if (item.bestItem !== undefined) itemType = "restaurant";
        else if (item.coupleFriendly !== undefined) itemType = "hotel";
        else if (item.specialty !== undefined) itemType = "market";

        return { ...item, type: itemType };
      });

      setSubmissions(typedData);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: PendingItem) => {
    if (!currentUser) return;

    try {
      setProcessing(item.id);

      // Determine collection name
      let collectionName = "restaurants";
      if (item.type === "hotel") collectionName = "hotels";
      else if (item.type === "market") collectionName = "markets";

      // Update submission status
      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, {
        status: "approved",
        reviewedBy: currentUser.uid,
        reviewedAt: serverTimestamp(),
      });

      // Update user stats
      const userRef = doc(db, "users", item.submittedBy);
      const statField = `stats.${collectionName}Submitted`;
      await updateDoc(userRef, {
        [statField]: increment(1),
        "stats.approvedSubmissions": increment(1),
        contributionPoints: increment(10),
        updatedAt: serverTimestamp(),
      });

      // Update leaderboard
      const leaderboardRef = doc(db, "leaderboard", item.submittedBy);
      await updateDoc(leaderboardRef, {
        totalPoints: increment(10),
        [`breakdown.${collectionName}`]: increment(1),
        updatedAt: serverTimestamp(),
      }).catch(async () => {
        // If leaderboard entry doesn't exist, create it
        const userDoc = await getDoc(doc(db, "users", item.submittedBy));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await setDoc(leaderboardRef, {
            displayName: userData.displayName,
            photoURL: userData.photoURL || "",
            totalPoints: 10,
            breakdown: {
              restaurants: collectionName === "restaurants" ? 1 : 0,
              hotels: collectionName === "hotels" ? 1 : 0,
              markets: collectionName === "markets" ? 1 : 0,
              travelGuides: 0,
            },
            updatedAt: serverTimestamp(),
          });
        }
      });

      // Refresh list
      fetchSubmissions();
      alert("সফলভাবে অনুমোদিত হয়েছে!");
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("অনুমোদন করতে সমস্যা হয়েছে।");
    } finally {
      setProcessing(null);
    }
  };

  const openRejectDialog = (item: PendingItem) => {
    setSelectedItem(item);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedItem || !currentUser || !rejectionReason.trim()) return;

    try {
      setProcessing(selectedItem.id);

      // Determine collection name
      let collectionName = "restaurants";
      if (selectedItem.type === "hotel") collectionName = "hotels";
      else if (selectedItem.type === "market") collectionName = "markets";

      // Update submission status
      const itemRef = doc(db, collectionName, selectedItem.id);
      await updateDoc(itemRef, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        reviewedBy: currentUser.uid,
        reviewedAt: serverTimestamp(),
      });

      // Refresh list
      fetchSubmissions();
      setIsRejectDialogOpen(false);
      alert("প্রত্যাখ্যান করা হয়েছে।");
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert("প্রত্যাখ্যান করতে সমস্যা হয়েছে।");
    } finally {
      setProcessing(null);
      setSelectedItem(null);
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
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "text-food bg-food/10";
      case "hotel":
        return "text-hotels bg-hotels/10";
      case "market":
        return "text-primary bg-primary/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">Review Queue</h1>
        <p className="text-white/90 text-sm">
          Approve or reject pending submissions
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-[104px] z-10 bg-background px-4 pt-6 pb-3">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as SubmissionType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-muted h-auto">
            <TabsTrigger
              value="all"
              className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All ({submissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="restaurant"
              className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Restaurants
            </TabsTrigger>
            <TabsTrigger
              value="hotel"
              className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Hotels
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Markets
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Submissions List */}
      <div className="px-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No pending submissions</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissions.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                    {item.bestItem && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Best: {item.bestItem}
                      </p>
                    )}
                    {item.specialty && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.specialty.slice(0, 3).map((s: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(item)}
                    disabled={processing === item.id}
                  >
                    {processing === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => openRejectDialog(item)}
                    disabled={processing === item.id}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for rejection:
            </p>
            <Textarea
              placeholder="যেমন: তথ্য অসম্পূর্ণ, ভুল তথ্য, ডুপ্লিকেট..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || processing !== null}
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
