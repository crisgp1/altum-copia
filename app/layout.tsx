import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Suspense } from "react";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
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
