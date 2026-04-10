import Link from 'next/link';
import './layout.css';

export default function PublicLayout({ children }) {
  return (
    <>
      <nav className="public-navbar">
        <div className="public-navbar__container">
          <Link href="/" className="public-navbar__logo">
            Losrones
          </Link>

          <ul className="public-navbar__menu">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/productos">Productos</Link></li>
            <li><Link href="/noticias">Noticias</Link></li>
            <li><Link href="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>
      </nav>

      <main className="public-main">
        {children}
      </main>
    </>
  );
}
