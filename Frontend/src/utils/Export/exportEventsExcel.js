import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import logo from '../../assets/logo/logo_cnpm.png';

const COLORS = {
  title: '1E3A8A',
  header: '2563EB',
  border: 'E5E7EB',
  headerBorder: 'D1D5DB',
  zebra: 'F8FAFC',
  text: '111827',
  muted: '475569',
  white: 'FFFFFF',
};

const STATUS_LABEL = {
  published: 'ĐÃ CÔNG BỐ',
  draft: 'NHÁP',
  completed: 'ĐÃ KẾT THÚC',
  upcoming: 'SẮP TỚI',
  cancelled: 'ĐÃ HUỶ',
};

const STATUS_COLOR = {
  published: '15803D',
  draft: '64748B',
  completed: '7C3AED',
  upcoming: '0284C7',
  cancelled: 'DC2626',
};

const TAG_LABEL = {
  TECH: 'CÔNG NGHỆ',
  ACAD: 'HỌC THUẬT',
  SOCIAL: 'XÃ HỘI',
  CERT: 'CHỨNG CHỈ',
};

const EVENT_COLUMNS = [
  { header: 'Mã sự kiện', width: 12 },
  { header: 'Tên sự kiện', width: 34 },
  { header: 'Địa điểm', width: 26 },
  { header: 'Ngày', width: 14 },
  { header: 'Giờ bắt đầu', width: 12 },
  { header: 'Giờ kết thúc', width: 12 },
  { header: 'Loại', width: 16 },
  { header: 'Trạng thái', width: 18 },
  { header: 'Sức chứa', width: 12 },
  { header: 'Đăng ký', width: 12 },
  { header: 'Ban tổ chức', width: 20 },
  { header: 'Ngân sách', width: 18 },
];

const border = (argb = COLORS.border) => ({
  top: { style: 'thin', color: { argb } },
  left: { style: 'thin', color: { argb } },
  right: { style: 'thin', color: { argb } },
  bottom: { style: 'thin', color: { argb } },
});

