import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cloudvault - Gestión Inteligente de Archivos en la Nube",
    template: "%s | Cloudvault"
  },
  description: "Gestiona, organiza y comparte tus archivos en la nube de forma segura. Sistema profesional de almacenamiento con Cloudinary y autenticación empresarial.",
  keywords: ["cloudinary", "gestión de archivos", "almacenamiento en la nube", "cloudvault", "file management", "cloud storage"],
  authors: [{ name: "Cloudvault Team" }],
  creator: "Cloudvault",
  publisher: "Cloudvault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Cloudvault - Gestión Inteligente de Archivos",
    description: "Sistema profesional de almacenamiento y gestión de archivos en la nube con seguridad empresarial.",
    url: "/",
    siteName: "Cloudvault",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cloudvault - Gestión de Archivos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloudvault - Gestión Inteligente de Archivos",
    description: "Sistema profesional de almacenamiento en la nube con seguridad empresarial.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
