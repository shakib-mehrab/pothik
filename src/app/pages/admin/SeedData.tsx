import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAuth } from "../../../contexts/AuthContext";

export function SeedData() {
  const { currentUser } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const sampleRestaurants = [
    {
      name: "সুলতানস ডাইন",
      location: "ধানমন্ডি ২, ঢাকা",
      howToGo: "মেট্রো: শাহবাগ, রিকশা/উবার",
      bestItem: "কাচ্চি বিরিয়ানি, টেহারি",
      reviews: "ভালো মানের কাচ্চি। দাম একটু বেশি কিন্তু স্বাদ ভালো।",
      status: "approved",
      lastUpdated: "Feb 2026",
    },
    {
      name: "হাজী বিরিয়ানি",
      location: "নাজিরাবাজার, পুরান ঢাকা",
      howToGo: "বাস: গুলিস্তান, রিকশা",
      bestItem: "মটন বিরিয়ানি, বোরহানি",
      reviews: "পুরান ঢাকার বিখ্যাত বিরিয়ানি। লাইন থাকে প্রায়ই।",
      status: "approved",
      lastUpdated: "Feb 2026",
    },
  ];

  const sampleHotels = [
    {
      name: "হোটেল ৬১",
      location: "উত্তরা, সেক্টর ৩, ঢাকা",
      howToGo: "মেট্রো: উত্তরা সেন্টার স্টেশন, হেঁটে ৫ মিনিট",
      coupleFriendly: true,
      documentsNeeded: ["এনআইডি"],
      facebookPage: "facebook.com/hotel61",
      reviews: "পরিষ্কার রুম, ভালো সার্ভিস। বাজেট হোটেলের জন্য দুর্দান্ত।",
      category: "hotel",
      status: "approved",
      lastUpdated: "Feb 2026",
    },
  ];

  const sampleMarkets = [
    {
      name: "বসুন্ধরা সিটি",
      location: "Panthapath, Dhaka",
      howToGo: "মেট্রো: কারওয়ান বাজার স্টেশন, বাস: Panthapath",
      specialty: ["ফ্যাশন", "ইলেকট্রনিক্স", "ফুড কোর্ট"],
      reviews: "দক্ষিণ এশিয়ার বৃহত্তম শপিং মল",
      category: "brands",
      status: "approved",
      lastUpdated: "Feb 2026",
    },
    {
      name: "নিউ মার্কেট",
      location: "Azimpur, Dhaka",
      howToGo: "মেট্রো: শাহবাগ/ঢাকা বিশ্ববিদ্যালয়, বাস: Azimpur",
      specialty: ["পোশাক", "জুতা", "শাড়ি"],
      reviews: "ঢাকার পুরাতন শপিং গন্তব্য",
      category: "local",
      status: "approved",
      lastUpdated: "Feb 2026",
    },
  ];

  const handleSeedData = async () => {
    if (!currentUser) return;

    try {
      setSeeding(true);
      setResult(null);

      let success = 0;
      let failed = 0;

      // Seed restaurants
      for (const restaurant of sampleRestaurants) {
        try {
          await addDoc(collection(db, "restaurants"), {
            ...restaurant,
            submittedBy: currentUser.uid,
            submittedAt: serverTimestamp(),
          });
          success++;
        } catch (error) {
          console.error("Error adding restaurant:", error);
          failed++;
        }
      }

      // Seed hotels
      for (const hotel of sampleHotels) {
        try {
          await addDoc(collection(db, "hotels"), {
            ...hotel,
            submittedBy: currentUser.uid,
            submittedAt: serverTimestamp(),
          });
          success++;
        } catch (error) {
          console.error("Error adding hotel:", error);
          failed++;
        }
      }

      // Seed markets
      for (const market of sampleMarkets) {
        try {
          await addDoc(collection(db, "markets"), {
            ...market,
            submittedBy: currentUser.uid,
            submittedAt: serverTimestamp(),
          });
          success++;
        } catch (error) {
          console.error("Error adding market:", error);
          failed++;
        }
      }

      setResult({
        success: true,
        message: `Successfully seeded ${success} items. ${
          failed > 0 ? `Failed: ${failed}` : ""
        }`,
      });
    } catch (error) {
      console.error("Error seeding data:", error);
      setResult({
        success: false,
        message: "Failed to seed data. Please try again.",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">Seed Data</h1>
        <p className="text-white/90 text-sm">
          Import sample data for testing
        </p>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-4">
        {/* Info Card */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will add sample restaurants, hotels, and markets to your
            database. All items will be marked as approved.
          </AlertDescription>
        </Alert>

        {/* Sample Data Preview */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Sample Data Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Restaurants:</span>
              <Badge variant="secondary">{sampleRestaurants.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Hotels:</span>
              <Badge variant="secondary">{sampleHotels.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Markets:</span>
              <Badge variant="secondary">{sampleMarkets.length}</Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total:</span>
                <Badge>
                  {sampleRestaurants.length +
                    sampleHotels.length +
                    sampleMarkets.length}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Seed Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSeedData}
          disabled={seeding}
        >
          {seeding ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Seeding data...
            </>
          ) : (
            <>
              <Database className="w-5 h-5 mr-2" />
              Seed Database
            </>
          )}
        </Button>

        {/* Result Alert */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        {/* Warning */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> This operation will add new data to your
            database. Make sure you're running this in a development or test
            environment.
          </p>
        </Card>
      </div>
    </div>
  );
}
