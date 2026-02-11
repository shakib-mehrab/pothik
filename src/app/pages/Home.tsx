import React from 'react';
import { Link, useNavigate } from "react-router";
import { Search, Train, ShoppingBag, MapPin, Building2, BookOpen, LogIn, User, LogOut, Shield } from "lucide-react";
import { Input } from "../components/ui/input";
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

export function Home() {
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

  const quickAccessTiles = [
    {
      path: "/transport",
      icon: Train,
      title: "যাতায়াত",
      subtitle: "কোথায় যাবো? কেমনে যাবো?",
      color: "bg-transport text-transport-foreground"
    },
    {
      path: "/markets",
      icon: ShoppingBag,
      title: "হাট-বাজার",
      subtitle: "কোথায় গেলে কি পাবো?",
      color: "bg-accent text-accent-foreground"
    },
    {
      path: "/restaurants",
      icon: MapPin,
      title: "খাই দাই",
      subtitle: "কোথায় কি খাওয়া যায়?",
      color: "bg-food text-food-foreground"
    },
    {
      path: "/planner",
      icon: MapPin,
      title: "ঘুরতে যাই",
      subtitle: "চলোনা ঘুরে আসি...",
      color: "bg-travel text-travel-foreground"
    },
    {
      path: "/hotels",
      icon: Building2,
      title: "হোটেল / রিসোর্ট",
      subtitle: "কই থাকা যায়?",
      color: "bg-hotels text-hotels-foreground"
    },
    {
      path: "/travel-guide",
      icon: BookOpen,
      title: "ভ্রমন গাইড",
      subtitle: "জানো, বুঝো, ঘুরো!",
      color: "bg-accent text-accent-foreground"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Rickshaw Art Pattern */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-12 relative overflow-hidden">
        {/* Header Image - Full Cover */}
        <div className="absolute inset-0 bg-cover bg-center opacity-60 header-image-0" />

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rickshaw-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rickshaw-pattern)" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">পথিক</h1>
            <p className="text-white/90 text-sm">Your Bangladesh Travel Companion</p>
          </div>
          
          {/* Auth Button/Avatar */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            ) : currentUser && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage
                        src={userData.photoURL || ""}
                        alt={userData.displayName}
                      />
                      <AvatarFallback className="bg-white/90 text-primary">
                        {getInitials(userData.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData.email}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Points:
                        </span>
                        <span className="text-xs font-semibold text-primary">
                          {userData.contributionPoints}
                        </span>
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
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>লগ আউট</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 shadow-md">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  লগইন
                </Link>
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
              placeholder="Search stations, markets, hotels..."
              className="pl-10 border-0 focus-visible:ring-0 bg-transparent"
            />
          </div>
        </Card>
      </div>

      {/* Quick Access Tiles */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickAccessTiles.map((tile) => {
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

      {/* Popular Routes */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Popular Metro Routes</h2>
        <div className="space-y-3">
          {[
            { from: "Uttara North", to: "Motijheel", time: "32 min" },
            { from: "Agargaon", to: "Kamalapur", time: "18 min" },
            { from: "Farmgate", to: "Bangladesh Secretariat", time: "8 min" },
          ].map((route, idx) => (
            <Card key={idx} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Train className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{route.from} → {route.to}</p>
                  <p className="text-xs text-muted-foreground">{route.time} journey</p>
                </div>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                View
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 mb-8">
        <Card className="bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-xl">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Verified by Pathik</h3>
              <p className="text-xs text-muted-foreground">
                All data is manually curated and updated by our community of travelers
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
