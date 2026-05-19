import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import { getDashboardOverviewAPI } from "../../services/dashboard-service";

const DEFAULT_OVERVIEW = {
  stats: [
    { label: "Thành viên", value: 124, accent: "#3b82f6", icon: "👥", trend: 8 },
    { label: "Sự kiện",    value: 8,   accent: "#10b981", icon: "📅" },
    { label: "Hoạt động",  value: 42,  accent: "#6366f1", icon: "⚡" },
    { label: "Thông báo",  value: 14,  accent: "#f97316", icon: "🔔" },
  ],
  activities: [
    { text: "Đã thêm 5 thành viên mới hôm nay.",        time: "10 phút trước", icon: "👥" },
    { text: "Cập nhật lịch họp ban chủ nhiệm.",          time: "1 giờ trước",   icon: "📅" },
    { text: "Phê duyệt 3 đơn đăng ký tham gia.",         time: "2 giờ trước",   icon: "✅" },
    { text: "Gửi thông báo sự kiện mới đến thành viên.", time: "5 giờ trước",   icon: "🔔" },
    { text: "Workshop Git & GitHub đã kết thúc.",        time: "Hôm qua",       icon: "🎉" },
  ],
  chartData: [
    { month: "T7",  value: 28 },
    { month: "T8",  value: 42 },
    { month: "T9",  value: 35 },
    { month: "T10", value: 55 },
    { month: "T11", value: 48 },
    { month: "T12", value: 62 },
  ],
};

// ── SVG Bar Chart ─────────────────────────────────────────────
function BarChart({ data }) {
  const W = 520, H = 180, PAD_L = 32, PAD_B = 32, PAD_T = 16, PAD_R = 16;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const max = Math.max(...data.map((d) => d.value));
  const barW = Math.floor(chartW / data.length) - 10;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = PAD_T + chartH * (1 - ratio);
        return <line key={ratio} x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f0f4f8" strokeWidth="1" />;
      })}
      {data.map((d, i) => {
        const x = PAD_L + (chartW / data.length) * i + 5;
        const barH = (d.value / max) * chartH;
        const y = PAD_T + chartH - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={d.month}>
            <rect x={x + 2} y={y + 3} width={barW} height={barH} rx={6} fill="rgba(59,130,246,0.08)" />
            <rect x={x} y={y} width={barW} height={barH} rx={6} fill={isLast ? "#1d4ed8" : "#93c5fd"} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={isLast ? "#1d4ed8" : "#64748b"}>{d.value}</text>
            <text x={x + barW / 2} y={PAD_T + chartH + 18} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────
const DashboardPage = () => {
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [error, setError] = useState("");
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowWelcomeBadge(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    getDashboardOverviewAPI()
      .then((data) => {
        if (data?.stats) {
          setOverview((prev) => ({
            ...prev,
            stats: data.stats,
            activities: data.activities ?? prev.activities,
          }));
        }
      })
      .catch((err) => setError(err?.message || "Không thể tải dữ liệu"));
  }, []);

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bảng điều khiển</h1>
          <p className={styles.pageSubtitle}>
            Tổng quan nhanh về hoạt động, thành viên và sự kiện của câu lạc bộ.
          </p>
        </div>
        {showWelcomeBadge && (
          <div className={styles.pageBadge}>👋 Chào mừng trở lại</div>
        )}
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {overview.stats.map((stat) => (
          <div
            key={stat.label}
            className={styles.statCard}
            style={{ borderLeft: `4px solid ${stat.accent}` }}
          >
            <span className={styles.statIcon}>{stat.icon}</span>
            <div className={styles.statBody}>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
            {typeof stat.trend === "number" && (
              <span className={`${styles.statTrend} ${stat.trend >= 0 ? styles.trendUp : styles.trendDown}`}>
                {stat.trend >= 0 ? "↑" : "↓"} {Math.abs(stat.trend)}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className={styles.bodyGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Hoạt động theo tháng</h2>
            <span className={styles.panelLabel}>6 tháng gần nhất</span>
          </div>
          <BarChart data={overview.chartData} />
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Hoạt động gần đây</h2>
            <span className={styles.panelLabel}>Mới nhất</span>
          </div>
          <ul className={styles.timeline}>
            {overview.activities.map((item, i) => (
              <li key={i} className={styles.timelineItem}>
                <span className={styles.timelineIcon}>{item.icon}</span>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>{item.text}</p>
                  <p className={styles.timelineTime}>{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default DashboardPage;
