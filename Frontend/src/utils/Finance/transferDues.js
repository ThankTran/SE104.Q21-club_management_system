const STORAGE_KEY = 'club_transfer_dues';
const INCOME_RECEIPTS_KEY = 'club_transfer_income_receipts';

export const MEMBER_PAYMENT_PROFILE = {
  id: 'TV001',
  name: 'Nguyễn Minh Anh',
};

export function getTransferDues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransferDues(dues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dues));
}

export function getTransferIncomeReceipts() {
  try {
    const raw = localStorage.getItem(INCOME_RECEIPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransferIncomeReceipts(receipts) {
  localStorage.setItem(INCOME_RECEIPTS_KEY, JSON.stringify(receipts));
}

export function upsertIncomeReceiptFromDue(due) {
  if (!due || due.status !== 'paid') return getTransferIncomeReceipts();

  const receipts = getTransferIncomeReceipts();
  const receipt = buildIncomeReceiptFromDue(due);
  const exists = receipts.some((item) => item.sourceDueId === due.id || item.id === receipt.id);
  const next = exists
    ? receipts.map((item) =>
      item.sourceDueId === due.id || item.id === receipt.id ? { ...item, ...receipt } : item,
    )
    : [receipt, ...receipts];

  saveTransferIncomeReceipts(next);
  return next;
}

export function syncPaidTransferDuesToIncomeReceipts(dues = getTransferDues()) {
  dues
    .filter((due) => due.status === 'paid')
    .forEach((due) => upsertIncomeReceiptFromDue(due));

  return getTransferIncomeReceipts();
}

export function createTransferDue(payload, existing = getTransferDues()) {
  const nextNumber = existing.length + 1;
  const id = `QR${String(nextNumber).padStart(3, '0')}`;
  const memberPart = payload.nguoiNop ? slugMemberName(payload.nguoiNop) : 'MEMBER';
  const transferCode = `${payload.maSuKien || 'QUY'}-${memberPart}-${id}`;

  return {
    id,
    transferCode,
    lyDo: payload.lyDo,
    soTien: Number(payload.soTien),
    maSuKien: payload.maSuKien || '',
    targetName: payload.nguoiNop || '',
    ngayTao: new Date().toISOString(),
    status: 'pending',
    qrPayload: `CLB THMN | ${transferCode}`,
    paidBy: '',
    memberId: '',
    paidAt: '',
    paidMethod: '',
  };
}

export function markTransferDuePaid(id, member = MEMBER_PAYMENT_PROFILE) {
  const dues = getTransferDues();
  const updated = dues.map((due) =>
    due.id === id
      ? {
        ...due,
        status: 'paid',
        paidBy: member.name,
        memberId: member.id,
        paidAt: new Date().toISOString(),
        paidMethod: 'Chuyển khoản',
      }
      : due,
  );
  saveTransferDues(updated);
  upsertIncomeReceiptFromDue(updated.find((due) => due.id === id));
  return updated;
}

export function markTransferDueCashPaid(id) {
  const dues = getTransferDues();
  const updated = dues.map((due) =>
    due.id === id
      ? {
        ...due,
        status: 'paid',
        paidBy: due.targetName || 'Thủ quỹ ghi nhận',
        memberId: '',
        paidAt: new Date().toISOString(),
        paidMethod: 'Tiền mặt',
      }
      : due,
  );
  saveTransferDues(updated);
  upsertIncomeReceiptFromDue(updated.find((due) => due.id === id));
  return updated;
}

export function deleteTransferDue(id) {
  const updated = getTransferDues().filter((due) => due.id !== id);
  saveTransferDues(updated);
  return updated;
}

function slugMemberName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .slice(-10)
    .toUpperCase() || 'MEMBER';
}

function buildIncomeReceiptFromDue(due) {
  const paidAt = due.paidAt ? new Date(due.paidAt) : new Date();
  return {
    id: `THU${due.id}`,
    nguoiNop: due.paidBy || due.targetName || 'Thành viên',
    lyDo: due.lyDo,
    hinhThuc: due.paidMethod || 'Chuyển khoản',
    ngayThu: paidAt.toISOString().slice(0, 10),
    soTien: Number(due.soTien || 0),
    maSuKien: due.maSuKien || null,
    sourceDueId: due.id,
    transferCode: due.transferCode,
  };
}
