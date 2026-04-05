import "./globals.css";

export const metadata = {
  title: "Losrones Web",
  description: "Panel y sitio publico de Losrones",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
