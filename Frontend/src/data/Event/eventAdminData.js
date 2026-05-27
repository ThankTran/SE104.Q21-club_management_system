export const MOCK_EVENTS = [
  { id: 1, title: 'Workshop An ninh mạng', location: 'Lab Hall A', date: '2024-10-24', time: '08:00', estimatedCost: 12500000, status: 'published', tag: 'TECH', capacity: 150, attendance: 124, description: 'Workshop về bảo mật hệ thống và an ninh mạng.' },
  { id: 2, title: 'Chiến lược Metadata 101', location: 'Remote Access', date: '2024-11-12', time: '09:00', estimatedCost: 4200000, status: 'draft', tag: 'ACAD', capacity: 200, attendance: 0, description: 'Khoá học trực tuyến về chiến lược metadata.' },
  { id: 3, title: 'Dạ tiệc Kết nối Mùa hè', location: 'Khuôn viên trường', date: '2024-08-05', time: '18:00', estimatedCost: 8900000, status: 'completed', tag: 'SOCIAL', capacity: 450, attendance: 450, description: 'Sự kiện giao lưu cuối hè của CLB.' },
  { id: 4, title: 'Hội thảo Nghiên cứu Khoa học', location: 'Hội trường A', date: '2024-12-10', time: '08:00', estimatedCost: 15000000, status: 'upcoming', tag: 'ACAD', capacity: 300, attendance: 0, description: 'Hội thảo nghiên cứu khoa học thường niên.' },
  { id: 5, title: 'Chứng chỉ Phân tích Dữ liệu', location: 'Phòng máy tính C101', date: '2024-09-20', time: '08:00', estimatedCost: 6000000, status: 'completed', tag: 'CERT', capacity: 30, attendance: 28, description: 'Khoá học Python data analysis.' },
  { id: 6, title: 'Talkshow Khởi nghiệp Công nghệ', location: 'Hội trường B', date: '2024-11-18', time: '14:00', estimatedCost: 7000000, status: 'published', tag: 'TECH', capacity: 220, attendance: 176, description: 'Chia sẻ từ startup founder và CEO.' },
  { id: 7, title: 'Workshop Git & GitHub', location: 'Phòng Lab B202', date: '2024-10-29', time: '13:30', estimatedCost: 3500000, status: 'published', tag: 'TECH', capacity: 80, attendance: 67, description: 'Hướng dẫn teamwork và quản lý source code.' },
  { id: 8, title: 'Ngày hội Việc làm CNTT', location: 'Sảnh chính', date: '2024-11-25', time: '09:00', estimatedCost: 18000000, status: 'upcoming', tag: 'SOCIAL', capacity: 500, attendance: 0, description: 'Kết nối sinh viên với doanh nghiệp.' },
  { id: 9, title: 'Khóa học TOEIC Cấp tốc', location: 'Phòng B105', date: '2024-10-15', time: '18:00', estimatedCost: 5200000, status: 'completed', tag: 'CERT', capacity: 100, attendance: 91, description: 'Luyện thi TOEIC cho sinh viên.' },
  { id: 10, title: 'Seminar Trí tuệ Nhân tạo', location: 'Phòng D301', date: '2024-12-12', time: '14:00', estimatedCost: 9500000, status: 'upcoming', tag: 'ACAD', capacity: 180, attendance: 0, description: 'Cập nhật xu hướng AI hiện đại.' },
  { id: 11, title: 'Workshop UI/UX Design', location: 'Phòng C204', date: '2024-11-08', time: '15:00', estimatedCost: 4800000, status: 'published', tag: 'TECH', capacity: 60, attendance: 51, description: 'Thực hành thiết kế giao diện hiện đại.' },
  { id: 12, title: 'Diễn đàn Chuyển đổi số', location: 'Hội trường lớn', date: '2024-12-05', time: '09:30', estimatedCost: 13200000, status: 'upcoming', tag: 'ACAD', capacity: 320, attendance: 0, description: 'Thảo luận xu hướng chuyển đổi số.' },
  { id: 13, title: 'Workshop CV & Phỏng vấn', location: 'Phòng A102', date: '2024-10-20', time: '13:00', estimatedCost: 2600000, status: 'completed', tag: 'SOCIAL', capacity: 90, attendance: 83, description: 'Chuẩn bị CV và kỹ năng phỏng vấn.' },
  { id: 14, title: 'Hackathon 24h Sinh viên', location: 'Innovation Lab', date: '2024-11-30', time: '08:00', estimatedCost: 21000000, status: 'upcoming', tag: 'TECH', capacity: 120, attendance: 0, description: 'Cuộc thi sáng tạo giải pháp công nghệ.' },
  { id: 15, title: 'Khóa học MOS Word', location: 'Phòng máy A101', date: '2024-09-28', time: '08:30', estimatedCost: 4300000, status: 'completed', tag: 'CERT', capacity: 40, attendance: 36, description: 'Ôn luyện chứng chỉ MOS Word.' },
  { id: 16, title: 'Giải bóng đá Sinh viên', location: 'Sân vận động', date: '2024-12-14', time: '07:00', estimatedCost: 9800000, status: 'upcoming', tag: 'SOCIAL', capacity: 260, attendance: 0, description: 'Giải đấu giao lưu giữa các khoa.' },
  { id: 17, title: 'Seminar Cloud Computing', location: 'Phòng D105', date: '2024-11-21', time: '10:00', estimatedCost: 6100000, status: 'published', tag: 'ACAD', capacity: 140, attendance: 112, description: 'Tìm hiểu điện toán đám mây.' },
  { id: 18, title: 'Workshop Python nâng cao', location: 'Lab C201', date: '2024-12-16', time: '13:30', estimatedCost: 5600000, status: 'upcoming', tag: 'TECH', capacity: 70, attendance: 0, description: 'Python nâng cao cho data analysis.' },
  { id: 19, title: 'Đêm nhạc Acoustic Sinh viên', location: 'Sân trường', date: '2024-12-18', time: '19:00', estimatedCost: 7600000, status: 'upcoming', tag: 'SOCIAL', capacity: 350, attendance: 0, description: 'Đêm nhạc giao lưu thư giãn.' },
  { id: 20, title: 'Lễ Tổng kết Cuối năm', location: 'Hội trường A', date: '2024-12-28', time: '17:30', estimatedCost: 14500000, status: 'upcoming', tag: 'SOCIAL', capacity: 500, attendance: 0, description: 'Tổng kết hoạt động và trao thưởng.' },
];

