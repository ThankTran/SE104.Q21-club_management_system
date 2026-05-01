// src/components/Gallery/Gallery.jsx
import { galleryData } from '../data/content';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { description, images, cta } = galleryData;

  return (
    <section className={`${styles.gallery} reveal`} id="gallery">
      <p className={`${styles.desc} reveal`}>{description}</p>

      <div className={styles.grid}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`${styles.item} reveal delay-${i % 4}`}
            style={{ background: img.bg }}
          >
            {/* Thay bằng <img src={img.src} alt={img.label} /> khi có ảnh thật */}
            <span className={styles.label}>{img.label}</span>
          </div>
        ))}
      </div>

      <button className={`${styles.registerBtn} reveal`}>
        {cta}
      </button>
    </section>
  );
}