'use client';

import { useEffect, useMemo, useState } from 'react';
import HttpService from '@services/HttpService';
import Spinner from '@admin-shared/spinner/Spinner';
import NoticiaModal from './components/NoticiaModal/NoticiaModal';
import './Noticias.scss';

const NEWS_TAG_COLORS = ['#ffba30', '#27ae60', '#3498db', '#e74c3c', '#1abc9c'];
const DEFAULT_NEWS_TAG_COLOR = NEWS_TAG_COLORS[0];

const normalizeNewsTagColor = (value) => {
  if (!value) return DEFAULT_NEWS_TAG_COLOR;
  const normalized = String(value).trim().toLowerCase();
  const withHash = normalized.startsWith('#') ? normalized : `#${normalized}`;
  return NEWS_TAG_COLORS.includes(withHash) ? withHash : DEFAULT_NEWS_TAG_COLOR;
};

const getTagTextColor = (hexColor) => {
  const safeHex = normalizeNewsTagColor(hexColor).replace('#', '');
  const r = Number.parseInt(safeHex.slice(0, 2), 16);
  const g = Number.parseInt(safeHex.slice(2, 4), 16);
  const b = Number.parseInt(safeHex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65 ? '#1f2937' : '#ffffff';
};

const stripHtml = (html = '') => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const estimateReadTime = (html) => {
  const text = stripHtml(html);
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min`;
};

const formatDate = (dateValue) => {
  if (!dateValue) return '';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Noticias = () => {
  const httpService = useMemo(() => new HttpService(), []);
  const BACK_HOST = process.env.NEXT_PUBLIC_BACK_HOST;

  const [selected, setSelected] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const getMediaSrc = (mediaPath) => {
    if (!mediaPath) return '';
    if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
    const normalizedPath = String(mediaPath)
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');
    if (!BACK_HOST) return `/${normalizedPath}`;
    return `${BACK_HOST}/${normalizedPath}`;
  };

  useEffect(() => {
    let cancelled = false;

    const loadNews = async () => {
      try {
        setLoadingNews(true);
        const response = await httpService.getData('/store-items/public/news');

        if (!cancelled && response.status === 200) {
          const normalized = (response.data || []).map((entry) => {
            const descriptionHtml = entry.descriptionHtml || '';
            const excerpt = entry.excerpt || stripHtml(descriptionHtml).slice(0, 160);

            return {
              ...entry,
              tagColor: entry.tag ? normalizeNewsTagColor(entry.tagColor) : null,
              excerpt,
              date: formatDate(entry.updatedAt || entry.createdAt),
              readTime: estimateReadTime(descriptionHtml),
            };
          });

          setNewsItems(normalized);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading public news:', error);
          setNewsItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingNews(false);
        }
      }
    };

    loadNews();

    return () => {
      cancelled = true;
    };
  }, [httpService]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refresh = () => {
      if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
      }
    };

    const timerId = window.setTimeout(refresh, 40);
    return () => window.clearTimeout(timerId);
  }, [loadingNews, newsItems.length]);

  const featuredNews = newsItems[0] || null;
  const secondaryNews = featuredNews ? newsItems.slice(1) : newsItems;

  return (
    <section className="news" data-aos="fade-up" data-aos-duration="850">
      <div className="news__hero" data-aos="fade-up" data-aos-delay="60" data-aos-duration="850">
        <p className="news__eyebrow" data-aos="fade-up" data-aos-delay="80" data-aos-duration="800">Blog & Noticias</p>
        <h1 className="news__title" data-aos="fade-up" data-aos-delay="130" data-aos-duration="850">Últimas Noticias</h1>
        <p className="news__subtitle" data-aos="fade-up" data-aos-delay="190" data-aos-duration="850">
          Consejos, novedades y todo lo que necesitas saber sobre el mundo pet.
        </p>
      </div>

      <div className="news__container" data-aos="fade-up" data-aos-delay="90" data-aos-duration="850">
        {loadingNews ? (
          <div className="news__loading" data-aos="fade-up" data-aos-delay="120" data-aos-duration="800">
            <Spinner color="#6564d8" />
          </div>
        ) : newsItems.length === 0 ? (
          <p className="news__empty" data-aos="fade-up" data-aos-delay="120" data-aos-duration="800">No hay noticias activas por ahora.</p>
        ) : (
          <>
            {featuredNews && (
              <div className="news__featured" onClick={() => setSelected(featuredNews)} data-aos="fade-up" data-aos-delay="140" data-aos-duration="900">
                <div className="news__featured-img" data-aos="zoom-in" data-aos-delay="180" data-aos-duration="900">
                  {featuredNews.image ? (
                    <img src={getMediaSrc(featuredNews.image)} alt={featuredNews.title || 'Noticia destacada'} loading="lazy" />
                  ) : (
                    <span>📷 Imagen destacada</span>
                  )}
                </div>
                <div className="news__featured-content" data-aos="fade-left" data-aos-delay="220" data-aos-duration="900">
                  {featuredNews.tag && (
                    <span
                      className="news__tag"
                      style={{
                        background: normalizeNewsTagColor(featuredNews.tagColor),
                        color: getTagTextColor(featuredNews.tagColor),
                      }}
                    >
                      {featuredNews.tag}
                    </span>
                  )}
                  <h2 className="news__featured-title">{featuredNews.title}</h2>
                  <p className="news__featured-excerpt">{featuredNews.excerpt}</p>
                  <div className="news__featured-meta">
                    {featuredNews.date && <span>{featuredNews.date}</span>}
                    <span>⏱ {featuredNews.readTime}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="news__grid" data-aos="fade-up" data-aos-delay="180" data-aos-duration="850">
              {secondaryNews.map((n, idx) => (
                <div
                  className="news__card"
                  key={n.id}
                  onClick={() => setSelected(n)}
                  data-aos="fade-up"
                  data-aos-delay={String(220 + (idx * 70))}
                  data-aos-duration="850"
                >
                  <div className="news__card-img">
                    {n.image ? (
                      <img src={getMediaSrc(n.image)} alt={n.title || 'Noticia'} loading="lazy" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <div className="news__card-body">
                    {n.tag && (
                      <span
                        className="news__tag news__tag--sm"
                        style={{
                          background: normalizeNewsTagColor(n.tagColor),
                          color: getTagTextColor(n.tagColor),
                        }}
                      >
                        {n.tag}
                      </span>
                    )}
                    <h3 className="news__card-title">{n.title}</h3>
                    <p className="news__card-excerpt">{n.excerpt}</p>
                    <div className="news__card-meta">
                      {n.date && <span>{n.date}</span>}
                      <span>⏱ {n.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <NoticiaModal noticia={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default Noticias;
