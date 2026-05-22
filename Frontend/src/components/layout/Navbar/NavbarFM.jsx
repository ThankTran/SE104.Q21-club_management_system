import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavbarFM.module.css";
import logo from "../../../assets/logo/logo_cnpm.png";
import noti from "../../../assets/icons/noti.svg";
import setting from "../../../assets/icons/setting.svg";
import Searchbar from "../../common/SearchBar/Searchbar";
import NotificationPopover from "./NotificationPopover";
  
const initialNotifications = [
  {
    id: 1,
    type: "document", // Tài liệu
    actorName: "Nguyễn Hoàng Nam",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "đã tải lên tài liệu học tập mới:",
    highlight: "Slide bài giảng Giải Tích 2 - Chương 3.pdf",
    time: "10 phút trước",
    isUnread: true,
    category: "Hôm nay",
  },
  {
    id: 2,
    type: "new_member", // Thành viên mới
    actorName: "Lê Minh Triết",
    actorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content: "vừa gia nhập đại gia đình học thuật",
    highlight: "THMN Academic Club",
    time: "2 giờ trước",
    isUnread: true,
    category: "Hôm nay",
  },
  {
    id: 3,
    type: "upcoming_event", // Sự kiện sắp diễn ra
    actorName: "Hội Thảo Khoa Học",
    actorAvatar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80",
    content: "sẽ bắt đầu sau",
    highlight: "1 giờ nữa tại Phòng Hội thảo A2",
    time: "3 giờ trước",
    isUnread: true,
    category: "Hôm nay",
  },
  {
    id: 4,
    type: "new_event", // Sự kiện mới
    actorName: "Ban Truyền Thông",
    actorAvatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80",
    content: "đã tạo một sự kiện mới sắp diễn ra:",
    highlight: "Đại hội Câu lạc bộ THMN Nhiệm kỳ 2026 - 2027",
    time: "1 ngày trước",
    isUnread: false,
    category: "Trước đó",
  },
  {
    id: 5,
    type: "document", // Tài liệu
    actorName: "Phạm Thùy Chi",
    actorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "đã phê duyệt đề xuất tài liệu học thuật:",
    highlight: "Bài tập lớn Cấu trúc dữ liệu & Giải thuật",
    time: "3 ngày trước",
    isUnread: false,
    category: "Trước đó",
  },
  {
    id: 6,
    type: "new_member", // Thành viên mới
    actorName: "Trần Anh Đức",
    actorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    content: "đã hoàn thành đăng ký thành viên ban Kỹ thuật",
    highlight: "",
    time: "4 ngày trước",
    isUnread: false,
    category: "Trước đó",
  }
];

const NavbarFM = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
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
        {/* Notifications Icon Button */}
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