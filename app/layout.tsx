import type { Metadata } from "next";
import { inter, dancingScript } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rox Does Nails - Deine Traumnägel sind nur einen Termin entfernt",
  description: "Willkommen bei Rox Does Nails. Professionelle Nagelpflege und -design in Wallisellen. Termin buchen für Neuset, Auffüllen und mehr.",
  keywords: "Nagelpflege, Nail Art, Wallisellen, Termin buchen, Rox Does Nails",
  authors: [{ name: "Rox Does Nails" }],
  openGraph: {
    title: "Rox Does Nails - Deine Traumnägel sind nur einen Termin entfernt",
    description: "Willkommen bei Rox Does Nails. Professionelle Nagelpflege und -design in Wallisellen.",
    type: "website",
    locale: "de_CH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${dancingScript.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
