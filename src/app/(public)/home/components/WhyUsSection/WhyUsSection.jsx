import './WhyUsSection.scss';

const WHY_US_ITEMS = [
  {
    icon: '🌿',
    color: 'pink',
    title: 'Ingredientes Naturales',
    text: 'Solo utilizamos ingredientes reales y naturales. Sin aditivos ni conservantes artificiales en ninguna de nuestras fórmulas.',
  },
  {
    icon: '🚚',
    color: 'yellow',
    title: 'Envío Express',
    text: 'Recibe tu pedido en 24-48 horas. Envío gratis en compras mayores a $50. Tu mascota no puede esperar.',
  },
  {
    icon: '🏥',
    color: 'plum',
    title: 'Aprobado por Veterinarios',
    text: 'Nuestras fórmulas son desarrolladas y aprobadas por veterinarios especialistas en nutrición animal.',
  },
];

const WhyUsSection = () => {
  return (
    <section className="why-us" id="why-us">
      <div className="why-us__container">
        <p className="why-us__eyebrow">¿Por Qué Elegirnos?</p>
        <h2 className="why-us__title">Lo Que Nos Hace Diferentes</h2>

        <div className="why-us__grid">
          {WHY_US_ITEMS.map((item, idx) => (
            <div className="why-us__card" key={idx}>
              <div className={`why-us__card-icon why-us__card-icon--${item.color}`}>
                {item.icon}
              </div>
              <h3 className="why-us__card-title">{item.title}</h3>
              <p className="why-us__card-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
