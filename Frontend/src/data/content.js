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
  title: ['Kết nối tri thức, xây dựng tương lai'],
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
  tag: 'Hình ảnh',
  title: 'Khoảnh khắc đáng nhớ',
  description:
    'Những hình ảnh ghi lại các hoạt động nổi bật của CLB trong suốt hành trình phát triển.',
  images: [
    { id: 1,  label: 'Hội thảo KH', bg: 'linear-gradient(135deg,#254a2a,#3f6b39)' },
    { id: 2,  label: 'Workshop', bg: 'linear-gradient(135deg,#3f6b39,#64ab59)' },
    { id: 3,  label: 'Giao lưu', bg: 'linear-gradient(135deg,#1e293b,#4b5563)' },
    { id: 4,  label: 'Ngoại khóa', bg: 'linear-gradient(135deg,#64ab59,#c9e8c8)' },
    { id: 5,  label: 'Tọa đàm', bg: 'linear-gradient(135deg,#254a2a,#64ab59)' },
    { id: 6,  label: 'Văn nghệ', bg: 'linear-gradient(135deg,#4b5563,#1e293b)' },
    { id: 7,  label: 'Kết nạp thành viên', bg: 'linear-gradient(135deg,#3f6b39,#254a2a)' },
    { id: 8,  label: 'Sinh hoạt CLB', bg: 'linear-gradient(135deg,#c9e8c8,#64ab59)' },
    { id: 9,  label: 'Học thuật', bg: 'linear-gradient(135deg,#254a2a,#4b5563)' },
    { id: 10, label: 'Team building', bg: 'linear-gradient(135deg,#64ab59,#3f6b39)' },
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