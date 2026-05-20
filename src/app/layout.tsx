import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pengelolaan Aset Tetap – Lahan BTS",
  description: "Sistem Informasi Manajemen Aset Lahan Base Transceiver Station",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
