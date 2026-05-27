import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProfilePage.module.css";
import cameraIcon from "../../assets/icons/camera.svg";
import userIcon from "../../assets/icons/user.svg";
import academicIcon from "../../assets/icons/academic.svg";
import timelineIcon from "../../assets/icons/timeline.svg";
import useAuthStore from "../../store/auth-store";
import { getMemberByIdAPI } from "../../services/member-service";
import {
  getEventRegistrationsByMemberAPI,
  getEventOrganizersByMemberAPI,
  getEventsAPI,
  normalizeEventFromApi,
} from "../../services/event-service";
import {
  getResourcesAPI,
  normalizeResourceFromApi,
} from "../../services/resource-service";
import { getMemberDuesAPI } from "../../services/finance-service";
import {
  getInitials,
  readCustomProfile,
  writeCustomProfile,
} from "../../utils/profile-custom";

const COVER_BACKGROUND =
  "linear-gradient(135deg, #1e3a8a 0%, #003d82 50%, #3a445eff 100%)";

const EMPTY_PROFILE = {
  name: "",
  studentId: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  faculty: "",
  department: "",
  major: "",
  skills: [],
  joinDate: "",
  role: "",
  status: "",
  avatar: "",
  cover: COVER_BACKGROUND,
};

const GENDER_LABELS = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const REQUEST_STATUS_LABELS = {
  APPROVED: "Đang hoạt động",
  PENDING: "Đang xét duyệt",
  REJECTED: "Từ chối",
};

const DUE_STATUS_LABELS = {
  COMPLETED: "Đã đóng",
  PENDING: "Chờ đóng",
  CANCELLED: "Đã hủy",
};

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
  "Ionic", "Xamarin",
];

