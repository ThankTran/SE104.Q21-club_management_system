// src/data/content.js
// Toàn bộ nội dung text tập trung tại đây — chỉnh sửa dễ dàng.

export const navLinks = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Giới thiệu', href: '#about' },
  { label: 'Sự kiện', href: '#events' },
  { label: 'Thành viên', href: '#members'},
  { label: 'Liên hệ', href: '#footer' },
];

export const heroData = {
  badge: 'CLB Học Thuật',
  title: ['Kết nối tri', 'thức, xây dựng', 'tương lai'],
  description:
    'Giới thiệu về CLB học thuật — nơi hội tụ những sinh viên đam mê nghiên cứu, học hỏi và cùng nhau phát triển trong môi trường học thuật năng động.',
  cta: 'Tìm hiểu thêm',
  stats: { value: '500+', label: 'Thành viên' },
};

export const aboutData = {
  tag: 'Về chúng tôi',
  title: 'About Club',
  description:
    'Đây là nơi để bạn học hỏi, chia sẻ và cùng nhau tạo nên những giá trị tích cực cho cộng đồng sinh viên.',
  cards: [
    { label: 'Nghiên cứu\nkhoa học', color: '#1a3d2b', height: 200 },
    { label: 'Hội thảo\nchuyên đề',  color: '#2d6a4f', height: 160 },
    { label: 'Kết nối\nmạng lưới',   color: '#74c69d', height: 210 },
    { label: 'Phát triển\nkỹ năng',   color: '#3d5a6c', height: 175 },
    { label: 'Học bổng &\ncơ hội',    color: '#52b788', height: 190 },
  ],
};

export const eventsData = {
  tag: 'Sự kiện',
  title: 'Events',
  description:
    'Giới thiệu về các hoạt động sự kiện của CLB — từ hội thảo, tọa đàm đến các buổi workshop thực tế bổ ích.',
  items: [
    {
      title: 'Hội thảo Nghiên cứu Khoa học 2024',
      desc: 'Sự kiện thường niên quy tụ hơn 200 sinh viên tham gia.',
    },
    {
      title: 'Workshop Kỹ năng mềm',
      desc: 'Loạt workshop chuyên sâu về thuyết trình, làm việc nhóm và quản lý thời gian.',
    },
    {
      title: 'Tọa đàm với chuyên gia',
      desc: 'Chuỗi buổi giao lưu cùng các chuyên gia đầu ngành hàng đầu Việt Nam.',
    },
  ],
  cta: 'Xem thêm sự kiện',
};

export const galleryData = {
  description:
    'Giới thiệu về các hoạt động sự kiện của CLB qua những khoảnh khắc đáng nhớ.',
  images: [
    { label: 'Hội thảo',   bg: 'linear-gradient(135deg,#1a3d2b,#2d6a4f)' },
    { label: 'Workshop',   bg: 'linear-gradient(135deg,#3d5a6c,#2d4a5c)' },
    { label: 'Giao lưu',   bg: 'linear-gradient(135deg,#2d6a4f,#74c69d)' },
    { label: 'Ngoại khóa', bg: 'linear-gradient(135deg,#b0c4d0,#c8d8e4)' },
  ],
  cta: 'Đăng ký ngay',
};

export const footerData = {
  clubName: 'CLB Học Thuật',
  tagline: 'Nơi kết nối những tâm hồn yêu tri thức và khát vọng cống hiến.',
  quickAccess: [
    { label: 'Trang chủ',  href: '#' },
    { label: 'Giới thiệu', href: '#' },
    { label: 'Sự kiện',    href: '#' },
    { label: 'Thành viên', href: '#' },
  ],
  support: [
    { label: 'Liên hệ',         href: '#' },
    { label: 'FAQ',              href: '#' },
    { label: 'Hỗ trợ kỹ thuật', href: '#' },
  ],
  legal: [
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Điều khoản sử dụng', href: '#' },
  ],
};