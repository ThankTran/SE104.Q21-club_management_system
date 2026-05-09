// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import PublicLayout from "./components/layout/Navigation/PublicLayout";
// import DashboardLayout from "./components/layout/Navigation/DashboardLayout";

// import Signin from "./pages/SigninPage";
// import SignupPage from "./pages/SignupPage";
// import Homepage from "./pages/Homepage";
// import Aboutpage from "./pages/Aboutpage";
// import DashboardPage from "./pages/DashboardPage";
// import MemberUserPage from "./pages/MemberUserPage";
// import MemberAdminPage from "./pages/MemberAdminPage";

// import useAuthStore from "./store/auth-store";

// // ── Protected Route ──────────────────────────────────────────
// // Chặn route nếu chưa đăng nhập
// function ProtectedRoute({ children }) {
//   const { isLoggedIn } = useAuthStore();
//   if (!isLoggedIn) return <Navigate to="/login" replace />;
//   return children;
// }

// // ── Member Route ─────────────────────────────────────────────
// // Tự động chọn Admin hay User page dựa vào role
// function MemberRoute() {
//   const { user } = useAuthStore();
//   const isAdmin = user?.role === "admin";
//   return isAdmin ? <MemberAdminPage /> : <MemberUserPage />;
// }

// // ── App ──────────────────────────────────────────────────────
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* ── Public Layout ── */}
//         <Route element={<PublicLayout />}>
//           <Route path="/"       element={<Homepage />} />
//           <Route path="/home"   element={<Homepage />} />
//           <Route path="/about"  element={<Aboutpage />} />
//           <Route path="/login"  element={<Signin />} />
//           <Route path="/signup" element={<SignupPage />} />
//         </Route>

//         {/* ── Dashboard Layout (protected) ── */}
//         <Route
//           element={
//             <ProtectedRoute>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/dashboard" element={<DashboardPage />} />

//           {/* Route trực tiếp để test từng trang */}
//           <Route path="/members/admin" element={<MemberAdminPage />} />
//         </Route>

//         {/* ── Fallback ── */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage    from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}