import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import NavbarFM from "../Navbar/NavbarFM";

const MainLayout = () => {
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
            padding: "32px 36px",
            background: "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
