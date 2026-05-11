import React from "react";
import Navbar from "../components/Navbar"; // Đường dẫn đến file Navbar của bạn
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import NavbarFM from "../components/NavbarFM";


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