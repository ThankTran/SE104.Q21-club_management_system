import { useMemo, useState } from "react";
import styles from "./FinancePage.module.css";

const MONTHLY_FEE = 75000;

const INITIAL_INCOMES = [
  { id: 1, code: "PT001", payer: "Nguyễn Minh Anh", reason: "Đóng quỹ tháng", method: "Chuyển khoản", date: "2026-05-01", amount: 75000 },
  { id: 2, code: "PT002", payer: "Trần Quốc Bảo", reason: "Đóng quỹ tháng", method: "Tiền mặt", date: "2026-05-02", amount: 75000 },
];

const INITIAL_EXPENSES = [
  { id: 1, code: "PC001", eventId: "EV001", receiver: "Lê Hoàng Nam", content: "Mua nước uống cho workshop", date: "2026-05-05", amount: 120000 },
];

const EVENTS = ["EV001", "EV002", "EV003"];

export default function FinancePage() {
  const [tab, setTab] = useState("income");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [incomes, setIncomes] = useState(INITIAL_INCOMES);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  const [incomeForm, setIncomeForm] = useState({
    payer: "",
    reason: "Đóng quỹ tháng",
    method: "Chuyển khoản",
    date: new Date().toISOString().slice(0, 10),
    amount: MONTHLY_FEE,
  });

  const [expenseForm, setExpenseForm] = useState({
    eventId: "",
    receiver: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
  });

  const monthData = useMemo(() => {
    const matchMonth = (date) => new Date(date).getMonth() + 1 === Number(month);
    const monthIncomes = incomes.filter((i) => matchMonth(i.date));
    const monthExpenses = expenses.filter((e) => matchMonth(e.date));
    const totalIncome = monthIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpense = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      incomes: monthIncomes,
      expenses: monthExpenses,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      rows: [
        ...monthIncomes.map((i) => ({ date: i.date, type: "Thu", activity: i.reason, content: i.payer, amount: i.amount })),
        ...monthExpenses.map((e) => ({ date: e.date, type: "Chi", activity: e.eventId, content: e.content, amount: -e.amount })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
  }, [incomes, expenses, month]);

  const validateIncome = () => {
    if (!incomeForm.payer.trim()) return "QĐ10.1: Người nộp tiền không được để trống.";
    if (!incomeForm.reason.trim()) return "QĐ10.1: Lý do không được để trống.";
    if (!incomeForm.method.trim()) return "QĐ10.1: Hình thức không được để trống.";
    if (!incomeForm.date) return "QĐ10.1: Ngày thu không được để trống.";
    if (Number(incomeForm.amount) <= 0) return "QĐ10.3: Số tiền phải lớn hơn 0.";
    if (incomeForm.reason === "Đóng quỹ tháng" && Number(incomeForm.amount) !== MONTHLY_FEE) return "QĐ10.2: Số tiền đóng quỹ là 75k/tháng.";
    return "";
  };

  const validateExpense = () => {
    if (!expenseForm.eventId.trim()) return "QĐ11.1: Mã sự kiện không được để trống.";
    if (!EVENTS.includes(expenseForm.eventId)) return "QĐ11.3: Mã sự kiện phải hợp lệ.";
    if (!expenseForm.receiver.trim()) return "QĐ11.1: Người nhận tiền không được để trống.";
    if (!expenseForm.content.trim()) return "QĐ11.1: Nội dung chi không được để trống.";
    if (!expenseForm.date) return "QĐ11.1: Ngày lập không được để trống.";
    if (Number(expenseForm.amount) <= 0) return "QĐ11.2: Số tiền phải lớn hơn 0.";
    return "";
  };

  const addIncome = (e) => {
    e.preventDefault();
    const err = validateIncome();
    if (err) return alert(err);

    setIncomes((prev) => [
      { id: Date.now(), code: `PT${String(prev.length + 1).padStart(3, "0")}`, ...incomeForm, amount: Number(incomeForm.amount) },
      ...prev,
    ]);

    setIncomeForm({ payer: "", reason: "Đóng quỹ tháng", method: "Chuyển khoản", date: new Date().toISOString().slice(0, 10), amount: MONTHLY_FEE });
  };

  const addExpense = (e) => {
    e.preventDefault();
    const err = validateExpense();
    if (err) return alert(err);

    setExpenses((prev) => [
      { id: Date.now(), code: `PC${String(prev.length + 1).padStart(3, "0")}`, ...expenseForm, amount: Number(expenseForm.amount) },
      ...prev,
    ]);

    setExpenseForm({ eventId: "", receiver: "", content: "", date: new Date().toISOString().slice(0, 10), amount: "" });
  };

  const removeIncome = (id) => setIncomes((prev) => prev.filter((i) => i.id !== id));
  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>BM10 + BM11 + BM12</p>
          <h1>Quản lý thu chi quỹ CLB</h1>
          <p>Lập phiếu thu, phiếu chi và báo cáo thu chi tháng theo quy định.</p>
        </div>
      </section>

      <section className={styles.summary}>
        <SummaryCard label="Tổng thu" value={monthData.totalIncome} />
        <SummaryCard label="Tổng chi" value={monthData.totalExpense} />
        <SummaryCard label="Số dư" value={monthData.balance} highlight />
      </section>

      <section className={styles.tabs}>
        <button className={tab === "income" ? styles.active : ""} onClick={() => setTab("income")}>BM10 - Phiếu thu</button>
        <button className={tab === "expense" ? styles.active : ""} onClick={() => setTab("expense")}>BM11 - Phiếu chi</button>
        <button className={tab === "report" ? styles.active : ""} onClick={() => setTab("report")}>BM12 - Báo cáo tháng</button>
      </section>

      {tab === "income" && (
        <section className={styles.panel}>
          <h2>Phiếu Thu Tiền</h2>
          <form className={styles.form} onSubmit={addIncome}>
            <Field label="Người nộp tiền"><input value={incomeForm.payer} onChange={(e) => setIncomeForm({ ...incomeForm, payer: e.target.value })} /></Field>
            <Field label="Lý do"><input value={incomeForm.reason} onChange={(e) => setIncomeForm({ ...incomeForm, reason: e.target.value })} /></Field>
            <Field label="Hình thức">
              <select value={incomeForm.method} onChange={(e) => setIncomeForm({ ...incomeForm, method: e.target.value })}>
                <option>Chuyển khoản</option>
                <option>Tiền mặt</option>
                <option>Khác</option>
              </select>
            </Field>
            <Field label="Ngày thu"><input type="date" value={incomeForm.date} onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} /></Field>
            <Field label="Số tiền"><input type="number" value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} /></Field>
            <button className={styles.submitBtn}>Lập phiếu thu</button>
          </form>

          <FinanceTable
            rows={incomes}
            type="income"
            onDelete={removeIncome}
          />
        </section>
      )}

      {tab === "expense" && (
        <section className={styles.panel}>
          <h2>Phiếu Chi Tiền</h2>
          <form className={styles.form} onSubmit={addExpense}>
            <Field label="Mã sự kiện">
              <select value={expenseForm.eventId} onChange={(e) => setExpenseForm({ ...expenseForm, eventId: e.target.value })}>
                <option value="">Chọn sự kiện</option>
                {EVENTS.map((ev) => <option key={ev}>{ev}</option>)}
              </select>
            </Field>
            <Field label="Người nhận tiền"><input value={expenseForm.receiver} onChange={(e) => setExpenseForm({ ...expenseForm, receiver: e.target.value })} /></Field>
            <Field label="Nội dung chi"><input value={expenseForm.content} onChange={(e) => setExpenseForm({ ...expenseForm, content: e.target.value })} /></Field>
            <Field label="Ngày lập"><input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} /></Field>
            <Field label="Số tiền"><input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} /></Field>
            <button className={styles.submitBtn}>Lập phiếu chi</button>
          </form>

          <FinanceTable
            rows={expenses}
            type="expense"
            onDelete={removeExpense}
          />
        </section>
      )}

      {tab === "report" && (
        <section className={styles.panel}>
          <div className={styles.reportHead}>
            <div>
              <h2>Báo Cáo Quỹ</h2>
              <p>QĐ12: Tháng phải từ 1 đến 12.</p>
            </div>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
          </div>

          <div className={styles.reportBox}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ngày</th>
                  <th>Loại</th>
                  <th>Hoạt động</th>
                  <th>Nội dung</th>
                  <th>Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {monthData.rows.map((r, index) => (
                  <tr key={`${r.date}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{new Date(r.date).toLocaleDateString("vi-VN")}</td>
                    <td>{r.type}</td>
                    <td>{r.activity}</td>
                    <td>{r.content}</td>
                    <td className={r.amount >= 0 ? styles.moneyIn : styles.moneyOut}>
                      {formatMoney(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.reportTotal}>
              <span>Tổng thu: <strong>{formatMoney(monthData.totalIncome)}</strong></span>
              <span>Tổng chi: <strong>{formatMoney(monthData.totalExpense)}</strong></span>
              <span>Số dư: <strong>{formatMoney(monthData.balance)}</strong></span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({ label, value, highlight }) {
  return (
    <div className={`${styles.summaryCard} ${highlight ? styles.highlight : ""}`}>
      <span>{formatMoney(value)}</span>
      <p>{label}</p>
    </div>
  );
}

function FinanceTable({ rows, type, onDelete }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã phiếu</th>
            {type === "income" ? <th>Người nộp</th> : <th>Người nhận</th>}
            {type === "expense" && <th>Mã sự kiện</th>}
            <th>Nội dung / Lý do</th>
            {type === "income" && <th>Hình thức</th>}
            <th>Ngày</th>
            <th>Số tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{type === "income" ? r.payer : r.receiver}</td>
              {type === "expense" && <td>{r.eventId}</td>}
              <td>{type === "income" ? r.reason : r.content}</td>
              {type === "income" && <td>{r.method}</td>}
              <td>{new Date(r.date).toLocaleDateString("vi-VN")}</td>
              <td>{formatMoney(r.amount)}</td>
              <td><button className={styles.deleteBtn} onClick={() => onDelete(r.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}