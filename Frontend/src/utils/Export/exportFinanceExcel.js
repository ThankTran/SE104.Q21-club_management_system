import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import logo from '../../assets/logo/logo_cnpm.png';

const BLUE = '1E3A8A';
const HEADER_BLUE = '2563EB';
const BORDER = 'E5E7EB';
const TEXT = '334155';
const GREEN = '15803D';
const RED = 'DC2626';
const PRIMARY = '1E40AF';

export default async function exportFinanceExcelPro({
  thuList = [],
  chiList = [],
  bcThu = [],
  bcChi = [],
  options = {},
}) {
  const wb = new ExcelJS.Workbook();

  wb.creator = 'Club Management';
  wb.company = 'Câu lạc bộ học thuật THMN';
  wb.created = new Date();
  wb.modified = new Date();

  const money = (v) => Number(v || 0);

  const fmtDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString('vi-VN');
  };

  const toBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const border = {
    top: { style: 'thin', color: { argb: BORDER } },
    left: { style: 'thin', color: { argb: BORDER } },
    right: { style: 'thin', color: { argb: BORDER } },
    bottom: { style: 'thin', color: { argb: BORDER } },
  };

  async function addLogo(ws, { col = 0.35, row = 0, width = 54, height = 54 } = {}) {
    try {
      const imageId = wb.addImage({
        base64: await toBase64(logo),
        extension: 'png',
      });

      ws.addImage(imageId, {
        tl: { col, row },
        ext: { width, height },
      });
    } catch (err) {
      console.log('Logo load failed:', err);
    }
  }

  function setupSheet(
    ws,
    title,
    {
      titleRange = 'B1:H1',
      subtitleRange = 'B2:H2',
    } = {},
  ) {
    ws.views = [{ showGridLines: false }];

    ws.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    ws.mergeCells(titleRange);
    const titleCell = ws.getCell(titleRange.split(':')[0]);

    titleCell.value = title;
    titleCell.font = {
      size: 18,
      bold: true,
      color: { argb: 'FFFFFF' },
    };
    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: BLUE },
    };

    ws.getRow(1).height = 42;

    ws.mergeCells(subtitleRange);
    const sub = ws.getCell(subtitleRange.split(':')[0]);

    sub.value = `Ngày xuất file: ${new Date().toLocaleString('vi-VN')}`;
    sub.font = {
      italic: true,
      size: 10,
      color: { argb: '475569' },
    };
    sub.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    ws.getRow(2).height = 22;
    ws.getRow(3).height = 8;
  }

  function styleHeader(row) {
    row.height = 24;

    row.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        name: 'Calibri',
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: HEADER_BLUE },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = border;
    });
  }

  function styleDataRow(row, index) {
    row.height = 22;

    row.eachCell((cell) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
      };
      cell.border = border;
      cell.alignment = {
        vertical: 'middle',
      };

      if (index % 2 === 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8FAFC' },
        };
      }
    });
  }

  function addKpiSheet({
    ws,
    headerLeft = 'Chỉ tiêu',
    headerRight = 'Giá trị',
    rows,
    valueStartCell = 'C',
    mergeRightEnd = 'E',
  }) {
    ws.mergeCells('A4:B4');
    ws.mergeCells(`${valueStartCell}4:${mergeRightEnd}4`);

    ws.getCell('A4').value = headerLeft;
    ws.getCell(`${valueStartCell}4`).value = headerRight;

    styleHeader(ws.getRow(4));

    rows.forEach((item, index) => {
      const rowIndex = 5 + index;

      ws.addRow([item.label, '', item.value]);

      ws.mergeCells(`A${rowIndex}:B${rowIndex}`);
      ws.mergeCells(`${valueStartCell}${rowIndex}:${mergeRightEnd}${rowIndex}`);

      const labelCell = ws.getCell(`A${rowIndex}`);
      const valueCell = ws.getCell(`${valueStartCell}${rowIndex}`);

      ws.getRow(rowIndex).height = 28;

      [labelCell, valueCell].forEach((cell) => {
        cell.border = border;
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      });

      labelCell.font = {
        bold: true,
        size: 12,
        color: { argb: TEXT },
      };

      valueCell.numFmt = item.isCount ? '0' : '#,##0" ₫"';
      valueCell.font = {
        bold: true,
        size: 12,
        color: {
          argb: item.color || (item.value < 0 ? RED : GREEN),
        },
      };
    });

    ws.columns = [
      { width: 18 },
      { width: 18 },
      { width: 16 },
      { width: 16 },
      { width: 16 },
    ];
  }

  function addListSheet({ ws, headers, data, moneyCol, centerCols = [], autoFilterTo }) {
    headers.forEach((h, i) => {
      ws.getCell(4, i + 1).value = h;
    });

    styleHeader(ws.getRow(4));

    data.forEach((rowData, i) => {
      const row = ws.addRow(rowData);
      styleDataRow(row, i);

      centerCols.forEach((col) => {
        row.getCell(col).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      });

      row.getCell(moneyCol).numFmt = '#,##0" ₫"';
      row.getCell(moneyCol).alignment = {
        horizontal: 'right',
        vertical: 'middle',
      };
    });

    ws.autoFilter = {
      from: 'A4',
      to: autoFilterTo,
    };
  }

  const tongThu = thuList.reduce((s, r) => s + money(r.soTien), 0);
  const tongChi = chiList.reduce((s, r) => s + money(r.soTien), 0);
  const soDu = tongThu - tongChi;

  if (options.overview) {
    const ws = wb.addWorksheet('Tổng quan');

    await addLogo(ws, { col: 0.56 });

    setupSheet(ws, 'DASHBOARD TÀI CHÍNH', {
      titleRange: 'B1:D1',
      subtitleRange: 'B2:D2',
    });

    addKpiSheet({
      ws,
      mergeRightEnd: 'D',
      rows: [
        { label: 'Tổng thu', value: tongThu },
        { label: 'Tổng chi', value: tongChi },
        { label: 'Số dư quỹ', value: soDu },
        { label: 'Số phiếu thu', value: thuList.length, isCount: true, color: PRIMARY },
        { label: 'Số phiếu chi', value: chiList.length, isCount: true, color: PRIMARY },
      ],
    });
  }

  if (options.income) {
    const ws = wb.addWorksheet('Phiếu thu', {
      views: [{ state: 'frozen', ySplit: 4, showGridLines: false }],
    });

    await addLogo(ws);

    setupSheet(ws, 'DANH SÁCH PHIẾU THU', {
      titleRange: 'B1:G1',
      subtitleRange: 'B2:G2',
    });

    addListSheet({
      ws,
      headers: ['Mã phiếu', 'Người nộp', 'Lý do', 'Hình thức', 'Ngày thu', 'Số tiền', 'Mã sự kiện'],
      data: thuList.map((r) => [
        r.id,
        r.nguoiNop,
        r.lyDo,
        r.hinhThuc,
        fmtDate(r.ngayThu),
        money(r.soTien),
        r.maSuKien || '—',
      ]),
      moneyCol: 6,
      centerCols: [1, 4, 5, 7],
      autoFilterTo: 'G4',
    });

    ws.columns = [
      { width: 14 },
      { width: 24 },
      { width: 34 },
      { width: 18 },
      { width: 16 },
      { width: 18 },
      { width: 16 },
    ];
  }

  if (options.expense) {
    const ws = wb.addWorksheet('Phiếu chi', {
      views: [{ state: 'frozen', ySplit: 4, showGridLines: false }],
    });

    await addLogo(ws);

    setupSheet(ws, 'DANH SÁCH PHIẾU CHI', {
      titleRange: 'B1:F1',
      subtitleRange: 'B2:F2',
    });

    addListSheet({
      ws,
      headers: ['Mã phiếu', 'Người nhận', 'Nội dung chi', 'Ngày lập', 'Số tiền', 'Mã sự kiện'],
      data: chiList.map((r) => [
        r.id,
        r.nguoiNhan,
        r.noiDung,
        fmtDate(r.ngayLap),
        money(r.soTien),
        r.maSuKien || '—',
      ]),
      moneyCol: 5,
      centerCols: [1, 4, 6],
      autoFilterTo: 'F4',
    });

    ws.columns = [
      { width: 14 },
      { width: 24 },
      { width: 38 },
      { width: 16 },
      { width: 18 },
      { width: 16 },
    ];
  }

  if (options.report) {
    const ws = wb.addWorksheet('Báo cáo quỹ');

    await addLogo(ws, { col: 0.56 });

    setupSheet(ws, 'BÁO CÁO QUỸ', {
      titleRange: 'B1:E1',
      subtitleRange: 'B2:E2',
    });

    const bcTongThu = bcThu.reduce((s, r) => s + money(r.soTien), 0);
    const bcTongChi = bcChi.reduce((s, r) => s + money(r.soTien), 0);
    const bcSoDu = bcTongThu - bcTongChi;

    addKpiSheet({
      ws,
      rows: [
        { label: 'Tổng thu tháng', value: bcTongThu },
        { label: 'Tổng chi tháng', value: bcTongChi },
        { label: 'Số dư tháng', value: bcSoDu },
      ],
    });
  }

  if (options.charts) {
    const ws = wb.addWorksheet('Biểu đồ');

    await addLogo(ws, { col: 0.56 });

    setupSheet(ws, 'THỐNG KÊ TÀI CHÍNH', {
      titleRange: 'B1:E1',
      subtitleRange: 'B2:E2',
    });

    addKpiSheet({
      ws,
      headerLeft: 'Danh mục',
      headerRight: 'Giá trị',
      rows: [
        { label: 'Tổng thu', value: tongThu },
        { label: 'Tổng chi', value: tongChi },
        { label: 'Số dư', value: soDu },
      ],
    });
  }

  const buffer = await wb.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `BaoCaoTaiChinh_${Date.now()}.xlsx`,
  );
}