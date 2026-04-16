import Link from 'next/link';
import './FooterSection.scss';

const FooterSection = () => {
  return (
    <footer className="footer" id="footer" data-aos="fade-up" data-aos-duration="900">
      <div className="footer__container" data-aos="fade-up" data-aos-delay="80" data-aos-duration="900">
        <div data-aos="fade-up" data-aos-delay="120" data-aos-duration="850">
          <div className="footer__brand-name">Losrones</div>
          <p className="footer__brand-desc">
            Tu tienda de cachorros favorita en México. Alimento, juguetes,
            accesorios y todo lo que tu compañero peludo necesita para ser feliz.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="180" data-aos-duration="850">
          <h3 className="footer__col-title">Navegación</h3>
          <ul className="footer__links">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/productos">Productos</Link></li>
            <li><Link href="/noticias">Noticias</Link></li>
            <li><Link href="/sobre-nosotros">Sobre Nosotros</Link></li>
          </ul>
        </div>

        <div data-aos="fade-up" data-aos-delay="240" data-aos-duration="850">
          <h3 className="footer__col-title">Ayuda</h3>
          <ul className="footer__links">
            <li><Link href="/contacto">Contacto</Link></li>
            <li><a href="#">Preguntas Frecuentes</a></li>
            <li><a href="#">Envíos y Devoluciones</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
          </ul>
        </div>

        <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="850">
          <h3 className="footer__col-title">Contacto</h3>
          <ul className="footer__links">
            <li><a href="mailto:info@losrones.com">info@losrones.com</a></li>
            <li><a href="tel:+525555555555">+52 555 555 5555</a></li>
            <li><a href="#">Ciudad de México, MX</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom" data-aos="fade-up" data-aos-delay="360" data-aos-duration="850">
        <p className="footer__copyright">© 2026 Losrones. Todos los derechos reservados.</p>
        <div className="footer__socials">
          <a href="#" className="footer__social-link" aria-label="Facebook">f</a>
          <a href="#" className="footer__social-link" aria-label="Instagram">ig</a>
          <a href="#" className="footer__social-link" aria-label="Twitter">x</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
