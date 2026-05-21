import { MOCK_MEMBERS } from "../Member/memberMockData";

export const ACCOUNT_STATUS_LABELS = {
  all: "Tất cả",
  active: "Đang hoạt động",
  locked: "Đã khóa",
  pending: "Chờ kích hoạt",
};

const EXTRA_MEMBERS = [
  {
    id: "2410007",
    name: "Hoàng Tuấn Kiệt",
    department: "Khoa Công nghệ phần mềm",
    email: "tuankiet2410007@student.edu.vn",
    role: "Thành viên",
    registeredAt: "2026-04-28",
    requestStatus: "Đã duyệt",
  },
  {
    id: "2410008",
    name: "Bùi Thanh Trúc",
    department: "Khoa Hệ thống thông tin",
    email: "thanhtruc2410008@student.edu.vn",
    role: "Thành viên",
    registeredAt: "2026-05-01",
    requestStatus: "Đã duyệt",
  },
  {
    id: "2410009",
    name: "Đặng Minh Quân",
    department: "Khoa Kỹ thuật máy tính",
    email: "minhquan2410009@student.edu.vn",
    role: "Trưởng ban học thuật",
    registeredAt: "2026-05-04",
    requestStatus: "Đã duyệt",
  },
  {
    id: "2410010",
    name: "Mai Phương Uyên",
    department: "Khoa Khoa học máy tính",
    email: "phuonguyen2410010@student.edu.vn",
    role: "Thành viên",
    registeredAt: "2026-05-08",
    requestStatus: "Đang xét duyệt",
  },
  {
    id: "2410011",
    name: "Ngô Hải Đăng",
    department: "Khoa Mạng máy tính & Truyền thông",
    email: "haidang2410011@student.edu.vn",
    role: "Trưởng ban truyền thông",
    registeredAt: "2026-05-10",
    requestStatus: "Đã duyệt",
  },
  {
    id: "2410012",
    name: "Lý Khánh Vy",
    department: "Khoa Khoa học & Kỹ thuật thông tin",
    email: "khanhvy2410012@student.edu.vn",
    role: "Thành viên",
    registeredAt: "2026-05-11",
    requestStatus: "Đã duyệt",
  },
  {
    id: "2410013",
    name: "Phan Đức Huy",
    department: "Khoa Công nghệ phần mềm",
    email: "duchuy2410013@student.edu.vn",
    role: "Thành viên",
    registeredAt: "2026-05-13",
    requestStatus: "Từ chối",
  },
  {
    id: "2410014",
    name: "Tạ Minh Châu",
    department: "Khoa Hệ thống thông tin",
    email: "minhchau2410014@student.edu.vn",
    role: "Phó chủ nhiệm",
    registeredAt: "2026-05-15",
    requestStatus: "Đã duyệt",
  },
];

const ACCOUNT_META = [
  {
    status: "active",
    lastLogin: "Hôm nay, 09:14",
    sessions: [
      { id: 1, device: "Chrome trên Windows 11", location: "TP. Hồ Chí Minh", ip: "113.160.xx.xx", time: "Đang hoạt động" },
      { id: 2, device: "Safari trên iPhone", location: "Hà Nội", ip: "27.72.xx.xx", time: "2 giờ trước" },
    ],
  },
  {
    status: "active",
    lastLogin: "Hôm qua, 22:13",
    sessions: [
      { id: 1, device: "Chrome trên Android", location: "Cần Thơ", ip: "14.160.xx.xx", time: "Hôm qua" },
    ],
  },
  {
    status: "pending",
    lastLogin: "5 ngày trước",
    sessions: [],
  },
  {
    status: "pending",
    lastLogin: "Chưa đăng nhập",
    sessions: [],
  },
  {
    status: "locked",
    lastLogin: "Chưa đăng nhập",
    sessions: [],
  },
  {
    status: "active",
    lastLogin: "3 giờ trước",
    sessions: [
      { id: 1, device: "Firefox trên macOS", location: "Đà Nẵng", ip: "42.116.xx.xx", time: "3 giờ trước" },
    ],
  },
  {
    status: "active",
    lastLogin: "Hôm nay, 07:35",
    sessions: [
      { id: 1, device: "Edge trên Windows 11", location: "TP. Hồ Chí Minh", ip: "118.69.xx.xx", time: "Hôm nay" },
    ],
  },
  {
    status: "active",
    lastLogin: "1 ngày trước",
    sessions: [
      { id: 1, device: "Safari trên iPad", location: "Hà Nội", ip: "42.112.xx.xx", time: "1 ngày trước" },
    ],
  },
  {
    status: "active",
    lastLogin: "4 giờ trước",
    sessions: [
      { id: 1, device: "Chrome trên Ubuntu", location: "Đà Nẵng", ip: "27.68.xx.xx", time: "4 giờ trước" },
    ],
  },
  {
    status: "pending",
    lastLogin: "Chưa đăng nhập",
    sessions: [],
  },
  {
    status: "active",
    lastLogin: "2 ngày trước",
    sessions: [
      { id: 1, device: "Chrome trên Windows 10", location: "Bình Dương", ip: "14.169.xx.xx", time: "2 ngày trước" },
    ],
  },
  {
    status: "active",
    lastLogin: "6 giờ trước",
    sessions: [
      { id: 1, device: "Firefox trên Windows 11", location: "TP. Hồ Chí Minh", ip: "113.161.xx.xx", time: "6 giờ trước" },
    ],
  },
  {
    status: "locked",
    lastLogin: "7 ngày trước",
    sessions: [],
  },
  {
    status: "active",
    lastLogin: "Hôm nay, 12:05",
    sessions: [
      { id: 1, device: "Chrome trên macOS", location: "Hà Nội", ip: "27.72.xx.xx", time: "Đang hoạt động" },
    ],
  },
];

const ACCOUNT_MEMBERS = [...MOCK_MEMBERS, ...EXTRA_MEMBERS];

export const MOCK_ACCOUNTS = ACCOUNT_MEMBERS.map((member, index) => {
  const meta = ACCOUNT_META[index] || {
    status: member.requestStatus === "Đã duyệt" ? "active" : "pending",
    lastLogin: "Chưa đăng nhập",
    sessions: [],
  };

  return {
    id: `ACC-${String(index + 1).padStart(3, "0")}`,
    memberId: member.id,
    username: member.email.split("@")[0],
    password: `CLB@${member.id.slice(-4)}`,
    name: member.name,
    email: member.email,
    role: member.role,
    department: member.department,
    status: meta.status,
    lastLogin: meta.lastLogin,
    createdAt: formatDate(member.registeredAt),
    sessions: meta.sessions,
  };
});

function formatDate(value) {
  if (!value) return "Chưa cập nhật";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}
