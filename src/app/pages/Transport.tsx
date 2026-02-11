import { Link, useNavigate } from "react-router";
import { Train, Bus, Navigation, LogIn, User, LogOut, Shield } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "../../services/authService";

export function Transport() {
  const { currentUser, userData, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const transportTiles = [
    {
      path: "/metro",
      icon: Train,
      title: "ঢাকা মেট্রো",
      subtitle: "স্টেশন ও গেট তথ্য",
      color: "bg-transport text-transport-foreground"
    },
    {
      path: "/local-bus",
      icon: Bus,
      title: "লোকাল বাস",
      subtitle: "শহরের বাস রুট",
      color: "bg-transport text-transport-foreground"
    },
    {
      path: "/long-distance",
      icon: Navigation,
      title: "দুরপাল্লা",
      subtitle: "আন্তঃজেলা বাস",
      color: "bg-transport text-transport-foreground"
    },
    {
      path: "/train",
      icon: Train,
      title: "ট্রেন",
      subtitle: "রেলওয়ে সময়সূচী",
      color: "bg-transport text-transport-foreground"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with transport theme */}
      <div className="bg-gradient-to-br from-transport to-transport/80 px-6 pt-6 pb-16 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="transport-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#transport-pattern)" />
          </svg>
        </div>
        {/* Header Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/header1.svg)' }}
        />

        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">যাতায়াত</h1>
            <p className="text-white/90 text-sm">Transportation Options in Bangladesh</p>
          </div>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            ) : currentUser && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage src={userData.photoURL || ""} alt={userData.displayName} />
                      <AvatarFallback className="bg-white/90 text-transport">
                        {getInitials(userData.displayName)}
                      </AvatarFallback>
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
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>প্রোফাইল</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>লগ আউট</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-white text-transport hover:bg-white/90 shadow-md">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  লগইন
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Transport Options Grid */}
      <div className="px-6 mt-5 mb-5 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {transportTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link key={tile.path} to={tile.path}>
                <Card className={`p-5 ${tile.color} shadow-md hover:shadow-lg transition-all cursor-pointer rounded-xl`}>
                  <Icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-1">{tile.title}</h3>
                  <p className="text-xs opacity-90">{tile.subtitle}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 mb-8">
        <Card className="bg-gradient-to-r from-transport/20 to-transport/10 border-transport/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-transport/20 flex items-center justify-center flex-shrink-0">
              <span className="text-transport text-xl">🚌</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Real-time Information</h3>
              <p className="text-xs text-muted-foreground">
                Find routes, schedules, and fares for all transport options in Bangladesh
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
