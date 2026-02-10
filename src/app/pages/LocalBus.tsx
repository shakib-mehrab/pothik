import { Card } from "../components/ui/card";
import { Bus, Clock, MapPin, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { useState } from "react";

interface BusRoute {
  id: string;
  name: string;
  route: {
    from: string;
    to: string;
  };
  hours: string;
  type: "Semi-Seating" | "Seating";
}

export function LocalBus() {
  const [searchQuery, setSearchQuery] = useState("");

  const busRoutes: BusRoute[] = [
    {
      id: "1",
      name: "Achim Paribahan",
      route: { from: "Gabtoli", to: "Demra Staff Quarter" },
      hours: "6:00 AM–11:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "2",
      name: "Active Paribahan",
      route: { from: "Shia Masjid", to: "Abdullahpur" },
      hours: "6:00 AM–10:30 PM",
      type: "Semi-Seating"
    },
    {
      id: "3",
      name: "Agradut",
      route: { from: "Savar", to: "Notun Bazar" },
      hours: "5:30 AM–10:30 PM",
      type: "Semi-Seating"
    },
    {
      id: "4",
      name: "BRTC Route 1",
      route: { from: "Madanpur", to: "Savar" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "5",
      name: "BRTC Route 2",
      route: { from: "Motijheel", to: "Tongi" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "6",
      name: "Balaka",
      route: { from: "Sayapabad", to: "Gazipur Chourasta" },
      hours: "6:00 AM–10:00 PM",
      type: "Seating"
    },
    {
      id: "7",
      name: "Best Satabdi",
      route: { from: "Azimpur", to: "Dia Bari" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "8",
      name: "Dhakar Chaka",
      route: { from: "Banani", to: "Notun Bazar" },
      hours: "6:00 AM–10:00 PM",
      type: "Seating"
    },
    {
      id: "9",
      name: "Green Dhaka",
      route: { from: "Motijheel", to: "Kuril Bishwa Road" },
      hours: "6:00 AM–10:00 PM",
      type: "Seating"
    },
    {
      id: "10",
      name: "Mirpur Metro Services",
      route: { from: "Azimpur", to: "Mirpur 1" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "11",
      name: "Nur E Makka",
      route: { from: "Chiriyakhana", to: "Malibagh Railgate" },
      hours: "5:30 AM–10:30 PM",
      type: "Seating"
    },
    {
      id: "12",
      name: "Trust Transport AC",
      route: { from: "Mirpur DOHS", to: "Kawran Bazar" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "13",
      name: "Welcome",
      route: { from: "Nandan Park", to: "Motijheel" },
      hours: "5:30 AM–10:30 PM",
      type: "Semi-Seating"
    },
    {
      id: "14",
      name: "6 No. (Motijheel-Banani)",
      route: { from: "Kamalapur", to: "Notun Bazar" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    },
    {
      id: "15",
      name: "8 No.",
      route: { from: "Jatrabari", to: "Gabtoli" },
      hours: "6:00 AM–10:00 PM",
      type: "Semi-Seating"
    }
  ];

  const filteredRoutes = busRoutes.filter((route) => {
    const query = searchQuery.toLowerCase();
    return (
      route.name.toLowerCase().includes(query) ||
      route.route.from.toLowerCase().includes(query) ||
      route.route.to.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-transport to-transport/80 px-6 pt-8 pb-12 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bus-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bus-pattern)" />
          </svg>
        </div>

        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">লোকাল বাস</h1>
          <p className="text-white/90 text-sm">City Bus Routes & Services</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 -mt-6 mb-6 relative z-10">
        <Card className="p-1 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by bus name or location..."
              className="pl-10 border-0 focus-visible:ring-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="px-6 mb-6">
        <Card className="bg-gradient-to-r from-transport/20 to-transport/10 border-transport/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-transport/20 flex items-center justify-center flex-shrink-0">
              <Bus className="w-4 h-4 text-transport" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">200+ Bus Services</h3>
              <p className="text-xs text-muted-foreground">
                Data sourced from dhakabusservice.com - Operating hours may vary by situation and route
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bus Routes List */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {filteredRoutes.length === busRoutes.length
            ? "All Bus Services"
            : `${filteredRoutes.length} Service${filteredRoutes.length !== 1 ? "s" : ""} Found`}
        </h2>
        <div className="space-y-3">
          {filteredRoutes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No bus routes found matching your search.</p>
            </Card>
          ) : (
            filteredRoutes.map((route) => (
              <Card key={route.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-transport/10 flex items-center justify-center flex-shrink-0">
                    <Bus className="w-5 h-5 text-transport" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">{route.name}</h3>

                    {/* Route */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-foreground">
                        {route.route.from} → {route.route.to}
                      </p>
                    </div>

                    {/* Operating Hours & Type */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{route.hours}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                          route.type === "Seating"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {route.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-6 pb-8">
        <p className="text-xs text-center text-muted-foreground">
          Want to add more routes?{" "}
          <a
            href="https://dhakabusservice.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-transport hover:underline"
          >
            Visit dhakabusservice.com
          </a>
        </p>
      </div>
    </div>
  );
}
