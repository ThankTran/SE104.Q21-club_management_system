import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import logo from "../../assets/logo/logo_cnpm.png";

export default async function exportEventsExcelPro(events = []) {
  const wb = new ExcelJS.Workbook();

  wb.creator = "Club Management";
  wb.company = "Câu lạc bộ học thuật THMN";
  wb.created = new Date();
  wb.modified = new Date();

  // =========================
  // HELPERS
  // =========================
  async function toBase64(url) {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function money(v) {
    return Number(v || 0);
  }

  function viDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;

    return d.toLocaleDateString("vi-VN");
  }

  function statusLabel(status) {
    const map = {
      published: "ĐÃ CÔNG BỐ",
      draft: "NHÁP",
      completed: "ĐÃ KẾT THÚC",
      upcoming: "SẮP TỚI",
      cancelled: "ĐÃ HUỶ",
    };

    return map[status] || status;
  }

  function tagLabel(tag) {
    const map = {
      TECH: "CÔNG NGHỆ",
      ACAD: "HỌC THUẬT",
      SOCIAL: "XÃ HỘI",
      CERT: "CHỨNG CHỈ",
    };

    return map[tag] || tag;
  }

  // =========================
  // SHEET 1
  // =========================
  const ws = wb.addWorksheet("Danh sách sự kiện", {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  // PAGE SETUP
  ws.pageSetup = {
    paperSize: 9,
    orientation: "landscape",
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

  // =========================
  // LOGO
  // =========================
  try {
    const imageId = wb.addImage({
      base64: await toBase64(logo),
      extension: "png",
    });

    ws.addImage(imageId, {
      tl: { col: 0.02, row: 0 },
      ext: { width: 55, height: 55 },
    });
  } catch (err) {
    console.log("Logo load failed:", err);
  }

  // =========================
  // TITLE
  // =========================
  ws.mergeCells("B1:J1");

  const titleCell = ws.getCell("B1");
  titleCell.value = "BÁO CÁO QUẢN LÝ SỰ KIỆN";
  titleCell.font = {
    size: 20,
    bold: true,
    color: { argb: "FFFFFF" },
    name: "Calibri",
  };
  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1e3a8a" },
  };

  ws.getRow(1).height = 42;

  // SUBTITLE
  ws.mergeCells("B2:J2");

  const sub = ws.getCell("B2");
  sub.value = `Ngày xuất file: ${new Date().toLocaleString("vi-VN")}`;
  sub.font = {
    size: 10,
    italic: true,
    color: { argb: "475569" },
  };
  sub.alignment = {
    horizontal: "center",
  };

  ws.getRow(2).height = 22;

  // =========================
  // HEADER
  // =========================
  const headers = [
    "ID",
    "Tên sự kiện",
    "Địa điểm",
    "Ngày",
    "Giờ",
    "Loại",
    "Trạng thái",
    "Sức chứa",
    "Đăng ký",
    "Ngân sách",
  ];

  ws.addRow(headers);

  const headerRow = ws.getRow(4);
  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFF" },
      name: "Calibri",
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2563EB" },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: { style: "thin", color: { argb: "D1D5DB" } },
      left: { style: "thin", color: { argb: "D1D5DB" } },
      right: { style: "thin", color: { argb: "D1D5DB" } },
      bottom: { style: "thin", color: { argb: "D1D5DB" } },
    };
  });

  // =========================
  // DATA
  // =========================
  events.forEach((e, i) => {
    const row = ws.addRow([
      e.id,
      e.title,
      e.location,
      viDate(e.date),
      e.time || "",
      tagLabel(e.tag),
      statusLabel(e.status),
      Number(e.capacity || 0),
      Number(e.attendance || 0),
      money(e.estimatedCost),
    ]);

    row.height = 22;

    row.eachCell((cell) => {
      cell.font = {
        name: "Calibri",
        size: 11,
      };

      cell.alignment = {
        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin", color: { argb: "E5E7EB" } },
        left: { style: "thin", color: { argb: "E5E7EB" } },
        right: { style: "thin", color: { argb: "E5E7EB" } },
        bottom: { style: "thin", color: { argb: "E5E7EB" } },
      };
    });

    // Zebra row
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8FAFC" },
        };
      });
    }

    // align
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(4).alignment = { horizontal: "center" };
    row.getCell(5).alignment = { horizontal: "center" };
    row.getCell(8).alignment = { horizontal: "center" };
    row.getCell(9).alignment = { horizontal: "center" };

    // currency
    row.getCell(10).numFmt = '#,##0" ₫"';

    // status color
    const statusCell = row.getCell(7);

    const statusColor = {
      published: "15803D",
      draft: "64748B",
      completed: "7C3AED",
      upcoming: "0284C7",
      cancelled: "DC2626",
    };

    statusCell.font = {
      bold: true,
      color: {
        argb: statusColor[e.status] || "111827",
      },
    };
  });

  // =========================
  // COLUMN WIDTH
  // =========================
  ws.columns = [
    { width: 8 },
    { width: 34 },
    { width: 26 },
    { width: 14 },
    { width: 10 },
    { width: 16 },
    { width: 18 },
    { width: 12 },
    { width: 12 },
    { width: 18 },
  ];

  // FILTER
  ws.autoFilter = {
    from: "A4",
    to: "J4",
  };

  // FOOTER
  ws.footerFooter = "&LClub Management&RTrang &P / &N";

  // =========================
  // DASHBOARD SHEET
  // =========================
  const dash = wb.addWorksheet("Dashboard");

  const total = events.length;
  const budget = events.reduce((s, e) => s + money(e.estimatedCost), 0);
  const published = events.filter((e) => e.status === "published").length;
  const completed = events.filter((e) => e.status === "completed").length;
  const totalCap = events.reduce((s, e) => s + Number(e.capacity || 0), 0);
  const totalJoin = events.reduce((s, e) => s + Number(e.attendance || 0), 0);

  const fillRate =
    totalCap > 0 ? ((totalJoin / totalCap) * 100).toFixed(1) + "%" : "0%";

  dash.mergeCells("A1:B1");
  dash.getCell("A1").value = "DASHBOARD TỔNG QUAN";
  dash.getCell("A1").font = {
    size: 18,
    bold: true,
    color: { argb: "FFFFFF" },
  };
  dash.getCell("A1").alignment = { horizontal: "center" };
  dash.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1E40AF" },
  };

  dash.getRow(1).height = 28;

  dash.addRow([]);
  dash.addRow(["Tổng số sự kiện", total]);
  dash.addRow(["Đã công bố", published]);
  dash.addRow(["Đã kết thúc", completed]);
  dash.addRow(["Tỉ lệ lấp đầy", fillRate]);
  dash.addRow(["Tổng ngân sách", budget]);

  dash.columns = [
    { width: 26 },
    { width: 20 },
  ];

  for (let i = 3; i <= 7; i++) {
    const row = dash.getRow(i);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "E5E7EB" } },
        left: { style: "thin", color: { argb: "E5E7EB" } },
        right: { style: "thin", color: { argb: "E5E7EB" } },
        bottom: { style: "thin", color: { argb: "E5E7EB" } },
      };
    });

    row.getCell(1).font = { bold: true };
  }

  dash.getCell("B7").numFmt = '#,##0" ₫"';

  // =========================
  // EXPORT
  // =========================
  const buffer = await wb.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `BaoCaoSuKien_${Date.now()}.xlsx`
  );
}