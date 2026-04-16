'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import twemoji from 'twemoji';
import Navbar from './shared/Navbar/Navbar';
import CartSidebar from './shared/CartSidebar/CartSidebar';
import usePublicCart from '@store/usePublicCart';

const SECTION_ANIMATIONS = ['fade-up', 'zoom-in-up', 'fade-up'];
const CARD_ANIMATIONS = ['zoom-in-up', 'fade-up', 'fade-down'];

const TWEMOJI_OPTIONS = {
  folder: 'svg',
  ext: '.svg',
  className: 'twemoji',
};

const applyAosAttributes = () => {
  if (typeof document === 'undefined') return;

  const sections = Array.from(document.querySelectorAll('.public-main section, .public-main footer, .public-main form'));

  sections.forEach((section, sectionIndex) => {
    if (!section.dataset.aos) {
      section.dataset.aos = SECTION_ANIMATIONS[sectionIndex % SECTION_ANIMATIONS.length];
    }

    if (!section.dataset.aosDuration) {
      section.dataset.aosDuration = '850';
    }

    const animatedChildren = Array.from(
      section.querySelectorAll('[class*="__card"], [class*="__item"], [class*="__btn"], [class*="__title"]')
    );

    animatedChildren.forEach((element, elementIndex) => {
      if (!element.dataset.aos) {
        element.dataset.aos = CARD_ANIMATIONS[elementIndex % CARD_ANIMATIONS.length];
      }

      if (!element.dataset.aosDelay) {
        element.dataset.aosDelay = String((elementIndex % 6) * 70);
      }

      if (!element.dataset.aosDuration) {
        element.dataset.aosDuration = '700';
      }
    });
  });
};

const applyTwemoji = () => {
  if (typeof document === 'undefined') return;
  twemoji.parse(document.body, TWEMOJI_OPTIONS);
};

export default function PublicLayout({ children }) {
  const hydrate = usePublicCart((s) => s.hydrate);
  const pathname = usePathname();
  const isLoginRoute = pathname === '/login';
  const whatsappLink = 'https://wa.me/522294324870';

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    applyAosAttributes();
    applyTwemoji();

    AOS.init({
      duration: 800,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      once: false,
      mirror: true,
      offset: 80,
      anchorPlacement: 'top-bottom',
    });

    const frameId = window.requestAnimationFrame(() => {
      AOS.refreshHard();
      applyTwemoji();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let rafId = null;
    const scheduleParse = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        applyTwemoji();
      });
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          scheduleParse();
          return;
        }

        if (mutation.type === 'characterData') {
          scheduleParse();
          return;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      {!isLoginRoute && <Navbar />}
      {!isLoginRoute && <CartSidebar />}
      <main className="public-main">
        {children}
      </main>
      {!isLoginRoute && (
        <a
          href={whatsappLink}
          className="whatsapp-fab"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          title="Contactar por WhatsApp"
        >
          <svg
            className="whatsapp-fab__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M19.05 4.91A9.82 9.82 0 0 0 12.08 2C6.64 2 2.2 6.42 2.2 11.87c0 1.75.46 3.45 1.34 4.95L2 22l5.34-1.5a9.86 9.86 0 0 0 4.74 1.2h.01c5.44 0 9.88-4.43 9.88-9.88a9.8 9.8 0 0 0-2.92-6.91Zm-6.97 15.1h-.01a8.19 8.19 0 0 1-4.18-1.14l-.3-.18-3.17.89.85-3.09-.2-.32a8.18 8.18 0 0 1-1.25-4.3c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.26.85 5.82 2.41a8.17 8.17 0 0 1 2.41 5.81c0 4.54-3.7 8.23-8.21 8.23Zm4.51-6.17c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.56.12-.16.24-.64.82-.78.98-.14.16-.29.18-.54.06-.25-.12-1.06-.39-2.01-1.25-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.24.25-.4.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.4-.41-.56-.41h-.48c-.17 0-.43.06-.66.3-.23.24-.87.85-.87 2.08 0 1.22.89 2.41 1.01 2.58.12.16 1.74 2.66 4.22 3.73.59.25 1.06.4 1.42.5.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.29Z"
            />
          </svg>
        </a>
      )}
    </>
  );
}
