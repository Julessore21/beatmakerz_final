import "@/styles/globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { CartProvider } from "@/context/CartContext";
import GlobalAudioPlayer from "@/components/GlobalAudioPlayer";
import NavBar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import FooterWrapper from "@/components/FooterWrapper";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Beatmakerz",
  title: {
    default: "Beatmakerz",
    template: "%s | Beatmakerz",
  },
  description:
    "Plateforme française de vente d'instrumentales et de services pour artistes",
  alternates: {
    canonical: "/",
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
  openGraph: {
    type: "website",
    siteName: "Beatmakerz",
    title: "Beatmakerz",
    description:
      "Plateforme française de vente d'instrumentales et de services pour artistes",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Beatmakerz",
      },
    ],
    locale: "fr_FR",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Beatmakerz",
    description:
      "Plateforme française de vente d'instrumentales et de services pour artistes",
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans flex min-h-screen flex-col bg-transparent">
        <CartProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              <header>
                <NavBar />
              </header>
              <main className="flex-1 w-full">
                {children}
              </main>
              <FooterWrapper />
              <GlobalAudioPlayer />
            </AudioPlayerProvider>
          </AuthProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
