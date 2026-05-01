import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    setTimeout(() => {
      elements.forEach(el => observer.observe(el));
    }, 50);

    return () => observer.disconnect();
  }, []);
}