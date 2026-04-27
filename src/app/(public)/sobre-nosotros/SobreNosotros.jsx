import './SobreNosotros.scss';

const VALORES = [
  {
    icon: '❤️',
    title: 'Amor por los cachorros y michis',
    text: 'Todo lo que hacemos es pensando en su bienestar, comodidad y felicidad.',
  },
  {
    icon: '🤝',
    title: 'Cercanía con nuestros clientes',
    text: 'Nos gusta conocer a cada cliente y a sus peludos. Aquí no eres uno más, eres parte de la familia Rones.',
  },
  {
    icon: '⭐',
    title: 'Calidad que sí se nota',
    text: 'Elegimos productos que realmente funcionan y que nosotros mismos usaríamos con nuestros cachorros.',
  },
  {
    icon: '🐶',
    title: 'Experiencia Rones',
    text: 'Queremos que cada visita sea especial, que tu cachorro o michi salga feliz... y tú también.',
  },
];

const CONTACTOS = [
  {
    name: 'Facturación y buzón de quejas',
    phone: '229 447 3721',
    detail: 'Atención administrativa y seguimiento de reportes.',
    iconType: 'billing',
  },
  {
    name: 'Compras',
    phone: '229 675 9490',
    detail: 'Pedidos, surtido y atención para nuevos productos.',
    iconType: 'purchases',
  },
];

const ContactIcon = ({ type }) => {
  if (type === 'billing') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img">
        <path d="M6 3.5h12v17l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2v-17z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 8h6M9 11.5h6M9 15h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img">
      <rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5.8A1.8 1.8 0 019.8 4h4.4A1.8 1.8 0 0116 5.8V7M3 11h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const SobreNosotros = () => {
  return (
    <section className="about" data-aos="fade-up" data-aos-duration="850">
      {/* ─── Hero ─── */}
      <div className="about__hero" data-aos="fade-up" data-aos-delay="60" data-aos-duration="850">
        <p className="about__eyebrow" data-aos="fade-up" data-aos-delay="80" data-aos-duration="800">Nuestra Historia</p>
        <h1 className="about__title" data-aos="fade-up" data-aos-delay="130" data-aos-duration="850">Sobre Nosotros</h1>
        <p className="about__subtitle" data-aos="fade-up" data-aos-delay="190" data-aos-duration="850">
          Lo que empezó con Ron y una camada de ocho cachorros, hoy es una historia de esfuerzo, familia y amor por cada michi y cachorro en Veracruz.
        </p>
      </div>

      <div className="about__container" data-aos="fade-up" data-aos-delay="90" data-aos-duration="850">
        {/* ─── Story ─── */}
        <div className="about__story" data-aos="fade-up" data-aos-delay="130" data-aos-duration="900">
          <div className="about__story-content" data-aos="fade-left" data-aos-delay="210" data-aos-duration="900">
            <h2 className="about__story-title">🐾 Nuestra historia</h2>
            <p>
              Todo empezó con Ron. 🐶
            </p>
            <p>
              Él fue el mayor de una familia de ocho cachorros, y cada vez que los llevábamos a la estética,
              en lugar de anotar sus nombres uno por uno, simplemente los llamaban “los Rones”.
              Sin pensarlo mucho, ese nombre se quedó… y con el tiempo se volvió algo especial para nosotros.
            </p>
            <p>
              Años después, en un momento complicado antes de nuestra boda, decidimos empezar desde cero.
              Con esfuerzo y muchas ganas, comenzamos vendiendo artículos para perros en distintos puntos de la ciudad.
              Poco a poco, lo que empezó como una forma de salir adelante se fue convirtiendo en algo mucho más grande.
            </p>
            <p>
              El 2 de enero de 2018 abrimos nuestra primera tienda en Plaza Mocambo, marcando el inicio de lo que hoy es Rones.
              Con el tiempo crecimos, aprendimos y superamos retos importantes, siempre con la misma idea:
              ofrecer lo mejor para quienes forman parte de la familia.
            </p>
            <p>
              Hoy, seguimos aquí, con nuestras sucursales en Veracruz, dedicados a consentir a cada cachorro y michi que llega,
              porque entendemos que no son solo mascotas… son parte de hogar. 🐾
            </p>
          </div>
        </div>

        {/* ─── Stats ─── */}
        <div className="about__stats" data-aos="fade-up" data-aos-delay="180" data-aos-duration="850">
          <div className="about__stat" data-aos="fade-up" data-aos-delay="220" data-aos-duration="800">
            <span className="about__stat-number">5,000+</span>
            <span className="about__stat-label">Clientes felices</span>
          </div>
          <div className="about__stat" data-aos="fade-up" data-aos-delay="280" data-aos-duration="800">
            <span className="about__stat-number">3</span>
            <span className="about__stat-label">Tiendas en México</span>
          </div>
          <div className="about__stat" data-aos="fade-up" data-aos-delay="340" data-aos-duration="800">
            <span className="about__stat-number">50+</span>
            <span className="about__stat-label">Productos</span>
          </div>
          <div className="about__stat" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
            <span className="about__stat-number">8</span>
            <span className="about__stat-label">Años de experiencia</span>
          </div>
        </div>

        {/* ─── Values ─── */}
        <div className="about__values-section" data-aos="fade-up" data-aos-delay="220" data-aos-duration="850">
          <h2 className="about__section-title" data-aos="fade-up" data-aos-delay="250" data-aos-duration="800">🐾 Nuestros valores</h2>
          <div className="about__values">
            {VALORES.map((v, i) => (
              <div
                className="about__value-card"
                key={i}
                data-aos="fade-up"
                data-aos-delay={String(280 + (i * 80))}
                data-aos-duration="850"
              >
                <span className="about__value-icon">{v.icon}</span>
                <h3 className="about__value-title">{v.title}</h3>
                <p className="about__value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Contact Channels ─── */}
        <div className="about__team-section" data-aos="fade-up" data-aos-delay="260" data-aos-duration="850">
          <h2 className="about__section-title" data-aos="fade-up" data-aos-delay="290" data-aos-duration="800">Canales de atención</h2>
          <div className="about__team">
            {CONTACTOS.map((t, i) => (
              <div
                className="about__team-card"
                key={i}
                data-aos="fade-up"
                data-aos-delay={String(320 + (i * 80))}
                data-aos-duration="850"
              >
                <div className="about__team-avatar">
                  <ContactIcon type={t.iconType} />
                </div>
                <h3 className="about__team-name">{t.name}</h3>
                <p className="about__team-role">{t.phone}</p>
                <p className="about__team-detail">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
