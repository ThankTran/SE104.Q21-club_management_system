import { useEffect } from "react";

const useScrollReveal = (toggle = false) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          if (!toggle) observer.unobserve(entry.target); // 1 lần
        } else if (toggle) {
          entry.target.classList.remove("active"); // ẩn/hiện
        }
      });
    }, { threshold: 0.15 });

    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [toggle]);
};

export default useScrollReveal;