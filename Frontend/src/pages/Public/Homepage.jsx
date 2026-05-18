import React from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import NavbarFM from "../../components/layout/Navbar/NavbarFM";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Searchbar from "../../components/common/SearchBar/Searchbar";

const HomePage = () => {
  return (
    <div className="home-wrapper">
      {/* 1. Đặt Navbar ở trên cùng */}
      <NavbarFM />
      {/* 2. Đặt Sidebar bên trái */}
      <Sidebar />
      {/* 2. Phần nội dung của trang */}
      <main
        style={{ padding: "100px 20px", textAlign: "center", height: 1500 }}
      >
        <h1>Welcome to My Website</h1>
      </main>
    </div>
  );
};

export default HomePage;
