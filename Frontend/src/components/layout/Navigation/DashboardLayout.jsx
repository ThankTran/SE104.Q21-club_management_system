import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import NavbarFM from "../Navbar/NavbarFM";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

      <NavbarFM />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", marginTop: 60 }}>

        <Sidebar />

        <main
          style={{
            flex: 1,
            marginLeft: 180,      
            overflowY: "auto",
            padding: "20px 36px",
            background: "#f8f9fa",
          }}
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;