'use client';

import usePublicCart from '@store/usePublicCart';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './ProductModal.scss';

const BACK_HOST = (process.env.NEXT_PUBLIC_BACK_HOST || '').replace(/\/+$/, '');

const getMediaSrc = (mediaPath) => {
  if (!mediaPath) return '';
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const normalizedPath = String(mediaPath)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
  if (!BACK_HOST) return `/${normalizedPath}`;
  return `${BACK_HOST}/${normalizedPath}`;
};

const Stars = ({ count = 5, max = 5 }) => (
  <>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={i < count ? 'pm__star' : 'pm__star pm__star--empty'}>★</span>
    ))}
  </>
);

const ProductModal = ({ product, onClose, allowAddToCart = true }) => {
  const addItem = usePublicCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!product) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [product]);

  const productImages = useMemo(() => {
    if (!product) return [];

    const gallery = Array.isArray(product.gallery)
      ? product.gallery.map((entry) => String(entry)).filter(Boolean)
      : [];

    return [...new Set([product.image, ...gallery].filter(Boolean))];
  }, [product]);

  const activeImage = productImages[activeImageIndex] || productImages[0] || null;

  if (!product || typeof document === 'undefined') return null;

  const handlePrevImage = () => {
    if (productImages.length <= 1) return;
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? productImages.length - 1 : currentIndex - 1
    );
  };

  const handleNextImage = () => {
    if (productImages.length <= 1) return;
    setActiveImageIndex((currentIndex) =>
      currentIndex === productImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasDiscount = Number(product.originalPrice) > Number(product.price) && Number(product.originalPrice) > 0;
  const discount = hasDiscount
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const modalContent = (
    <>
      <div className="pm__overlay" onClick={onClose} />
      <div className="pm">
        <button className="pm__close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="pm__body">
          {/* Image */}
          <div className="pm__image-area">
            {activeImage ? (
              <>
                <img
                  className="pm__image"
                  src={getMediaSrc(activeImage)}
                  alt={product.name}
                  loading="lazy"
                />
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="pm__image-nav pm__image-nav--prev"
                      onClick={handlePrevImage}
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="pm__image-nav pm__image-nav--next"
                      onClick={handleNextImage}
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>

                    <div className="pm__thumbs" role="tablist" aria-label="Galeria de producto">
                      {productImages.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          className={`pm__thumb ${index === activeImageIndex ? 'pm__thumb--active' : ''}`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Ver imagen ${index + 1}`}
                          aria-pressed={index === activeImageIndex}
                        >
                          <img src={getMediaSrc(image)} alt={`${product.name} ${index + 1}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="pm__image-placeholder">📷 Imagen producto</div>
            )}
            {discount > 0 && (
              <span className="pm__discount-badge">-{discount}%</span>
            )}
          </div>

          {/* Info */}
          <div className="pm__info">
            <div className="pm__rating">
              <Stars count={product.rating} />
              <span className="pm__rating-text">({product.rating}/5)</span>
            </div>

            <h2 className="pm__name">{product.name}</h2>
            
            {product.weight && (
              <span className="pm__weight">{product.weight}</span>
            )}

            <p className="pm__description">{product.description}</p>

            <div className="pm__prices">
              <span className="pm__price-current">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="pm__price-original">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {allowAddToCart && (
              <>
                {/* Quantity Selector */}
                <div className="pm__qty-section">
                  <span className="pm__qty-label">Cantidad:</span>
                  <div className="pm__qty-controls">
                    <button className="pm__qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                    <span className="pm__qty-value">{qty}</span>
                    <button className="pm__qty-btn" onClick={() => setQty(qty + 1)}>+</button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  className={`pm__add-btn ${added ? 'pm__add-btn--added' : ''}`}
                  onClick={handleAdd}
                >
                  {added ? '✓ Añadido al carrito' : '🛒 Agregar al Carrito'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ProductModal;
