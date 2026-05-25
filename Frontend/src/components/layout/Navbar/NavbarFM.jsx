import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavbarFM.module.css";
import logo from "../../../assets/logo/logo_cnpm.png";
import noti from "../../../assets/icons/noti.svg";
import setting from "../../../assets/icons/setting.svg";
import NotificationPopover from "./NotificationPopover";
import {
  getNotificationsAPI,
  getNotificationsByMemberAPI,
} from "../../../services/notification-service";
import useAuthStore from "../../../store/auth-store";

const targetTypeToNotificationType = (targetType = "") => {
  const value = targetType.toLowerCase();
  if (value.includes("member")) return "new_member";
  if (value.includes("event")) return "upcoming_event";
  if (value.includes("document") || value.includes("resource")) return "document";
  return "document";
};

const formatRelativeTime = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Hôm qua";
  return `${diffDays} ngày trước`;
};

const isToday = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return false;

  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const normalizeNotification = (item, readByNotificationId) => {
  const id = item.notificationId ?? item.id;
  const readRecord = readByNotificationId.get(id);

  return {
    id,
    type: targetTypeToNotificationType(item.targetType),
    actorName: item.title || "Thông báo",
    content: item.content || "",
    highlight: "",
    time: formatRelativeTime(item.sentAt),
    isUnread: readRecord ? !readRecord.isRead : true,
    category: isToday(item.sentAt) ? "today" : "earlier",
    targetType: item.targetType,
    raw: item,
  };
};

const NavbarFM = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const profileRef = useRef(null);
  const currentUser = useAuthStore((state) => state.user);
  const currentMemberId = currentUser?.memberId;

  useEffect(() => {
    let ignore = false;

    const loadNotifications = async () => {
      setNotificationLoading(true);
      setNotificationError("");
      try {
        const [items, recipients] = await Promise.all([
          getNotificationsAPI(),
          currentMemberId
            ? getNotificationsByMemberAPI(currentMemberId).catch(() => [])
            : Promise.resolve([]),
        ]);
        if (ignore) return;

        const readByNotificationId = new Map(
          (recipients || []).map((item) => [item.notificationId, item])
        );
        setNotifications(
          (items || [])
            .slice()
            .sort((a, b) => new Date(b.sentAt || 0) - new Date(a.sentAt || 0))
            .map((item) => normalizeNotification(item, readByNotificationId))
        );
      } catch (error) {
        if (!ignore) {
          setNotificationError(error?.message || "Không thể tải thông báo");
          setNotifications([]);
        }
      } finally {
        if (!ignore) {
          setNotificationLoading(false);
        }
      }
    };

    loadNotifications();
    return () => {
      ignore = true;
    };
  }, [currentMemberId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const isSettingsActive = location.pathname === "/settings";
  const isProfileActive = location.pathname === "/profile";
  const isProfileOpenOrActive = openMenu || isProfileActive;

  return (
    <nav className={styles.navbar}>
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

      <div className={styles.actionsSection}>
        <div className={styles.notificationContainer}>
          <button
            className={`${styles.iconBtn} ${showNoti ? styles.activeIconBtn : ""}`}
            title="Notifications"
            onClick={() => setShowNoti(!showNoti)}
            data-bell-button="true"
          >
            <img src={noti} alt="Notifications" className={styles.iconImg} />
            {unreadCount > 0 && (
              <span className={styles.bellBadge}>{unreadCount}</span>
            )}
          </button>

          {showNoti && (
            <NotificationPopover
              notifications={notifications}
              setNotifications={setNotifications}
              isLoading={notificationLoading}
              error={notificationError}
              onClose={() => setShowNoti(false)}
            />
          )}
        </div>

        <button
          className={`${styles.iconBtn} ${isSettingsActive ? styles.activeIconBtn : ""}`}
          title="Settings"
          onClick={() => navigate("/settings")}
        >
          <img src={setting} alt="Settings" className={styles.iconImg} />
        </button>

        <div className={styles.profileContainer} ref={profileRef}>
          <button
            className={`${styles.profileBtn} ${isProfileOpenOrActive ? styles.activeProfileBtn : ""}`}
            title="Profile"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className={`${styles.avatar} ${isProfileOpenOrActive ? styles.activeAvatar : ""}`}></div>
          </button>

          {openMenu && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  navigate("/profile");
                  setOpenMenu(false);
                }}
              >
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
