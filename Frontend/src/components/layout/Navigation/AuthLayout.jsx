import React, { useEffect, useRef } from "react";
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas dimensions based on client bounds
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles configurations
    const particles = [];
    const particleCount = 80;
    const connectionDistance = 120;
    const mouse = {
      x: null,
      y: null,
      radius: 150, // Influence radius of the mouse
    };

    // Track mouse positioning
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initialize particles with randomized coordinates and velocities
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 3 +1, // Larger particles (size 2 to 5 pixels)
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles position
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off bounds
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Clamp to screen bounds in case of resize
        if (p.x < 0) p.x = 0;
        if (p.x > canvas.width) p.x = canvas.width;
        if (p.y < 0) p.y = 0;
        if (p.y > canvas.height) p.y = canvas.height;

        // Mouse attraction/movement influence
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Draw lines to mouse
            const lineAlpha = force * 0.45; // Brighter mouse connection lines
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(135, 206, 250, ${lineAlpha})`; // Glowing light blue link
            ctx.lineWidth = 1.0;
            ctx.stroke();

            // Gently attract particles toward mouse
            p.x += (dx / dist) * force * 0.5;
            p.y += (dy / dist) * force * 0.5;
          }
        }

        // Render individual particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; // Brighter white color
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)"; // Brighter glowing shadow
        ctx.shadowBlur = 6; // Soft glow radius
        ctx.fill();
      });

      // Reset shadows for connection drawing to avoid heavy performance cost
      ctx.shadowBlur = 0;

      // Draw connection lines between particles that are close
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.3; // Increased connection line alpha
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.7; // Slightly thicker lines
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className={styles.authLayout}>
      <canvas ref={canvasRef} className={styles.canvasBackground} />
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Câu lạc bộ học thuật THMN </h1>
          <h1></h1>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;

