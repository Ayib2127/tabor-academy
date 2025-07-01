import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from "@/components/ui/toaster";

// Load Inter font locally
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taboracademy.com'),
  title: {
    default: 'Tabor Digital Academy - Empowering Ethiopian Entrepreneurs',
    template: '%s | Tabor Digital Academy'
  },
  description: 'A modern, interactive e-learning platform designed to rapidly equip individuals from Ethiopia\'s emerging markets with entrepreneurial, digital, and freelancing skills.',
  keywords: ['digital skills', 'Ethiopian entrepreneurs', 'online learning', 'digital marketing', 'e-commerce', 'entrepreneurship'],
  authors: [{ name: 'Tabor Digital Academy' }],
  creator: 'Tabor Digital Academy',
  publisher: 'Tabor Digital Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taboracademy.com',
    siteName: 'Tabor Digital Academy',
    title: 'Tabor Digital Academy - Empowering Ethiopian Entrepreneurs',
    description: 'A modern, interactive e-learning platform designed to rapidly equip individuals from Ethiopia\'s emerging markets with entrepreneurial, digital, and freelancing skills.',
    images: [
      {
        url: 'https://taboracademy.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tabor Digital Academy'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tabor Digital Academy - Empowering Ethiopian Entrepreneurs',
    description: 'A modern, interactive e-learning platform designed to rapidly equip individuals from Ethiopia\'s emerging markets with entrepreneurial, digital, and freelancing skills.',
    images: ['https://taboracademy.com/twitter-image.jpg'],
    creator: '@taboracademy'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter?.className ?? ''}>
      <head>
        {/* Preload local fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload logo */}
        <link
          rel="preload"
          href="/logo.jpg"
          as="image"
          type="image/png"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/logo.jpg" sizes="any" />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="font-sans" suppressHydrationWarning={true}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
              <SiteFooter />
              <Analytics />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}