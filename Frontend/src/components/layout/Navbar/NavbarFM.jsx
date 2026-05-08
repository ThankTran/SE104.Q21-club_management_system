import React, { useState } from "react";
import styles from "./NavbarFM.module.css";
import search from "../assets/icons/search.svg";
import noti from "../assets/icons/noti.svg";
import setting from "../assets/icons/setting.svg";

const NavbarFM = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <nav className={styles.navbar}>
      {/* Left Section - Logo */}
      <div className={styles.logoSection}>
        <img
          src="/logo_cnpm.png"
          alt="THMN club logo"
          className={styles.logoImg}
        />
        <h2 className={styles.logo}>THMN club</h2>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsSection}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Center Section - Search */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search archives..."
          className={styles.searchInput}
        />
        <button className={styles.searchBtn}>
          <img src={search} alt="Search" className={styles.searchIcon} />
        </button>
      </div>

      {/* Right Section - Icons */}
      <div className={styles.actionsSection}>
        <button className={styles.iconBtn} title="Notifications">
          <img src={noti} alt="Notifications" className={styles.iconImg} />
        </button>
        <button className={styles.iconBtn} title="Settings">
          <img src={setting} alt="Settings" className={styles.iconImg} />
        </button>
        <button className={styles.profileBtn} title="Profile">
          <div className={styles.avatar}></div>
        </button>
      </div>
    </nav>
  );
};

export default NavbarFM;
