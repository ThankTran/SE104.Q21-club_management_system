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

  // Active Tab State: 'general' | 'notifications' | 'security' | 'privacy' | 'integrations'
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

  // 3. Security Settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      showToast("Vui lòng nhập đầy đủ thông tin mật khẩu", "error");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      showToast("Mật khẩu mới và Xác nhận không khớp", "error");
      return;
    }
    if (security.newPassword.length < 6) {
      showToast("Mật khẩu mới phải từ 6 ký tự trở lên", "error");
      return;
    }

    showToast("Cập nhật mật khẩu thành công!");
    setSecurity((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  // 4. Privacy Settings
  const [privacy, setPrivacy] = useState({
    hidePhone: true,
    hideEmail: false,
    showOnlineStatus: true,
  });

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
    showToast("Đã cập nhật tùy chọn quyền riêng tư!");
  };

  // 5. Integrations Settings
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
            className={`${styles.tabBtn} ${activeTab === "security" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <img src={shieldIcon} alt="" className={styles.tabIcon} />
            <span>Bảo mật & Đăng nhập</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "privacy" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <img src={userIcon} alt="" className={styles.tabIcon} />
            <span>Quyền riêng tư</span>
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
                      <option value="system">Theo hệ thống (System)</option>
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
                    <h4>Nhắc nhở đóng quỹ & Đóng phí</h4>
                    <p>Nhận các nhắc nhở hạn đóng phí, tài chính cần hoàn thành sớm.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifications.financeReminder}
                      onChange={() => handleToggleNoti("financeReminder")}
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

                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Đăng ký tham gia sự kiện</h4>
                    <p>Nhận cập nhật khi trạng thái duyệt tham gia sự kiện của bạn thay đổi.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifications.eventRegistrations}
                      onChange={() => handleToggleNoti("eventRegistrations")}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Bảo mật & Đăng nhập</h2>
                <p>Cập nhật mật khẩu của bạn và kiểm tra danh sách phiên đăng nhập hoạt động.</p>
              </div>

              <div className={styles.securityGrid}>
                {/* Change Password Block */}
                <div className={styles.sectionCard}>
                  <h3>Đổi mật khẩu</h3>
                  <form onSubmit={handlePasswordSubmit} className={styles.subForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="sec-current-pwd">Mật khẩu hiện tại</label>
                      <input
                        id="sec-current-pwd"
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity((prev) => ({ ...prev, currentPassword: e.target.value }))
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="sec-new-pwd">Mật khẩu mới</label>
                      <input
                        id="sec-new-pwd"
                        type="password"
                        value={security.newPassword}
                        onChange={(e) =>
                          setSecurity((prev) => ({ ...prev, newPassword: e.target.value }))
                        }
                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="sec-confirm-pwd">Xác nhận mật khẩu mới</label>
                      <input
                        id="sec-confirm-pwd"
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) =>
                          setSecurity((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        placeholder="Xác nhận mật khẩu mới"
                        required
                      />
                    </div>
                    <button type="submit" className={styles.changePasswordBtn}>
                      Cập nhật mật khẩu
                    </button>
                  </form>
                </div>                
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {activeTab === "privacy" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Quyền riêng tư cá nhân</h2>
                <p>Quyết định những thông tin nào của bạn được hiển thị với các thành viên khác trong CLB.</p>
              </div>

              <div className={styles.toggleGroup}>
                

                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Ẩn số điện thoại liên hệ</h4>
                    <p>Ẩn số điện thoại trên trang thông tin công khai. Các thành viên khác sẽ không thể xem được.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={privacy.hidePhone}
                      onChange={(e) => handlePrivacyChange("hidePhone", e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Ẩn địa chỉ email</h4>
                    <p>Không hiển thị địa chỉ email cá nhân trên danh sách thành viên của câu lạc bộ.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={privacy.hideEmail}
                      onChange={(e) => handlePrivacyChange("hideEmail", e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleText}>
                    <h4>Trạng thái trực tuyến</h4>
                    <p>Hiển thị chấm xanh trực tuyến khi bạn đang truy cập vào hệ thống CLB.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={privacy.showOnlineStatus}
                      onChange={(e) => handlePrivacyChange("showOnlineStatus", e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
