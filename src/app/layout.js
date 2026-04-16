import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Luckiest_Guy, Poppins } from "next/font/google";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://losrones.com";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Losrones | Tienda para Mascotas en Veracruz",
    template: "%s | Losrones",
  },
  description:
    "Losrones: alimento, accesorios y productos para mascotas en Veracruz y Boca del Rio. Compra en linea y conoce nuestras sucursales.",
  keywords: [
    "tienda de mascotas",
    "alimento para perro",
    "alimento para gato",
    "accesorios para mascotas",
    "Veracruz",
    "Boca del Rio",
    "Losrones",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Losrones | Tienda para Mascotas en Veracruz",
    description:
      "Alimento, accesorios y productos para mascotas. Visitanos en nuestras sucursales o compra en linea.",
    url: SITE_URL,
    siteName: "Losrones",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Losrones | Tienda para Mascotas en Veracruz",
    description:
      "Alimento, accesorios y productos para mascotas. Visitanos en nuestras sucursales o compra en linea.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${poppins.variable} ${luckiestGuy.variable}`}>{children}</body>
    </html>
  );
}
