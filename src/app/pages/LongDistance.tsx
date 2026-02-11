import { Card } from "../components/ui/card";
import { Bus, Phone, MapPin, Clock, Navigation, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { getLongDistanceBuses } from "../../services/firestoreService";
import type { LongDistanceBus } from "../../types";

export function LongDistance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [buses, setBuses] = useState<LongDistanceBus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuses() {
      setLoading(true);
      const data = await getLongDistanceBuses();
      setBuses(data as LongDistanceBus[]);
      setLoading(false);
    }
    fetchBuses();
  }, []);

  const filteredBuses = buses.filter((bus) => {
    const query = searchQuery.toLowerCase();
    return (
      bus.company.toLowerCase().includes(query) ||
      bus.route.from.toLowerCase().includes(query) ||
      bus.route.to.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-transport to-transport/80 px-6 pt-6 pb-12 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="longdist-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#longdist-pattern)" />
          </svg>
        </div>
        {/* Header Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/header1.svg)' }}
        />

        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">দুরপাল্লা</h1>
            <p className="text-white/90 text-sm">Inter-District Bus Services</p>
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
                      <AvatarFallback className="bg-white/90 text-transport">{getInitials(userData.displayName)}</AvatarFallback>
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
              <Button asChild size="sm" className="bg-white text-transport hover:bg-white/90 shadow-md">
                <Link to="/auth"><LogIn className="mr-2 h-4 w-4" />লগইন</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 -mt-6 mb-6 relative z-10">
        <Card className="p-1 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by company or destination..."
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
              <h3 className="font-semibold text-sm mb-1">{buses.length}+ Bus Companies</h3>
              <p className="text-xs text-muted-foreground">
                Long-distance services across Bangladesh - Check schedules before travel
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bus Services List */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {loading
            ? "Loading..."
            : filteredBuses.length === buses.length
            ? "All Bus Services"
            : `${filteredBuses.length} Service${filteredBuses.length !== 1 ? "s" : ""} Found`}
        </h2>
        <div className="space-y-3">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading bus services...</p>
            </Card>
          ) : filteredBuses.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No bus services found matching your search.</p>
            </Card>
          ) : (
            filteredBuses.map((bus) => (
              <Card key={bus.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-transport/10 flex items-center justify-center flex-shrink-0">
                    <Bus className="w-5 h-5 text-transport" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-2">{bus.company}</h3>

                    {/* Route */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-foreground">
                        {bus.route.from} → {bus.route.to}
                      </p>
                    </div>

                    {/* Fare */}
                    {bus.fare && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-md font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {bus.fare}
                        </span>
                      </div>
                    )}

                    {/* Schedule */}
                    {bus.schedule && (
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{bus.schedule}</span>
                      </div>
                    )}

                    {/* Counter Location */}
                    {bus.counterLocation && (
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{bus.counterLocation}</span>
                      </div>
                    )}

                    {/* Contact */}
                    {bus.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <a
                          href={`tel:${bus.contactNumber}`}
                          className="text-xs text-transport hover:underline"
                        >
                          {bus.contactNumber}
                        </a>
                      </div>
                    )}
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
          Contact numbers and schedules may vary - Please confirm before travel
        </p>
      </div>
    </div>
  );
}
