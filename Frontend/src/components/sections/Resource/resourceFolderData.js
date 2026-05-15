export const RESOURCE_FOLDER_TREE = [
  {
    id: 'general',
    label: 'ĐẠI CƯƠNG',
    children: [
      {
        id: 'politics-law',
        label: 'Lý luận chính trị và pháp luật',
        children: [
          { id: 'tu-tuong-ho-chi-minh', label: 'Tư tưởng Hồ Chí Minh' },
          { id: 'triet-hoc-mac-lenin', label: 'Triết học Mác - Lênin' },
          { id: 'kinh-te-chinh-tri', label: 'Kinh tế Chính trị Mác - Lênin' },
          { id: 'chu-nghia-xa-hoi-khoa-hoc', label: 'Chủ nghĩa xã hội khoa học' },
          { id: 'lich-su-dang', label: 'Lịch sử Đảng Cộng sản Việt Nam' },
          { id: 'phap-luat-dai-cuong', label: 'Pháp luật đại cương' },
        ],
      },
      {
        id: 'math-it-science',
        label: 'Toán - Tin học - Khoa học tự nhiên',
        children: [
          { id: 'giai-tich', label: 'Giải tích' },
          { id: 'dai-so-tuyen-tinh', label: 'Đại số tuyến tính' },
          { id: 'cau-truc-roi-rac', label: 'Cấu trúc rời rạc' },
          { id: 'xac-suat-thong-ke', label: 'Xác suất thống kê' },
          { id: 'nhap-mon-lap-trinh', label: 'Nhập môn lập trình' },
        ],
      },
      {
        id: 'foreign-language',
        label: 'Ngoại ngữ',
        children: [
          { id: 'anh-van-1', label: 'Anh văn 1' },
          { id: 'anh-van-2', label: 'Anh văn 2' },
          { id: 'anh-van-3', label: 'Anh văn 3' },
        ],
      },
    ],
  },
  {
    id: 'major',
    label: 'CHUYÊN NGÀNH',
    children: [
      { id: 'cong-nghe-phan-mem', label: 'Công nghệ phần mềm' },
      { id: 'he-thong-thong-tin', label: 'Hệ thống thông tin' },
      { id: 'khoa-hoc-may-tinh', label: 'Khoa học máy tính' },
      { id: 'ky-thuat-may-tinh', label: 'Kỹ thuật máy tính' },
      { id: 'mang-may-tinh', label: 'Mạng máy tính và truyền thông dữ liệu' },
      { id: 'an-toan-thong-tin', label: 'An toàn thông tin' },
      { id: 'thuong-mai-dien-tu', label: 'Thương mại điện tử' },
    ],
  },
];

export const RESOURCE_LEAF_FOLDERS = flattenLeaves(RESOURCE_FOLDER_TREE);
export const DEFAULT_RESOURCE_FOLDER_ID = RESOURCE_LEAF_FOLDERS[0].id;

export function flattenLeaves(nodes, parentLabels = []) {
  return nodes.flatMap((node) => {
    const path = [...parentLabels, node.label];
    if (!node.children?.length) {
      return { ...node, pathLabel: path.join(' / ') };
    }
    return flattenLeaves(node.children, path);
  });
}
