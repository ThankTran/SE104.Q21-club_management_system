import { useState } from 'react';

import styles from './FinanceExportModal.module.css';

import exportFinanceExcelPro from '../../../utils/Export/exportFinanceExcel';

const EXPORT_ITEMS = [
  {
    key: 'overview',
    title: 'Tổng quan',
    desc: 'Dashboard tài chính tổng hợp',
  },
  {
    key: 'income',
    title: 'Phiếu thu',
    desc: 'Danh sách toàn bộ phiếu thu',
  },
  {
    key: 'expense',
    title: 'Phiếu chi',
    desc: 'Danh sách toàn bộ phiếu chi',
  },
  {
    key: 'report',
    title: 'Báo cáo quỹ',
    desc: 'Tổng hợp thu chi theo tháng',
  },
  {
    key: 'charts',
    title: 'Biểu đồ thống kê',
    desc: 'Biểu đồ trực quan tài chính',
  },
];

export default function FinanceExportModal({
  open,
  onClose,
  thuList,
  chiList,
  bcThu,
  bcChi,
}) {
  const [options, setOptions] = useState({
    overview: true,
    income: true,
    expense: true,
    report: true,
    charts: true,
  });

  if (!open) return null;

  const toggle = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExport = async () => {
    await exportFinanceExcelPro({
      thuList,
      chiList,
      bcThu,
      bcChi,
      options,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Xuất dữ liệu tài chính
            </h2>

            <p className={styles.subtitle}>
              Chọn dữ liệu muốn xuất
            </p>
          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.sectionTitle}>
            Nội dung xuất file
          </p>

          <div className={styles.optionGrid}>
            {EXPORT_ITEMS.map((item) => (
              <label
                key={item.key}
                className={`${styles.optionCard} ${
                  options[item.key]
                    ? styles.optionActive
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={options[item.key]}
                  onChange={() => toggle(item.key)}
                  className={styles.checkbox}
                />

                <div className={styles.optionContent}>
                  <p className={styles.optionTitle}>
                    {item.title}
                  </p>

                  <p className={styles.optionDesc}>
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Huỷ
          </button>

          <button
            className={styles.exportBtn}
            onClick={handleExport}
          >
            Xuất Excel
          </button>
        </div>
      </div>
    </div>
  );
}