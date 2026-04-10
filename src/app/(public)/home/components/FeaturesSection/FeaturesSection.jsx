import './FeaturesSection.scss';

const FeaturesSection = () => {
  return (
    <section className="features" id="features">
      <div className="features__container">
        <div className="features__card features__card--pink">
          <span className="features__eyebrow">Nuestra Promesa</span>
          <h2 className="features__card-title">Traemos el mejor alimento</h2>
          <p className="features__card-text">
            Seleccionamos cuidadosamente cada ingrediente para garantizar la
            máxima calidad y nutrición para tu mascota.
          </p>
          <div className="features__card-image">📷 Imagen</div>
        </div>

        <div className="features__card features__card--yellow">
          <span className="features__eyebrow">Calidad Garantizada</span>
          <h2 className="features__card-title">Lo mejor para tu compañero</h2>
          <p className="features__card-text">
            Fórmulas desarrolladas por veterinarios y nutricionistas para
            cada etapa de vida de tu mascota.
          </p>
          <div className="features__card-image">📷 Imagen</div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
