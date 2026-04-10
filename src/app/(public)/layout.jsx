'use client';

import { useEffect } from 'react';
import Navbar from './shared/Navbar/Navbar';
import CartSidebar from './shared/CartSidebar/CartSidebar';
import usePublicCart from '@store/usePublicCart';

export default function PublicLayout({ children }) {
  const hydrate = usePublicCart((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="public-main">
        {children}
      </main>
    </>
  );
}
