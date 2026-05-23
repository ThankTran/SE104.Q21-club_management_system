import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout hiện tại của bạn
import MainLayout from "./components/layout/Navigation/MainLayout";

// Public
import LandingPage from "./pages/Public/LandingPage";
import HomePage    from "./pages/Public/Homepage";

import DashboardPage from "./pages/Dashboard/DashboardPage";;

// Member pages
import MemberAdminPage from "./pages/Member/MemberAdminPage";
import MemberUserPage  from "./pages/Member/MemberUserPage";

// Event pages
import EventUserPage from "./pages/Event/EventUserPage";
import EventAdminPage from "./pages/Event/EventAdminPage";

// Resource pages
import ResourceUserPage from "./pages/Resource/ResourceUserPage";
import ResourceAdminPage from "./pages/Resource/ResourceAdminPage";

// Finance page 
import FinancePage from "./pages/Finance/FinancePage";
import MemberPaymentPage from "./pages/Finance/MemberPaymentPage";
import AccountPage from "./pages/Account/AccountPage";

// Profile page
import ProfilePage from "./pages/Profile/ProfilePage";

// Help page
import HelpPage from "./pages/Help/HelpPage";

// Settings page
import SettingsPage from "./pages/Settings/SettingsPage";

import SigninPage from "./pages/Auth/SigninPage";

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
        <Route path="/signin" element={<SigninPage />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />          
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/memberuser"   element={<MemberUserPage />} />
          <Route path="/memberadmin"  element={<MemberAdminPage />} />
          <Route path="/resourcesuser" element={<ResourceUserPage />} />
          <Route path="/resourcesadmin" element={<ResourceAdminPage />} />      
          <Route path="/eventuser"    element={<EventUserPage />} />
          <Route path="/eventadmin" element={<EventAdminPage />} />
          <Route path="/finance"   element={<FinancePage />} />
          <Route path="/profile"   element={<ProfilePage />} />
          <Route path="/help"      element={<HelpPage />} />
          <Route path="/settings"  element={<SettingsPage />} />
          <Route path="/memberdues" element={<MemberPaymentPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
