import React, { useState } from "react";
import styles from "./NavbarFM.module.css";
import logo from "../../../assets/logo/logo_cnpm.png";
import noti from "../../../assets/icons/noti.svg";
import setting from "../../../assets/icons/setting.svg";
import Searchbar from "../../common/SearchBar/Searchbar";

const NavbarFM = () => {
  const [openMenu, setOpenMenu] = useState(false);
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

      {/* Right Section - Icons and Search */}
      <div className={styles.actionsSection}>
        <Searchbar />
        <button className={styles.iconBtn} title="Notifications">
          <img src={noti} alt="Notifications" className={styles.iconImg} />
        </button>
        <button className={styles.iconBtn} title="Settings">
          <img src={setting} alt="Settings" className={styles.iconImg} />
        </button>
        <div className={styles.profileContainer}>
          <button className={styles.profileBtn} title="Profile" onClick={() => setOpenMenu(!openMenu)}>
            <div className={styles.avatar}></div>
          </button>

          {openMenu && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem}>
                  Hồ sơ
                </button>

                <button className={styles.dropdownItem}>
                  Đăng xuất
                </button>
              </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarFM;