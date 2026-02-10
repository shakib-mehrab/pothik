import { Outlet, useLocation, Link } from "react-router";
import { Home, Train, ShoppingBag, MapPin } from "lucide-react";

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "শুচিপত্র", englishLabel: "Home" },
    { path: "/restaurants", icon: MapPin, label: "খাই দাই", englishLabel: "Restaurants" },
    { path: "/markets", icon: ShoppingBag, label: "হাট-বাজার", englishLabel: "Markets" },
    { path: "/planner", icon: MapPin, label: "পর্যটন", englishLabel: "Planner" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border shadow-lg">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
