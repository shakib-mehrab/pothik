import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Metro } from "./pages/Metro";
import { Markets } from "./pages/Markets";
import { TourPlanner } from "./pages/TourPlanner";
import { Transport } from "./pages/Transport";
import { LocalBus } from "./pages/LocalBus";
import { LongDistance } from "./pages/LongDistance";
import { TrainSchedule } from "./pages/TrainSchedule";
import { TravelGuide } from "./pages/TravelGuide";
import { Hotels } from "./pages/Hotels";
import { Restaurants } from "./pages/Restaurants";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { Leaderboard } from "./pages/Leaderboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { ReviewQueue } from "./pages/admin/ReviewQueue";
import { SeedData } from "./pages/admin/SeedData";
import { withAdminRoute } from "../components/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "auth", Component: Auth },
      { path: "profile", Component: Profile },
      { path: "leaderboard", Component: Leaderboard },
      { path: "transport", Component: Transport },
      { path: "metro", Component: Metro },
      { path: "local-bus", Component: LocalBus },
      { path: "long-distance", Component: LongDistance },
      { path: "train", Component: TrainSchedule },
      { path: "markets", Component: Markets },
      { path: "planner", Component: TourPlanner },
      { path: "travel-guide", Component: TravelGuide },
      { path: "hotels", Component: Hotels },
      { path: "restaurants", Component: Restaurants },
      { path: "admin", Component: withAdminRoute(AdminDashboard) },
      { path: "admin/review-queue", Component: withAdminRoute(ReviewQueue) },
      { path: "admin/seed-data", Component: withAdminRoute(SeedData) },
    ],
  },
]);
