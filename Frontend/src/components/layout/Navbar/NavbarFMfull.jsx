import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./NavbarFM.module.css";
import search from "../../../assets/icons/search.svg";
import noti from "../../../assets/icons/noti.svg";
import setting from "../../../assets/icons/setting.svg";

const NavbarFMfull = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { id: "home", label: "Home", path: "/" },
    { id: "members", label: "Members", path: "/members" },
    { id: "resources", label: "Resources", path: "/resources" },
    { id: "events", label: "Events", path: "/events" },
    { id: "about", label: "About", path: "/about" },
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "reports", label: "Reports", path: "/reports" },
  ];

  return (
    <nav className={styles.navbar}>
      {/* Left Section - Logo */}
      <Link to="/" className={styles.logoSection}>
        <img
          src="/logo_cnpm.png"
          alt="THMN club logo"
          className={styles.logoImg}
        />
        <h2 className={styles.logo}>THMN club</h2>
      </Link>

      {/* Navigation Tabs */}
      <div className={styles.tabsSection}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`${styles.tab} ${
              currentPath === tab.path ? styles.active : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Right Section - Icons */}
      <div className={styles.actionsSection}>
        <button className={styles.profileBtn} title="Profile">
          <div className={styles.avatar}></div>
        </button>
        <Link to="/login" className={styles.signin}>
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default NavbarFMfull;
