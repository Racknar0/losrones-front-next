'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import usePublicCart from '@store/usePublicCart';
import HttpService from '@services/HttpService';
import ProductModal from '../../../productos/components/ProductModal/ProductModal';
import './ProductsSection.scss';

const ALL_FILTER_ID = 'all';
const BACK_HOST = (process.env.NEXT_PUBLIC_BACK_HOST || '').replace(/\/+$/, '');
const httpService = new HttpService();

const getMediaSrc = (mediaPath) => {
  if (!mediaPath) return '';
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const normalizedPath = String(mediaPath).replace(/^\/+/, '');
  if (!BACK_HOST) return `/${normalizedPath}`;
  return `${BACK_HOST}/${normalizedPath}`;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeFavoriteProduct = (item) => {
  let price = toNumber(item?.price, 0);
  let originalPrice = toNumber(item?.originalPrice, price);

  const gallery = Array.isArray(item?.gallery)
    ? item.gallery.map((entry) => String(entry)).filter(Boolean)
    : [];
  const image = item?.image || gallery[0] || null;
  const normalizedGallery = [...new Set([image, ...gallery].filter(Boolean))];

  const hasValidDiscount = price > 0 && originalPrice > price;
  if (!hasValidDiscount) {
    const basePrice = originalPrice > 0 ? originalPrice : price;
    price = basePrice;
    originalPrice = basePrice;
  }

  return {
    id: item?.id,
    name: item?.name || 'Producto sin nombre',
    description: item?.description || 'Sin descripcion disponible.',
    price,
    originalPrice,
    rating: toNumber(item?.rating, 5),
    image,
    gallery: normalizedGallery,
  };
};

const Stars = ({ count = 5, max = 5 }) => (
  <>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={i < count ? 'products__star' : 'products__star products__star--empty'}>★</span>
    ))}
  </>
);

const ProductsSection = () => {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER_ID);
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState('');
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

  const filteredProducts = useMemo(() => favoriteProducts, [favoriteProducts]);

  useEffect(() => {
    let isMounted = true;

    const loadFavoriteCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await httpService.getData('/store-items/public/favorites/categories');
        const categories = Array.isArray(response?.data) ? response.data : [];

        if (!isMounted) return;
        setFavoriteCategories(categories);
      } catch (error) {
        console.error('Error loading public favorite categories:', error);
        if (!isMounted) return;
        setFavoriteCategories([]);
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    loadFavoriteCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadFavoriteProducts = async () => {
      try {
        setLoadingProducts(true);
        setFetchError('');

        const query = new URLSearchParams();
        if (activeFilter !== ALL_FILTER_ID) {
          query.set('favoriteCategoryId', activeFilter);
        }

        const endpoint = query.toString()
          ? `/store-items/public/favorites/products?${query.toString()}`
          : '/store-items/public/favorites/products';

        const response = await httpService.getData(endpoint);
        const items = Array.isArray(response?.data?.items) ? response.data.items : [];

        if (!isMounted) return;
        setFavoriteProducts(items.map(normalizeFavoriteProduct));
      } catch (error) {
        console.error('Error loading public favorite products:', error);

        if (!isMounted) return;
        setFavoriteProducts([]);
        setFetchError('No se pudieron cargar los favoritos. Intenta nuevamente en un momento.');
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    };

    loadFavoriteProducts();

    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

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
            className={`products__filter-btn ${activeFilter === ALL_FILTER_ID ? 'products__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(ALL_FILTER_ID)}
            disabled={loadingCategories}
          >
            Todos
          </button>
          {favoriteCategories.map((favoriteCategory) => (
            <button
              key={favoriteCategory.id}
              type="button"
              className={`products__filter-btn ${activeFilter === String(favoriteCategory.id) ? 'products__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(String(favoriteCategory.id))}
              disabled={loadingCategories}
            >
              {favoriteCategory.category?.name || 'Categoria'}
            </button>
          ))}
        </div>

        {loadingProducts ? (
          <div className="products__empty">Cargando favoritos...</div>
        ) : fetchError ? (
          <div className="products__empty">{fetchError}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="products__empty">Aun no hay productos configurados en el bloque favoritos.</div>
        ) : (
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
                    <div className="products__card-image">
                      {product.image ? (
                        <img className="products__card-img" src={getMediaSrc(product.image)} alt={product.name} loading="lazy" />
                      ) : (
                        <span className="products__card-placeholder">📷 Imagen producto</span>
                      )}
                      {product.originalPrice > product.price && (
                        <span className="products__card-discount">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="products__card-rating">
                      <Stars count={product.rating} />
                    </div>
                    <div className="products__card-name">{product.name}</div>
                    <div className="products__card-price">
                      <span className="products__card-price-current">${product.price.toFixed(2)}</span>
                      {product.originalPrice > product.price && (
                        <span className="products__card-price-original">${product.originalPrice.toFixed(2)}</span>
                      )}
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
        )}

        {filteredProducts.length > 0 && snapPoints.length > 1 && (
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
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductsSection;
