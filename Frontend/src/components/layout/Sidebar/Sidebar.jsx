import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import dashboard from "../../../assets/icons/dashboard.svg";
import members   from "../../../assets/icons/members.svg";
import resources from "../../../assets/icons/resources.svg";
import events    from "../../../assets/icons/events.svg";
import finance   from "../../../assets/icons/finance.svg";
import help      from "../../../assets/icons/help.svg";
import logout    from "../../../assets/icons/logout.svg";
import home      from "../../../assets/icons/home.svg";

const menuItems = [
  { id: "home",      label: "Home",      icon: home,      path: "/home"      },
  { id: "dashboard", label: "Dashboard", icon: dashboard, path: "/dashboard" },
  { id: "memberuser",   label: "Member User",   icon: members,   path: "/memberuser"   },
  { id: "memberadmin",  label: "Member Admin",  icon: members,   path: "/memberadmin"     },
  { id: "resourcesuser", label: "Resources User", icon: resources, path: "/resourcesuser" },
  { id: "resourcesadmin", label: "Resources Admin", icon: resources, path: "/resourcesadmin" },
  { id: "eventuser",  label: "Event User",  icon: events,   path: "/eventuser"     },
  { id: "eventadmin",  label: "Event Admin",  icon: events,   path: "/eventadmin"     },
  { id: "finance",   label: "Finance",   icon: finance,   path: "/finance"   },
  { id: "memberdues", label: "Đóng quỹ", icon: finance, path: "/memberdues" },
];

const bottomItems = [
  { id: "help",   label: "Trợ giúp",   icon: help   },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định active dựa theo URL thực tế, không phải state
  const activeId = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  )?.id ?? "dashboard";

  return (
    <div className={styles.sidebar}>
      {/* Main Menu */}
      <nav className={styles.mainMenu}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${activeId === item.id ? styles.active : ""}`}
            onClick={() => navigate(item.path)}  // ← navigate thay vì chỉ setState
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
