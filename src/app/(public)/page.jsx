import Link from 'next/link';
import './page.scss';

export default function PublicPage() {
  return (
    <main className="public_home">
      <section className="public_home_card">
        <h1>Losrones Web</h1>
        <p>Sitio publico de Losrones.</p>
        <Link href="/login" className="public_login_link">
          Ir a iniciar sesion
        </Link>
      </section>
    </main>
  );
}
