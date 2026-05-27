import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";
import archiveIcon from "../../assets/icons/archive.svg";
import membersIcon from "../../assets/icons/members.svg";
import eventsIcon from "../../assets/icons/events.svg";
import addIcon from "../../assets/icons/add.svg";
import verifyIcon from "../../assets/icons/verify.svg";
import maintenanceIcon from "../../assets/icons/maintenance.svg";
import exportReportIcon from "../../assets/icons/export-report.svg";
import preferencesIcon from "../../assets/icons/preferences.svg";
import chevronRightIcon from "../../assets/icons/chevron-right.svg";
import useScrollReveal from "../../hooks/useScrollReveal";
import { getEventsAPI, normalizeEventFromApi } from "../../services/event-service";
import { getMembersAPI } from "../../services/member-service";
import { getNotificationsAPI } from "../../services/notification-service";
import useAuthStore from "../../store/auth-store";
import { isManager } from "../../utils/access-control";

const APPROVED_STATUS = "APPROVED";

const DEFAULT_OVERVIEW = {
  stats: [
    {
      label: "Hoạt động",
      value: 0,
      sub: "Tổng trong năm",
      desc: "Dữ liệu hoạt động được đồng bộ từ hệ thống.",
      badge: "0 tháng này",
    },
    {
      label: "Thành viên",
      value: 0,
      sub: "Tổng trong CLB",
      desc: "Thành viên hiện có trong câu lạc bộ.",
    },
    {
      label: "Sự kiện tháng này",
      value: 0,
      sub: "Đã lên lịch",
      desc: "Sự kiện đang được theo dõi trong tháng.",
    },
  ],
  activities: [],
};

const FALLBACK_ACTIVITIES = [
  {
    text: "Chưa có hoạt động mới từ API.",
    time: "",
    desc: "Danh sách sẽ tự cập nhật khi backend trả dữ liệu.",
  },
];

const metricIcons = [archiveIcon, membersIcon, eventsIcon];

const formatRelativeTime = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return value || "";

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

const formatEventMonth = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return `Tháng ${date.getMonth() + 1}`;
};

const normalizeActivity = (activity, index) => ({
  id: `${activity.text || "activity"}-${index}`,
  text: activity.text || "Hoạt động mới",
  time: formatRelativeTime(activity.time),
  desc: activity.content || activity.description || activity.desc || "Cập nhật từ hệ thống.",
  icon: index % 3 === 0 ? addIcon : index % 3 === 1 ? verifyIcon : maintenanceIcon,
});

const buildHomeOverview = (members = [], events = [], notifications = []) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const approvedMembers = members.filter((member) => member.reqStatus === APPROVED_STATUS);
  const normalizedEvents = events.map(normalizeEventFromApi);
  const eventsThisMonth = normalizedEvents.filter((event) => {
    const eventDate = event.date ? new Date(event.date) : null;
    return (
      eventDate &&
      !Number.isNaN(eventDate.getTime()) &&
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });
  const eventsThisYear = normalizedEvents.filter((event) => {
    const eventDate = event.date ? new Date(event.date) : null;
    return eventDate && !Number.isNaN(eventDate.getTime()) && eventDate.getFullYear() === currentYear;
  });

  return {
    stats: [
      {
        label: "Hoạt động",
        value: eventsThisYear.length,
        sub: "Tổng trong năm",
        desc: "Hoạt động được đồng bộ từ danh sách sự kiện.",
        badge: `${eventsThisMonth.length} tháng này`,
      },
      {
        label: "Thành viên",
        value: approvedMembers.length || members.length,
        sub: "Tổng trong CLB",
        desc: "Thành viên hiện có trong câu lạc bộ.",
      },
      {
        label: "Sự kiện tháng này",
        value: eventsThisMonth.length,
        sub: "Đã lên lịch",
        desc: "Sự kiện đang được theo dõi trong tháng.",
      },
    ],
    activities: notifications
      .slice()
      .sort((a, b) => new Date(b.sentAt || 0) - new Date(a.sentAt || 0))
      .slice(0, 10)
      .map((item) => ({
        text: item.title,
        time: item.sentAt,
        content: item.content,
      })),
    events: normalizedEvents,
  };
};

