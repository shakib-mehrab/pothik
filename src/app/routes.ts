import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Metro } from "./pages/Metro";
import { Markets } from "./pages/Markets";
import { TourPlanner } from "./pages/TourPlanner";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "metro", Component: Metro },
      { path: "markets", Component: Markets },
      { path: "planner", Component: TourPlanner },
    ],
  },
]);
