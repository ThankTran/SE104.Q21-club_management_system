import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import { getDashboardOverviewAPI } from "../services/dashboard-service";

const DEFAULT_OVERVIEW = {
  stats: [
    { label: "Thành viên", value: "124", accent: "#3b82f6" },
    { label: "Sự kiện", value: "8", accent: "#10b981" },
    { label: "Hoạt động", value: "42", accent: "#6366f1" },
    { label: "Thông báo", value: "14", accent: "#f97316" },
  ],
  activities: [
    "Đã thêm 5 thành viên mới hôm nay.",
    "Cập nhật lịch họp ban chủ nhiệm.",
    "Phê duyệt 3 đơn đăng ký tham gia.",
    "Gửi thông báo sự kiện mới đến thành viên.",
  ],
};

const DashboardPage = () => {
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowWelcomeBadge(false);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    getDashboardOverviewAPI()
      .then((data) => {
        if (data && data.stats) {
          setOverview({
            stats: data.stats,
            activities: data.activities ?? DEFAULT_OVERVIEW.activities,
          });
        }
      })
      .catch((err) => {
        setError(err?.message || "Không thể tải dữ liệu");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bảng điều khiển</h1>
          <p className={styles.pageSubtitle}>
            Tổng quan nhanh về hoạt động, thành viên và sự kiện của câu lạc bộ.
          </p>
        </div>

        {showWelcomeBadge && (
          <div className={styles.pageBadge}>Chào mừng trở lại</div>
        )}
      </div>

      <div className={styles.statsGrid}>
        {overview.stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
            <div
              className={styles.statAccent}
              style={{ backgroundColor: stat.accent }}
            />
          </div>
        ))}
      </div>

      <div className={styles.bodyGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Hoạt động gần đây</h2>
            <span className={styles.panelLabel}>Mới nhất</span>
          </div>
          <ul className={styles.activityList}>
            {overview.activities.map((item, index) => (
              <li key={index} className={styles.activityItem}>
                <span className={styles.activityDot} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Thông tin nhanh</h2>
          </div>
          <div className={styles.quickCard}>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : error ? (
              <p className={styles.errorText}>{error}</p>
            ) : (
              <>
                <p className={styles.quickText}>Dữ liệu dashboard đã sẵn sàng.</p>
                <p className={styles.quickMeta}>
                  Số liệu đang được cập nhật tự động từ hệ thống.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
