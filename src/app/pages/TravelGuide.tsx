import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, DollarSign, Building2, Navigation, ChevronDown, Star } from "lucide-react";

interface TravelGuide {
  id: string;
  placeName: string;
  description: string;
  approximateBudget: string;
  budgetDescription: string;
  mustVisitPlaces: string[];
  recommendedHotels: string[];
  howToGo: string;
  lastUpdated: string;
}

export function TravelGuide() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [expandedBudget, setExpandedBudget] = useState<string | null>(null);

  const guides: TravelGuide[] = [
    {
      id: "coxs-bazar",
      placeName: "কক্সবাজার",
      description: "বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকত কক্সবাজার। সূর্যোদয় ও সূর্যাস্তের অপরূপ দৃশ্য, সামুদ্রিক খাবার এবং প্রাকৃতিক সৌন্দর্যের জন্য বিখ্যাত। পরিবার ও বন্ধুদের সাথে ঘুরতে আসার জন্য আদর্শ স্থান।",
      approximateBudget: "৳৫,০০০ - ৳১০,০০০",
      budgetDescription: "বাস ভাড়া (রাউন্ড ট্রিপ): ৳১,৫০০, হোটেল (২ রাত): ৳৩,০০০-৫,০০০, খাবার ও অন্যান্য: ৳২,০০০-৩,৫০০। মোট খরচ ৩ দিন/২ রাতের জন্য।",
      mustVisitPlaces: [
        "কক্সবাজার সমুদ্র সৈকত",
        "ইনানী সৈকত",
        "হিমছড়ি",
        "সোনাদিয়া দ্বীপ",
        "রাডার স্টেশন পয়েন্ট"
      ],
      recommendedHotels: [
        "লং বিচ হোটেল",
        "সি প্যালেস",
        "ওশান প্যারাডাইস"
      ],
      howToGo: "ঢাকা থেকে সরাসরি বাস। শ্যামলী, হানিফ, গ্রিন লাইন পরিবহন উপলব্ধ। যাত্রা সময় প্রায় ১০-১২ ঘন্টা। এসি/নন-এসি উভয় বাস আছে।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "sajek",
      placeName: "সাজেক ভ্যালি",
      description: "বাংলাদেশের ছাদ খ্যাত সাজেক ভ্যালি। মেঘের রাজ্য, পাহাড়ি দৃশ্য এবং আদিবাসী সংস্কৃতির সমন্বয়। প্রকৃতি প্রেমীদের জন্য স্বর্গ। শীতকালে ভ্রমণের জন্য সবচেয়ে ভালো সময়।",
      approximateBudget: "৳৮,০০০ - ৳১৫,০০০",
      budgetDescription: "গাড়ি ভাড়া (শেয়ার বেসিস): ৳২,৫০০, সেনাবাহিনী পারমিট: ৳৫০০, রিসোর্ট (২ রাত): ৳৪,০০০-৯,০০০, খাবার: ৳১,০০০-৩,০০০। ৩ দিন/২ রাতের জন্য।",
      mustVisitPlaces: [
        "কংলাক পাহাড়",
        "সাজেক ভিউ পয়েন্ট",
        "রুইলুই পাড়া",
        "হেলিপ্যাড",
        "কমলক ঝর্ণা"
      ],
      recommendedHotels: [
        "সাজেক রিসোর্ট",
        "রুইলুই রিসোর্ট",
        "মেঘপুঞ্জি কটেজ"
      ],
      howToGo: "ঢাকা/চট্টগ্রাম থেকে খাগড়াছড়ি। খাগড়াছড়ি থেকে চান্দের গাড়িতে সাজেক। সেনাবাহিনীর পারমিট প্রয়োজন। পথে দিঘীনালা বাজার দিয়ে যেতে হয়।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "sundarbans",
      placeName: "সুন্দরবন",
      description: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন এবং রয়েল বেঙ্গল টাইগারের আবাসস্থল। প্রকৃতি ও বন্যপ্রাণী প্রেমীদের জন্য অনন্য অভিজ্ঞতা। নৌকায় ভ্রমণ করে বনের গভীরে যাওয়ার রোমাঞ্চ।",
      approximateBudget: "৳৬,০০০ - ৳১২,০০০",
      budgetDescription: "ঢাকা-খুলনা বাস: ৳৮০০, নৌকা ভাড়া (প্যাকেজ): ৳৪,০০০-৮,০০০, খাবার ও অন্যান্য: ৳১,২০০-৩,২০০। ২ দিন/১ রাতের প্যাকেজ।",
      mustVisitPlaces: [
        "করমজল",
        "কটকা",
        "হিরণ পয়েন্ট (নীলকমল)",
        "দুবলার চর",
        "মান্দারবাড়িয়া"
      ],
      recommendedHotels: [
        "খুলনায় থাকুন - নৌকায় ঘুমানো বেশি রোমাঞ্চকর",
        "হোটেল রয়্যাল ইন্টারন্যাশনাল (খুলনা)",
        "হোটেল ক্যাসেল সালাম (খুলনা)"
      ],
      howToGo: "ঢাকা থেকে খুলনা বাসে। খুলনা থেকে মংলা বন্দর। সেখান থেকে নৌকায় সুন্দরবন। সাধারণত গাইড ও নৌকা প্যাকেজ নিয়ে যাওয়া ভালো।",
      lastUpdated: "Feb 2026"
    },
    {
      id: "sylhet",
      placeName: "সিলেট",
      description: "চা বাগান, হাওর ও পাহাড়ের সৌন্দর্যের শহর সিলেট। জাফলং, রাতারগুল, লালাখাল সহ অসংখ্য প্রাকৃতিক দর্শনীয় স্থান। বর্ষাকালে ভ্রমণের জন্য আদর্শ।",
      approximateBudget: "৳৫,০০০ - ৳৯,০০০",
      budgetDescription: "ঢাকা-সিলেট ট্রেন/বাস: ৳৮০০-১,২০০, হোটেল (২ রাত): ৳২,৫০০-৪,০০০, স্থানীয় ভ্রমণ: ৳১,৭০০-৩,৮০০। ৩ দিন/২ রাতের জন্য।",
      mustVisitPlaces: [
        "রাতারগুল সোয়াম্প ফরেস্ট",
        "জাফলং",
        "লালাখাল",
        "বিছনাকান্দি",
        "হাদারপার হাওর"
      ],
      recommendedHotels: [
        "হোটেল গ্র্যান্ড সিলেট",
        "রোজ ভিউ হোটেল",
        "নাদিয়া রিসোর্ট"
      ],
      howToGo: "ঢাকা থেকে ট্রেন (পারাবত এক্সপ্রেস, উপবন এক্সপ্রেস) অথবা বাসে। যাত্রা সময় ৬-৮ ঘন্টা। সিলেট থেকে স্থানীয় সিএনজি/গাড়ি ভাড়া করে বিভিন্ন স্থান ভ্রমণ।",
      lastUpdated: "Feb 2026"
    }
  ];

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
