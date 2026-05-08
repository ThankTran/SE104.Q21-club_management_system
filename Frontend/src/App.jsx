import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/Navigation/PublicLayout";
import DashboardLayout from "./components/layout/Navigation/DashboardLayout";

import Signin from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import Aboutpage from "./pages/Aboutpage";
import DashboardPage from "./pages/DashboardPage";
import MembersPage from "./pages/MembersPage";

// TESTING


const App = () => {
  return (
    <Router>
      <Routes>
        {/*dùng Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/about" element={<Aboutpage />} />
        </Route>

        {/*dùng Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersPage />} />
        </Route>      
      </Routes>
    </Router>
  );
};

export default App;
