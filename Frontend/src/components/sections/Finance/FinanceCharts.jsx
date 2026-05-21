import { useState, useMemo } from 'react';
import styles from './FinanceCharts.module.css';

// ── Helpers ──────────────────────────────────────────────────
const MONTHS_VI = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function getMonth(dateStr) {
  return new Date(dateStr).getMonth();
}

function getMonthlyData(thuList, chiList) {
  const thu = Array(12).fill(0);
  const chi = Array(12).fill(0);
  thuList.forEach(r => { thu[getMonth(r.ngayThu)] += r.soTien; });
  chiList.forEach(r => { chi[getMonth(r.ngayLap)] += r.soTien; });
  return { thu, chi };
}

function fmtMoney(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}tr`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return v;
}

function fmtMoneyFull(v) {
  return v.toLocaleString('vi-VN') + '₫';
}

function BarChart({ thuList, chiList }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const { thu, chi } = useMemo(() => getMonthlyData(thuList, chiList), [thuList, chiList]);

  const maxVal = Math.max(...thu, ...chi, 1);
  const BAR_H = 160;

  return (
    <div className={styles.barChart}>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.dotThu} />
          <span>Thu</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.dotChi} />
          <span>Chi</span>
        </div>
      </div>

      <div className={styles.barArea} style={{ height: BAR_H + 28 }}>
        {[0, 25, 50, 75, 100].map(pct => (
          <div
            key={pct}
            className={pct === 0 ? styles.gridLineBase : styles.gridLine}
            style={{ bottom: 28 + (BAR_H * pct / 100) }}
          />
        ))}

        {MONTHS_VI.map((label, i) => {
          const thuH = maxVal > 0 ? (thu[i] / maxVal) * BAR_H : 0;
          const chiH = maxVal > 0 ? (chi[i] / maxVal) * BAR_H : 0;
          const isHovered = hoveredMonth === i;

          return (
            <div
              key={i}
              className={styles.monthGroup}
              onMouseEnter={() => setHoveredMonth(i)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              {isHovered && (
                <div className={styles.tooltip} style={{ bottom: BAR_H + 34 }}>
                  <div className={styles.tooltipTitle}>Tháng {i + 1}</div>
                  <div className={styles.tooltipThu}>Thu: {fmtMoneyFull(thu[i])}</div>
                  <div className={styles.tooltipChi}>Chi: {fmtMoneyFull(chi[i])}</div>
                  <div className={styles.tooltipBalance} style={{ color: chi[i] > thu[i] ? '#f87171' : '#4ade80' }}>
                    {chi[i] > thu[i] ? '▼' : '▲'} {fmtMoneyFull(Math.abs(thu[i] - chi[i]))}
                  </div>
                </div>
              )}

              <div className={styles.barPair} style={{ height: BAR_H }}>
                <div
                  className={styles.barThu}
                  style={{
                    height: Math.max(thuH, 2),
                    background: isHovered
                      ? 'var(--primary-700)'
                      : 'linear-gradient(180deg, var(--primary-400), var(--primary-600))',
                  }}
                />
                <div
                  className={styles.barChi}
                  style={{
                    height: Math.max(chiH, 2),
                    background: isHovered
                      ? '#ea580c'
                      : 'linear-gradient(180deg, #fb923c, #f97316)',
                  }}
                />
              </div>

              <span className={styles.monthLabel}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LineChart({ thuList, chiList }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { thu, chi } = useMemo(() => getMonthlyData(thuList, chiList), [thuList, chiList]);

  const soDuArr = useMemo(() => {
    let cumulative = 0;
    return thu.map((t, i) => { cumulative += t - chi[i]; return cumulative; });
  }, [thu, chi]);

  const W = 380, H = 140, PAD = 20;
  const minVal = Math.min(...soDuArr);
  const maxVal = Math.max(...soDuArr, 0);
  const range = maxVal - minVal || 1;

  const points = soDuArr.map((v, i) => ({
    x: PAD + (i / 11) * (W - PAD * 2),
    y: H - PAD - ((v - minVal) / range) * (H - PAD * 2),
    val: v,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;
  const zeroY = H - PAD - ((0 - minVal) / range) * (H - PAD * 2);

  return (
    <div className={styles.lineWrap}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className={styles.lineSvg}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {minVal < 0 && (
          <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} className={styles.zeroLine} />
        )}

        <path d={areaD} fill="url(#lineGrad)" />

        <path d={pathD} className={styles.linePath} />

        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={styles.pointGroup}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 6 : 4}
              fill={p.val >= 0 ? 'var(--primary-500)' : '#ef4444'}
              className={styles.point}
            />

            {hoveredIdx === i && (
              <>
                <rect x={p.x - 46} y={p.y - 42} width={92} height={34} rx={6} className={styles.svgTooltipBg} />
                <text x={p.x} y={p.y - 28} textAnchor="middle" className={styles.svgTooltipTitle}>T{i + 1}</text>
                <text
                  x={p.x}
                  y={p.y - 15}
                  textAnchor="middle"
                  fill={p.val >= 0 ? '#4ade80' : '#f87171'}
                  className={styles.svgTooltipValue}
                >
                  {p.val >= 0 ? '+' : ''}{fmtMoney(p.val)}
                </text>
              </>
            )}
          </g>
        ))}

        {points.map((p, i) => (
          i % 2 === 0 && (
            <text key={i} x={p.x} y={H - 2} textAnchor="middle" className={styles.xLabel}>{MONTHS_VI[i]}</text>
          )
        ))}
      </svg>
    </div>
  );
}

function DonutChart({ tongThu, tongChi }) {
  const [hovered, setHovered] = useState(null);
  const total = tongThu + tongChi || 1;
  const thuPct = tongThu / total;
  const chiPct = tongChi / total;

  const R = 54, CX = 70, CY = 70, stroke = 22;
  const circumference = 2 * Math.PI * R;

  const thuDash = thuPct * circumference;
  const chiDash = chiPct * circumference;

  const soDu = tongThu - tongChi;
  const isDanger = soDu < 0;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutSvgWrap}>
        <svg width={140} height={140}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />

          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={hovered === 'chi' ? '#ea580c' : '#f97316'}
            strokeWidth={hovered === 'chi' ? stroke + 3 : stroke}
            strokeDasharray={`${chiDash} ${circumference - chiDash}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            transform={`rotate(-90 ${CX} ${CY})`}
            className={styles.donutSlice}
            onMouseEnter={() => setHovered('chi')}
            onMouseLeave={() => setHovered(null)}
          />

          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={hovered === 'thu' ? 'var(--primary-700)' : 'var(--primary-500)'}
            strokeWidth={hovered === 'thu' ? stroke + 3 : stroke}
            strokeDasharray={`${thuDash} ${circumference - thuDash}`}
            strokeDashoffset={-chiDash}
            strokeLinecap="butt"
            transform={`rotate(-90 ${CX} ${CY})`}
            className={styles.donutSlice}
            onMouseEnter={() => setHovered('thu')}
            onMouseLeave={() => setHovered(null)}
          />

          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fill={isDanger ? '#ef4444' : 'var(--gray-900)'}
            className={styles.donutCenter}
          >
            {fmtMoney(Math.abs(soDu))}
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" className={styles.donutSub}>
            {isDanger ? 'ÂM QUỸ' : 'SỐ DƯ'}
          </text>
        </svg>
      </div>

      <div className={styles.donutLegend}>
        {[
          { key: 'thu', label: 'Thu nhập', value: tongThu, color: 'var(--primary-500)', pct: thuPct },
          { key: 'chi', label: 'Chi tiêu', value: tongChi, color: '#f97316', pct: chiPct },
        ].map(item => (
          <div
            key={item.key}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
            className={styles.donutLegendItem}
            style={{
              background: hovered === item.key ? '#f8fafc' : 'transparent',
              borderColor: hovered === item.key ? item.color : 'transparent',
            }}
          >
            <div className={styles.donutLegendTop}>
              <div className={styles.donutDot} style={{ background: item.color }} />
              <span className={styles.donutLabel}>{item.label}</span>
              <span className={styles.donutPct}>{(item.pct * 100).toFixed(1)}%</span>
            </div>
            <div className={styles.donutValue}>{fmtMoneyFull(item.value)}</div>
            <div className={styles.miniBar}>
              <div className={styles.miniBarFill} style={{ width: `${item.pct * 100}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapChart({ thuList, chiList }) {
  const [hovered, setHovered] = useState(null);

  const monthlyNet = useMemo(() => {
    const { thu, chi } = getMonthlyData(thuList, chiList);
    return thu.map((t, i) => ({ month: i, thu: t, chi: chi[i], net: t - chi[i] }));
  }, [thuList, chiList]);

  const maxAbs = Math.max(...monthlyNet.map(d => Math.abs(d.net)), 1);

  return (
    <div className={styles.heatmapWrap}>
      <div className={styles.heatmapTitle}>CÂN ĐỐI THÁNG (xanh = dương, đỏ = âm)</div>
      <div className={styles.heatmapGrid}>
        {monthlyNet.map((d, i) => {
          const intensity = Math.abs(d.net) / maxAbs;
          const isPositive = d.net >= 0;
          const bg = isPositive
            ? `rgba(59, 130, 246, ${0.1 + intensity * 0.7})`
            : `rgba(239, 68, 68, ${0.1 + intensity * 0.7})`;
          const isHov = hovered === i;

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={styles.heatCell}
              style={{
                background: bg,
                borderColor: isHov ? (isPositive ? 'var(--primary-500)' : '#ef4444') : 'transparent',
                transform: isHov ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div className={styles.heatMonth}>T{i + 1}</div>
              <div className={styles.heatValue} style={{ color: isPositive ? 'var(--primary-700)' : '#dc2626' }}>
                {d.net >= 0 ? '+' : ''}{fmtMoney(d.net)}
              </div>

              {isHov && (
                <div className={styles.heatTooltip}>
                  <div className={styles.tooltipTitle}>Tháng {i + 1}</div>
                  <div className={styles.tooltipThu}>Thu: {fmtMoneyFull(d.thu)}</div>
                  <div className={styles.tooltipChi}>Chi: {fmtMoneyFull(d.chi)}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FinanceCharts({ thuList = [], chiList = [] }) {
  const [activeChart, setActiveChart] = useState('bar');

  const tongThu = thuList.reduce((s, r) => s + r.soTien, 0);
  const tongChi = chiList.reduce((s, r) => s + r.soTien, 0);

  const CHARTS = [
    { key: 'bar',     label: '📊 Thu Chi',    desc: 'So sánh thu-chi theo tháng' },
    { key: 'line',    label: '📈 Số Dư',       desc: 'Biến động số dư tích lũy' },
    { key: 'donut',   label: '🍩 Cơ Cấu',      desc: 'Tỷ lệ thu và chi' },
    { key: 'heatmap', label: '🌡️ Cân Đối',    desc: 'Nhiệt độ tài chính mỗi tháng' },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Biểu đồ Tài chính</h3>
          <p className={styles.desc}>
            {CHARTS.find(c => c.key === activeChart)?.desc}
          </p>
        </div>

        <div className={styles.tabs}>
          {CHARTS.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveChart(c.key)}
              className={`${styles.tabBtn} ${activeChart === c.key ? styles.tabBtnActive : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartArea}>
        {activeChart === 'bar' && <BarChart thuList={thuList} chiList={chiList} />}
        {activeChart === 'line' && <LineChart thuList={thuList} chiList={chiList} />}
        {activeChart === 'donut' && <DonutChart tongThu={tongThu} tongChi={tongChi} />}
        {activeChart === 'heatmap' && <HeatmapChart thuList={thuList} chiList={chiList} />}
      </div>

      <div className={styles.summary}>
        {[
          { label: 'Tổng Thu', value: tongThu, color: 'var(--primary-700)' },
          { label: 'Tổng Chi', value: tongChi, color: '#f97316' },
          { label: 'Số Dư', value: tongThu - tongChi, color: tongThu >= tongChi ? '#16a34a' : '#dc2626' },
        ].map((item, i) => (
          <div key={i} className={styles.summaryItem}>
            <div className={styles.summaryLabel}>{item.label}</div>
            <div className={styles.summaryValue} style={{ color: item.color }}>
              {item.value >= 0 ? '' : '-'}{fmtMoneyFull(Math.abs(item.value))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}