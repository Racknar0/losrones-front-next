import Navbar from './shared/Navbar/Navbar';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="public-main">
        {children}
      </main>
    </>
  );
}
