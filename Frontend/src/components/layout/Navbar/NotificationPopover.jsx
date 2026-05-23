import React, { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  UserPlus, 
  CalendarPlus, 
  Clock, 
  MoreHorizontal, 
  Check, 
  Trash2, 
  Settings, 
  CheckCheck,
  BellOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/auth-store";
import styles from "./NotificationPopover.module.css";

const NotificationPopover = ({ notifications, setNotifications, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("all"); // "all" or "unread"
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef(null);
  const popoverRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        // Only close popover if not clicking the bell button itself
        const bellBtn = document.querySelector('[data-bell-button="true"]');
        if (bellBtn && !bellBtn.contains(event.target)) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Toggle single notification unread status
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  // Handle double-click navigation
  const handleDoubleClick = (noti) => {
    if (noti.isUnread) {
      handleMarkAsRead(noti.id);
    }
    
    let path = "/home";
    switch (noti.type) {
      case "document":
        path = isAdmin ? "/resourcesadmin" : "/resourcesuser";
        break;
      case "new_member":
        path = isAdmin ? "/memberadmin" : "/memberuser";
        break;
      case "new_event":
      case "upcoming_event":
        path = isAdmin ? "/eventadmin" : "/eventuser";
        break;
      default:
        path = "/home";
    }
    
    navigate(path);
    onClose();
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    setShowMoreMenu(false);
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    setShowMoreMenu(false);
  };

  // Delete a specific notification
  const handleDeleteNotification = (id, e) => {
    e.stopPropagation(); // prevent triggering read event
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };



  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return n.isUnread;
    return true;
  });

  // Group notifications by category ("Hôm nay" vs "Trước đó")
  const todayNotis = filteredNotifications.filter((n) => n.category === "Hôm nay");
  const earlierNotis = filteredNotifications.filter((n) => n.category === "Trước đó");

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Thông báo</h2>
        <div className={styles.moreMenuContainer} ref={menuRef}>
          <button 
            className={styles.moreBtn} 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="Tùy chọn thông báo"
          >
            <MoreHorizontal size={20} />
          </button>
          
          {showMoreMenu && (
            <div className={styles.moreDropdown}>
              <button className={styles.menuItem} onClick={handleMarkAllAsRead}>
                <CheckCheck size={16} />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
              <button className={styles.menuItem} onClick={handleClearAll}>
                <Trash2 size={16} />
                <span>Xóa tất cả thông báo</span>
              </button>
              <button className={styles.menuItem} onClick={() => setShowMoreMenu(false)}>
                <Settings size={16} />
                <span>Cài đặt thông báo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "unread" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Chưa đọc
          {notifications.filter((n) => n.isUnread).length > 0 && (
            <span className={styles.unreadCountBadge}>
              {notifications.filter((n) => n.isUnread).length}
            </span>
          )}
        </button>
      </div>

      {/* List container */}
      <div className={styles.listScroll}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <BellOff size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Không có thông báo nào</p>
          </div>
        ) : (
          <>
            {/* Today Section */}
            {todayNotis.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionHeader}>Hôm nay</h3>
                <div className={styles.sectionList}>
                  {todayNotis.map((noti) => (
                    <NotificationItem 
                      key={noti.id} 
                      noti={noti} 
                      onMarkRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                      onDoubleClick={handleDoubleClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier Section */}
            {earlierNotis.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionHeader}>Trước đó</h3>
                <div className={styles.sectionList}>
                  {earlierNotis.map((noti) => (
                    <NotificationItem 
                      key={noti.id} 
                      noti={noti} 
                      onMarkRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                      onDoubleClick={handleDoubleClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Sub-component for individual notification item
const NotificationItem = ({ noti, onMarkRead, onDelete, onDoubleClick }) => {
  // Generate a beautiful monochromatic illustration icon based on the type
  const getIllustrationIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText size={22} className={styles.illustrationIcon} />;
      case "new_member":
        return <UserPlus size={22} className={styles.illustrationIcon} />;
      case "new_event":
        return <CalendarPlus size={22} className={styles.illustrationIcon} />;
      case "upcoming_event":
        return <Clock size={22} className={styles.illustrationIcon} />;
      default:
        return <FileText size={22} className={styles.illustrationIcon} />;
    }
  };

  return (
    <div 
      className={`${styles.notiItem} ${noti.isUnread ? styles.unreadItem : ""}`}
      onClick={() => onMarkRead(noti.id)}
      onDoubleClick={() => onDoubleClick(noti)}
    >
      {/* Monochromatic Illustration Container */}
      <div className={`${styles.illustrationWrapper} ${styles[`illustration_${noti.type}`]}`}>
        {getIllustrationIcon(noti.type)}
      </div>

      {/* Notification Text content */}
      <div className={styles.contentWrapper}>
        <p className={styles.notiText}>
          <span className={styles.actorName}>{noti.actorName}</span>
          {" "}{noti.content}{" "}
          {noti.highlight && (
            <span className={styles.highlightText}>{noti.highlight}</span>
          )}
        </p>
        <span className={`${styles.time} ${noti.isUnread ? styles.unreadTime : ""}`}>
          {noti.time}
        </span>
      </div>

      {/* Unread status indicator and Actions */}
      <div className={styles.rightActions}>
        {noti.isUnread && <div className={styles.unreadDot}></div>}
        <button 
          className={styles.deleteItemBtn} 
          onClick={(e) => onDelete(noti.id, e)}
          title="Xóa thông báo"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default NotificationPopover;
