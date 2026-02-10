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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "transport", Component: Transport },
      { path: "metro", Component: Metro },
      { path: "local-bus", Component: LocalBus },
      { path: "long-distance", Component: LongDistance },
      { path: "train", Component: TrainSchedule },
      { path: "markets", Component: Markets },
      { path: "planner", Component: TourPlanner },
      { path: "travel-guide", Component: TravelGuide },
    ],
  },
]);
