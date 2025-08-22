import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import AuthRedirectHandler from "@/app/components/auth/AuthRedirectHandler";
import ClientLayout from "@/app/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALTUM Legal - Excelencia Jurídica desde 1998",
  description: "Bufete de abogados especializado con más de 25 años de experiencia en derecho corporativo, litigio y asesoría legal integral en México.",
  keywords: ["abogados", "derecho corporativo", "litigio", "asesoría legal", "México", "Guadalajara", "ALTUM Legal"],
  authors: [{ name: "ALTUM Legal" }],
  creator: "ALTUM Legal",
  publisher: "ALTUM Legal",
  robots: "index, follow",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: '/assets/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/icons/favicon.ico' },
    ],
    apple: { url: '/assets/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { rel: 'android-chrome', url: '/assets/icons/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/assets/icons/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    type: "website",
    title: "ALTUM Legal - Excelencia Jurídica desde 1998",
    description: "Bufete de abogados especializado con más de 25 años de experiencia en derecho corporativo, litigio y asesoría legal integral en México.",
    siteName: "ALTUM Legal",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALTUM Legal - Excelencia Jurídica desde 1998",
    description: "Bufete de abogados especializado con más de 25 años de experiencia en derecho corporativo, litigio y asesoría legal integral en México.",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#152239',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-6XHJHHQGQ0"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6XHJHHQGQ0');
            `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClientLayout>
            <Suspense fallback={null}>
              <AuthRedirectHandler />
            </Suspense>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
