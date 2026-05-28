import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import dashboard from "../../../assets/icons/dashboard.svg";
import members   from "../../../assets/icons/members.svg";
import resources from "../../../assets/icons/resources.svg";
import events    from "../../../assets/icons/events.svg";
import finance   from "../../../assets/icons/finance.svg";
import help      from "../../../assets/icons/help.svg";
import home      from "../../../assets/icons/home.svg";
import setting   from "../../../assets/icons/setting.svg";
import useAuthStore from "../../../store/auth-store";
import { canAccessPath } from "../../../utils/access-control";

const menuItems = [
  { id: "home",      label: "Trang chủ",      icon: home,      path: "/home"      },
  { id: "dashboard", label: "Thống kê", icon: dashboard, path: "/dashboard" },
  { id: "memberuser",   label: "Thành viên",   icon: members,   path: "/memberuser"   },
  { id: "memberadmin",  label: "Quản lý thành viên",  icon: members,   path: "/memberadmin"     },
  { id: "resourcesuser", label: "Tài liệu", icon: resources, path: "/resourcesuser" },
  { id: "resourcesadmin", label: "Quản lý tài liệu", icon: resources, path: "/resourcesadmin" },
  { id: "eventuser",  label: "Sự kiện",  icon: events,   path: "/eventuser"     },
  { id: "eventadmin",  label: "Quản lý sự kiện",  icon: events,   path: "/eventadmin"     },
  { id: "finance",   label: "Tài chính",   icon: finance,   path: "/finance"   },
  { id: "memberdues", label: "Đóng quỹ", icon: finance, path: "/memberdues" },
  { id: "account", label: "Tài khoản", icon: setting, path: "/account" },
];

const bottomItems = [
  { id: "help", label: "Trợ giúp", icon: help, path: "/help" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const visibleMenuItems = menuItems.filter((item) => canAccessPath(item.path, user, token));
  const visibleBottomItems = bottomItems.filter((item) => canAccessPath(item.path, user, token));

  // Xác định active dựa theo URL thực tế, không phải state
  const activeId = [...visibleMenuItems, ...visibleBottomItems].find((item) =>
    location.pathname.startsWith(item.path)
  )?.id ?? "home";

  return (
    <div className={styles.sidebar}>
      {/* Main Menu */}
      <nav className={styles.mainMenu}>
        {visibleMenuItems.map((item) => (
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
        {visibleBottomItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.bottomItem} ${activeId === item.id ? styles.active : ""}`}
            title={item.label}
            onClick={() => navigate(item.path)}
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
