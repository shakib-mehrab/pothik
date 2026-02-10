import { Link } from "react-router";
import { Train, Bus, Navigation } from "lucide-react";
import { Card } from "../components/ui/card";

export function Transport() {
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
      <div className="bg-gradient-to-br from-transport to-transport/80 px-6 pt-8 pb-16 relative overflow-hidden">
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

        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">যাতায়াত</h1>
          <p className="text-white/90 text-sm">Transportation Options in Bangladesh</p>
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
