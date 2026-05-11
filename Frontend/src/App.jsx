import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout hiện tại của bạn
import DashboardLayout from "./components/layout/Navigation/DashboardLayout";

// Public
import LandingPage from "./pages/LandingPage";
import HomePage    from "./pages/HomePage";

// Member pages
import MemberAdminPage from "./pages/MemberAdminPage";
import MemberUserPage  from "./pages/MemberUserPage";

// Event pages
import EventUserPage from "./pages/Event/EventUserPage";
import EventAdminPage from "./pages/Event/EventAdminPage";

// Placeholder cho các trang chưa code
const Placeholder = ({ title }) => (
  <div style={{ padding: "40px 32px" }}>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>
      {title}
    </h1>
    <p style={{ color: "#6b7280", fontSize: 14 }}>
      Trang này đang được phát triển...
    </p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/"     element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="/memberuser"   element={<MemberUserPage />} />
          <Route path="/memberadmin"  element={<MemberAdminPage />} />
          <Route path="/resources" element={<Placeholder title="Resources" />} />
          <Route path="/eventuser"    element={<EventUserPage />} />
          <Route path="/eventadmin" element={<EventAdminPage />} />
          <Route path="/finance"   element={<Placeholder title="Finance" />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}