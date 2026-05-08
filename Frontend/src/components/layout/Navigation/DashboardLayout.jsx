import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; 
import NavbarFM from "../Navbar/NavbarFM";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar cố định bên trái */}
      <Sidebar />
      <NavbarFM />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
