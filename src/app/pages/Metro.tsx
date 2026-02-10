import { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { ChevronDown, MapPin, Clock, Edit, Trash2, Plus } from "lucide-react";

interface MetroStation {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  gates: {
    name: string;
    exitTo: string;
    landmarks: string[];
  }[];
  fare: string;
  lastUpdated: string;
}

export function Metro() {
  const [openStation, setOpenStation] = useState<string | null>(null);

  const stations: MetroStation[] = [
    {
      id: "uttara-north",
      nameBangla: "উত্তরা উত্তর",
      nameEnglish: "Uttara North",
      gates: [
        {
          name: "Gate A",
          exitTo: "Jasimuddin Avenue",
          landmarks: ["Rajlakshmi Complex", "Uttara Sector 3"]
        },
        {
          name: "Gate B",
          exitTo: "Airport Road",
          landmarks: ["Uttara Market", "House Building"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "uttara-center",
      nameBangla: "উত্তরা কেন্দ্র",
      nameEnglish: "Uttara Center",
      gates: [
        {
          name: "Gate A",
          exitTo: "Sonargaon Janapath",
          landmarks: ["Mascot Plaza", "Uttara Sector 7"]
        },
        {
          name: "Gate B",
          exitTo: "Azampur Road",
          landmarks: ["Family World", "Diabari"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "uttara-south",
      nameBangla: "উত্তরা দক্ষিণ",
      nameEnglish: "Uttara South",
      gates: [
        {
          name: "Gate A",
          exitTo: "Jashimuddin Road",
          landmarks: ["Passport Office", "Sector 13"]
        },
        {
          name: "Gate B",
          exitTo: "Airport Road",
          landmarks: ["Radisson Blu", "Le Meridien"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "pallabi",
      nameBangla: "পল্লবী",
      nameEnglish: "Pallabi",
      gates: [
        {
          name: "Gate A",
          exitTo: "Mirpur Road",
          landmarks: ["Pallabi Bazar", "Mirpur 11"]
        },
        {
          name: "Gate B",
          exitTo: "Begum Rokeya Sarani",
          landmarks: ["Rupnagar", "Pallabi Police Station"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "mirpur-11",
      nameBangla: "মিরপুর-১১",
      nameEnglish: "Mirpur-11",
      gates: [
        {
          name: "Gate A",
          exitTo: "Mirpur Road",
          landmarks: ["Mirpur 11 Bus Stand", "Shewrapara"]
        },
        {
          name: "Gate B",
          exitTo: "Eastern Road",
          landmarks: ["Kazipara", "Local Market"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "agargaon",
      nameBangla: "আগারগাঁও",
      nameEnglish: "Agargaon",
      gates: [
        {
          name: "Gate A",
          exitTo: "Bir Uttam Mir Shawkat Sarak",
          landmarks: ["Sher-e-Bangla Nagar", "BTCL Bhaban"]
        },
        {
          name: "Gate B",
          exitTo: "Agargaon Road",
          landmarks: ["Taltola Market", "Mohakhali"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "farmgate",
      nameBangla: "ফার্মগেট",
      nameEnglish: "Farmgate",
      gates: [
        {
          name: "Gate A",
          exitTo: "Kazi Nazrul Islam Avenue",
          landmarks: ["Farmgate Bazar", "Karwan Bazar"]
        },
        {
          name: "Gate B",
          exitTo: "Tejgaon Link Road",
          landmarks: ["Tejgaon", "Mohakhali Flyover"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "kawran-bazar",
      nameBangla: "কারওয়ান বাজার",
      nameEnglish: "Kawran Bazar",
      gates: [
        {
          name: "Gate A",
          exitTo: "Kawran Bazar",
          landmarks: ["Wholesale Market", "TV Stations"]
        },
        {
          name: "Gate B",
          exitTo: "Panthapath",
          landmarks: ["Bashundhara City", "Sonargaon Hotel"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "shahbag",
      nameBangla: "শাহবাগ",
      nameEnglish: "Shahbag",
      gates: [
        {
          name: "Gate A",
          exitTo: "Shahbag Square",
          landmarks: ["Dhaka University", "National Museum"]
        },
        {
          name: "Gate B",
          exitTo: "Elephant Road",
          landmarks: ["Birdem Hospital", "Bangla Academy"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "dhaka-university",
      nameBangla: "ঢাকা বিশ্ববিদ্যালয়",
      nameEnglish: "Dhaka University",
      gates: [
        {
          name: "Gate A",
          exitTo: "TSC Area",
          landmarks: ["Teacher-Student Centre", "Arts Faculty"]
        },
        {
          name: "Gate B",
          exitTo: "Secretariat Road",
          landmarks: ["Curzon Hall", "Jagannath Hall"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "bangladesh-secretariat",
      nameBangla: "বাংলাদেশ সচিবালয়",
      nameEnglish: "Bangladesh Secretariat",
      gates: [
        {
          name: "Gate A",
          exitTo: "Secretariat Road",
          landmarks: ["Government Offices", "Parliament Area"]
        },
        {
          name: "Gate B",
          exitTo: "Topkhana Road",
          landmarks: ["High Court", "Supreme Court"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "motijheel",
      nameBangla: "মতিঝিল",
      nameEnglish: "Motijheel",
      gates: [
        {
          name: "Gate A",
          exitTo: "Motijheel C/A",
          landmarks: ["Bangladesh Bank", "Press Club"]
        },
        {
          name: "Gate B",
          exitTo: "Dilkusha",
          landmarks: ["GPO", "Purana Paltan"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    },
    {
      id: "kamalapur",
      nameBangla: "কমলাপুর",
      nameEnglish: "Kamalapur",
      gates: [
        {
          name: "Gate A",
          exitTo: "Railway Station",
          landmarks: ["Kamalapur Railway Station", "Bus Terminal"]
        },
        {
          name: "Gate B",
          exitTo: "Malibagh",
          landmarks: ["Malibagh Chowdhurypara", "Moghbazar"]
        }
      ],
      fare: "৳20 - ৳100",
      lastUpdated: "Feb 2026"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">মেট্রো নাম</h1>
            <p className="text-white/90 text-sm">Metro Station Guide & Exit Gates</p>
          </div>
          <Button 
            size="sm" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => alert('Add new station (feature coming soon!)')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Station List */}
      <div className="px-4 pt-6 space-y-3">
        {stations.map((station, index) => (
          <Card key={station.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Collapsible
              open={openStation === station.id}
              onOpenChange={(isOpen) => setOpenStation(isOpen ? station.id : null)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Station Number */}
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Station Info */}
                    <div className="text-left">
                      <h3 className="font-semibold">{station.nameBangla}</h3>
                      <p className="text-sm text-muted-foreground">{station.nameEnglish}</p>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openStation === station.id ? "rotate-180" : ""
                    }`} 
                  />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 pt-2 border-t border-border/50">
                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-primary border-primary/30 hover:bg-primary/10"
                      onClick={() => alert('Edit station details (feature coming soon!)')}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => alert('Delete station (feature coming soon!)')}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {/* Fare Info */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      Fare: {station.fare}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated: {station.lastUpdated}
                    </div>
                  </div>

                  {/* Exit Gates */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Exit Gates
                    </h4>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs text-primary"
                      onClick={() => alert('Add new gate (feature coming soon!)')}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Gate
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {station.gates.map((gate) => (
                      <div key={gate.name} className="bg-muted/30 rounded-lg p-3 relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                            onClick={() => alert('Edit gate (feature coming soon!)')}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                            onClick={() => alert('Delete gate (feature coming soon!)')}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {gate.name}
                          </Badge>
                          <span className="text-sm font-medium">{gate.exitTo}</span>
                        </div>
                        <div className="pl-2">
                          <p className="text-xs text-muted-foreground mb-1">Nearby:</p>
                          <div className="flex flex-wrap gap-1">
                            {gate.landmarks.map((landmark, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-white px-2 py-1 rounded-md border border-border"
                              >
                                {landmark}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verified Badge */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium inline-flex items-center gap-1">
                      ✓ Verified by Pathik
                    </span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}