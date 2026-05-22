import React from "react";
import styles from "./Homepage.module.css";
import archiveIcon from "../../assets/icons/archive.svg";
import membersIcon from "../../assets/icons/members.svg";
import eventsIcon from "../../assets/icons/events.svg";
import addIcon from "../../assets/icons/add.svg";
import verifyIcon from "../../assets/icons/verify.svg";
import maintenanceIcon from "../../assets/icons/maintenance.svg";
import exportReportIcon from "../../assets/icons/export-report.svg";
import preferencesIcon from "../../assets/icons/preferences.svg";
import broadcastIcon from "../../assets/icons/broadcast.svg";
import chevronRightIcon from "../../assets/icons/chevron-right.svg";
import useScrollReveal from "../../hooks/useScrollReveal";

const Homepage = () => {
  useScrollReveal();
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={`${styles.hero} reveal`}>
        <div className={`${styles.heroContent} reveal-left`}>
          <h1 className={styles.heroTitle}>Welcome back, Quản trị viên CLB</h1>
          <p className={styles.heroSubtitle}>
            Quản lý hoạt động của câu lạc bộ, sắp xếp các sự kiện sắp tới, và
            giám sát cộng đồng câu lạc bộ học thuật.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>Thêm mới</button>
            <button className={styles.secondaryButton}>Xem báo cáo</button>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className={`${styles.metrics} reveal`}>
        <div className={styles.metricsHeader}>
          <h2 className={styles.metricsTitle}>Tổng quan</h2>
        </div>
        <div className={`${styles.metricsGrid} reveal`}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <div className={styles.metricIcon}>
                <img src={archiveIcon} alt="Archive" />
              </div>
              <div className={styles.metricBadge}>+12% tháng này</div>
            </div>
            <div className={styles.metricBadgeHeader}>
              <div className={styles.metricNumber}>1,482</div>
            </div>
            <div className={styles.metricLabel}>Các hoạt động</div>
            <div className={styles.metricDesc}>
              Tài liệu mới đã xác minh hiện đang lưu hành trong hệ thống.
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <img src={membersIcon} alt="Members" />
            </div>
            <div className={styles.metricNumber}>86</div>
            <div className={styles.metricLabel}>Thành viên</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <img src={eventsIcon} alt="Events" />
            </div>
            <div className={styles.metricNumber}>24</div>
            <div className={styles.metricLabel}>Sự kiện đang chờ</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${styles.mainContent} reveal`}>
        <div className={`${styles.leftColumn} reveal-left`}>
          {/* Latest Activity */}
          <div className={styles.activity}>
            <h3 className={styles.sectionTitle}>Hoạt động gần đây</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <img src={addIcon} alt="Add" />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <span className={styles.activityTitle}>
                      Thêm thành viên mới: Nguyễn Văn A
                    </span>
                    <span className={styles.activityTime}>2 giờ trước</span>
                  </div>
                  <p className={styles.activityDesc}>Được thêm bởi Admin.</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <img src={verifyIcon} alt="Verify" />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <span className={styles.activityTitle}>
                      Xác minh thành viên hoàn tất
                    </span>
                    <span className={styles.activityTime}>5 giờ trước</span>
                  </div>
                  <p className={styles.activityDesc}>
                    12 sinh viên mới đã được xác minh.
                  </p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <img src={maintenanceIcon} alt="Maintenance" />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <span className={styles.activityTitle}>
                      Thông báo hệ thống: Bảo trì
                    </span>
                    <span className={styles.activityTime}>Hôm qua</span>
                  </div>
                  <p className={styles.activityDesc}>
                    Bảo trì hoàn tất. Hiệu suất cải thiện 15%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className={styles.status}>
            <div className={styles.statusHeader}>
              <div className={styles.statusDot}></div>
              <h3 className={styles.statusTitle}>Hoạt động hệ thống</h3>
            </div>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>API CLB</span>
                <span className={styles.statusValue}>99.9% Uptime</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Độ trễ</span>
                <span className={styles.statusValue}>42ms</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Tải lưu trữ</span>
                <span className={styles.statusValue}>64.2%</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Đồng bộ hoạt động</span>
                <span className={styles.statusValue}>Tốt</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.rightColumn} reveal-right`}>
          {/* Upcoming Events */}
          <div className={styles.events}>
            <h3 className={styles.sectionTitle}>Sự kiện sắp tới</h3>
            <div className={styles.eventList}>
              <div className={styles.eventItem}>
                <div className={styles.eventDate}>
                  <span className={styles.eventDay}>15</span>
                  <span className={styles.eventMonth}>Tháng 5</span>
                </div>
                <div className={styles.eventContent}>
                  <h4 className={styles.eventTitle}>Hội thảo CNTT</h4>
                  <p className={styles.eventDesc}>
                    Thảo luận về xu hướng công nghệ mới.
                  </p>
                </div>
              </div>
              <div className={styles.eventItem}>
                <div className={styles.eventDate}>
                  <span className={styles.eventDay}>20</span>
                  <span className={styles.eventMonth}>Tháng 5</span>
                </div>
                <div className={styles.eventContent}>
                  <h4 className={styles.eventTitle}>Đấu trường IT</h4>
                  <p className={styles.eventDesc}>
                    Thi đấu coding cho sinh viên.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Toolkit */}
          <div className={styles.adminToolkit}>
            <span className={styles.adminToolkitLabel}>ADMIN TOOLKIT</span>
            <div className={styles.adminToolkitList}>
              <button className={styles.adminToolkitItem}>
                <div className={styles.adminToolkitIcon}>
                  <img src={exportReportIcon} alt="Export Report" width="20" height="20" />
                </div>
                <span className={styles.adminToolkitText}>Xuất báo cáo hàng năm</span>
                <img src={chevronRightIcon} alt="" className={styles.adminToolkitChevron} />
              </button>

              <button className={styles.adminToolkitItem}>
                <div className={styles.adminToolkitIcon}>
                  <img src={preferencesIcon} alt="System Preferences" width="20" height="20" />
                </div>
                <span className={styles.adminToolkitText}>Tùy chỉnh hệ thống</span>
                <img src={chevronRightIcon} alt="" className={styles.adminToolkitChevron} />
              </button>

              <button className={styles.adminToolkitItem}>
                <div className={styles.adminToolkitIcon}>
                  <img src={broadcastIcon} alt="Broadcast Message" width="20" height="20" />
                </div>
                <span className={styles.adminToolkitText}>Gửi thông báo hàng loạt</span>
                <img src={chevronRightIcon} alt="" className={styles.adminToolkitChevron} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
