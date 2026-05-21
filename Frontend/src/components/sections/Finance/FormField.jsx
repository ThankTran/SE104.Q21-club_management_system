import styles from './FormField.module.css';

export default function Field({ label, error, children }) {
  const labelContent = typeof label === 'string' && label.trimEnd().endsWith('*')
    ? (
      <>
        {label.replace(/\s*\*$/, '')} <span className={styles.required}>*</span>
      </>
    )
    : label;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{labelContent}</label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