const getLocalDateParts = (value) => {
  if (!value) return null;
  const text = String(value);
  const datePart = text.slice(0, 10);
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const monthMatch = text.match(/^(\d{4})-(\d{2})$/);

  if (match) {
    return {
      year: match[1],
      month: match[2],
      day: match[3],
      sortValue: Number(`${match[1]}${match[2]}${match[3]}`),
    };
  }

  if (monthMatch) {
    return {
      year: monthMatch[1],
      month: monthMatch[2],
      day: "",
      monthOnly: true,
      sortValue: Number(`${monthMatch[1]}${monthMatch[2]}00`),
    };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return {
    year,
    month,
    day,
    sortValue: Number(`${year}${month}${day}`),
  };
};

const formatDateForInput = (value) => {
  const parts = getLocalDateParts(value);
  return parts && !parts.monthOnly
    ? `${parts.year}-${parts.month}-${parts.day}`
    : "";
};

const formatDisplayDate = (value) => {
  const parts = getLocalDateParts(value);
  if (!parts) return "";
  return parts.monthOnly
    ? `${parts.month}/${parts.year}`
    : `${parts.day}/${parts.month}/${parts.year}`;
};

const getActivitySortValue = (value) => getLocalDateParts(value)?.sortValue || 0;

const fileToOptimizedAvatar = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Không thể đọc file ảnh."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("File ảnh không hợp lệ."));
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

const buildProfile = (currentUser, member, customProfile) => {
  const source = {
    ...currentUser,
    ...member,
  };

  const roleName = member?.roleName || currentUser?.roleName || "";
  const departmentName =
    member?.departmentName || currentUser?.departmentName || "";
  const reqStatus = member?.reqStatus || currentUser?.reqStatus || "";

  return {
    ...EMPTY_PROFILE,
    name: source.fullName || "",
    studentId: source.studentId || "",
    email: source.email || "",
    phone: member?.phone || "",
    dob: formatDateForInput(member?.dateOfBirth),
    gender: GENDER_LABELS[member?.gender] || member?.gender || "",
    faculty: departmentName,
    department: departmentName,
    major: departmentName ? `Khoa ${departmentName}` : "",
    skills: customProfile.skills || [],
    joinDate: formatDisplayDate(member?.createdAt || currentUser?.createdAt),
    role: roleName,
    status: REQUEST_STATUS_LABELS[reqStatus] || reqStatus || "Chưa cập nhật",
    avatar: customProfile.avatar || "",
    cover: COVER_BACKGROUND,
  };
};

const formatDocumentStatus = (status) => {
  if (status === "APPROVED" || status === "approved") return "Đã phê duyệt";
  if (status === "REJECTED" || status === "rejected") return "Từ chối";
  return "Đang xét duyệt";
};

const formatEventRegistrationStatus = (registration, event) => {
  if (registration.attended) return "Đã tham dự";
  if (event?.status === "completed") return "Vắng mặt";
  return "Đã đăng ký";
};

const buildActivities = ({
  registrations = [],
  organizers = [],
  resources = [],
  dues = [],
  events = [],
  member,
  currentUser,
  memberId,
}) => {
  const normalizedEvents = (events || []).map(normalizeEventFromApi);
  const eventById = new Map(
    normalizedEvents.map((event) => [String(event.id), event])
  );

  const activityItems = [];

  if (member?.createdAt || currentUser?.createdAt) {
    activityItems.push({
      id: `member-${memberId}`,
      type: "member",
      title: "Gia nhập CLB",
      role: member?.roleName || currentUser?.roleName || "Thành viên",
      date: formatDisplayDate(member?.createdAt || currentUser?.createdAt),
      rawDate: member?.createdAt || currentUser?.createdAt,
      status: REQUEST_STATUS_LABELS[member?.reqStatus || currentUser?.reqStatus] || "Đã duyệt",
    });
  }

  registrations.forEach((registration) => {
    const event = eventById.get(String(registration.eventId));
    const rawDate = event?.date || registration.registeredAt;
    activityItems.push({
      id: `registration-${registration.eventId}-${registration.memberId}`,
      type: "event",
      title: event?.title || `Sự kiện ${registration.eventId}`,
      role: "Thành viên tham dự",
      date: formatDisplayDate(rawDate),
      rawDate,
      status: formatEventRegistrationStatus(registration, event),
    });
  });

  organizers.forEach((organizer) => {
    const event = eventById.get(String(organizer.eventId));
    const rawDate = event?.date || "";
    activityItems.push({
      id: `organizer-${organizer.eventId}-${organizer.memberId}-${organizer.roleId || "role"}`,
      type: "event",
      title: event?.title || `Sự kiện ${organizer.eventId}`,
      role: organizer.roleName || "Ban tổ chức",
      date: formatDisplayDate(rawDate),
      rawDate,
      status: "Đã phân công",
    });
  });

  resources
    .map(normalizeResourceFromApi)
    .filter((resource) => Number(resource.memberId) === Number(memberId))
    .forEach((resource) => {
      activityItems.push({
        id: `document-${resource.id}`,
        type: "document",
        title: resource.title || "Tài liệu",
        role: "Người cung cấp",
        date: formatDisplayDate(resource.createdAt),
        rawDate: resource.createdAt,
        status: formatDocumentStatus(resource.reqStatus || resource.status),
      });
    });

  dues.forEach((due) => {
    const rawDate = due.month || "";
    activityItems.push({
      id: `due-${due.transactionId || due.month || due.memberId}`,
      type: "finance",
      title: due.month ? `Đóng quỹ tháng ${due.month}` : "Đóng quỹ CLB",
      role: due.roleName || "Thành viên",
      date: formatDisplayDate(rawDate),
      rawDate,
      status: DUE_STATUS_LABELS[due.status] || due.status || "Chưa cập nhật",
    });
  });

  return activityItems
    .filter((item) => item.title)
    .sort((a, b) => getActivitySortValue(b.rawDate) - getActivitySortValue(a.rawDate));
};

const isSuccessStatus = (status = "") =>
  [
    "Đang hoạt động",
    "Đã duyệt",
    "Đã tham dự",
    "Đã đăng ký",
    "Đã phân công",
    "Đã phê duyệt",
    "Đã đóng",
  ].some((text) => status.includes(text));

const ProfilePage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const memberId = currentUser?.memberId;
  const [activeTab, setActiveTab] = useState("personal");
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [activities, setActivities] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const suggestionsRef = useRef(null);
  const skillInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const customProfile = useMemo(
    () => readCustomProfile(memberId),
    [memberId]
  );

  const filteredSuggestions = newSkill.trim()
    ? SKILL_SUGGESTIONS.filter(
        (skill) =>
          skill.toLowerCase().includes(newSkill.trim().toLowerCase()) &&
          !profile.skills.includes(skill)
      ).slice(0, 8)
    : [];

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

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

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!memberId) {
        setProfile(EMPTY_PROFILE);
        setProfileError("Bạn cần đăng nhập để xem hồ sơ.");
        return;
      }

      setProfileLoading(true);
      setProfileError("");

      try {
        const member = await getMemberByIdAPI(memberId);
        if (!ignore) {
          setProfile(buildProfile(currentUser, member, customProfile));
        }
      } catch (error) {
        if (!ignore) {
          setProfile(buildProfile(currentUser, null, customProfile));
          setProfileError(
            error?.message || "Không thể tải đầy đủ thông tin hồ sơ."
          );
        }
      } finally {
        if (!ignore) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [currentUser, customProfile, memberId]);

  useEffect(() => {
    let ignore = false;

    const loadActivities = async () => {
      if (!memberId) {
        setActivities([]);
        setActivityError("");
        return;
      }

      setActivityLoading(true);
      setActivityError("");

      try {
        const [
          member,
          registrations,
          organizers,
          resources,
          dues,
          events,
        ] = await Promise.all([
          getMemberByIdAPI(memberId).catch(() => null),
          getEventRegistrationsByMemberAPI(memberId).catch(() => []),
          getEventOrganizersByMemberAPI(memberId).catch(() => []),
          getResourcesAPI().catch(() => []),
          getMemberDuesAPI(memberId).catch(() => []),
          getEventsAPI().catch(() => []),
        ]);

        if (!ignore) {
          setActivities(
            buildActivities({
              registrations,
              organizers,
              resources,
              dues,
              events,
              member,
              currentUser,
              memberId,
            })
          );
        }
      } catch (error) {
        if (!ignore) {
          setActivities([]);
          setActivityError(
            error?.message || "Không thể tải lịch sử hoạt động."
          );
        }
      } finally {
        if (!ignore) {
          setActivityLoading(false);
        }
      }
    };

    loadActivities();
    return () => {
      ignore = true;
    };
  }, [currentUser, memberId]);

  const persistCustomProfile = (updates) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        ...updates,
      };
      writeCustomProfile(memberId, {
        avatar: next.avatar,
        skills: next.skills,
      });
      return next;
    });
  };

  const handleAddSkill = (skillName) => {
    const trimmed = (skillName || newSkill).trim();
    if (!trimmed) return;

    if (profile.skills.includes(trimmed)) {
      showToast("Kỹ năng này đã tồn tại", "error");
      return;
    }

    persistCustomProfile({
      skills: [...profile.skills, trimmed],
    });
    setNewSkill("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    showToast(`Đã thêm kỹ năng "${trimmed}"!`);
  };

  const handleRemoveSkill = (skillToRemove) => {
    persistCustomProfile({
      skills: profile.skills.filter((skill) => skill !== skillToRemove),
    });
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
      if (
        selectedSuggestionIndex >= 0 &&
        filteredSuggestions[selectedSuggestionIndex]
      ) {
        handleAddSkill(filteredSuggestions[selectedSuggestionIndex]);
      } else {
        handleAddSkill();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleAvatarPick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file ảnh hợp lệ", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Ảnh đại diện không được vượt quá 5MB", "error");
      return;
    }

    try {
      const avatar = await fileToOptimizedAvatar(file);
      persistCustomProfile({ avatar });
      showToast("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      showToast(error?.message || "Không thể cập nhật ảnh đại diện", "error");
    }
  };

  const renderAvatar = () => {
    if (profile.avatar) {
      return (
        <img
          src={profile.avatar}
          alt={profile.name || "Ảnh đại diện"}
          className={styles.avatar}
        />
      );
    }

    return (
      <div className={styles.avatarInitials}>
        {getInitials(
          profile.name,
          profile.studentId ? String(profile.studentId).slice(0, 2) : "TV"
        )}
      </div>
    );
  };

  if (!memberId) {
    return (
      <div className={styles.container}>
        <div className={styles.contentCard}>
          <div className={styles.emptyState}>
            Bạn cần đăng nhập để xem hồ sơ.
          </div>
        </div>
      </div>
    );
  }

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

      <div className={styles.headerBlock}>
        <div
          className={styles.coverBanner}
          style={{ background: profile.cover }}
        >
          <div className={styles.coverOverlay}></div>
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.avatarContainer} onClick={handleAvatarPick}>
            {renderAvatar()}
            <div className={styles.avatarOverlay}>
              <span className={styles.cameraIcon}>
                <img src={cameraIcon} alt="Camera" />
              </span>
              <span className={styles.avatarText}>Thay ảnh</span>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className={styles.avatarInput}
              onChange={handleAvatarFileChange}
            />
          </div>
          <div className={styles.mainBio}>
            <div className={styles.bioNameRow}>
              <h1 className={styles.fullName}>
                {profile.name || "Chưa cập nhật"}
              </h1>
              <span className={styles.statusBadge}>{profile.status}</span>
            </div>
            <p className={styles.roleTitle}>
              {[profile.role, profile.department].filter(Boolean).join(" • ") ||
                "Chưa cập nhật vai trò"}
            </p>
            <p className={styles.joinDate}>
              Gia nhập ngày {profile.joinDate || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      {profileError && (
        <div className={styles.inlineAlert}>{profileError}</div>
      )}

      <div className={styles.profileBody}>
        <div className={styles.navTabs}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "personal" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("personal")}
          >
            <img src={userIcon} alt="" className={styles.tabIcon} /> Thông tin cá nhân
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "academic" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("academic")}
          >
            <img src={academicIcon} alt="" className={styles.tabIcon} /> Học tập & Chuyên môn
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "activity" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("activity")}
          >
            <img src={timelineIcon} alt="" className={styles.tabIcon} /> Lịch sử hoạt động
          </button>
        </div>

        <div className={styles.contentCard}>
          {activeTab === "personal" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Thông tin cá nhân</h2>
              </div>
              {profileLoading ? (
                <div className={styles.emptyState}>Đang tải hồ sơ...</div>
              ) : (
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
              )}
            </div>
          )}

          {activeTab === "academic" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Chuyên môn</h2>
              </div>
              <div className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Vai trò</label>
                    <input type="text" value={profile.role} disabled />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Khoa</label>
                    <input type="text" value={profile.major} disabled />
                  </div>
                </div>

                <div className={styles.skillsSection}>
                  <label className={styles.skillsLabel}>
                    Kỹ năng học thuật & Công nghệ
                  </label>

                  <div className={styles.tagsContainer}>
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill) => (
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
                      ))
                    ) : (
                      <span className={styles.mutedText}>
                        Chưa có kỹ năng nào.
                      </span>
                    )}
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
                        <div
                          className={styles.suggestionsDropdown}
                          ref={suggestionsRef}
                        >
                          {filteredSuggestions.map((suggestion, index) => (
                            <div
                              key={suggestion}
                              className={`${styles.suggestionItem} ${
                                index === selectedSuggestionIndex
                                  ? styles.suggestionActive
                                  : ""
                              }`}
                              onClick={() => handleAddSkill(suggestion)}
                              onMouseEnter={() =>
                                setSelectedSuggestionIndex(index)
                              }
                            >
                              <span className={styles.suggestionIcon}>+</span>
                              <span className={styles.suggestionText}>
                                {suggestion}
                              </span>
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

          {activeTab === "activity" && (
            <div className={styles.tabContent}>
              <div className={styles.contentHeader}>
                <h2>Lịch sử hoạt động CLB</h2>
              </div>

              {activityLoading ? (
                <div className={styles.emptyState}>Đang tải hoạt động...</div>
              ) : activityError ? (
                <div className={styles.emptyState}>{activityError}</div>
              ) : activities.length === 0 ? (
                <div className={styles.emptyState}>
                  Chưa có lịch sử hoạt động.
                </div>
              ) : (
                <div className={styles.activitiesTimeline}>
                  {activities.map((act) => (
                    <div key={act.id} className={styles.timelineItem}>
                      <div
                        className={`${styles.timelineIconWrapper} ${
                          act.type === "event"
                            ? styles.dotEvent
                            : act.type === "document"
                              ? styles.dotDocument
                              : act.type === "finance"
                                ? styles.dotFinance
                                : act.type === "member"
                                  ? styles.dotMember
                                  : ""
                        }`}
                      ></div>
                      <div
                        className={`${styles.timelineContent} ${
                          act.type === "event"
                            ? styles.bgEvent
                            : act.type === "document"
                              ? styles.bgDocument
                              : act.type === "finance"
                                ? styles.bgFinance
                                : act.type === "member"
                                  ? styles.bgMember
                                  : ""
                        }`}
                      >
                        <div className={styles.timelineHeader}>
                          <h4 className={styles.timelineTitle}>{act.title}</h4>
                          <span className={styles.timelineDate}>
                            {act.date || "Chưa cập nhật"}
                          </span>
                        </div>
                        <div className={styles.timelineDetails}>
                          <span className={styles.timelineRole}>
                            Vai trò: <strong>{act.role}</strong>
                          </span>
                          <span
                            className={`${styles.timelineStatus} ${
                              isSuccessStatus(act.status)
                                ? styles.statusSuccess
                                : styles.statusInfo
                            }`}
                          >
                            {act.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
