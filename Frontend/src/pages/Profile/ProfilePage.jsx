import React, { useState, useRef, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import membersIcon from "../../assets/icons/members.svg";
import eventsIcon from "../../assets/icons/events.svg";
import resourcesIcon from "../../assets/icons/resources.svg";
import financeIcon from "../../assets/icons/finance.svg";
import cameraIcon from "../../assets/icons/camera.svg";
import userIcon from "../../assets/icons/user.svg";
import academicIcon from "../../assets/icons/academic.svg";
import timelineIcon from "../../assets/icons/timeline.svg";

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
  {
    id: 5,
    type: "member",
    title: "Gia nhập CLB Công Nghệ UIT",
    role: "Thành viên mới",
    date: "15/10/2024",
    status: "Đã duyệt",
    icon: membersIcon,
  },
];

const SKILL_SUGGESTIONS = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C",
  "ReactJS", "React Native", "Angular", "Vue.js", "Next.js", "Node.js",
  "Express.js", "Django", "Flask", "Spring Boot", "Laravel", "Ruby on Rails",
  "HTML", "CSS", "SASS", "TailwindCSS", "Bootstrap",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
  "Git", "GitHub", "GitLab", "Docker", "Kubernetes", "AWS", "Azure",
  "UI/UX Design", "Figma", "Adobe XD", "Photoshop",
  "Machine Learning", "Deep Learning", "AI", "Data Science",
  "REST API", "GraphQL", "WebSocket",
  "Linux", "Bash", "PowerShell",
  "Agile", "Scrum", "Jira",
  "Swift", "Kotlin", "Flutter", "Dart",
  "Blockchain", "Solidity", "Web3",
  "Cybersecurity", "Penetration Testing",
  "Unity", "Unreal Engine", "Game Development",
  "Embedded Systems", "IoT", "Arduino", "Raspberry Pi",
  "Go", "Rust", "PHP", "R", "Scala",
  "Jest", "Mocha", "Chai", "JUnit", "PyTest",
  "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
  "Google Cloud Platform", "DigitalOcean", "Heroku",
  "Hadoop", "Spark", "Pandas", "NumPy",
  "Supabase", "Realm",
  "OWASP", "SSL/TLS", "IAM",
  "Terraform", "Ansible", "Puppet", "Chef",
  "Tableau", "Power BI", "Apache Kafka",
  "Ionic", "Xamarin"
];

