import Link from 'next/link';
import './ProductsSection.scss';

const PRODUCTS = [
  { slug: 'alimento-premium-pollo', name: 'Alimento Premium Pollo', price: 24.99, originalPrice: 32.99, rating: 5 },
  { slug: 'snack-natural-carne', name: 'Snack Natural de Carne', price: 12.50, originalPrice: 16.00, rating: 4 },
  { slug: 'mix-vegetales-perro', name: 'Mix de Vegetales', price: 18.99, originalPrice: 22.99, rating: 5 },
  { slug: 'omega-fish-blend', name: 'Omega Fish Blend', price: 29.99, originalPrice: 36.99, rating: 4 },
];

const Stars = ({ count = 5, max = 5 }) => (
  <>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={i < count ? 'products__star' : 'products__star products__star--empty'}>★</span>
    ))}
  </>
);

const ProductsSection = () => {
  return (
    <section className="products" id="products">
      <div className="products__container">
        <div className="products__header">
          <p className="products__eyebrow">Nuestros Productos</p>
          <h2 className="products__title">Las Mejores Opciones</h2>
        </div>

        <div className="products__filters">
          <button className="products__filter-btn products__filter-btn--active">Todos</button>
          <button className="products__filter-btn">Vegetales</button>
          <button className="products__filter-btn">Pescado</button>
          <button className="products__filter-btn">Carne</button>
        </div>

        <div className="products__grid">
          {PRODUCTS.map((product) => (
            <Link href={`/productos/${product.slug}`} className="products__card" key={product.slug}>
              <div className="products__card-image">📷 Imagen producto</div>
              <div className="products__card-rating">
                <Stars count={product.rating} />
              </div>
              <div className="products__card-name">{product.name}</div>
              <div className="products__card-price">
                <span className="products__card-price-current">${product.price}</span>
                <span className="products__card-price-original">${product.originalPrice}</span>
              </div>
              <span className="products__card-btn">Agregar al Carrito</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
