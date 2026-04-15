'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import usePublicCart from '@store/usePublicCart';
import HttpService from '@services/HttpService';
import useChunkedVirtualizedList from '@helpers/useChunkedVirtualizedList';
import ProductModal from './components/ProductModal/ProductModal';
import './Productos.scss';

const ALL_CATEGORY_ID = 'all';
const CATALOG_BATCH_SIZE = 24;
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

const normalizeProduct = (item) => {
  let price = toNumber(item?.price, 0);
  let originalPrice = toNumber(item?.originalPrice, price);
  const rawGallery = Array.isArray(item?.gallery)
    ? item.gallery.map((entry) => String(entry)).filter(Boolean)
    : [];
  const image = item?.image || rawGallery[0] || null;
  const gallery = [...new Set([image, ...rawGallery].filter(Boolean))];

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
    gallery,
    categoryIds: Array.isArray(item?.categoryIds) ? item.categoryIds : [],
  };
};

const Stars = ({ count = 5, max = 5 }) => (
  <>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={i < count ? 'prod__star' : 'prod__star prod__star--empty'}>★</span>
    ))}
  </>
);

const Productos = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_ID);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([{ id: ALL_CATEGORY_ID, label: 'Todos' }]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const productsRequestRef = useRef(0);
  const addItem = usePublicCart((s) => s.addItem);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await httpService.getData('/store-items/public/categories');
        const apiCategories = Array.isArray(response?.data) ? response.data : [];
        const normalizedCategories = apiCategories.map((category) => ({
          id: String(category.id),
          label: category.name,
        }));

        if (!isMounted) return;
        setCategories([{ id: ALL_CATEGORY_ID, label: 'Todos' }, ...normalizedCategories]);
      } catch (error) {
        console.error('Error loading public categories:', error);
        if (!isMounted) return;
        setCategories([{ id: ALL_CATEGORY_ID, label: 'Todos' }]);
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const requestId = productsRequestRef.current + 1;
    productsRequestRef.current = requestId;

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setFetchError('');

        const query = new URLSearchParams();
        if (activeCategory !== ALL_CATEGORY_ID) {
          query.set('categoryId', activeCategory);
        }

        const endpoint = query.toString()
          ? `/store-items/public/products?${query.toString()}`
          : '/store-items/public/products';

        const response = await httpService.getData(endpoint);
        const apiProducts = Array.isArray(response?.data?.items) ? response.data.items : [];

        if (!isMounted || requestId !== productsRequestRef.current) return;
        setProducts(apiProducts.map(normalizeProduct));
      } catch (error) {
        console.error('Error loading public products:', error);

        if (!isMounted || requestId !== productsRequestRef.current) return;
        setProducts([]);
        setFetchError('No se pudieron cargar los productos. Intenta nuevamente en un momento.');
      } finally {
        if (isMounted && requestId === productsRequestRef.current) {
          setLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const filtered = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    if (!searchValue) return products;

    return products.filter((product) => {
      const name = String(product.name || '').toLowerCase();
      const description = String(product.description || '').toLowerCase();
      return name.includes(searchValue) || description.includes(searchValue);
    });
  }, [search, products]);

  const { visibleItems, hasMore, loaderRef } = useChunkedVirtualizedList(filtered, {
    batchSize: CATALOG_BATCH_SIZE,
    resetKey: `${activeCategory}-${search}-${filtered.length}`,
  });

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <section className="prod">
      {/* ─── Header ─── */}
      <div className="prod__hero">
        <div className="prod__hero-content">
          <p className="prod__eyebrow">Catálogo Completo</p>
          <h1 className="prod__title">Nuestros Productos</h1>
          <p className="prod__subtitle">
            Encuentra todo lo que tu cachorro necesita. Alimentos, snacks, juguetes y más.
          </p>
        </div>
      </div>

      <div className="prod__container">
        {/* ─── Filters ─── */}
        <div className="prod__filters">
          <div className="prod__search-wrapper">
            <svg className="prod__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="prod__search"
              placeholder="Buscar productos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="prod__categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`prod__cat-btn ${activeCategory === cat.id ? 'prod__cat-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                disabled={loadingCategories}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Results Count ─── */}
        <p className="prod__results-count">
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ─── Grid ─── */}
        {loadingProducts ? (
          <div className="prod__empty">
            <span>⏳</span>
            <p>Cargando productos...</p>
          </div>
        ) : fetchError ? (
          <div className="prod__empty">
            <span>⚠️</span>
            <p>{fetchError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="prod__empty">
            <span>🔍</span>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <>
            <div className="prod__grid">
            {visibleItems.map((product) => {
              const hasDiscount = product.originalPrice > product.price && product.originalPrice > 0;
              const discount = hasDiscount
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  className="prod__card"
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="prod__card-image">
                    {product.image ? (
                      <img
                        className="prod__card-img"
                        src={getMediaSrc(product.image)}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <span className="prod__card-placeholder">📷</span>
                    )}
                    {discount > 0 && (
                      <span className="prod__card-discount">-{discount}%</span>
                    )}
                  </div>
                  <div className="prod__card-body">
                    <div className="prod__card-rating">
                      <Stars count={product.rating} />
                    </div>
                    <h3 className="prod__card-name">{product.name}</h3>
                    <div className="prod__card-prices">
                      <span className="prod__card-price">${product.price.toFixed(2)}</span>
                      {hasDiscount && (
                        <span className="prod__card-original">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      className="prod__card-btn"
                      onClick={(e) => handleQuickAdd(e, product)}
                    >
                      🛒 Agregar
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
            {hasMore && (
              <div ref={loaderRef} className="prod__loader-trigger">
                Cargando mas productos...
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Product Modal ─── */}
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

export default Productos;
