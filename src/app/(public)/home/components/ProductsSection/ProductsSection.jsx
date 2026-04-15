'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import usePublicCart from '@store/usePublicCart';
import { PRODUCTS as ALL_PRODUCTS } from '../../../productos/data/products';
import ProductModal from '../../../productos/components/ProductModal/ProductModal';
import './ProductsSection.scss';

const FEATURED_PRODUCT_IDS = [1, 2, 3, 8, 9, 10, 13, 14, 15];

const Stars = ({ count = 5, max = 5 }) => (
  <>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={i < count ? 'products__star' : 'products__star products__star--empty'}>★</span>
    ))}
  </>
);

const ProductsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapPoints, setSnapPoints] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });
  const addItem = usePublicCart((state) => state.addItem);

  const featuredProducts = useMemo(() => {
    return FEATURED_PRODUCT_IDS
      .map((productId) => ALL_PRODUCTS.find((product) => product.id === productId))
      .filter(Boolean);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return featuredProducts;
    return featuredProducts.filter((product) => product.category === activeFilter);
  }, [activeFilter, featuredProducts]);

  const handleQuickAdd = (event, product) => {
    event.stopPropagation();
    addItem(product, 1);
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onReInit = useCallback(() => {
    if (!emblaApi) return;

    setSnapPoints(emblaApi.scrollSnapList());
    onSelect();
  }, [emblaApi, onSelect]);

  const handlePrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const handleDotClick = useCallback((index) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onReInit);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi, onReInit, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
  }, [activeFilter, emblaApi, filteredProducts.length]);

  return (
    <section className="products" id="products">
      <div className="products__container">
        <div className="products__header">
          <p className="products__eyebrow">Lo Más Vendido</p>
          <h2 className="products__title">Favoritos de Nuestros Clientes</h2>
        </div>

        <div className="products__filters">
          <button
            type="button"
            className={`products__filter-btn ${activeFilter === 'all' ? 'products__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`products__filter-btn ${activeFilter === 'alimento' ? 'products__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter('alimento')}
          >
            Alimento
          </button>
          <button
            type="button"
            className={`products__filter-btn ${activeFilter === 'juguetes' ? 'products__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter('juguetes')}
          >
            Juguetes
          </button>
          <button
            type="button"
            className={`products__filter-btn ${activeFilter === 'accesorios' ? 'products__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter('accesorios')}
          >
            Accesorios
          </button>
        </div>

        <div className="products__slider-shell">
          <button
            type="button"
            className="products__nav products__nav--prev"
            onClick={handlePrev}
            disabled={!canScrollPrev}
            aria-label="Desplazar productos hacia la izquierda"
          >
            ‹
          </button>

          <div className="products__viewport" ref={emblaRef}>
            <div className="products__track">
              {filteredProducts.map((product) => (
                <div className="products__slide" key={product.id}>
                  <div
                    className="products__card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedProduct(product)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedProduct(product);
                      }
                    }}
                  >
                    <div className="products__card-image">📷 Imagen producto</div>
                    <div className="products__card-rating">
                      <Stars count={product.rating} />
                    </div>
                    <div className="products__card-name">{product.name}</div>
                    <div className="products__card-price">
                      <span className="products__card-price-current">${product.price}</span>
                      <span className="products__card-price-original">${product.originalPrice}</span>
                    </div>
                    <button
                      type="button"
                      className="products__card-btn"
                      onClick={(event) => handleQuickAdd(event, product)}
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="products__nav products__nav--next"
            onClick={handleNext}
            disabled={!canScrollNext}
            aria-label="Desplazar productos hacia la derecha"
          >
            ›
          </button>
        </div>

        {snapPoints.length > 1 && (
          <div className="products__dots" aria-label="Paginación de productos destacados">
            {snapPoints.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`products__dot ${selectedSnap === index ? 'products__dot--active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Ir al grupo ${index + 1}`}
                aria-pressed={selectedSnap === index}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductsSection;
