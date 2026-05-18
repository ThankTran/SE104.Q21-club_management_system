import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import logo from '../../assets/logo/logo_cnpm.png';

const COLUMNS = [
  { header: 'STT', width: 8 },
  { header: 'MSSV', width: 16 },
  { header: 'Họ tên', width: 28 },
  { header: 'Lớp', width: 16 },
  { header: 'Email', width: 30 },
  { header: 'Ngày đăng ký', width: 16 },
];

const border = {
  top: { style: 'thin', color: { argb: 'E5E7EB' } },
  left: { style: 'thin', color: { argb: 'E5E7EB' } },
  right: { style: 'thin', color: { argb: 'E5E7EB' } },
  bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
};

export default async function exportEventRegistrationsExcel(event, members = []) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh sách đăng ký', {
    views: [{ state: 'frozen', ySplit: 4, showGridLines: false }],
  });

  workbook.creator = 'Club Management';
  workbook.created = new Date();
  workbook.modified = new Date();

  const toBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  try {
    const imageId = workbook.addImage({
      base64: await toBase64(logo),
      extension: 'png',
    });

    worksheet.addImage(imageId, {
      tl: { col: 0.02, row: 0 },
      ext: { width: 55, height: 55 },
    });
  } catch (error) {
    console.log('Logo load failed:', error);
  }

  worksheet.mergeCells('B1:F1');
  worksheet.getCell('B1').value = 'DANH SÁCH THÀNH VIÊN ĐĂNG KÝ';
  worksheet.getCell('B1').font = { bold: true, size: 18, color: { argb: 'FFFFFF' }, name: 'Calibri' };
  worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('B1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
  worksheet.getRow(1).height = 42;

  worksheet.mergeCells('B2:F2');
  worksheet.getCell('B2').value = `${event?.eventCode || ''} - ${event?.title || ''} | Ngày xuất file: ${new Date().toLocaleString('vi-VN')}`;
  worksheet.getCell('B2').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('B2').font = { size: 10, italic: true, color: { argb: '475569' }, name: 'Calibri' };
  worksheet.getRow(2).height = 22;
  worksheet.getRow(3).height = 8;

  COLUMNS.forEach((column, index) => {
    worksheet.getCell(4, index + 1).value = column.header;
  });

  worksheet.getRow(4).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
    cell.border = border;
  });

  members.forEach((member, index) => {
    const row = worksheet.addRow([
      index + 1,
      member.memberCode,
      member.name,
      member.className,
      member.email,
      member.registeredAt,
    ]);

    row.eachCell((cell) => {
      cell.border = border;
      cell.alignment = { vertical: 'middle' };
    });
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  });

  worksheet.columns = COLUMNS.map(({ width }) => ({ width }));
  worksheet.autoFilter = { from: 'A4', to: 'F4' };

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `DanhSachDangKy_${event?.eventCode || 'SuKien'}_${Date.now()}.xlsx`;

  saveAs(new Blob([buffer]), fileName);
}
