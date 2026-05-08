import styles from './MemberTable.module.css';

const ROLE_STYLE = {
  'Head of Research': { bg: '#e8f4f8', color: '#1a6b8a' },
  'Senior Fellow':    { bg: '#ede8f8', color: '#5b3fa8' },
  'Researcher':       { bg: '#e8f0fe', color: '#1a4fa8' },
  'Admin':            { bg: '#fef3c7', color: '#92400e' },
};

const STATUS_STYLE = {
  Active:     { dot: '#38a169' },
  'On Leave': { dot: '#a0aec0' },
  Inactive:   { dot: '#e53e3e' },
};

function Avatar({ initials, name }) {
  const colors = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#06b6d4'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={styles.avatar} style={{ background: colors[idx] }}>
      {initials || name.slice(0,2).toUpperCase()}
    </div>
  );
}

export default function MemberTable({ members = [], onEdit, onDelete, isAdmin = false }) {
  if (!members.length) {
    return (
      <div className={styles.empty}>
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#cbd5e0" strokeWidth="1.2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <p>Không tìm thấy thành viên nào</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>MEMBER</th>
            <th>DEPARTMENT</th>
            <th>ROLE</th>
            <th>STATUS</th>
            {isAdmin && <th>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const roleStyle = ROLE_STYLE[m.role] || { bg: '#f3f4f6', color: '#374151' };
            const statusStyle = STATUS_STYLE[m.status] || { dot: '#a0aec0' };
            return (
              <tr key={m.id} className={styles.row}>
                <td>
                  <div className={styles.memberCell}>
                    <Avatar initials={m.avatar} name={m.name} />
                    <div>
                      <p className={styles.memberName}>{m.name}</p>
                      <p className={styles.memberId}>ID: #{m.id}</p>
                    </div>
                  </div>
                </td>
                <td className={styles.dept}>{m.department}</td>
                <td>
                  <span className={styles.badge} style={{ background: roleStyle.bg, color: roleStyle.color }}>
                    {m.role}
                  </span>
                </td>
                <td>
                  <span className={styles.status}>
                    <span className={styles.statusDot} style={{ background: statusStyle.dot }} />
                    {m.status}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => onEdit?.(m)}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => onDelete?.(m)}>Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}