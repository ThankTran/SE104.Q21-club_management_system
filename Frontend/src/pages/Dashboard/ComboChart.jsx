/* ComboChart.jsx
   Cột nhóm: Sự kiện (xanh dương) + Tài liệu (xanh lá)
   Đường:    Thành viên mới (cam)
*/

export default function ComboChart({ data }) {
  const W = 560, H = 200;
  const PAD_L = 40, PAD_R = 20, PAD_T = 20, PAD_B = 36;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  if (!data || data.length === 0) return null;
  const allValues = data.flatMap((d) => [d.events ?? 0, d.docs ?? 0, d.members ?? 0]);
  const max = Math.max(...allValues, 1);
  const step = chartW / data.length;
  const BAR_GROUP = step * 0.55;
  const BAR_W = Math.max(8, BAR_GROUP / 2 - 3);

  const toY = (val) => PAD_T + chartH - (val / max) * chartH;

  // Y-axis grid labels
  const gridRatios = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 11, color: "#64748b", fontWeight: 600 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "#93c5fd", display: "inline-block" }} />
          Sự kiện
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "#6ee7b7", display: "inline-block" }} />
          Tài liệu
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 24, height: 2, background: "#f97316", display: "inline-block", borderRadius: 2 }} />
          Thành viên mới
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>

        {/* Grid lines + Y labels */}
        {gridRatios.map((ratio) => {
          const y = PAD_T + chartH * (1 - ratio);
          const label = Math.round(max * ratio);
          return (
            <g key={ratio}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f0f4f8" strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#cbd5e1">{label}</text>
            </g>
          );
        })}

        {/* Bars + month labels */}
        {data.map((d, i) => {
          const cx = PAD_L + step * i + step / 2;
          const groupX = cx - BAR_GROUP / 2;

          const evH = (d.events / max) * chartH;
          const evY = toY(d.events);

          const docH = (d.docs / max) * chartH;
          const docY = toY(d.docs);

          return (
            <g key={d.month}>
              {/* Event bar */}
              <rect x={groupX} y={evY} width={BAR_W} height={evH} rx={4} fill="#93c5fd" />
              <text x={groupX + BAR_W / 2} y={evY - 4} textAnchor="middle" fontSize="9" fill="#64748b">{d.events}</text>

              {/* Doc bar */}
              <rect x={groupX + BAR_W + 4} y={docY} width={BAR_W} height={docH} rx={4} fill="#6ee7b7" />
              <text x={groupX + BAR_W + 4 + BAR_W / 2} y={docY - 4} textAnchor="middle" fontSize="9" fill="#64748b">{d.docs}</text>

              {/* Month label */}
              <text x={cx} y={PAD_T + chartH + 20} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">{d.month}</text>
            </g>
          );
        })}

        {/* Member line */}
        <polyline
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={data.map((d, i) => {
            const cx = PAD_L + (step * i) + step / 2;
            return `${cx},${toY(d.members)}`;
          }).join(" ")}
        />

        {/* Member dots */}
        {data.map((d, i) => {
          const cx = PAD_L + step * i + step / 2;
          const cy = toY(d.members);
          return (
            <g key={`m-${i}`}>
              <circle cx={cx} cy={cy} r={4} fill="#f97316" />
              <text x={cx} y={cy - 8} textAnchor="middle" fontSize="9" fill="#f97316" fontWeight="700">{d.members}</text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}