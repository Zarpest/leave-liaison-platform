
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Requests from "./pages/Requests";
import TeamPage from "./pages/TeamPage";
import Approvals from "./pages/Approvals";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import DetailedHistory from "./pages/DetailedHistory";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
            <Route path="/requests" element={<RequireAuth><Requests /></RequireAuth>} />
            <Route path="/requests/:id" element={<RequireAuth><DetailedHistory /></RequireAuth>} />
            <Route path="/team" element={<RequireAuth><TeamPage /></RequireAuth>} />
            <Route path="/approvals" element={<RequireAuth><Approvals /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><AdminPanel /></RequireAuth>} />
            
            {/* Ruta no encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
