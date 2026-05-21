import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import settingIcon from "../../assets/icons/setting.svg";
import membersIcon from "../../assets/icons/members.svg";
import eventsIcon from "../../assets/icons/events.svg";
import resourcesIcon from "../../assets/icons/resources.svg";
import financeIcon from "../../assets/icons/finance.svg";
import cameraIcon from "../../assets/icons/camera.svg";
import userIcon from "../../assets/icons/user.svg";
import academicIcon from "../../assets/icons/academic.svg";
import timelineIcon from "../../assets/icons/timeline.svg";
import shieldIcon from "../../assets/icons/shield.svg";
import penIcon from "../../assets/icons/pen.svg";
import notiIcon from "../../assets/icons/noti.svg";
import plusIcon from "../../assets/icons/plus.svg";

const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: "event",
    title: "Hội thảo Công Nghệ 2026",
    role: "Thành viên tham dự",
    date: "10/05/2026",
    status: "Đã hoàn thành",
    icon: eventsIcon,
  },
  {
    id: 2,
    type: "document",
    title: "Tài liệu hướng dẫn OOP",
    role: "Người cung cấp",
    date: "28/04/2026",
    status: "Đã phê duyệt",
    icon: resourcesIcon,
  },
  {
    id: 3,
    type: "event",
    title: "Hackathon UIT 2026 ",
    role: "Thành viên dự thi",
    date: "15/03/2026",
    status: "Giải Nhì",
    icon: eventsIcon,
  },
  {
    id: 4,
    type: "finance",
    title: "Đóng phí thường niên",
    role: "Thành viên",
    date: "05/02/2026",
    status: "Đã đóng",
    icon: financeIcon,
  },
];

const DEFAULT_FACULTIES = [
  "Khoa học máy tính",
  "Công nghệ phần mềm",
  "Kỹ thuật máy tính",
  "Khoa học & kỹ thuật thông tin",
  "Hệ thống thông tin",
  "Mạng máy tính và truyền thông",
];

