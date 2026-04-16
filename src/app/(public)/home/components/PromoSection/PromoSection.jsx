 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HttpService from '@services/HttpService';
import './PromoSection.scss';

const BACK_HOST = (process.env.NEXT_PUBLIC_BACK_HOST || '').replace(/\/+$/, '');
const httpService = new HttpService();

const DEFAULT_PROMO = {
  discountLabel: 'Ahorra 20%',
  title: 'Consiente a tu cachorro con lo mejor',
  description:
    'Aprovecha nuestra oferta en alimento, juguetes y accesorios. Todo lo que necesitas para que tu compañero peludo viva su mejor vida.',
  image: null,
};

const getMediaSrc = (mediaPath) => {
  if (!mediaPath) return '';
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const normalizedPath = String(mediaPath).replace(/^\/+/, '');
  if (!BACK_HOST) return `/${normalizedPath}`;
  return `${BACK_HOST}/${normalizedPath}`;
};

const PromoSection = () => {
  const [promoData, setPromoData] = useState(DEFAULT_PROMO);

  useEffect(() => {
    let isMounted = true;

    const loadHighlightBlock = async () => {
      try {
        const response = await httpService.getData('/store-items/public/highlight-block');
        const block = response?.data || {};

        // Si el bloque esta inactivo, se mantiene la version base del promo.
        if (block.isActive === false) {
          if (isMounted) setPromoData(DEFAULT_PROMO);
          return;
        }

        const normalized = {
          discountLabel: block.discountLabel?.trim() || DEFAULT_PROMO.discountLabel,
          title: block.title?.trim() || DEFAULT_PROMO.title,
          description: block.description?.trim() || DEFAULT_PROMO.description,
          image: block.image || null,
        };

        if (!isMounted) return;
        setPromoData(normalized);
      } catch (error) {
        console.error('Error loading public highlight block in promo section:', error);
        if (!isMounted) return;
        setPromoData(DEFAULT_PROMO);
      }
    };

    loadHighlightBlock();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refresh = () => {
      if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
      }
    };

    const timerId = window.setTimeout(refresh, 40);
    return () => window.clearTimeout(timerId);
  }, [promoData]);

  return (
    <section className="promo" data-aos="fade-up" data-aos-duration="850">
      <div className="promo__wave promo__wave--top" data-aos="fade-down" data-aos-delay="50" data-aos-duration="800">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C120,10 240,50 360,30 C480,10 600,50 720,30 C840,10 960,50 1080,30 C1200,10 1320,50 1440,30 L1440,0 L0,0 Z"
            fill="#FDF8F1"
          />
        </svg>
      </div>

      <div className="promo__container">
        <div className="promo__image-wrapper" data-aos="fade-left" data-aos-delay="180" data-aos-duration="900">
          <div className="promo__image-placeholder">
            {promoData.image ? (
              <img className="promo__image" src={getMediaSrc(promoData.image)} alt={promoData.title} loading="lazy" />
            ) : (
              '📷 Imagen promo'
            )}
          </div>
        </div>

        <div className="promo__content" data-aos="fade-right" data-aos-delay="120" data-aos-duration="900">
          <span className="promo__discount" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">{promoData.discountLabel}</span>
          <h2 className="promo__title" data-aos="fade-up" data-aos-delay="260" data-aos-duration="850">{promoData.title}</h2>
          <p className="promo__text" data-aos="fade-up" data-aos-delay="320" data-aos-duration="850">{promoData.description}</p>
          <Link href="/productos" className="promo__cta" data-aos="fade-up" data-aos-delay="380" data-aos-duration="850">
            Ver Ofertas <span>→</span>
          </Link>
        </div>
      </div>

      <div className="promo__wave promo__wave--bottom" data-aos="fade-up" data-aos-delay="80" data-aos-duration="800">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C120,50 240,10 360,30 C480,50 600,10 720,30 C840,50 960,10 1080,30 C1200,50 1320,10 1440,30 L1440,60 L0,60 Z"
            fill="#FDF8F1"
          />
        </svg>
      </div>
    </section>
  );
};

export default PromoSection;
