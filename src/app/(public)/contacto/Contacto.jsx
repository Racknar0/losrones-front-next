'use client';

import './Contacto.scss';

const TIENDAS = [
  {
    name: 'Sucursal Ocampo',
    address: 'Melchor Ocampo #219 entre Independencia y 5 de Mayo, Veracruz, Veracruz',
    phone: '2294324870',
    hours: '11 am - 8 pm',
  },
  {
    name: 'Sucursal Américas',
    address: 'Plaza Américas, Local 22 ñ, Boca del Río, Veracruz',
    phone: '2294366524',
    hours: '11 am - 8 pm',
  },
  {
    name: 'Sucursal Mocambo',
    address: 'Plaza Mocambo, Local B23, Boca del Río, Veracruz',
    phone: '2299501910',
    hours: '11 am - 8 pm',
  },
];

const GOOGLE_MY_MAPS_ID = '1axLxrW6RaneLMevKfLXV1htZvn3QY64';
const GOOGLE_MY_MAPS_SHARE_URL = 'https://www.google.com/maps/d/u/0/edit?mid=1axLxrW6RaneLMevKfLXV1htZvn3QY64&usp=sharing';
const MAP_EMBED_ZOOM = 11;
const MAP_EMBED_SRC = `https://www.google.com/maps/d/embed?mid=${GOOGLE_MY_MAPS_ID}&z=${MAP_EMBED_ZOOM}`;
const WHATSAPP_NUMBER = '522294366524';
const WHATSAPP_TEXT = 'Hola, me gustaria ponerme en contacto para recibir informacion.';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const Contacto = () => {
  return (
    <section className="contact" data-aos="fade-up" data-aos-duration="850">
      {/* ─── Hero ─── */}
      <div className="contact__hero" data-aos="fade-up" data-aos-delay="60" data-aos-duration="850">
        <p className="contact__eyebrow" data-aos="fade-up" data-aos-delay="80" data-aos-duration="800">Encuéntranos</p>
        <h1 className="contact__title" data-aos="fade-up" data-aos-delay="130" data-aos-duration="850">Contáctanos</h1>
        <p className="contact__subtitle" data-aos="fade-up" data-aos-delay="190" data-aos-duration="850">
          Visítanos en cualquiera de nuestras 3 tiendas o escríbenos por WhatsApp.
        </p>
      </div>

      <div className="contact__container" data-aos="fade-up" data-aos-delay="90" data-aos-duration="850">
        {/* ─── Store Cards ─── */}
        <div className="contact__stores" data-aos="fade-up" data-aos-delay="130" data-aos-duration="850">
          {TIENDAS.map((t, i) => (
            <div
              className="contact__store"
              key={i}
              data-aos="fade-up"
              data-aos-delay={String(170 + (i * 90))}
              data-aos-duration="850"
            >
              <div className="contact__store-icon">📍</div>
              <h3 className="contact__store-name">{t.name}</h3>
              <p className="contact__store-address">{t.address}</p>
              <div className="contact__store-detail">
                <span>📞 {t.phone}</span>
              </div>
              <div className="contact__store-detail">
                <span>🕒 {t.hours}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__store-link"
              >
                Ver en Google Maps →
              </a>
            </div>
          ))}
        </div>

        {/* ─── Map ─── */}
        <div className="contact__map-section" data-aos="fade-up" data-aos-delay="220" data-aos-duration="850">
          <h2 className="contact__section-title" data-aos="fade-up" data-aos-delay="250" data-aos-duration="800">Nuestras Ubicaciones</h2>
          <div className="contact__map-wrapper" data-aos="zoom-in" data-aos-delay="300" data-aos-duration="900">
            <iframe
              className="contact__map"
              title="Ubicaciones Losrones"
              src={MAP_EMBED_SRC}
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: '20px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={GOOGLE_MY_MAPS_SHARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__store-link"
              style={{ margin: '0.85rem 0 0.2rem 0.65rem' }}
            >
              Abrir mapa completo ↗
            </a>
          </div>
        </div>

        {/* ─── Contact Info ─── */}
        <div className="contact__info-section" data-aos="fade-up" data-aos-delay="260" data-aos-duration="850">
          <div className="contact__info-card" data-aos="fade-up" data-aos-delay="300" data-aos-duration="850">
            <span className="contact__info-icon">💬</span>
            <h3>WhatsApp</h3>
            <p>Escríbenos al +52 229 436 6524</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__info-btn contact__info-btn--whatsapp"
            >
              Enviar Mensaje
            </a>
          </div>
          <div className="contact__info-card" data-aos="fade-up" data-aos-delay="360" data-aos-duration="850">
            <span className="contact__info-icon">📱</span>
            <h3>Redes Sociales</h3>
            <p>Síguenos en nuestras cuentas oficiales.</p>
            <div className="contact__social-links">
              <a
                href="https://www.tiktok.com/@losronesver"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__info-btn contact__info-btn--tiktok"
              >
                TikTok
              </a>
              <a
                href="https://www.facebook.com/LosRonesStore"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__info-btn contact__info-btn--facebook"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/losronesstore"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__info-btn contact__info-btn--instagram"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
