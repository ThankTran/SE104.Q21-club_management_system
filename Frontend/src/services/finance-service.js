import api from '../utils/api'

const isIncome = (type) => String(type).toUpperCase() === 'INCOME'
const toDateTimeParam = (value, fallbackTime) => {
  if (!value) return value
  const text = String(value)
  return text.includes('T') ? text : `${text}T${fallbackTime}`
}

export const normalizeTransactionFromApi = (transaction = {}) => {
  const base = {
    id: transaction.transactionId,
    maSuKien: transaction.eventId || null,
    soTien: Number(transaction.amount || 0),
    status: transaction.status,
    raw: transaction,
  }

  if (isIncome(transaction.type)) {
    return {
      ...base,
      nguoiNop: transaction.memberName || transaction.memberId ? String(transaction.memberName || transaction.memberId) : '',
      lyDo: transaction.description || '',
      hinhThuc: 'Tiền mặt',
      ngayThu: transaction.createdAt ? String(transaction.createdAt).slice(0, 10) : '',
    }
  }

  return {
    ...base,
    nguoiNhan: transaction.memberName || transaction.memberId ? String(transaction.memberName || transaction.memberId) : '',
    noiDung: transaction.description || '',
    ngayLap: transaction.createdAt ? String(transaction.createdAt).slice(0, 10) : '',
  }
}

export const toIncomePayload = (item = {}) => ({
  transactionId: item.id,
  eventId: item.maSuKien || null,
  memberId: item.memberId || null,
  type: 'INCOME',
  amount: Number(item.soTien || 0),
  description: item.lyDo,
  status: item.status || 'COMPLETED',
  createdById: item.createdById || null,
  approvedById: item.approvedById || null,
})

export const toExpensePayload = (item = {}) => ({
  transactionId: item.id,
  eventId: item.maSuKien || null,
  memberId: item.memberId || null,
  type: 'Expense',
  amount: Number(item.soTien || 0),
  description: item.noiDung,
  status: item.status || 'COMPLETED',
  createdById: item.createdById || null,
  approvedById: item.approvedById || null,
})

export const getTotalIncomeAPI = (from, to) =>
  api.get('finance/income', {
    params: {
      from: toDateTimeParam(from, '00:00:00'),
      to: toDateTimeParam(to, '23:59:59'),
    },
  })

export const getTotalExpenseAPI = (from, to) =>
  api.get('finance/expense', {
    params: {
      from: toDateTimeParam(from, '00:00:00'),
      to: toDateTimeParam(to, '23:59:59'),
    },
  })

export const getRevenueAPI = (from, to) =>
  api.get('finance/revenue', {
    params: {
      from: toDateTimeParam(from, '00:00:00'),
      to: toDateTimeParam(to, '23:59:59'),
    },
  })

export const getIncomeByEventAPI = (eventId) =>
  api.get(`finance/income/by-event/${eventId}`)

export const getExpenseByEventAPI = (eventId) =>
  api.get(`finance/expense/by-event/${eventId}`)

export const getRevenueByEventAPI = (eventId) =>
  api.get(`finance/revenue/by-event/${eventId}`)

export const getTransactionsAPI = () =>
  api.get('transactions')

export const getTransactionByIdAPI = (id) =>
  api.get(`transactions/${id}`)

export const getTransactionsByTypeAPI = (type) =>
  api.get('transactions/by-type', { params: { type } })

export const getTransactionsByEventAPI = (eventId) =>
  api.get(`transactions/by-event/${eventId}`)

export const createTransactionAPI = (payload) =>
  api.post('transactions', payload)

export const deleteTransactionAPI = (id) =>
  api.delete(`transactions/${id}`)

// Add PUT/PATCH /api/transactions/{id} for editing finance records.
// Add approve/reject transaction endpoints if finance approval is required.
// Add monthly report endpoint for BM12 with month validation and balance.
