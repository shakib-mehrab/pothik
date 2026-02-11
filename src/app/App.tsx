import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
