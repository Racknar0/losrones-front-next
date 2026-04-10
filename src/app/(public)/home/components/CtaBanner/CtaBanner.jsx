import Link from 'next/link';
import './CtaBanner.scss';

const CtaBanner = () => {
  return (
    <section className="cta-banner" id="cta">
      <div className="cta-banner__container">
        <h2 className="cta-banner__title">¿Listo para darle lo mejor a tu mascota?</h2>
        <p className="cta-banner__text">
          Únete a miles de dueños responsables que ya eligieron Losrones.
          Tu mascota lo merece.
        </p>
        <Link href="/productos" className="cta-banner__btn">
          Explorar Productos <span>→</span>
        </Link>
      </div>
    </section>
  );
};

export default CtaBanner;
