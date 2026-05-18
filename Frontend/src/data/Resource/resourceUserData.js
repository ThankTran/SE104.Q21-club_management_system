export const MOCK_RESOURCES = [
  { id: 1, title: 'Giáo trình Lập trình hướng đối tượng', category: 'major', major: 'Công nghệ phần mềm', subject: 'Lập trình hướng đối tượng', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Tài liệu chính thức môn OOP dùng trong học kỳ 1.', link: '#', uploadedBy: 'Nguyễn Minh Anh', createdAt: '2024-12-10', status: 'approved' },
  { id: 2, title: 'Slide Cơ sở dữ liệu – Chương 1 đến 5', category: 'major', major: 'Hệ thống thông tin', subject: 'Cơ sở dữ liệu', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Slide bài giảng môn CSDL.', link: '#', uploadedBy: 'Trần Quốc Bảo', createdAt: '2024-12-08', status: 'approved' },
  { id: 3, title: 'Tài liệu tham khảo Mạng máy tính', category: 'major', major: 'Mạng máy tính và truyền thông', subject: 'Mạng máy tính', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Tổng hợp lý thuyết TCP/IP.', link: '#', uploadedBy: 'Lê Hoàng Nam', createdAt: '2024-12-05', status: 'approved' },
  { id: 4, title: 'Giáo trình Giải tích 1', category: 'general', major: null, subject: 'Giải tích 1', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Giáo trình Giải tích 1.', link: '#', uploadedBy: 'Phạm Gia Hân', createdAt: '2024-12-01', status: 'approved' },
  { id: 5, title: 'Slide Kỹ thuật phần mềm – Agile & Scrum', category: 'major', major: 'Công nghệ phần mềm', subject: 'Kỹ thuật phần mềm', type: 'Slide bài giảng', format: 'PPT', source: 'Tự biên soạn', description: 'Agile và Scrum.', link: '#', uploadedBy: 'Võ Đức Tài', createdAt: '2024-11-28', status: 'approved' },
  { id: 6, title: 'Python cho Data Science – Hướng dẫn', category: 'major', major: 'Khoa học dữ liệu', subject: 'Khoa học dữ liệu', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Pandas và NumPy.', link: '#', uploadedBy: 'Nguyễn Khánh Linh', createdAt: '2024-11-25', status: 'approved' },
  { id: 7, title: 'Giáo trình Đại số tuyến tính', category: 'general', major: null, subject: 'Đại số tuyến tính', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Ma trận và không gian vector.', link: '#', uploadedBy: 'Đặng Nhật Quang', createdAt: '2024-11-22', status: 'approved' },
  { id: 8, title: 'Slide An toàn thông tin – Chương 1-4', category: 'major', major: 'An toàn thông tin', subject: 'An toàn thông tin', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Mã hóa và bảo mật.', link: '#', uploadedBy: 'Huỳnh Bảo Trân', createdAt: '2024-11-20', status: 'approved' },
  { id: 9, title: 'Tài liệu Git & GitHub thực hành', category: 'major', major: 'Công nghệ phần mềm', subject: 'Công cụ lập trình', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Git từ cơ bản đến nâng cao.', link: '#', uploadedBy: 'Trương Hải Đăng', createdAt: '2024-11-18', status: 'approved' },
  { id: 10, title: 'Giáo trình Kiến trúc máy tính', category: 'major', major: 'Kỹ thuật máy tính', subject: 'Kiến trúc máy tính', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'CPU và bộ nhớ.', link: '#', uploadedBy: 'Bùi Ngọc Mai', createdAt: '2024-11-15', status: 'approved' },
  { id: 11, title: 'React.js – Tài liệu học cơ bản', category: 'major', major: 'Công nghệ phần mềm', subject: 'Lập trình Web', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'React hooks và routing.', link: '#', uploadedBy: 'Lý Tuấn Kiệt', createdAt: '2024-11-12', status: 'approved' },
  { id: 12, title: 'Slide Trí tuệ nhân tạo – Giới thiệu AI', category: 'major', major: 'Khoa học máy tính', subject: 'Trí tuệ nhân tạo', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Machine learning cơ bản.', link: '#', uploadedBy: 'Phan Thảo Vy', createdAt: '2024-11-10', status: 'approved' },
  { id: 13, title: 'Tổng hợp đề thi CSDL các năm', category: 'major', major: 'Hệ thống thông tin', subject: 'Cơ sở dữ liệu', type: 'Tài liệu tham khảo', format: 'DOCX', source: 'Tự biên soạn', description: 'Đề thi từ 2020–2024.', link: '#', uploadedBy: 'Ngô Gia Huy', createdAt: '2024-11-08', status: 'approved' },
  { id: 14, title: 'Docker & Container – Hướng dẫn thực tế', category: 'major', major: 'Công nghệ phần mềm', subject: 'DevOps', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Docker cơ bản.', link: '#', uploadedBy: 'Mai Thanh Tùng', createdAt: '2024-11-05', status: 'approved' },
  { id: 15, title: 'Slide Lập trình Web – HTML CSS JS', category: 'major', major: 'Thương mại điện tử', subject: 'Lập trình Web', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'HTML CSS JavaScript.', link: '#', uploadedBy: 'Đoàn Yến Nhi', createdAt: '2024-11-02', status: 'approved' },
  { id: 16, title: 'Giáo trình Xác suất thống kê', category: 'general', major: null, subject: 'Xác suất thống kê', type: 'Giáo trình', format: 'PDF', source: 'Giảng viên cung cấp', description: 'Xác suất và thống kê.', link: '#', uploadedBy: 'Tạ Minh Khoa', createdAt: '2024-10-28', status: 'approved' },
  { id: 17, title: 'Node.js – Backend Development Guide', category: 'major', major: 'Công nghệ phần mềm', subject: 'Lập trình Web', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'REST API với Express.', link: '#', uploadedBy: 'Vũ Thành Công', createdAt: '2024-10-25', status: 'approved' },
  { id: 18, title: 'Tổng hợp đề thi Giải tích 1 – 2023', category: 'general', major: null, subject: 'Giải tích 1', type: 'Tài liệu tham khảo', format: 'DOCX', source: 'Tự biên soạn', description: 'Đề thi Giải tích 1.', link: '#', uploadedBy: 'Châu Bích Ngọc', createdAt: '2024-10-22', status: 'approved' },
  { id: 19, title: 'Slide Hệ điều hành – Chương 1-6', category: 'major', major: 'Khoa học máy tính', subject: 'Hệ điều hành', type: 'Slide bài giảng', format: 'PPT', source: 'Giảng viên cung cấp', description: 'Process và Thread.', link: '#', uploadedBy: 'Nguyễn Quốc Hưng', createdAt: '2024-10-18', status: 'approved' },
  { id: 20, title: 'Tài liệu UI/UX Design Fundamentals', category: 'major', major: 'Thương mại điện tử', subject: 'Thiết kế giao diện', type: 'Tài liệu tham khảo', format: 'PDF', source: 'Internet', description: 'Wireframe và prototype.', link: '#', uploadedBy: 'Lâm Gia Linh', createdAt: '2024-10-15', status: 'approved' },
];

export const TYPE_TABS = ['Tất cả', 'Giáo trình', 'Slide bài giảng', 'Tài liệu tham khảo', 'Đề thi', 'Bài tập', 'Khác'];
export const FORMAT_OPTIONS = ['Tất cả', 'PDF', 'DOCX', 'PPT', 'ZIP', 'PNG', 'Khác'];
export const SOURCE_OPTIONS = ['Tất cả', 'Giảng viên cung cấp', 'Tự biên soạn', 'Internet', 'Sinh viên khóa trước', 'Khác'];

export const PAGE_SIZE = 12;

export const MEMBER_PROFILE = {
  name: 'Nguyễn Minh Anh',
  memberId: 'TV001',
  role: 'Thành viên',
};

export const INITIAL_MEMBER_SUBMISSIONS = [
  {
    id: 'DX-001',
    title: 'Giáo trình React Hooks cơ bản',
    subject: 'Lập trình Web',
    type: 'Tài liệu tham khảo',
    format: 'PDF',
    link: '#',
    createdAt: '2024-12-12',
    status: 'approved',
    reviewedAt: '2024-12-14',
    note: 'Đã duyệt và thêm vào kho tài liệu.',
  },
  {
    id: 'DX-002',
    title: 'Slide DevOps tổng hợp',
    subject: 'DevOps',
    type: 'Slide bài giảng',
    format: 'PPT',
    link: '#',
    createdAt: '2024-12-15',
    status: 'pending',
    reviewedAt: '',
    note: 'Phiếu đang chờ admin xét duyệt.',
  },
];

