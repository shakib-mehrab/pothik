import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { PWAPrompt } from "../components/PWAPrompt";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
      <PWAPrompt />
    </AuthProvider>
  );
}
