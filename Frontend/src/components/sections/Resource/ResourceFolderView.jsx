import styles from "./ResourceFolderView.module.css";

const GENERAL_SUBJECTS = [
  "Giải tích 1",
  "Đại số tuyến tính",
  "Xác suất thống kê",
  "Chính trị và xã hội",
];

const UIT_MAJORS = [
  "Công nghệ phần mềm",
  "Hệ thống thông tin",
  "Khoa học máy tính",
  "Kỹ thuật máy tính",
  "Mạng máy tính và truyền thông",
  "Khoa học dữ liệu",
  "An toàn thông tin",
  "Thương mại điện tử",
];

export default function ResourceFolderView({
  selectedCategory,
  onSelectCategory,
  onSelectMajor,
  onSelectSubject,
}) {
  if (!selectedCategory) {
    return (
      <div className={styles.folderTable}>
        <div className={styles.header}>
          <span>Loại</span>
          <span>Tên</span>
          <span>Tùy chọn</span>
        </div>

        <button className={styles.row} onClick={() => onSelectCategory("general")}>
          <span className={styles.folderIcon}>📁</span>
          <span className={styles.name}>1. Môn đại cương</span>
          <span className={styles.action}>📋</span>
        </button>

        <button className={styles.row} onClick={() => onSelectCategory("major")}>
          <span className={styles.folderIcon}>📁</span>
          <span className={styles.name}>2. Môn theo ngành</span>
          <span className={styles.action}>📋</span>
        </button>
      </div>
    );
  }

  if (selectedCategory === "general") {
    return (
      <div className={styles.folderTable}>
        <div className={styles.header}>
          <span>Loại</span>
          <span>Tên môn học</span>
          <span>Tùy chọn</span>
        </div>

        {GENERAL_SUBJECTS.map((subject, index) => (
          <button
            key={subject}
            className={styles.row}
            onClick={() => onSelectSubject(subject)}
          >
            <span className={styles.folderIcon}>📁</span>
            <span className={styles.name}>{index + 1}. {subject}</span>
            <span className={styles.action}>📋</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.folderTable}>
      <div className={styles.header}>
        <span>Loại</span>
        <span>Tên ngành</span>
        <span>Tùy chọn</span>
      </div>

      {UIT_MAJORS.map((major, index) => (
        <button
          key={major}
          className={styles.row}
          onClick={() => onSelectMajor(major)}
        >
          <span className={styles.folderIcon}>📁</span>
          <span className={styles.name}>{index + 1}. {major}</span>
          <span className={styles.action}>📋</span>
        </button>
      ))}
    </div>
  );
}