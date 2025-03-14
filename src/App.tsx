
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import DetailedHistory from "./pages/DetailedHistory";
import Requests from "./pages/Requests";
import TeamPage from "./pages/TeamPage";
import Approvals from "./pages/Approvals";
import AdminPanel from "./pages/AdminPanel";
import SuperAdminPanel from "./pages/SuperAdminPanel";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import { Toaster } from "sonner";

function App() {
  console.log("App component rendering");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><DetailedHistory /></RequireAuth>} />
          <Route path="/requests" element={<RequireAuth><Requests /></RequireAuth>} />
          <Route path="/team" element={<RequireAuth><TeamPage /></RequireAuth>} />
          <Route path="/approvals" element={<RequireAuth><Approvals /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminPanel /></RequireAuth>} />
          <Route path="/superadmin" element={<RequireAuth><SuperAdminPanel /></RequireAuth>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