const Homepage = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const canUseManagerTools = isManager(currentUser);
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [events, setEvents] = useState([]);
  const [apiError, setApiError] = useState("");
  useScrollReveal();

  useEffect(() => {
    let ignore = false;

    const loadHomeData = async () => {
      setApiError("");
      const [membersResult, eventsResult, notificationsResult] = await Promise.allSettled([
        getMembersAPI(),
        getEventsAPI(),
        getNotificationsAPI(),
      ]);
      if (ignore) return;

      const memberData =
        membersResult.status === "fulfilled" && Array.isArray(membersResult.value)
          ? membersResult.value
          : [];
      const eventData =
        eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value)
          ? eventsResult.value
          : [];
      const notificationData =
        notificationsResult.status === "fulfilled" && Array.isArray(notificationsResult.value)
          ? notificationsResult.value
          : [];

      const nextOverview = buildHomeOverview(memberData, eventData, notificationData);
      setOverview((prev) => ({
        ...prev,
        stats: nextOverview.stats,
        activities: nextOverview.activities,
      }));
      setEvents(nextOverview.events);

      const errors = [membersResult, eventsResult, notificationsResult]
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason?.message)
        .filter(Boolean);
      if (errors.length) {
        setApiError(errors[0]);
      }
    };

    loadHomeData();
    return () => {
      ignore = true;
    };
  }, []);

  const metricCards = useMemo(() => {
    const statsByLabel = new Map((overview.stats || []).map((item) => [item.label, item]));
    const ordered = [
      statsByLabel.get("Hoạt động") || overview.stats?.[0] || DEFAULT_OVERVIEW.stats[0],
      statsByLabel.get("Thành viên") || overview.stats?.[1] || DEFAULT_OVERVIEW.stats[1],
      statsByLabel.get("Sự kiện tháng này") || overview.stats?.[2] || DEFAULT_OVERVIEW.stats[2],
    ];

    return ordered.map((stat, index) => ({
      ...stat,
      icon: metricIcons[index],
      desc: stat.desc || stat.sub || DEFAULT_OVERVIEW.stats[index].desc,
      badge: index === 0 ? stat.badge || "0 tháng này" : "",
    }));
  }, [overview.stats]);

  const activities = useMemo(() => {
    const items = overview.activities?.length ? overview.activities : FALLBACK_ACTIVITIES;
    return items.slice(0, 3).map(normalizeActivity);
  }, [overview.activities]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        const eventDate = event.date ? new Date(event.date) : null;
        return eventDate && !Number.isNaN(eventDate.getTime()) && eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2);
  }, [events]);

  const displayName = currentUser?.fullName || currentUser?.roleName || "Thành viên CLB";

  return (
    <div className={styles.container}>
      <div className={`${styles.hero} reveal`}>
        <div className={`${styles.heroContent} reveal-left`}>
          <h1 className={styles.heroTitle}>Welcome back, {displayName}</h1>
          <p className={styles.heroSubtitle}>
            Quản lý hoạt động của câu lạc bộ, sắp xếp các sự kiện sắp tới, và
            giám sát cộng đồng.
          </p>
          <div className={styles.heroButtons}>
            <button
              className={styles.secondaryButton}
              onClick={() => navigate(canUseManagerTools ? "/dashboard" : "/profile")}
            >
              {canUseManagerTools ? "Xem báo cáo" : "Xem hồ sơ"}
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.metrics} reveal`}>
        <div className={styles.metricsHeader}>
          <h2 className={styles.metricsTitle}>Tổng quan</h2>
        </div>
        <div className={`${styles.metricsGrid} reveal`}>
          {metricCards.map((metric) => (
            <div className={styles.metricCard} key={metric.label}>
              <div className={styles.metricIconLabelRow}>
                <div className={styles.metricIcon}>
                  <img src={metric.icon} alt="" />
                </div>
                <div className={styles.metricLabel}>{metric.label}</div>
                {metric.badge && <div className={styles.metricBadge}>{metric.badge}</div>}
              </div>
              <div className={styles.metricNumber}>
                {Number(metric.value || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.mainContent} reveal`}>
        <div className={`${styles.leftColumn} reveal-left`}>
          <div className={styles.activity}>
            <h3 className={styles.sectionTitle}>Hoạt động gần đây</h3>
            <div className={styles.activityList}>
              {activities.map((activity) => (
                <div className={styles.activityItem} key={activity.id}>
                  <div className={styles.activityIcon}>
                    <img src={activity.icon} alt="" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityTitle}>{activity.text}</span>
                      <span className={styles.activityTime}>{activity.time}</span>
                    </div>
                    <p className={styles.activityDesc}>{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.status}>
            <div className={styles.statusHeader}>
              <div className={styles.statusDot}></div>
              <h3 className={styles.statusTitle}>Hoạt động hệ thống</h3>
            </div>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>API CLB</span>
                <span className={styles.statusValue}>
                  {apiError ? "Cần kiểm tra" : "Đang kết nối"}
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Thành viên</span>
                <span className={styles.statusValue}>{metricCards[1]?.value ?? 0}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Sự kiện</span>
                <span className={styles.statusValue}>{metricCards[2]?.value ?? 0}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Đồng bộ</span>
                <span className={styles.statusValue}>{apiError ? "Lỗi" : "Tốt"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.rightColumn} reveal-right`}>
          <div className={styles.events}>
            <h3 className={styles.sectionTitle}>Sự kiện sắp tới</h3>
            <div className={styles.eventList}>
              {upcomingEvents.length === 0 ? (
                <p className={styles.eventDesc}>Chưa có sự kiện sắp tới.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div className={styles.eventItem} key={event.id}>
                    <div className={styles.eventDate}>
                      <span className={styles.eventDay}>
                        {event.date ? new Date(event.date).getDate() : "--"}
                      </span>
                      <span className={styles.eventMonth}>{formatEventMonth(event.date)}</span>
                    </div>
                    <div className={styles.eventContent}>
                      <h4 className={styles.eventTitle}>{event.title}</h4>
                      <p className={styles.eventDesc}>
                        {event.location || event.description || "Đang cập nhật địa điểm."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {canUseManagerTools && (
            <div className={styles.adminToolkit}>
              <span className={styles.adminToolkitLabel}>ADMIN TOOLKIT</span>
              <div className={styles.adminToolkitList}>
                <button className={styles.adminToolkitItem} onClick={() => navigate("/dashboard")}>
                  <div className={styles.adminToolkitIcon}>
                    <img src={exportReportIcon} alt="Export Report" width="20" height="20" />
                  </div>
                  <span className={styles.adminToolkitText}>Xuất báo cáo hằng năm</span>
                  <img src={chevronRightIcon} alt="" className={styles.adminToolkitChevron} />
                </button>

                <button className={styles.adminToolkitItem} onClick={() => navigate("/settings")}>
                  <div className={styles.adminToolkitIcon}>
                    <img src={preferencesIcon} alt="System Preferences" width="20" height="20" />
                  </div>
                  <span className={styles.adminToolkitText}>Tùy chỉnh hệ thống</span>
                  <img src={chevronRightIcon} alt="" className={styles.adminToolkitChevron} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
