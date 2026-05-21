import { useState } from 'react';

import styles from './FinanceExportButton.module.css';
import FinanceExportModal from './FinanceExportModal';

export default function FinanceExportButton(props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={styles.exportBtn}
        onClick={() => setOpen(true)}
      >
        <svg
          width="15"
          height="15"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>

        Xuất dữ liệu
      </button>

      <FinanceExportModal
        open={open}
        onClose={() => setOpen(false)}
        {...props}
      />
    </>
  );
}