import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderForNextAuth from "@/nextAuth/SessionProviderForNextAuth";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import { Toaster } from "sonner";
import MyContextProvider from "@/lib/MyContextProvider";
import { NextUiProvider } from "@/lib/NextUiProvider";
import { CartProvider } from "@/hooks/use-cart";
import dynamic from "next/dynamic";

const FacebookPixel = dynamic(() => import("@/components/pixel/facebookPixel"));

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
    default: "Glassophite | Premium Luxury Eyewear & Sunglasses",
    template: "%s | Glassophite",
  },
  description: "Glassophite is a statement of modern sophistication and refined luxury, crafted exclusively for the discerning eyes of Bangladeshi trendsetters. Explore premium handcrafted sunglasses.",
  keywords: [
    "luxury sunglasses",
    "premium eyewear",
    "Bangladesh fashion",
    "timeless eyewear designs",
    "designer sunglasses",
    "eyewear for trendsetters",
  ],
  metadataBase: new URL("https://www.glassophite.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Glassophite | Premium Luxury Eyewear & Sunglasses",
    description: "Discover Glassophite's curated collection of luxury sunglasses and premium eyewear.",
    url: "https://www.glassophite.com",
    siteName: "Glassophite",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glassophite | Premium Luxury Eyewear & Sunglasses",
    description: "Discover Glassophite's curated collection of luxury sunglasses and premium eyewear.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007C74",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FacebookPixel />
        <MyContextProvider>
          <SessionProviderForNextAuth>
            <ReduxStoreProvider>
              <NextUiProvider>
                <CartProvider>
                  <Toaster closeButton />
                  {children}
                </CartProvider>
              </NextUiProvider>
            </ReduxStoreProvider>
          </SessionProviderForNextAuth>
        </MyContextProvider>
      </body>
    </html>
  );
}