const ProfilePage = () => {
  // Tabs: 'personal' | 'academic' | 'activity'
  const [activeTab, setActiveTab] = useState("personal");
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const skillInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    studentId: "24520001",
    email: "24520001@gm.uit.edu.vn",
    phone: "0123456789",
    dob: "2006-01-01",
    gender: "Nam",
    faculty: "Công nghệ phần mềm",
    department: "Ban chủ nhiệm",
    major: "Khoa Công nghệ phần mềm",
    skills: ["ReactJS", "Node.js", "UI/UX Design", "SQL", "Git"],
    joinDate: "15/10/2024",
    role: "Trưởng ban ",
    avatar: "https://bazaarvietnam.vn/wp-content/uploads/2023/04/harper-bazaar-ca-si-noi-tieng-nhat-viet-nam-3.jpeg",
    cover: "linear-gradient(135deg, #1e3a8a 0%, #003d82 50%, #3a445eff 100%)",
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  // Lọc gợi ý kỹ năng dựa trên input
  const filteredSuggestions = newSkill.trim()
    ? SKILL_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(newSkill.trim().toLowerCase()) &&
          !profile.skills.includes(s)
      ).slice(0, 8)
    : [];

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        skillInputRef.current &&
        !skillInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSkill = (skillName) => {
    const trimmed = (skillName || newSkill).trim();
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      showToast("Kỹ năng này đã tồn tại", "error");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    showToast(`Đã thêm kỹ năng "${trimmed}"!`);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
    showToast(`Đã xóa kỹ năng "${skillToRemove}"`);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
        handleAddSkill(filteredSuggestions[selectedSuggestionIndex]);
      } else {
        handleAddSkill();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleAvatarChange = () => {
    const newAvatarUrl = prompt("Nhập URL ảnh đại diện mới:", profile.avatar);
    if (newAvatarUrl && newAvatarUrl.trim().startsWith("http")) {
      setProfile((prev) => ({ ...prev, avatar: newAvatarUrl }));
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
        </div>
      </div>

      <div className={styles.profileBody}>
        {/* Sidebar Nav Tabs */}
        <div className={styles.navTabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === "personal" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <img src={userIcon} alt="" className={styles.tabIcon} /> Thông tin cá nhân
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "academic" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("academic")}
          >
            <img src={academicIcon} alt="" className={styles.tabIcon} /> Học tập & Chuyên môn
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "activity" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <img src={timelineIcon} alt="" className={styles.tabIcon} /> Lịch sử hoạt động
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentCard}>
          {/* Tab 1: Personal Info (Read-only) */}
          {activeTab === "personal" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Thông tin cá nhân</h2>
              </div>
              <div className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Họ và tên</label>
                    <input type="text" value={profile.name} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Mã số sinh viên (MSSV)</label>
                    <input type="text" value={profile.studentId} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Địa chỉ Email</label>
                    <input type="email" value={profile.email} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số điện thoại</label>
                    <input type="tel" value={profile.phone} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Ngày sinh</label>
                    <input type="date" value={profile.dob} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Giới tính</label>
                    <input type="text" value={profile.gender} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Khoa</label>
                    <input type="text" value={profile.faculty} disabled />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Academic & Expertise - Only skill tags */}
          {activeTab === "academic" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Chuyên môn</h2>
              </div>
              <div className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Vai trò</label>
                    <input type="text" value={profile.department} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Khoa</label>
                    <input type="text" value={profile.major} disabled />
                  </div>
                </div>

                {/* Skill tag list with autocomplete */}
                <div className={styles.skillsSection}>
                  <label className={styles.skillsLabel}>Kỹ năng học thuật & Công nghệ</label>

                  <div className={styles.tagsContainer}>
                    {profile.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                        <button
                          type="button"
                          className={styles.removeTagBtn}
                          onClick={() => handleRemoveSkill(skill)}
                          title="Xóa kỹ năng"
                        >
                        x
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className={styles.addSkillRow}>
                    <div className={styles.skillInputWrapper}>
                      <input
                        ref={skillInputRef}
                        type="text"
                        placeholder="Gõ để tìm kỹ năng (vd: Python, React...)"
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value);
                          setShowSuggestions(true);
                          setSelectedSuggestionIndex(-1);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleSkillKeyDown}
                        className={styles.skillInput}
                      />
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className={styles.suggestionsDropdown} ref={suggestionsRef}>
                          {filteredSuggestions.map((suggestion, index) => (
                            <div
                              key={suggestion}
                              className={`${styles.suggestionItem} ${
                                index === selectedSuggestionIndex ? styles.suggestionActive : ""
                              }`}
                              onClick={() => handleAddSkill(suggestion)}
                              onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            >
                              <span className={styles.suggestionIcon}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg></span>
                              <span className={styles.suggestionText}>{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSkill()}
                      className={styles.addSkillBtn}
                    >
                      + Thêm tag
                    </button>
                  </div>
                </div>
              </div>
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
                    <div className={`${styles.timelineIconWrapper} ${
                      act.type === 'event'    ? styles.dotEvent    :
                      act.type === 'document' ? styles.dotDocument :
                      act.type === 'finance'  ? styles.dotFinance  :
                      act.type === 'member'   ? styles.dotMember   : ''
                    }`}></div>
                    <div className={`${styles.timelineContent} ${
                      act.type === 'event'    ? styles.bgEvent    :
                      act.type === 'document' ? styles.bgDocument :
                      act.type === 'finance'  ? styles.bgFinance  :
                      act.type === 'member'   ? styles.bgMember   : ''
                    }`}>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
