import { useState, useMemo } from 'react';
import styles from './FinancePage.module.css';

import { MOCK_THU, MOCK_CHI } from '../../data/financeMockData';
import { getThang } from '../../utils/Finance/financeUtils';

import FinanceHeader from '../../components/sections/Finance/FinanceHeader';
import FinanceStats from '../../components/sections/Finance/FinanceStats';
import FinanceTabs from '../../components/sections/Finance/FinanceTabs';
import FinanceOverview from '../../components/sections/Finance/FinanceOverview';
import IncomeTable from '../../components/sections/Finance/IncomeTable';
import ExpenseTable from '../../components/sections/Finance/ExpenseTable';
import FinanceReport from '../../components/sections/Finance/FinanceReport';
import IncomeFormModal from '../../components/sections/Finance/IncomeFormModal';
import ExpenseFormModal from '../../components/sections/Finance/ExpenseFormModal';
import ConfirmModal from '../../components/sections/Finance/ConfirmModal';

export default function FinancePage() {
  const [thuList, setThuList] = useState(MOCK_THU);
  const [chiList, setChiList] = useState(MOCK_CHI);

  const [thuFilters, setThuFilters] = useState({
    lyDo: '',
    hinhThuc: '',
    dateType: '',
    month: '',
    quarter: '',
    year: '',
  });

  const [chiFilters, setChiFilters] = useState({
    noiDung: '',
    nguoiNhan: '',
    dateType: '',
    month: '',
    quarter: '',
    year: '',
  });

  const [tab, setTab] = useState('overview');

  const [thuOpen, setThuOpen]       = useState(false);
  const [chiOpen, setChiOpen]       = useState(false);
  const [editThu, setEditThu]       = useState(null);
  const [editChi, setEditChi]       = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [baocaoThang, setBaocaoThang] = useState(new Date().getMonth() + 1);

  const [searchThu, setSearchThu] = useState('');
  const [searchChi, setSearchChi] = useState('');
  const [sortThu, setSortThu] = useState('desc');
  const [sortChi, setSortChi] = useState('desc');

  const tongThu = thuList.reduce((s, r) => s + r.soTien, 0);
  const tongChi = chiList.reduce((s, r) => s + r.soTien, 0);
  const soDu    = tongThu - tongChi;

  const bcThu = useMemo(() => thuList.filter(r => getThang(r.ngayThu) === baocaoThang), [thuList, baocaoThang]);
  const bcChi = useMemo(() => chiList.filter(r => getThang(r.ngayLap) === baocaoThang), [chiList, baocaoThang]);
  const bcTongThu = bcThu.reduce((s, r) => s + r.soTien, 0);
  const bcTongChi = bcChi.reduce((s, r) => s + r.soTien, 0);
  const bcSoDu    = bcTongThu - bcTongChi;

  // Lọc ngày
  const matchDateFilter = (dateStr, filters) => {
    if (!filters.dateType || filters.dateType === '') return true;  // ← thêm check rỗng
    
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const quarter = Math.ceil(month / 3);

    if (filters.dateType === 'month') {
      return !filters.month || month === Number(filters.month);
    }
    if (filters.dateType === 'quarter') {
      return !filters.quarter || quarter === Number(filters.quarter);
    }
    if (filters.dateType === 'year') {
      return !filters.year || year === Number(filters.year);
    }
    return true;
  };

  const filteredThu = useMemo(() => {
    const q = searchThu.toLowerCase();

    const filtered = thuList.filter(r => {
      const matchSearch =
        !q ||
        r.nguoiNop.toLowerCase().includes(q) ||
        r.lyDo.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);

      const matchLyDo =
        !thuFilters.lyDo ||
        r.lyDo.toLowerCase().includes(thuFilters.lyDo.toLowerCase());

      const matchHinhThuc =
        !thuFilters.hinhThuc ||
        r.hinhThuc === thuFilters.hinhThuc;

      const matchDate = matchDateFilter(r.ngayThu, thuFilters);

      return matchSearch && matchLyDo && matchHinhThuc && matchDate;
    });

    return filtered.sort((a, b) => {
      const da = new Date(a.ngayThu);
      const db = new Date(b.ngayThu);
      return sortThu === 'asc' ? da - db : db - da;
    });
  }, [thuList, searchThu, thuFilters, sortThu]);

  const filteredChi = useMemo(() => {
    const q = searchChi.toLowerCase();

    const filtered = chiList.filter(r => {
      const matchSearch =
        !q ||
        r.nguoiNhan.toLowerCase().includes(q) ||
        r.noiDung.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);

      const matchNoiDung =
        !chiFilters.noiDung ||
        r.noiDung.toLowerCase().includes(chiFilters.noiDung.toLowerCase());

      const matchNguoiNhan =
        !chiFilters.nguoiNhan ||
        r.nguoiNhan.toLowerCase().includes(chiFilters.nguoiNhan.toLowerCase());

      const matchDate = matchDateFilter(r.ngayLap, chiFilters);

      return matchSearch && matchNoiDung && matchNguoiNhan && matchDate;
    });

    return filtered.sort((a, b) => {
      const da = new Date(a.ngayLap);
      const db = new Date(b.ngayLap);
      return sortChi === 'asc' ? da - db : db - da;
    });
  }, [chiList, searchChi, chiFilters, sortChi]);

  const openThuModal = () => { setEditThu(null); setThuOpen(true); };
  const openChiModal = () => { setEditChi(null); setChiOpen(true); };
  const openEditThuModal = (r) => { setEditThu(r); setThuOpen(true); };
  const openEditChiModal = (r) => { setEditChi(r); setChiOpen(true); };

  const handleThuSubmit = (data) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editThu) {
        setThuList(p => p.map(r => r.id === editThu.id ? { ...r, ...data } : r));
      } else {
        const newId = `THU${String(thuList.length + 1).padStart(3, '0')}`;
        setThuList(p => [...p, { ...data, id: newId }]);
      }
      setFormLoading(false);
      setThuOpen(false);
      setEditThu(null);
    }, 600);
  };

  const handleChiSubmit = (data) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editChi) {
        setChiList(p => p.map(r => r.id === editChi.id ? { ...r, ...data } : r));
      } else {
        const newId = `CHI${String(chiList.length + 1).padStart(3, '0')}`;
        setChiList(p => [...p, { ...data, id: newId }]);
      }
      setFormLoading(false);
      setChiOpen(false);
      setEditChi(null);
    }, 600);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.id.startsWith('THU')) setThuList(p => p.filter(r => r.id !== deleteTarget.id));
    else setChiList(p => p.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className={styles.page}>
      <FinanceHeader
        onOpenThu={openThuModal}
        onOpenChi={openChiModal}
        thuList={thuList}
        chiList={chiList}
        bcThu={bcThu}
        bcChi={bcChi}
      />
      <FinanceStats
        tongThu={tongThu}
        tongChi={tongChi}
        soDu={soDu}
        thuCount={thuList.length}
        chiCount={chiList.length}
        bcThu={bcThu}
        baocaoThang={baocaoThang}
      />

      <FinanceTabs tab={tab} setTab={setTab} />

      {tab === 'overview' && (
        <FinanceOverview
          thuList={thuList}
          chiList={chiList}
          setTab={setTab}
        />
      )}

      {tab === 'thu' && (
        <IncomeTable
          thuList={thuList}
          filteredThu={filteredThu}
          searchThu={searchThu}
          setSearchThu={setSearchThu}
          onOpenThu={openThuModal}
          onEditThu={openEditThuModal}
          setDeleteTarget={setDeleteTarget}
          sortThu={sortThu}
          setSortThu={setSortThu}
          filters={thuFilters}
          setFilters={setThuFilters}
        />
      )}

      {tab === 'chi' && (
        <ExpenseTable
          chiList={chiList}
          filteredChi={filteredChi}
          searchChi={searchChi}
          setSearchChi={setSearchChi}
          onOpenChi={openChiModal}
          onEditChi={openEditChiModal}
          setDeleteTarget={setDeleteTarget}
          sortChi={sortChi}
          setSortChi={setSortChi}
          filters={chiFilters}
          setFilters={setChiFilters}
        />
      )}

      {tab === 'baocao' && (
        <FinanceReport
          baocaoThang={baocaoThang}
          setBaocaoThang={setBaocaoThang}
          bcThu={bcThu}
          bcChi={bcChi}
          bcTongThu={bcTongThu}
          bcTongChi={bcTongChi}
          bcSoDu={bcSoDu}
        />
      )}

      <IncomeFormModal
        open={thuOpen}
        onClose={() => { setThuOpen(false); setEditThu(null); }}
        onSubmit={handleThuSubmit}
        initial={editThu}
        loading={formLoading}
      />

      <ExpenseFormModal
        open={chiOpen}
        onClose={() => { setChiOpen(false); setEditChi(null); }}
        onSubmit={handleChiSubmit}
        initial={editChi}
        loading={formLoading}
      />
      <ConfirmModal item={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>

    
  );
}
