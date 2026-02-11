import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Users,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Utensils,
  Hotel,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { getPendingSubmissions } from "../../../services/firestoreService";
import { useAuth } from "../../../contexts/AuthContext";

export function AdminDashboard() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState({
    restaurants: 0,
    hotels: 0,
    markets: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const allPending = await getPendingSubmissions();

        const restaurants = allPending.filter((item: any) => item.bestItem !== undefined);
        const hotels = allPending.filter(
          (item: any) => item.coupleFriendly !== undefined
        );
        const markets = allPending.filter((item: any) => item.specialty !== undefined);

        setPendingCount({
          restaurants: restaurants.length,
          hotels: hotels.length,
          markets: markets.length,
          total: allPending.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Pending Submissions",
      value: pendingCount.total,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Restaurants",
      value: pendingCount.restaurants,
      icon: Utensils,
      color: "text-food",
      bgColor: "bg-food/10",
    },
    {
      title: "Hotels & Resorts",
      value: pendingCount.hotels,
      icon: Hotel,
      color: "text-hotels",
      bgColor: "bg-hotels/10",
    },
    {
      title: "Markets",
      value: pendingCount.markets,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const quickActions = [
    {
      title: "Review Queue",
      description: "Approve or reject pending submissions",
      icon: FileCheck,
      link: "/admin/review-queue",
      badge: pendingCount.total,
    },
    {
      title: "Seed Data",
      description: "Import sample data for testing",
      icon: MapPin,
      link: "/admin/seed-data",
    },
    {
      title: "Leaderboard",
      description: "View top contributors",
      icon: Trophy,
      link: "/leaderboard",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-white/90 text-sm">
          Welcome back, {userData?.displayName}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pt-6 pb-4">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.link}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{action.title}</h3>
                        {action.badge !== undefined && action.badge > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold mb-4">System Status</h2>
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Firebase Connected</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Authentication</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Firestore Database</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
