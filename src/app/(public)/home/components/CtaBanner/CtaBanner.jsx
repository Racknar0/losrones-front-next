import Link from 'next/link';
import './CtaBanner.scss';

const CtaBanner = () => {
  return (
    <section className="cta-banner" id="cta" data-aos="zoom-in-up" data-aos-duration="900">
      <div className="cta-banner__container" data-aos="fade-up" data-aos-delay="80" data-aos-duration="900">
        <h2 className="cta-banner__title" data-aos="fade-up" data-aos-delay="140" data-aos-duration="850">¿Listo para consentir a tu cachorro?</h2>
        <p className="cta-banner__text" data-aos="fade-up" data-aos-delay="220" data-aos-duration="850">
          Explora nuestra tienda con más de 500 productos. Alimento, juguetes,
          accesorios y mucho más. Envío gratis a todo México.
        </p>
        <Link href="/productos" className="cta-banner__btn" data-aos="fade-up" data-aos-delay="300" data-aos-duration="850">
          Ir a la Tienda <span>→</span>
        </Link>
      </div>
    </section>
  );
};

export default CtaBanner;
