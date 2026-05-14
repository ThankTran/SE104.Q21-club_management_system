export function fmtMoney(v) {
  return Number(v || 0).toLocaleString('vi-VN') + ' ₫';
}

export function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function getThang(dateStr) {
  if (!dateStr) return 0;
  return new Date(dateStr).getMonth() + 1;
}

export const toInputDate = (dateStr) => {
  if (!dateStr) return '';

  // nếu đã là yyyy-mm-dd
  if (dateStr.includes('-')) return dateStr;

  const parts = dateStr.split('/');

  // MM/DD/YYYY
  if (parts[0].length <= 2) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return '';
};