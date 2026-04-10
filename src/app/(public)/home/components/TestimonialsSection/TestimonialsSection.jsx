import './TestimonialsSection.scss';

const TESTIMONIALS = [
  { name: 'María López', role: 'Dueña de Max', text: 'Desde que cambiamos a Losrones, Max tiene más energía y su pelaje brilla como nunca. ¡100% recomendado!', initials: 'ML' },
  { name: 'Carlos Rivera', role: 'Dueño de Luna', text: 'La calidad de los ingredientes se nota de inmediato. Luna adora cada bocado y su digestión mejoró mucho.', initials: 'CR' },
  { name: 'Ana Martínez', role: 'Dueña de Rocky', text: 'Probamos muchas marcas antes, pero Losrones es la única que Rocky come sin dejar sobras. Excelente servicio.', initials: 'AM' },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container">
        <p className="testimonials__eyebrow">Testimonios</p>
        <h2 className="testimonials__title">Lo Que Dicen Nuestros Clientes</h2>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, idx) => (
            <div className="testimonials__card" key={idx}>
              <div className="testimonials__card-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span className="testimonials__star" key={i}>★</span>
                ))}
              </div>
              <p className="testimonials__card-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonials__card-author">
                <div className="testimonials__card-avatar">{t.initials}</div>
                <div>
                  <div className="testimonials__card-name">{t.name}</div>
                  <div className="testimonials__card-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
