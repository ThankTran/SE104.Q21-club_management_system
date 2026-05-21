import React, { useState } from "react";
import styles from "./HelpPage.module.css";
import useScrollReveal from "../../hooks/useScrollReveal";

import searchIcon from "../../assets/icons/search.svg";
import helpIcon from "../../assets/icons/help.svg";
import membersIcon from "../../assets/icons/members.svg";
import eventsIcon from "../../assets/icons/events.svg";
import resourcesIcon from "../../assets/icons/resources.svg";
import financeIcon from "../../assets/icons/finance.svg";
import verifyIcon from "../../assets/icons/verify.svg";
import infoIcon from "../../assets/icons/infor.svg";

const FAQ_DATA = [
  {
    id: 1,
    category: "member",
    question: "Làm thế nào để cập nhật thông tin học tập và chuyên ngành?",
    answer: "Bạn có thể truy cập vào trang 'Trang cá nhân' bằng cách bấm vào avatar ở thanh Navbar hoặc menu, sau đó chọn tab 'Học tập & Chuyên môn'. Tại đây, hãy bấm nút 'Chỉnh sửa hồ sơ' để sửa đổi ngành học, điểm GPA, ban hoạt động và các kỹ năng chuyên môn, sau đó lưu lại.",
  },
  {
    id: 2,
    category: "event",
    question: "Quy trình đăng ký tham gia một sự kiện mới như thế nào?",
    answer: "Bạn hãy chọn mục 'Sự kiện' trên Sidebar để xem danh sách các sự kiện đang diễn ra. Bấm chọn sự kiện mong muốn và nhấn nút 'Đăng ký tham gia'. Hệ thống sẽ tự động cập nhật lịch sử và gửi thông báo xác nhận qua email của bạn.",
  },
  {
    id: 3,
    category: "resource",
    question: "Làm cách nào để tải tài liệu học thuật lên hệ thống?",
    answer: "Vào mục 'Tài liệu' trên Sidebar. Nếu bạn là Quản trị viên hoặc được cấp quyền tải tài liệu, bạn sẽ thấy nút 'Thêm tài liệu'. Hãy điền đầy đủ các thông tin như tên tài liệu, môn học, mô tả ngắn và tải lên file (định dạng PDF, DOCX, ZIP...). Tài liệu sẽ hiển thị cho mọi người sau khi được duyệt.",
  },
  {
    id: 4,
    category: "finance",
    question: "Tôi có thể theo dõi tình hình tài chính và quỹ CLB ở đâu?",
    answer: "Hãy chọn mục 'Thu chi' trên Sidebar. Tại đây bạn sẽ thấy biểu đồ tổng quan quỹ CLB, danh sách các khoản thu đóng góp quỹ và lịch sử chi tiêu minh bạch được cập nhật bởi Ban Tài chính định kỳ hàng tháng.",
  },
  {
    id: 5,
    category: "account",
    question: "Làm sao để thay đổi mật khẩu và cài đặt nhận thông báo?",
    answer: "Bạn vào 'Trang cá nhân', chọn tab 'Bảo mật & Cài đặt'. Tại đây có biểu mẫu đổi mật khẩu và các nút gạt (toggle) để bật/tắt nhận thông báo qua Email hoặc thông báo hoạt động nội bộ CLB.",
  },
  {
    id: 6,
    category: "member",
    question: "Tôi muốn tham gia Ban Học thuật hoặc Ban Truyền thông của CLB thì làm thế nào?",
    answer: "Vào các đợt tuyển thành viên (thường ở đầu học kỳ), Ban Chủ nhiệm sẽ đăng thông báo tuyển dụng trên trang chủ. Bạn có thể nộp đơn trực tuyến hoặc liên hệ trực tiếp trưởng ban học thuật để được hướng dẫn chi tiết về quy trình ứng tuyển.",
  },
  {
    id: 7,
    category: "resource",
    question: "Có giới hạn dung lượng và định dạng cho tài liệu tải lên không?",
    answer: "Có, hệ thống giới hạn dung lượng tối đa là 20MB cho mỗi file tài liệu học thuật để đảm bảo tài nguyên lưu trữ. Các định dạng được hỗ trợ bao gồm PDF, DOCX, XLSX, PPTX, ZIP, và RAR.",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tất cả câu hỏi", icon: helpIcon },
  { id: "member", label: "Thành viên", icon: membersIcon },
  { id: "event", label: "Sự kiện", icon: eventsIcon },
  { id: "resource", label: "Tài liệu", icon: resourcesIcon },
  { id: "finance", label: "Thu chi", icon: financeIcon },
];

export default function HelpPage() {
  useScrollReveal();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Feedback Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMsg) setErrorMsg("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formState;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ các trường thông tin bắt buộc.");
      return;
    }

    if (!email.includes("@")) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({
        name: "",
        email: "",
        topic: "general",
        message: "",
      });
      
      // Auto dismiss success screen after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 6000);
    }, 1500);
  };

  // Filter FAQs
  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      {/* Help Banner Section */}
      <div className={`${styles.banner} reveal`}>
        <div className={styles.bannerOverlay}></div>
        <div className={`${styles.bannerContent} reveal-left`}>
          <h1 className={styles.bannerTitle}>Chúng tôi có thể giúp gì cho bạn?</h1>
          <p className={styles.bannerSubtitle}>
            Tìm kiếm câu trả lời nhanh chóng hoặc gửi yêu cầu hỗ trợ đến Ban quản trị câu lạc bộ.
          </p>
          <div className={styles.searchBox}>
            <img src={searchIcon} alt="Search" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm (ví dụ: đóng quỹ, tài liệu, sự kiện...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery("")}
                title="Xóa tìm kiếm"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.gridContent}>
        {/* Left Column: FAQ Accordion & Category Tabs */}
        <div className={`${styles.faqColumn} reveal-left`}>
          <h2 className={styles.sectionTitle}>
            <img src={infoIcon} alt="FAQs" className={styles.sectionTitleIcon} />
            Câu hỏi thường gặp
          </h2>

          {/* Categories Tab Bar */}
          <div className={styles.categoryTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${
                  activeCategory === cat.id ? styles.activeTab : ""
                }`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedFaq(null);
                }}
              >
                <img src={cat.icon} alt="" className={styles.tabIcon} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className={styles.faqList}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                  >
                    <button
                      className={styles.faqQuestionBtn}
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.faqQuestionText}>{faq.question}</span>
                      <span className={styles.faqArrow}>{isOpen ? "▲" : "▼"}</span>
                    </button>
                    <div
                      className={styles.faqAnswerContainer}
                      style={{
                        maxHeight: isOpen ? "200px" : "0",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p className={styles.faqAnswerText}>{faq.answer}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.noResults}>
                <p>Không tìm thấy câu hỏi phù hợp với từ khóa của bạn.</p>
                <button
                  className={styles.resetSearchBtn}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact info & Support Form */}
        <div className={`${styles.formColumn} reveal-right`}>
          {/* Quick Contact Cards */}
          <div className={styles.contactSection}>
            <h3 className={styles.sideTitle}>Liên hệ hỗ trợ nhanh</h3>
            <div className={styles.contactCards}>
              <div className={styles.contactCard}>
                <span className={styles.contactLabel}>Email Hỗ trợ:</span>
                <a href="mailto:24521092@gm.uit.edu.vn" className={styles.contactValue}>
                  24521092@gm.uit.edu.vn
                </a>
              </div>
              <div className={styles.contactCard}>
                <span className={styles.contactLabel}>Hotline:</span>
                <span className={styles.contactValue}>0987654321</span>
              </div>
              <div className={styles.contactCard}>
                <span className={styles.contactLabel}>Văn phòng CLB:</span>
                <span className={styles.contactValue}>Tầng 7, tòa E, UIT</span>
              </div>
            </div>
          </div>

          {/* Message / Support Ticket Form */}
          <div className={styles.ticketFormContainer}>
            <h3 className={styles.sideTitle}>Gửi ý kiến đóng góp & Yêu cầu</h3>
            
            {submitSuccess ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h4 className={styles.successTitle}>Gửi thông tin thành công!</h4>
                <p className={styles.successText}>
                  Cảm ơn bạn đã đóng góp ý kiến. Yêu cầu của bạn đã được tiếp nhận và ban quản trị sẽ phản hồi qua email trong vòng 24 giờ làm việc.
                </p>
                <button
                  className={styles.sendNewBtn}
                  onClick={() => setSubmitSuccess(false)}
                >
                  Gửi thêm phản hồi khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className={styles.supportForm}>
                {errorMsg && <div className={styles.formError}>{errorMsg}</div>}
                
                <div className={styles.formGroup}>
                  <label htmlFor="support-name">Họ và tên *</label>
                  <input
                    id="support-name"
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleFormChange}
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="support-email">Email liên hệ *</label>
                  <input
                    id="support-email"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleFormChange}
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="support-topic">Vấn đề cần hỗ trợ *</label>
                  <select
                    id="support-topic"
                    name="topic"
                    value={formState.topic}
                    onChange={handleFormChange}
                  >
                    <option value="general">Hỏi đáp chung</option>
                    <option value="member">Quản lý thành viên & Hồ sơ</option>
                    <option value="event">Sự kiện & Hoạt động</option>
                    <option value="finance">Thu chi & Tài chính</option>
                    <option value="technical">Lỗi kỹ thuật hệ thống</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="support-message">Nội dung yêu cầu *</label>
                  <textarea
                    id="support-message"
                    name="message"
                    rows="4"
                    maxLength="500"
                    value={formState.message}
                    onChange={handleFormChange}
                    placeholder="Mô tả chi tiết thắc mắc hoặc góp ý của bạn (tối đa 500 ký tự)..."
                    required
                  ></textarea>
                  <span className={styles.charCounter}>
                    {formState.message.length}/500 ký tự
                  </span>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className={styles.spinnerWrapper}>
                      <span className={styles.spinner}></span>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    "Gửi yêu cầu hỗ trợ"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
