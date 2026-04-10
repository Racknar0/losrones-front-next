import Link from 'next/link';
import './HeroSection.scss';

const HeroSection = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero__dots hero__dots--left" />
      <div className="hero__dots hero__dots--right" />

      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__badge">Alimento Natural Premium</span>
          <h1 className="hero__title">
            Porque cada bocado debe ser <span>puro</span>.
          </h1>
          <p className="hero__description">
            En Losrones elaboramos alimentos naturales y nutritivos para que tu
            mascota viva más sana y feliz. Ingredientes reales, sin conservantes
            artificiales.
          </p>
          <Link href="/productos" className="hero__cta">
            Ver Productos <span className="hero__cta-arrow">→</span>
          </Link>
        </div>

        <div className="hero__image-wrapper">
          <div className="hero__floating-badge hero__floating-badge--top">
            <span className="hero__floating-icon hero__floating-icon--yellow">🐾</span>
            100% Natural
          </div>
          <div className="hero__image-blob">
            <div className="hero__image-placeholder">📷 Imagen de mascota</div>
          </div>
          <div className="hero__floating-badge hero__floating-badge--bottom">
            <span className="hero__floating-icon hero__floating-icon--pink">❤️</span>
            +5,000 clientes felices
          </div>
        </div>
      </div>

      <div className="hero__wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C120,50 240,10 360,30 C480,50 600,10 720,30 C840,50 960,10 1080,30 C1200,50 1320,10 1440,30 L1440,60 L0,60 Z"
            fill="#FDF8F1"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
