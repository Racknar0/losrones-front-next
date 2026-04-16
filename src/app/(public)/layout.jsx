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
      <div className="site-construction-banner" role="status" aria-live="polite">
        Este sitio esta en construccion
      </div>
    </>
  );
}