const ProfilePage = () => {
  // Tabs: 'personal' | 'academic' | 'activity' | 'security'
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [faculties, setFaculties] = useState(DEFAULT_FACULTIES);
  const [newFaculty, setNewFaculty] = useState("");
  const [showAddFaculty, setShowAddFaculty] = useState(false);

  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    studentId: "24520001",
    email: "24520001@gm.uit.edu.vn",
    phone: "0123456789",
    dob: "2006-01-01",
    gender: "Nam",
    faculty: "Công nghệ phần mềm",
    gpa: "8.25/10",
    department: "Ban chủ nhiệm",
    major: "Khoa Công nghệ phần mềm",
    skills: ["ReactJS", "Node.js", "UI/UX Design", "SQL", "Git"],
    joinDate: "15/10/2024",
    role: "Trưởng ban ",
    avatar: "https://bazaarvietnam.vn/wp-content/uploads/2023/04/harper-bazaar-ca-si-noi-tieng-nhat-viet-nam-3.jpeg",
    cover: "linear-gradient(135deg, #1e3a8a 0%, #003d82 50%, #3a445eff 100%)",
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    activityUpdates: true,
    financeReminder: false,
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  const handleStartEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
    setShowAddFaculty(false);
    setNewFaculty("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowAddFaculty(false);
    setNewFaculty("");
  };

  const handleAddFaculty = () => {
    const trimmed = newFaculty.trim();
    if (!trimmed) return;
    if (faculties.includes(trimmed)) {
      showToast("Khoa này đã tồn tại", "error");
      return;
    }
    setFaculties([...faculties, trimmed]);
    setTempProfile({ ...tempProfile, faculty: trimmed });
    setNewFaculty("");
    setShowAddFaculty(false);
    showToast(`Đã thêm khoa "${trimmed}" thành công!`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!tempProfile.name.trim()) {
      showToast("Họ và tên không được để trống", "error");
      return;
    }
    if (!tempProfile.email.trim() || !tempProfile.email.includes("@")) {
      showToast("Email không hợp lệ", "error");
      return;
    }

    setProfile({ ...tempProfile });
    setIsEditing(false);
    showToast("Đã cập nhật thông tin cá nhân thành công!");
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (tempProfile.skills.includes(newSkill.trim())) {
      showToast("Kỹ năng này đã tồn tại", "error");
      return;
    }
    setTempProfile({
      ...tempProfile,
      skills: [...tempProfile.skills, newSkill.trim()],
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setTempProfile({
      ...tempProfile,
      skills: tempProfile.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      showToast("Vui lòng điền đầy đủ các trường mật khẩu", "error");
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

    showToast("Đổi mật khẩu thành công!");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAvatarChange = () => {
    const newAvatarUrl = prompt("Nhập URL ảnh đại diện mới:", profile.avatar);
    if (newAvatarUrl && newAvatarUrl.trim().startsWith("http")) {
      setProfile((prev) => ({ ...prev, avatar: newAvatarUrl }));
      setTempProfile((prev) => ({ ...prev, avatar: newAvatarUrl }));
      showToast("Cập nhật ảnh đại diện thành công!");
    } else if (newAvatarUrl !== null) {
      showToast("URL ảnh không hợp lệ", "error");
    }
  };

  return (
    <div className={styles.container}>
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.toastIcon}>
            {toast.type === "success" ? "✓" : "⚠"}
          </div>
          <div className={styles.toastMessage}>{toast.message}</div>
        </div>
      )}

      {/* Profile Header Block */}
      <div className={styles.headerBlock}>
        <div className={styles.coverBanner} style={{ background: profile.cover }}>
          <div className={styles.coverOverlay}></div>
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.avatarContainer} onClick={handleAvatarChange}>
            <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
            <div className={styles.avatarOverlay}>
              <span className={styles.cameraIcon}><img src={cameraIcon} alt="Camera" /></span>
              <span className={styles.avatarText}>Thay ảnh</span>
            </div>
          </div>
          <div className={styles.mainBio}>
            <div className={styles.bioNameRow}>
              <h1 className={styles.fullName}>{profile.name}</h1>
              <span className={styles.statusBadge}>Đang hoạt động</span>
            </div>
            <p className={styles.roleTitle}>{profile.role} • {profile.department}</p>
            <p className={styles.joinDate}>Gia nhập ngày {profile.joinDate}</p>
          </div>
          <div className={styles.headerActions}>
            {!isEditing ? (
              <button className={styles.editBtn} onClick={handleStartEdit}>
                <img src={penIcon} alt="" className={styles.btnIcon} /> Chỉnh sửa hồ sơ
              </button>
            ) : (
              <div className={styles.editActions}>
                <button className={styles.saveBtn} onClick={handleSaveProfile}>
                  ✓ Lưu thay đổi
                </button>
                <button className={styles.cancelBtn} onClick={handleCancelEdit}>
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.profileBody}>
        {/* Sidebar Nav Tabs */}
        <div className={styles.navTabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === "personal" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("personal");
              if (!isEditing) setIsEditing(false);
            }}
          >
            <img src={userIcon} alt="" className={styles.tabIcon} /> Thông tin cá nhân
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "academic" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("academic");
              if (!isEditing) setIsEditing(false);
            }}
          >
            <img src={academicIcon} alt="" className={styles.tabIcon} /> Học tập & Chuyên môn
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "activity" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("activity");
              setIsEditing(false);
            }}
          >
            <img src={timelineIcon} alt="" className={styles.tabIcon} /> Lịch sử hoạt động
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "security" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("security");
              setIsEditing(false);
            }}
          >
            <img src={shieldIcon} alt="" className={styles.tabIcon} /> Bảo mật & Cài đặt
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentCard}>
          {/* Tab 1: Personal Info */}
          {activeTab === "personal" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Thông tin cá nhân</h2>
              </div>
              <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      value={isEditing ? tempProfile.name : profile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Nhập họ tên đầy đủ"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Mã số sinh viên (MSSV)</label>
                    <input
                      type="text"
                      value={isEditing ? tempProfile.studentId : profile.studentId}
                      onChange={(e) => setTempProfile({ ...tempProfile, studentId: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Mã số sinh viên"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Địa chỉ Email</label>
                    <input
                      type="email"
                      value={isEditing ? tempProfile.email : profile.email}
                      onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                      disabled={!isEditing}
                      placeholder="username@hcmut.edu.vn"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={isEditing ? tempProfile.phone : profile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Số điện thoại liên lạc"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      value={isEditing ? tempProfile.dob : profile.dob}
                      onChange={(e) => setTempProfile({ ...tempProfile, dob: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Giới tính</label>
                    {isEditing ? (
                      <select
                        value={tempProfile.gender}
                        onChange={(e) => setTempProfile({ ...tempProfile, gender: e.target.value })}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <input type="text" value={profile.gender} disabled />
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.facultyGroup}`}>
                    <label>Khoa</label>
                    {isEditing ? (
                      <div className={styles.facultyWrapper}>
                        <select
                          value={showAddFaculty ? "__add__" : tempProfile.faculty}
                          onChange={(e) => {
                            if (e.target.value === "__add__") {
                              setShowAddFaculty(true);
                            } else {
                              setShowAddFaculty(false);
                              setTempProfile({ ...tempProfile, faculty: e.target.value });
                            }
                          }}
                          className={styles.facultySelect}
                        >
                          {faculties.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                          <option value="__add__">+ Thêm khoa mới...</option>
                        </select>
                        {showAddFaculty && (
                          <div className={styles.addFacultyRow}>
                            <input
                              type="text"
                              placeholder="Nhập tên khoa mới"
                              value={newFaculty}
                              onChange={(e) => setNewFaculty(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFaculty())}
                              className={styles.facultyInput}
                              autoFocus
                            />
                            <button
                              type="button"
                              className={styles.addFacultyBtn}
                              onClick={handleAddFaculty}
                            >
                              <img src={plusIcon} alt="" className={styles.addFacultyIcon} />
                              Thêm
                            </button>
                            <button
                              type="button"
                              className={styles.cancelFacultyBtn}
                              onClick={() => { setShowAddFaculty(false); setNewFaculty(""); }}
                            >
                              Hủy
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input type="text" value={profile.faculty} disabled />
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveSubmitBtn}>
                      Lưu thông tin cá nhân
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Tab 2: Academic & Expertise Info */}
          {activeTab === "academic" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Chuyên môn</h2>
              </div>
              <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Điểm GPA</label>
                    <input
                      type="text"
                      value={isEditing ? tempProfile.gpa : profile.gpa}
                      onChange={(e) => setTempProfile({ ...tempProfile, gpa: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ví dụ: 8.25/10"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ban chủ nhiệm</label>
                    {isEditing ? (
                      <select
                        value={tempProfile.department}
                        onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })}
                      >
                        <option value="Ban Chủ nhiệm">Ban Chủ nhiệm</option>
                        <option value="Ban Học thuật">Ban Học thuật</option>
                        <option value="Ban Truyền thông">Ban Truyền thông</option>
                        <option value="Ban Sự kiện">Ban Sự kiện</option>
                      </select>
                    ) : (
                      <input type="text" value={profile.department} disabled />
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Khoa</label>
                    <input
                      type="text"
                      value={isEditing ? tempProfile.major : profile.major}
                      onChange={(e) => setTempProfile({ ...tempProfile, major: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Khoa Công nghệ phần mềm"
                    />
                  </div>
                </div>

                {/* Skill tag list */}
                <div className={styles.skillsSection}>
                  <label className={styles.skillsLabel}>Kỹ năng học thuật & Công nghệ</label>
                  
                  <div className={styles.tagsContainer}>
                    {(isEditing ? tempProfile.skills : profile.skills).map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            className={styles.removeTagBtn}
                            onClick={() => handleRemoveSkill(skill)}
                            title="Xóa kỹ năng"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className={styles.addSkillRow}>
                      <input
                        type="text"
                        placeholder="Thêm kỹ năng mới (ví dụ: Python, TailwindCSS)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className={styles.skillInput}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className={styles.addSkillBtn}
                      >
                        + Thêm tag
                      </button>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveSubmitBtn}>
                      Lưu chuyên môn & Kỹ năng
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Tab 3: Activities & Accomplishments */}
          {activeTab === "activity" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Lịch sử hoạt động CLB</h2>
              </div>

              <div className={styles.activitiesTimeline}>
                {MOCK_ACTIVITIES.map((act) => (
                  <div key={act.id} className={styles.timelineItem}>
                    <div className={styles.timelineIconWrapper}>
                      <img src={act.icon} alt={act.type} className={styles.timelineIcon} />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4 className={styles.timelineTitle}>{act.title}</h4>
                        <span className={styles.timelineDate}>{act.date}</span>
                      </div>
                      <div className={styles.timelineDetails}>
                        <span className={styles.timelineRole}>Vai trò: <strong>{act.role}</strong></span>
                        <span className={`${styles.timelineStatus} ${
                          act.status.includes("hoàn thành") || act.status.includes("phê duyệt") || act.status.includes("Đã đóng")
                            ? styles.statusSuccess
                            : styles.statusInfo
                        }`}>
                          {act.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Security & Notification Settings */}
          {activeTab === "security" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Bảo mật & Cài đặt tài khoản</h2>
              </div>

              <div className={styles.settingsGrid}>
                {/* Section A: Password change */}
                <div className={styles.settingsSectionCard}>
                  <h3><img src={shieldIcon} alt="" className={styles.sectionHeaderIcon} /> Thay đổi mật khẩu</h3>
                  <form onSubmit={handlePasswordSubmit} className={styles.securityForm}>
                    <div className={styles.formGroup}>
                      <label>Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Mật khẩu mới</label>
                      <input
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        placeholder="Xác nhận mật khẩu mới"
                        required
                      />
                    </div>
                    <button type="submit" className={styles.changePasswordBtn}>
                      Cập nhật mật khẩu mới
                    </button>
                  </form>
                </div>

                {/* Section B: Toggles for notifications */}
                <div className={styles.settingsSectionCard}>
                  <h3><img src={notiIcon} alt="" className={styles.sectionHeaderIcon} /> Tùy chọn thông báo</h3>
                  <p className={styles.settingsSubtext}>Đăng ký các kênh để cập nhật thông tin kịp thời nhất.</p>
                  
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleItem}>
                      <div className={styles.toggleText}>
                        <h4>Thông báo qua Email</h4>
                        <p>Nhận tóm tắt tuần và thông báo quan trọng qua địa chỉ email liên kết.</p>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.emailAlerts}
                          onChange={(e) =>
                            setNotifications({ ...notifications, emailAlerts: e.target.checked })
                          }
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.toggleItem}>
                      <div className={styles.toggleText}>
                        <h4>Thông báo hoạt động CLB</h4>
                        <p>Đăng ký tin tức sự kiện mới và các hoạt động của câu lạc bộ.</p>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.activityUpdates}
                          onChange={(e) =>
                            setNotifications({ ...notifications, activityUpdates: e.target.checked })
                          }
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.toggleItem}>
                      <div className={styles.toggleText}>
                        <h4>Nhắc nhở đóng phí & Quỹ</h4>
                        <p>Nhận cảnh báo khi có các đợt thu quỹ hoặc nghĩa vụ tài chính cần hoàn tất.</p>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.financeReminder}
                          onChange={(e) =>
                            setNotifications({ ...notifications, financeReminder: e.target.checked })
                          }
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>                 
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
