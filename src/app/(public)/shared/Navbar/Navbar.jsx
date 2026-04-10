'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoLogin from '@assets/logo-login.png';
import { getAssetSrc } from '@helpers/assetSrc';
import './Navbar.scss';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* ─── Logo ─── */}
        <Link href="/" className="navbar__logo" onClick={closeMenu}>
          <img
            src={getAssetSrc(logoLogin)}
            alt="Losrones"
            className="navbar__logo-img"
            width={48}
            height={48}
          />
          <span className="navbar__logo-text">Losrones</span>
        </Link>

        {/* ─── Desktop Links ─── */}
        <ul className="navbar__menu">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar__link ${pathname === link.href ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ─── CTA Button (desktop) ─── */}
        <Link href="/contacto" className="navbar__cta">
          Contáctanos
        </Link>

        {/* ─── Hamburger (mobile) ─── */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        <ul className="navbar__drawer-menu">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar__drawer-link ${pathname === link.href ? 'navbar__drawer-link--active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contacto" className="navbar__drawer-cta" onClick={closeMenu}>
          Contáctanos
        </Link>
      </div>

      {/* ─── Overlay ─── */}
      {menuOpen && <div className="navbar__overlay" onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;
