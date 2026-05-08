import React from "react";
import styles from "./Aboutpage.module.css";
import missionIcon from "../assets/icons/mission.svg";
import visionIcon from "../assets/icons/vision.svg";
import valuesIcon from "../assets/icons/values.svg";
import useScrollReveal from "../hooks/useScrollReveal";

const teamMembers = [
  {
    name: "Phạm Hoàng Gia Hiển",
    role: "Ban Điều Hành",
    desc: "Sinh viên năm 2, ngành Kỹ thuật Phần mềm",
    initials: "GH",
    color: "var(--brand-cyan)",
  },
  {
    name: "Trần Thị Hồng Thanh",
    role: "Ban Điều Hành",
    desc: "Sinh viên năm 2, ngành Kỹ thuật Phần mềm",
    initials: "HT",
    color: "var(--accent-emerald)",
  },
  {
    name: "Lê Ngọc Minh Nhật",
    role: "Ban Điều Hành",
    desc: "Sinh viên năm 2, ngành Công nghệ Thông tin",
    initials: "MN",
    color: "var(--accent-purple)",
  },
  {
    name: "Nguyễn Ái My",
    role: "Ban Điều Hành",
    desc: "Sinh viên năm 2, ngành Kỹ thuật Phần mềm",
    initials: "AM",
    color: "var(--accent-pink)",
  },
];

const stats = [
  { number: "1", label: "Tháng kinh nghiệm" },
  { number: "1000+", label: "Thành viên" },
  { number: "50+", label: "Sự kiện" },
  { number: "500", label: "Tài liệu" },
];

const Aboutpage = () => {
  useScrollReveal();
  return (
    <div className={styles.container}>
      {/* ===== 1. Hero / Slogan ===== */}
      <section className={styles.heroSection}>
        <div className={`${styles.heroText} reveal-left`}>
          <span className={styles.heroTag}>ABOUT US</span>
          <h1 className={styles.heroTitle}>
            Học tập không chỉ là <span className={styles.highlight}>con đường</span>,
            <br />
            mà là <span className={styles.highlight}>đích đến</span> của mỗi người.
          </h1>
          <p className={styles.heroDesc}>
            Tri thức là chìa khóa mở ra cánh cửa tương lai. Tại THMN Club, chúng tôi 
            biến việc học thành một hành trình khám phá đầy cảm hứng.
          </p>
        </div>
        <div className={`${styles.heroImageWrapper} reveal-right`}>
          <div className={styles.heroAccentBlock}></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
            alt="Students studying"
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* ===== 2. Brand Story ===== */}
      <section className={`${styles.storySection} reveal`}>
        <div className={`${styles.storyImageWrapper} reveal-left`}>
          <div className={styles.storyAccentBlock}></div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=560&h=420&fit=crop"
            alt="Club founding story"
            className={styles.storyImage}
          />
        </div>
        <div className={`${styles.storyText} reveal-right`}>
          <span className={styles.sectionTag}>CÂU CHUYỆN CỦA CHÚNG TÔI</span>
          <h2 className={styles.sectionTitle}>Khởi nguồn từ <span className={styles.highlight}>đam mê học thuật</span></h2>
          <p className={styles.sectionDesc}>
            Câu lạc bộ học thuật THMN được thành lập với niềm tin rằng mỗi sinh viên
            đều xứng đáng có một môi trường học tập chất lượng. Bắt đầu từ một nhóm
            nhỏ sinh viên đam mê công nghệ, chúng tôi đã phát triển thành một cộng
            đồng sôi động.
          </p>
          <p className={styles.sectionDesc}>
            Chúng tôi tin rằng kiến thức không nên bị giới hạn trong giảng đường. Thông
            qua các buổi workshop, seminar, và dự án thực tế, CLB đã trở thành cầu nối
            giữa lý thuyết và thực hành cho hàng trăm sinh viên.
          </p>
        </div>
      </section>

      {/* ===== 3. Mission & Vision ===== */}
      <section className={`${styles.missionSection} reveal`}>
        <div className={styles.missionHeader}>
          <span className={styles.sectionTag}>SỨ MỆNH & TẦM NHÌN</span>
          <h2 className={styles.sectionTitle}>
            Đưa kiến thức đến <span className={styles.highlight}>gần hơn</span> với cộng đồng
          </h2>
        </div>
        <div className={styles.missionGrid}>
          <div className={styles.missionCard}>
            <div className={styles.missionIcon}>
              <img src={missionIcon} alt="Mission" width="32" height="32" />
            </div>
            <h3>Sứ mệnh</h3>
            <p>
              Tạo ra một hệ sinh thái học thuật nơi sinh viên có thể tiếp cận kiến
              thức chuyên sâu, rèn luyện kỹ năng thực tế và xây dựng mạng lưới kết
              nối chuyên nghiệp.
            </p>
          </div>
          <div className={styles.missionCard}>
            <div className={styles.missionIcon}>
              <img src={visionIcon} alt="Vision" width="32" height="32" />
            </div>
            <h3>Tầm nhìn</h3>
            <p>
              Trở thành câu lạc bộ học thuật hàng đầu, nơi mỗi thành viên đều được
              truyền cảm hứng để không ngừng học hỏi, sáng tạo và đóng góp cho cộng
              đồng.
            </p>
          </div>
          <div className={styles.missionCard}>
            <div className={styles.missionIcon}>
              <img src={valuesIcon} alt="Values" width="32" height="32" />
            </div>
            <h3>Giá trị cốt lõi</h3>
            <p>
              Tinh thần đoàn kết, chia sẻ tri thức không giới hạn, và cam kết phát
              triển bền vững cho mỗi cá nhân trong cộng đồng.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 4. Team ===== */}
      <section className={`${styles.teamSection} reveal`}>
        <div className={styles.teamHeader}>
          <span className={styles.sectionTag}>ĐỘI NGŨ NHÂN SỰ</span>
          <h2 className={styles.sectionTitle}><span className={styles.highlight}>Những người dẫn dắt</span> câu lạc bộ</h2>
          <p className={styles.teamSubtitle}>
            Đội ngũ quản trị viên nhiệt huyết, luôn nỗ lực mang đến trải nghiệm
            tốt nhất cho cộng đồng.
          </p>
        </div>
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div className={styles.teamCard} key={index}>
              <div
                className={styles.teamAvatar}
                style={{ background: member.color }}
              >
                <span className={styles.teamInitials}>{member.initials}</span>
              </div>
              <h4 className={styles.teamName}>{member.name}</h4>
              <span className={styles.teamRole}>{member.role}</span>
              <p className={styles.teamDesc}>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 5. Key Statistics ===== */}
      <section className={`${styles.statsSection} reveal`}>
        <div className={styles.statsOverlay}>
          <span className={styles.sectionTagLight}>NHỮNG CON SỐ BIẾT NÓI</span>
          <h2 className={styles.statsSectionTitle}>Dấu ấn của chúng tôi</h2>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div className={styles.statItem} key={index}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA / Footer ===== */}
      <section className={`${styles.ctaSection} reveal`}>
        <h2 className={styles.ctaTitle}>Sẵn sàng tham gia cùng chúng tôi?</h2>
        <p className={styles.ctaDesc}>
          Hãy trở thành một phần của cộng đồng học thuật năng động và sáng tạo.
        </p>
        <button className={styles.ctaButton}>Đăng ký ngay</button>
      </section>
    </div>
  );
};

export default Aboutpage;
