import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Campings, Glamping y Parques`,
  description: `${SITE_TAGLINE}. Reserva tu parcela ideal en España.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
