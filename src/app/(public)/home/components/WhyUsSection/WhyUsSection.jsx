import './WhyUsSection.scss';

const WHY_US_ITEMS = [
  {
    icon: '🛍️',
    color: 'pink',
    title: 'Todo en un Solo Lugar',
    text: 'Alimento, juguetes, camas, correas, higiene y más. No necesitas ir a otra tienda, aquí encuentras todo para tu cachorro.',
  },
  {
    icon: '🚚',
    color: 'yellow',
    title: 'Envío Rápido y Gratis',
    text: 'Recibe tu pedido en 24-48 horas. Envío gratis en compras mayores a $50. Porque tu cachorro no puede esperar.',
  },
  {
    icon: '💛',
    color: 'plum',
    title: 'Atención Personalizada',
    text: 'Nuestro equipo de amantes de las cachorros te asesora para elegir lo mejor según la raza, edad y necesidades de tu compañero.',
  },
];

const WhyUsSection = () => {
  return (
    <section className="why-us" id="why-us" data-aos="fade-up" data-aos-duration="850">
      <div className="why-us__container">
        <p className="why-us__eyebrow" data-aos="fade-up" data-aos-delay="60" data-aos-duration="800">¿Por Qué Elegirnos?</p>
        <h2 className="why-us__title" data-aos="fade-up" data-aos-delay="120" data-aos-duration="850">La Tienda Favorita de las Cachorros</h2>

        <div className="why-us__grid">
          {WHY_US_ITEMS.map((item, idx) => (
            <div
              className="why-us__card"
              key={idx}
              data-aos="fade-up"
              data-aos-delay={String(180 + (idx * 90))}
              data-aos-duration="850"
            >
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
