import styles from '../../../pages/Finance/FinancePage.module.css';
import { TABS } from '../Finance/financeConstants';

export default function FinanceTabs({ tab, setTab }) {
  return (
    <div className={styles.tabBar}>
      {TABS.map(t => (
        <button key={t.id} className={`${styles.tabBtn} ${tab === t.id ? styles.tabActive : ''}`}
          onClick={() => setTab(t.id)}>
          <span>{t.icon}</span> {t.label}
        </button>
      ))}
    </div>
  );
}
