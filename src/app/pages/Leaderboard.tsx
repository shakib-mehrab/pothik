import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Trophy, Crown, Medal, Star, Utensils, Hotel, ShoppingBag, MapPin, LogIn, User, LogOut, Shield, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "../../services/authService";
import { getTopContributorsExcludingAdmins } from "../../services/leaderboardService";
import { LeaderboardEntry } from "../../types";

export function Leaderboard() {
  const { currentUser, userData, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [topContributors, setTopContributors] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const contributors = await getTopContributorsExcludingAdmins(50);
        setTopContributors(contributors);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          {getRankIcon(rank)}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
        <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
      </div>
    );
  };

  const getContributionIcon = (type: string) => {
    switch (type) {
      case "restaurants":
        return <Utensils className="w-3 h-3" />;
      case "hotels":
        return <Hotel className="w-3 h-3" />;
      case "markets":
        return <ShoppingBag className="w-3 h-3" />;
      case "travelGuides":
        return <MapPin className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="header-pattern-leaderboard" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-pattern-leaderboard)" />
          </svg>
        </div>
        <div className="relative flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Community Leaderboard</h1>
            <p className="text-white/90 text-sm">Top Contributors of Pothik</p>
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
                      <AvatarFallback className="bg-white/90 text-primary">{getInitials(userData.displayName)}</AvatarFallback>
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
              <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 shadow-md">
                <Link to="/auth"><LogIn className="mr-2 h-4 w-4" />লগইন</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="px-4 pt-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : topContributors.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">No contributors yet</p>
            <p className="text-sm text-muted-foreground">Be the first to contribute and earn points!</p>
          </Card>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topContributors.length >= 3 && (
              <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <h2 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Top 3 Contributors
                </h2>
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  {topContributors[1] && (
                    <div className="flex flex-col items-center flex-1">
                      <Medal className="w-8 h-8 text-gray-400 mb-2" />
                      <Avatar className="h-16 w-16 border-2 border-gray-400 mb-2">
                        <AvatarImage src={topContributors[1].photoURL || ""} alt={topContributors[1].displayName} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                          {getInitials(topContributors[1].displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm text-center truncate w-full">{topContributors[1].displayName}</p>
                      <p className="text-xs font-bold text-primary">{topContributors[1].totalPoints} pts</p>
                    </div>
                  )}
                  {/* 1st Place */}
                  {topContributors[0] && (
                    <div className="flex flex-col items-center flex-1 -mt-4">
                      <Crown className="w-10 h-10 text-yellow-500 mb-2" />
                      <Avatar className="h-20 w-20 border-4 border-yellow-500 mb-2">
                        <AvatarImage src={topContributors[0].photoURL || ""} alt={topContributors[0].displayName} />
                        <AvatarFallback className="bg-yellow-50 text-yellow-700 text-base">
                          {getInitials(topContributors[0].displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-bold text-base text-center truncate w-full">{topContributors[0].displayName}</p>
                      <p className="text-sm font-bold text-primary">{topContributors[0].totalPoints} pts</p>
                    </div>
                  )}
                  {/* 3rd Place */}
                  {topContributors[2] && (
                    <div className="flex flex-col items-center flex-1">
                      <Medal className="w-8 h-8 text-amber-600 mb-2" />
                      <Avatar className="h-16 w-16 border-2 border-amber-600 mb-2">
                        <AvatarImage src={topContributors[2].photoURL || ""} alt={topContributors[2].displayName} />
                        <AvatarFallback className="bg-amber-50 text-amber-700 text-sm">
                          {getInitials(topContributors[2].displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm text-center truncate w-full">{topContributors[2].displayName}</p>
                      <p className="text-xs font-bold text-primary">{topContributors[2].totalPoints} pts</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Full Leaderboard List */}
            <div className="space-y-2">
              {topContributors.map((contributor) => {
                const isCurrentUser = currentUser?.uid === contributor.uid;
                return (
                  <Card
                    key={contributor.uid}
                    className={`p-4 ${isCurrentUser ? 'bg-primary/5 border-primary/30 border-2' : ''} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankBadge(contributor.rank)}
                      </div>

                      {/* Avatar & Name */}
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={contributor.photoURL || ""} alt={contributor.displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(contributor.displayName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{contributor.displayName}</p>
                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">You</Badge>
                          )}
                        </div>
                        
                        {/* Contribution Breakdown */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {contributor.breakdown.restaurants > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-food/10 text-food border-food/30 flex items-center gap-1">
                              <Utensils className="w-2.5 h-2.5" />
                              {contributor.breakdown.restaurants}
                            </Badge>
                          )}
                          {contributor.breakdown.hotels > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-hotels/10 text-hotels border-hotels/30 flex items-center gap-1">
                              <Hotel className="w-2.5 h-2.5" />
                              {contributor.breakdown.hotels}
                            </Badge>
                          )}
                          {contributor.breakdown.markets > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/30 flex items-center gap-1">
                              <ShoppingBag className="w-2.5 h-2.5" />
                              {contributor.breakdown.markets}
                            </Badge>
                          )}
                          {contributor.breakdown.travelGuides > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-travel/10 text-travel border-travel/30 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {contributor.breakdown.travelGuides}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-primary">{contributor.totalPoints}</span>
                        <span className="text-xs text-muted-foreground">points</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Points Info */}
            <Card className="p-4 bg-muted/50 mt-6">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                How to Earn Points
              </h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Submit a Restaurant/Hotel/Market: +10 points (when approved)</p>
                <p>• Create a Travel Guide: +15 points</p>
                <p>• Keep contributing to climb the leaderboard!</p>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
