// src/components/Gallery/Gallery.jsx
import { galleryData } from '../data/content';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { description, images, cta } = galleryData;

  return (
    <section className={styles.gallery} id="gallery">
      <p className={styles.desc}>{description}</p>

      <div className={styles.grid}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`${styles.item} fade-up`}
            style={{ background: img.bg, animationDelay: `${i * 0.1}s` }}
          >
            {/* Thay bằng <img src={img.src} alt={img.label} /> khi có ảnh thật */}
            <span className={styles.label}>{img.label}</span>
          </div>
        ))}
      </div>

      <button className={styles.registerBtn}>{cta}</button>
    </section>
  );
}