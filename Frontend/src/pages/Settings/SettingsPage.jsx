import React, { useState } from "react";
import styles from "./SettingsPage.module.css";
import useScrollReveal from "../../hooks/useScrollReveal";

import userIcon from "../../assets/icons/user.svg";
import notiIcon from "../../assets/icons/noti.svg";
import shieldIcon from "../../assets/icons/shield.svg";
import preferencesIcon from "../../assets/icons/preferences.svg";
import infoIcon from "../../assets/icons/infor.svg";
import settingIcon from "../../assets/icons/setting.svg";

export default function SettingsPage() {
  useScrollReveal();

  // Active Tab State: 'general' | 'notifications' | 'system'
  const [activeTab, setActiveTab] = useState("general");

  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  // 1. General & Interface settings
  const [generalSettings, setGeneralSettings] = useState({
    username: "Nguyễn Văn A",
    language: "vi",
    theme: "light",
    defaultView: "/home",
  });

  const handleGeneralSave = (e) => {
    e.preventDefault();
    if (!generalSettings.username.trim()) {
      showToast("Tên hiển thị không được để trống", "error");
      return;
    }
    showToast("Đã lưu thiết lập giao diện và tài khoản thành công!");
  };

  // 2. Notifications settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    activityUpdates: true,
    financeReminder: false,
    documentUploads: true,
    eventRegistrations: true,
  });

  const handleToggleNoti = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(
        `Đã ${updated[key] ? "bật" : "tắt"} thông báo ${
          key === "emailAlerts"
            ? "qua Email"
            : key === "activityUpdates"
            ? "hoạt động CLB"
            : key === "financeReminder"
            ? "nhắc nhở tài chính"
            : key === "documentUploads"
            ? "khi có tài liệu mới"
            : "đăng ký sự kiện"
        }.`
      );
      return updated;
    });
  };

  // 3. System Settings: Departments & Fund Amount
  const [departments, setDepartments] = useState([
    "Khoa học máy tính",
    "Kỹ thuật phần mềm",
    "Kỹ thuật máy tính",
    "Hệ thống thông tin",
    "Mạng và truyền thông",
  ]);
  const [newDept, setNewDept] = useState("");
  const [fundAmount, setFundAmount] = useState(50000);

  const handleAddDept = () => {
    if (!newDept.trim()) {
      showToast("Tên khoa không được để trống", "error");
      return;
    }
    if (departments.includes(newDept.trim())) {
      showToast("Khoa này đã tồn tại", "error");
      return;
    }
    setDepartments((prev) => [...prev, newDept.trim()]);
    setNewDept("");
    showToast(`Đã thêm khoa "${newDept.trim()}" thành công`);
  };

  const handleRemoveDept = (idx) => {
    const removed = departments[idx];
    setDepartments((prev) => prev.filter((_, i) => i !== idx));
    showToast(`Đã xóa khoa "${removed}"`);
  };

  const handleSystemSave = (e) => {
    e.preventDefault();
    if (fundAmount < 0 || isNaN(fundAmount)) {
      showToast("Số tiền quỹ không hợp lệ", "error");
      return;
    }
    showToast("Cài đặt hệ thống đã được lưu thành công!");
  };

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.toastIcon}>
            {toast.type === "success" ? "✓" : "⚠"}
          </div>
          <div className={styles.toastMessage}>{toast.message}</div>
        </div>
      )}

      {/* Header Cover Banner */}
      <div className={`${styles.headerBlock} reveal`}>
        <div className={styles.coverBanner}>
          <div className={styles.coverOverlay}></div>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleRow}>
              <div className={styles.iconCircle}>
                <img src={settingIcon} alt="Settings" className={styles.titleIcon} />
              </div>
              <div>
                <h1 className={styles.title}>Cài đặt hệ thống</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.layoutBody}>
        {/* Sidebar Nav Tabs */}
        <div className={`${styles.navTabs} reveal-left`}>
          <button
            className={`${styles.tabBtn} ${activeTab === "general" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <img src={preferencesIcon} alt="" className={styles.tabIcon} />
            <span>Tài khoản & Giao diện</span>
          </button>
          
          <button
            className={`${styles.tabBtn} ${activeTab === "notifications" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <img src={notiIcon} alt="" className={styles.tabIcon} />
            <span>Tùy chọn thông báo</span>
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === "system" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <img src={shieldIcon} alt="" className={styles.tabIcon} />
            <span>Cài đặt hệ thống</span>
          </button>

        </div>

        {/* Content area */}
        <div className={`${styles.contentCard} reveal-right`}>
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Tài khoản & Giao diện</h2>
                <p>Điều chỉnh các tùy chọn hiển thị cơ bản của bạn.</p>
              </div>
              <form onSubmit={handleGeneralSave} className={styles.settingsForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="settings-language">Ngôn ngữ giao diện</label>
                    <select
                      id="settings-language"
                      value={generalSettings.language}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, language: e.target.value }))
                      }
                    >
                      <option value="vi">Tiếng Việt (Vietnamese)</option>
                      <option value="en">Tiếng Anh (English)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="settings-theme">Giao diện (Theme)</label>
                    <select
                      id="settings-theme"
                      value={generalSettings.theme}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, theme: e.target.value }))
                      }
                    >
                      <option value="light">Sáng (Light Mode)</option>
                      <option value="dark">Tối (Dark Mode)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveSubmitBtn}>
                    Lưu thiết lập
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Tùy chọn thông báo</h2>
                <p>Kiểm soát cách thức và tần suất bạn nhận được thông báo từ hoạt động câu lạc bộ.</p>
              </div>

              <div className={styles.toggleGroup}>
                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Thông báo qua Email</h4>
                    <p>Nhận thư tóm tắt hàng tuần, thông tin tài chính quan trọng qua email của bạn.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={() => handleToggleNoti("emailAlerts")}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Thông báo hoạt động CLB</h4>
                    <p>Đăng ký các thông tin sự kiện mới phát sinh và tin tức nội bộ CLB.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifications.activityUpdates}
                      onChange={() => handleToggleNoti("activityUpdates")}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Tải lên tài liệu học thuật</h4>
                    <p>Gửi thông báo khi có tài liệu học tập mới thuộc chuyên ngành của bạn được phê duyệt.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifications.documentUploads}
                      onChange={() => handleToggleNoti("documentUploads")}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM SETTINGS */}
          {activeTab === "system" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Cài đặt hệ thống</h2>
                <p>Quản lý danh sách khoa và số tiền đóng quỹ định kỳ của câu lạc bộ.</p>
              </div>

              <form onSubmit={handleSystemSave} className={styles.settingsForm}>
                {/* Department Management Section */}
                <div className={styles.sectionCard}>
                  <h3>🏛️ Quản lý khoa</h3>
                  <div className={styles.formGroup}>
                    <label>Thêm khoa mới</label>
                    <div className={styles.inlineInputRow}>
                      <input
                        type="text"
                        placeholder="Nhập tên khoa..."
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDept();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.addDeptBtn}
                        onClick={handleAddDept}
                      >
                        + Thêm
                      </button>
                    </div>
                  </div>

                  <div className={styles.deptList}>
                    {departments.length === 0 && (
                      <p className={styles.emptyText}>Chưa có khoa nào được thêm.</p>
                    )}
                    {departments.map((dept, idx) => (
                      <div key={idx} className={styles.deptItem}>
                        <div className={styles.deptInfo}>
                          <span className={styles.deptIndex}>{idx + 1}</span>
                          <span className={styles.deptName}>{dept}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.removeDeptBtn}
                          onClick={() => handleRemoveDept(idx)}
                          title="Xóa khoa"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fund Amount Section */}
                <div className={styles.sectionCard}>
                  <h3>💰 Quỹ định kỳ</h3>
                  <div className={styles.formGroup}>
                    <label htmlFor="fund-amount">Số tiền đóng quỹ định kỳ (VND)</label>
                    <div className={styles.fundInputWrapper}>
                      <input
                        id="fund-amount"
                        type="number"
                        min="0"
                        step="1000"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(Number(e.target.value))}
                      />
                      <span className={styles.fundUnit}>VND</span>
                    </div>
                    <p className={styles.fundHint}>
                      Hiện tại: <strong>{Number(fundAmount).toLocaleString("vi-VN")} VND</strong> / kỳ
                    </p>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveSubmitBtn}>
                    Lưu cài đặt hệ thống
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
