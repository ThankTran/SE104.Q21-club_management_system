import React, { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("#home");

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Members", href: "#members" },
    { name: "Resources", href: "#resources" },
    { name: "Events", href: "#events" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Finance", href: "#finance" },
  ];

  return (
    <div className={styles["nav-container"]}>
      <nav className={styles["glass-nav"]}>
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            // Nếu href trùng với activeTab hiện tại thì thêm class active
            className={`${styles["nav-item"]} ${activeTab === item.href ? styles.active : ""}`}
            onClick={() => setActiveTab(item.href)}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