export const STATUS_LABEL = {
  published: { label: 'Đang diễn ra', bg: '#e6f4ea', color: '#276749' },
  draft: { label: 'Chưa diễn ra', bg: '#e8ecf2', color: '#3a4a5c' },
  completed: { label: 'Đã kết thúc', bg: '#ede8f8', color: '#5b3fa8' },
  evaluated: { label: 'Đã đánh giá', bg: '#dcfce7', color: '#15803d' },
  upcoming: { label: 'Sắp diễn ra', bg: '#e0f0ff', color: '#1a6b8a' },
  cancelled: { label: 'Đã hủy', bg: '#fff0f0', color: '#e53e3e' },
};

export const TAG_LABEL = {
  TECH: { label: 'CÔNG NGHỆ', bg: '#e0f2fe', color: '#0369a1' },
  ACAD: { label: 'HỌC THUẬT', bg: '#ede9fe', color: '#6d28d9' },
  SOCIAL: { label: 'XÃ HỘI', bg: '#dcfce7', color: '#15803d' },
  CERT: { label: 'CHỨNG CHỈ', bg: '#fef3c7', color: '#b45309' },
  OTHER: { label: 'KHÁC', bg: '#f1f5f9', color: '#475569' },
};

export const PAGE_SIZE = 5;
export const TAG_FILTERS = ['TECH', 'ACAD', 'SOCIAL', 'CERT'];

export const REGISTERED_MEMBER_POOL = [
  { memberCode: '24521643', name: 'Nguyễn Minh Anh', className: 'KTPM2024.1', email: 'minhanh@student.edu.vn' },
  { memberCode: '24521644', name: 'Trần Hoàng Nam', className: 'KTPM2024.2', email: 'hoangnam@student.edu.vn' },
  { memberCode: '23521645', name: 'Lê Gia Hân', className: 'KTPM2023.1', email: 'giahan@student.edu.vn' },
  { memberCode: '23521646', name: 'Phạm Tuấn Kiệt', className: 'KTPM2023.2', email: 'tuankiet@student.edu.vn' },
  { memberCode: '24521647', name: 'Đặng Thu Hà', className: 'CNTT2024.1', email: 'thuha@student.edu.vn' },
  { memberCode: '24521648', name: 'Võ Nhật Linh', className: 'CNTT2024.2', email: 'nhatlinh@student.edu.vn' },
  { memberCode: '23521649', name: 'Bùi Khánh Vy', className: 'HTTT2023.1', email: 'khanhvy@student.edu.vn' },
  { memberCode: '23521650', name: 'Hoàng Đức Huy', className: 'HTTT2023.2', email: 'duchuy@student.edu.vn' },
  { memberCode: '24521651', name: 'Ngô Bảo Ngọc', className: 'KHMT2024.1', email: 'baongoc@student.edu.vn' },
  { memberCode: '24521652', name: 'Đỗ Quang Minh', className: 'KHMT2024.2', email: 'quangminh@student.edu.vn' },
];
