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

const Contacto = () => {
  return (
    <section className="contact">
      {/* ─── Hero ─── */}
      <div className="contact__hero">
        <p className="contact__eyebrow">Encuéntranos</p>
        <h1 className="contact__title">Contáctanos</h1>
        <p className="contact__subtitle">
          Visítanos en cualquiera de nuestras 3 tiendas o escríbenos por WhatsApp.
        </p>
      </div>

      <div className="contact__container">
        {/* ─── Store Cards ─── */}
        <div className="contact__stores">
          {TIENDAS.map((t, i) => (
            <div className="contact__store" key={i}>
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
        <div className="contact__map-section">
          <h2 className="contact__section-title">Nuestras Ubicaciones</h2>
          <div className="contact__map-wrapper">
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
        <div className="contact__info-section">
          <div className="contact__info-card">
            <span className="contact__info-icon">💬</span>
            <h3>WhatsApp</h3>
            <p>Escríbenos al 2294324870</p>
            <a
              href="https://wa.me/522294324870"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__info-btn contact__info-btn--whatsapp"
            >
              Enviar Mensaje
            </a>
          </div>
          <div className="contact__info-card">
            <span className="contact__info-icon">✉️</span>
            <h3>Email</h3>
            <p>info@losrones.com</p>
            <a href="mailto:info@losrones.com" className="contact__info-btn">
              Enviar Email
            </a>
          </div>
          <div className="contact__info-card">
            <span className="contact__info-icon">📱</span>
            <h3>Redes Sociales</h3>
            <p>@losrones en todas las plataformas</p>
            <a href="#" className="contact__info-btn">
              Seguirnos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
