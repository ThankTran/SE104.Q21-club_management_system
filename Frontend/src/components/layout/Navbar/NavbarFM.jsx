import React from "react";
import styles from "./NavbarFM.module.css";
import logo from "../../../assets/logo/logo_cnpm.png";
import search from "../../../assets/icons/search.svg";
import noti from "../../../assets/icons/noti.svg";
import setting from "../../../assets/icons/setting.svg";

const NavbarFM = () => {
  return (
    <nav className={styles.navbar}>
      {/* Left Section - Logo */}
      <div className={styles.logoSection}>
        <img
          src={logo}
          alt="THMN club logo"
          className={styles.logoImg}
        />
        <div className={styles.logoText}>
          <h1 className={styles.logoTitle}>THMN</h1>
          <h2 className={styles.logoSubtitle}>Academic Club</h2>
          <h3 className={styles.logoSlogan}>KNOWLEDGE - LEADERSHIP - IMPACT</h3>
        </div>
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