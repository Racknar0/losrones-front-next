'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './NoticiaModal.scss';

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

const NoticiaModal = ({ noticia, onClose }) => {
  useEffect(() => {
    if (!noticia) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [noticia]);

  if (!noticia || typeof document === 'undefined') return null;

  const modalContent = (
    <>
      <div className="nm__overlay" onClick={onClose} />
      <div className="nm" onClick={(event) => event.stopPropagation()}>
        <button className="nm__close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="nm__image">
          {noticia.image ? (
            <img src={getMediaSrc(noticia.image)} alt={noticia.title || 'Noticia'} loading="lazy" />
          ) : (
            <span className="nm__image-placeholder">📷 Imagen de noticia</span>
          )}
        </div>

        <div className="nm__body">
          {noticia.tag && (
            <span
              className="nm__tag"
              style={{
                backgroundColor: normalizeNewsTagColor(noticia.tagColor),
                color: getTagTextColor(noticia.tagColor),
              }}
            >
              {noticia.tag}
            </span>
          )}

          <div className="nm__meta">
            {noticia.date && <span className="nm__date">{noticia.date}</span>}
            {noticia.readTime && <span className="nm__read-time">⏱ {noticia.readTime}</span>}
          </div>

          <h2 className="nm__title">{noticia.title}</h2>

          <div className="nm__content">
            {noticia.descriptionHtml ? (
              <div dangerouslySetInnerHTML={{ __html: noticia.descriptionHtml }} />
            ) : (
              <p>{noticia.content || noticia.excerpt || ''}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default NoticiaModal;
