import React, { useState } from "react";
import styles from "./NavbarFM.module.css";

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
          <span>🔍</span>
        </button>
      </div>

      {/* Right Section - Icons */}
      <div className={styles.actionsSection}>
        <button className={styles.iconBtn} title="Notifications">
          <span>🔔</span>
        </button>
        <button className={styles.iconBtn} title="Settings">
          <span>⚙️</span>
        </button>
        <button className={styles.profileBtn} title="Profile">
          <div className={styles.avatar}></div>
        </button>
      </div>
    </nav>
  );
};

export default NavbarFM;
