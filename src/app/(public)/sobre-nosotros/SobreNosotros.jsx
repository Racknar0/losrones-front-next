import './SobreNosotros.scss';

const VALORES = [
  { icon: '🌿', title: 'Naturalidad', text: 'Cada ingrediente es seleccionado por su calidad y origen natural. Sin aditivos artificiales.' },
  { icon: '❤️', title: 'Pasión', text: 'Amamos lo que hacemos. Cada producto refleja nuestro compromiso con el bienestar animal.' },
  { icon: '🔬', title: 'Ciencia', text: 'Nuestras fórmulas son desarrolladas con la guía de veterinarios y nutricionistas expertos.' },
  { icon: '🤝', title: 'Compromiso', text: 'Donamos trimestralmente a refugios de animales. Creemos en devolver a la comunidad.' },
];

const TEAM = [
  { name: 'Dr. Carlos Mendoza', role: 'Director de Nutrición', initials: 'CM' },
  { name: 'Ana García', role: 'Fundadora & CEO', initials: 'AG' },
  { name: 'Roberto Sánchez', role: 'Jefe de Producción', initials: 'RS' },
  { name: 'Dra. María Torres', role: 'Veterinaria en Jefe', initials: 'MT' },
];

const SobreNosotros = () => {
  return (
    <section className="about" data-aos="fade-up" data-aos-duration="850">
      {/* ─── Hero ─── */}
      <div className="about__hero" data-aos="fade-up" data-aos-delay="60" data-aos-duration="850">
        <p className="about__eyebrow" data-aos="fade-up" data-aos-delay="80" data-aos-duration="800">Nuestra Historia</p>
        <h1 className="about__title" data-aos="fade-up" data-aos-delay="130" data-aos-duration="850">Sobre Nosotros</h1>
        <p className="about__subtitle" data-aos="fade-up" data-aos-delay="190" data-aos-duration="850">
          Desde 2018 transformando la nutrición animal en México con productos naturales y de calidad premium.
        </p>
      </div>

      <div className="about__container" data-aos="fade-up" data-aos-delay="90" data-aos-duration="850">
        {/* ─── Story ─── */}
        <div className="about__story" data-aos="fade-up" data-aos-delay="130" data-aos-duration="900">
          <div className="about__story-img" data-aos="zoom-in" data-aos-delay="170" data-aos-duration="900">📷 Imagen de equipo</div>
          <div className="about__story-content" data-aos="fade-left" data-aos-delay="210" data-aos-duration="900">
            <h2 className="about__story-title">Cómo empezó todo</h2>
            <p>
              Losrones nació en 2018 de la frustración de nuestra fundadora, Ana García, al no encontrar
              alimentos verdaderamente naturales para su golden retriever, Max. Tras meses de investigación
              y el apoyo de veterinarios especialistas, desarrolló las primeras fórmulas de lo que hoy es
              Losrones.
            </p>
            <p>
              Lo que comenzó como un pequeño emprendimiento en la cocina de casa, hoy es una empresa con
              4 tiendas en México, un equipo de más de 50 personas y la confianza de más de 5,000 familias
              que eligen nuestros productos cada mes.
            </p>
            <p>
              Nuestro compromiso sigue siendo el mismo: ofrecer alimentos que realmente nutran, hechos con
              ingredientes que nosotros mismos comeríamos. Porque tu cachorro merece lo mejor.
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
          <h2 className="about__section-title" data-aos="fade-up" data-aos-delay="250" data-aos-duration="800">Nuestros Valores</h2>
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

        {/* ─── Team ─── */}
        <div className="about__team-section" data-aos="fade-up" data-aos-delay="260" data-aos-duration="850">
          <h2 className="about__section-title" data-aos="fade-up" data-aos-delay="290" data-aos-duration="800">Nuestro Equipo</h2>
          <div className="about__team">
            {TEAM.map((t, i) => (
              <div
                className="about__team-card"
                key={i}
                data-aos="fade-up"
                data-aos-delay={String(320 + (i * 80))}
                data-aos-duration="850"
              >
                <div className="about__team-avatar">{t.initials}</div>
                <h3 className="about__team-name">{t.name}</h3>
                <p className="about__team-role">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
