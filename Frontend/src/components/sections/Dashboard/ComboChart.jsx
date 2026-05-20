import { useState, useRef } from "react";
import styles from "./ComboChart.module.css";

const TABS = [
  { key: "all",     label: "Tổng hợp" },
  { key: "members", label: "Thành viên" },
  { key: "events",  label: "Sự kiện" },
  { key: "docs",    label: "Tài liệu" },
];

const W = 560, H = 200;
const PAD_L = 36, PAD_R = 16, PAD_T = 24, PAD_B = 32;
const chartW = W - PAD_L - PAD_R;
const chartH = H - PAD_T - PAD_B;

function getMax(data, tab) {
  if (tab === "all")     return Math.max(...data.flatMap(d => [d.events, d.docs, d.members]), 1);
  if (tab === "members") return Math.max(...data.map(d => d.members), 1);
  if (tab === "events")  return Math.max(...data.map(d => d.events), 1);
  if (tab === "docs")    return Math.max(...data.map(d => d.docs), 1);
}

function toY(val, max) {
  return PAD_T + chartH - (val / max) * chartH;
}

// ── Bar (single) ─────────────────────────────────────────────
function SingleBar({ data, key2, color, animate }) {
  const max = getMax(data, key2 === "members" ? "members" : key2 === "events" ? "events" : "docs");
  const step = chartW / data.length;
  const barW = Math.max(18, step * 0.45);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className={animate ? styles.fadeIn : ""} style={{ display: "block", overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = PAD_T + chartH * (1 - r);
        return (
          <g key={r}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f0f4f8" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#cbd5e1">{Math.round(max * r)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const val = d[key2];
        const x = PAD_L + step * i + (step - barW) / 2;
        const bh = (val / max) * chartH;
        const y = toY(val, max);
        const isLast = i === data.length - 1;
        return (
          <g key={d.month}>
            <rect x={x} y={y} width={barW} height={bh} rx={5}
              fill={isLast ? color.dark : color.light} />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="9" fontWeight="700"
              fill={isLast ? color.dark : "#94a3b8"}>{val}</text>
            <text x={x + barW / 2} y={PAD_T + chartH + 18} textAnchor="middle" fontSize="11"
              fill="#94a3b8" fontWeight="500">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Line (single) ─────────────────────────────────────────────
function SingleLine({ data, animate }) {
  const max = getMax(data, "members");
  const step = chartW / data.length;

  const points = data.map((d, i) => {
    const cx = PAD_L + step * i + step / 2;
    return `${cx},${toY(d.members, max)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className={animate ? styles.fadeIn : ""} style={{ display: "block", overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = PAD_T + chartH * (1 - r);
        return (
          <g key={r}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f0f4f8" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#cbd5e1">{Math.round(max * r)}</text>
          </g>
        );
      })}
      {/* Area fill */}
      <polyline
        fill="rgba(249,115,22,0.08)"
        stroke="none"
        points={[
          `${PAD_L + step / 2},${PAD_T + chartH}`,
          ...data.map((d, i) => `${PAD_L + step * i + step / 2},${toY(d.members, max)}`),
          `${PAD_L + step * (data.length - 1) + step / 2},${PAD_T + chartH}`,
        ].join(" ")}
      />
      <polyline fill="none" stroke="#f97316" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" points={points} />
      {data.map((d, i) => {
        const cx = PAD_L + step * i + step / 2;
        const cy = toY(d.members, max);
        return (
          <g key={d.month}>
            <circle cx={cx} cy={cy} r={4} fill="white" stroke="#f97316" strokeWidth="2" />
            <text x={cx} y={cy - 9} textAnchor="middle" fontSize="9" fill="#f97316" fontWeight="700">{d.members}</text>
            <text x={cx} y={PAD_T + chartH + 18} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── All (combo) ───────────────────────────────────────────────
function AllChart({ data, animate }) {
  const max = getMax(data, "all");
  const step = chartW / data.length;
  const GRP = step * 0.55;
  const BW = Math.max(8, GRP / 2 - 3);

  const memberPoints = data.map((d, i) => {
    const cx = PAD_L + step * i + step / 2;
    return `${cx},${toY(d.members, max)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className={animate ? styles.fadeIn : ""} style={{ display: "block", overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = PAD_T + chartH * (1 - r);
        return (
          <g key={r}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f0f4f8" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#cbd5e1">{Math.round(max * r)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const cx = PAD_L + step * i + step / 2;
        const gx = cx - GRP / 2;
        const evH = (d.events / max) * chartH;
        const evY = toY(d.events, max);
        const dcH = (d.docs / max) * chartH;
        const dcY = toY(d.docs, max);
        return (
          <g key={d.month}>
            <rect x={gx} y={evY} width={BW} height={evH} rx={4} fill="#93c5fd" />
            <text x={gx + BW / 2} y={evY - 4} textAnchor="middle" fontSize="9" fill="#64748b">{d.events}</text>
            <rect x={gx + BW + 4} y={dcY} width={BW} height={dcH} rx={4} fill="#6ee7b7" />
            <text x={gx + BW + 4 + BW / 2} y={dcY - 4} textAnchor="middle" fontSize="9" fill="#64748b">{d.docs}</text>
            <text x={cx} y={PAD_T + chartH + 18} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">{d.month}</text>
          </g>
        );
      })}
      {/* Member line */}
      <polyline fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={memberPoints} />
      {data.map((d, i) => {
        const cx = PAD_L + step * i + step / 2;
        const cy = toY(d.members, max);
        return <circle key={i} cx={cx} cy={cy} r={3.5} fill="white" stroke="#f97316" strokeWidth="2" />;
      })}
    </svg>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function ComboChart({ data }) {
  const [tab, setTab] = useState("all");
  const [animate, setAnimate] = useState(true);
  const frameRef = useRef(null);

  const handleTab = (key) => {
    if (key === tab) return;
    
    setAnimate(false);

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setTab(key);
      setAnimate(true);
    });
  };

  if (!data || data.length === 0) return null;

  const LEGEND = [
    { color: "#93c5fd", label: "Sự kiện", bar: true },
    { color: "#6ee7b7", label: "Tài liệu", bar: true },
    { color: "#f97316", label: "Thành viên mới", bar: false },
  ];

  return (
    <div className={styles.wrap}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
            onClick={() => handleTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Legend (chỉ hiện ở tab Tổng hợp) */}
      {tab === "all" && (
        <div className={styles.legend}>
          {LEGEND.map((l) => (
            <span key={l.label} className={styles.legendItem}>
              {l.bar
                ? <span className={styles.legendBox} style={{ background: l.color }} />
                : <span className={styles.legendLine} style={{ background: l.color }} />
              }
              {l.label}
            </span>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className={styles.chartWrap}>
        {tab === "all"     && <AllChart     data={data} animate={animate} />}
        {tab === "members" && <SingleLine   data={data} animate={animate} />}
        {tab === "events"  && <SingleBar    data={data} key2="events"  color={{ light: "#93c5fd", dark: "#1d4ed8" }} animate={animate} />}
        {tab === "docs"    && <SingleBar    data={data} key2="docs"    color={{ light: "#6ee7b7", dark: "#059669" }} animate={animate} />}
      </div>
    </div>
  );
}