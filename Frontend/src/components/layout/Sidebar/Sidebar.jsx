import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import dashboard from "../../../assets/icons/dashboard.svg";
import members from "../../../assets/icons/members.svg";
import resources from "../../../assets/icons/resources.svg";
import events from "../../../assets/icons/events.svg";
import finance from "../../../assets/icons/finance.svg";
import help from "../../../assets/icons/help.svg";
import logout from "../../../assets/icons/logout.svg";
import home from "../../../assets/icons/home.svg";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "home", label: "Home", icon: home },
    { id: "dashboard", label: "Dashboard", icon: dashboard },
    { id: "members", label: "Members", icon: members },
    { id: "resources", label: "Resources", icon: resources },
    { id: "events", label: "Events", icon: events },
    { id: "finance", label: "Finance", icon: finance },
  ];

  const bottomItems = [
    { id: "help", label: "Help", icon: help },
    { id: "logout", label: "Logout", icon: logout },
  ];

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
  };

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>THMN club</h1>
        <p className={styles.version}>v1.0.0</p>
      </div>

      {/* Main Menu */}
      <nav className={styles.mainMenu}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${
              activeItem === item.id ? styles.active : ""
            }`}
            onClick={() => handleMenuClick(item.id)}
            title={item.label}
          >
            <img src={item.icon} alt={item.label} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className={styles.bottomMenu}>
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={styles.bottomItem}
            title={item.label}
          >
            <img src={item.icon} alt={item.label} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