export default async function exportEventsExcelPro(events = []) {
  const wb = new ExcelJS.Workbook();

  wb.creator = 'Club Management';
  wb.company = 'Câu lạc bộ học thuật THMN';
  wb.created = new Date();
  wb.modified = new Date();

  const money = (v) => Number(v || 0);

  const viDate = (dateStr) => {
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

  async function addLogo(ws, { col = 0.23, row = 0, width = 55, height = 55 } = {}) {
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

  function setupPage(ws) {
    ws.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.3,
        right: 0.3,
        top: 0.4,
        bottom: 0.4,
        header: 0.2,
        footer: 0.2,
      },
    };
  }

  function setupTitle(ws, title, { titleRange = 'B1:J1', subtitleRange = 'B2:J2' } = {}) {
    ws.mergeCells(titleRange);

    const titleCell = ws.getCell(titleRange.split(':')[0]);
    titleCell.value = title;
    titleCell.font = {
      size: 20,
      bold: true,
      color: { argb: COLORS.white },
      name: 'Calibri',
    };
    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.title },
    };

    ws.getRow(1).height = 42;

    ws.mergeCells(subtitleRange);

    const sub = ws.getCell(subtitleRange.split(':')[0]);
    sub.value = `Ngày xuất file: ${new Date().toLocaleString('vi-VN')}`;
    sub.font = {
      size: 10,
      italic: true,
      color: { argb: COLORS.muted },
    };
    sub.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    ws.getRow(2).height = 22;
  }

  function styleHeader(row) {
    row.height = 24;

    row.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: COLORS.white },
        name: 'Calibri',
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.header },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = border(COLORS.headerBorder);
    });
  }

  function styleDataRow(row, index) {
    row.height = 22;

    row.eachCell((cell) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
      };
      cell.alignment = {
        vertical: 'middle',
      };
      cell.border = border();

      if (index % 2 === 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLORS.zebra },
        };
      }
    });
  }

  function createBaseSheet(name, title, options = {}) {
    const ws = wb.addWorksheet(name, {
      views: [{ state: 'frozen', ySplit: 4, showGridLines: false }],
    });

    setupPage(ws);
    setupTitle(ws, title, options);

    return ws;
  }

  async function createEventSheet() {
    const ws = createBaseSheet('Danh sách sự kiện', 'BÁO CÁO QUẢN LÝ SỰ KIỆN', {
      titleRange: 'B1:L1',
      subtitleRange: 'B2:L2',
    });

    await addLogo(ws);

    ws.getRow(3).height = 8;

    EVENT_COLUMNS.forEach((col, index) => {
      ws.getCell(4, index + 1).value = col.header;
    });

    styleHeader(ws.getRow(4));    styleHeader(ws.getRow(4));

    events.forEach((event, index) => {
      const row = ws.addRow([
        event.eventCode || event.id,
        event.title,
        event.location,
        viDate(event.date),
        event.time || '',
        event.endTime || '',
        TAG_LABEL[event.tag] || event.tag,
        STATUS_LABEL[event.status] || event.status,
        Number(event.capacity || 0),
        Number(event.attendance || 0),
        event.organizer || '',
        money(event.estimatedCost),
      ]);

      styleDataRow(row, index);

      [1, 4, 5, 6, 9, 10].forEach((col) => {
        row.getCell(col).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      });

      row.getCell(12).numFmt = '#,##0" ₫"';

      row.getCell(8).font = {
        bold: true,
        color: {
          argb: STATUS_COLOR[event.status] || COLORS.text,
        },
      };
    });

    ws.columns = EVENT_COLUMNS.map(({ width }) => ({ width }));

    ws.autoFilter = {
      from: 'A4',
      to: 'L4',
    };

    ws.footerFooter = '&LClub Management&RTrang &P / &N';
  }

  function createDashboardSheet() {
    const ws = wb.addWorksheet('Dashboard');

    ws.views = [{ showGridLines: false }];

    const total = events.length;
    const budget = events.reduce((s, e) => s + money(e.estimatedCost), 0);
    const published = events.filter((e) => e.status === 'published').length;
    const completed = events.filter((e) => e.status === 'completed').length;
    const totalCap = events.reduce((s, e) => s + Number(e.capacity || 0), 0);
    const totalJoin = events.reduce((s, e) => s + Number(e.attendance || 0), 0);
    const fillRate = totalCap > 0 ? `${((totalJoin / totalCap) * 100).toFixed(1)}%` : '0%';

    ws.mergeCells('A1:B1');

    const title = ws.getCell('A1');
    title.value = 'DASHBOARD TỔNG QUAN';
    title.font = {
      size: 18,
      bold: true,
      color: { argb: COLORS.white },
    };
    title.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    title.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.title },
    };

    ws.getRow(1).height = 28;

    const rows = [
      ['Tổng số sự kiện', total, 'count'],
      ['Đã công bố', published, 'count'],
      ['Đã kết thúc', completed, 'count'],
      ['Tỉ lệ lấp đầy', fillRate, 'percent'],
      ['Tổng ngân sách', budget, 'money'],
    ];

    ws.addRow([]);

    rows.forEach(([label, value]) => {
      ws.addRow([label, value]);
    });

    ws.columns = [
      { width: 26 },
      { width: 20 },
    ];

    for (let i = 3; i <= 7; i++) {
      const row = ws.getRow(i);
      const valueCell = row.getCell(2);
      const type = rows[i - 3][2];

      row.eachCell((cell) => {
        cell.border = border();
        cell.alignment = {
          vertical: 'middle',
        };
      });

      row.getCell(1).font = {
        bold: true,
        color: { argb: COLORS.text },
      };

      if (type === 'money') {
        valueCell.numFmt = '#,##0" ₫"';
      }

      valueCell.font = {
        bold: true,
        color: { argb: type === 'money' ? COLORS.title : COLORS.header },
      };
    }
  }

  await createEventSheet();
  createDashboardSheet();

  const buffer = await wb.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `BaoCaoSuKien_${Date.now()}.xlsx`,
  );
}
