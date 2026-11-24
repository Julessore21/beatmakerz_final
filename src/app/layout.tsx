import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { PlayerBar } from "@/components/shop/PlayerBar";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://beatmakerz.fr" : "http://localhost:3000")).replace(/\/$/, "");
const description = "Des prods pour rappeurs, prêtes à poser : trap, drill, cloud, lofi. Écoute, achète la licence, télécharge tes fichiers tout de suite.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Beatmakerz",
  title: { default: "Beatmakerz · Prods pour rappeurs", template: "%s · Beatmakerz" },
  description,
  openGraph: {
    type: "website",
    siteName: "Beatmakerz",
    title: "Beatmakerz · Prods pour rappeurs",
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Beatmakerz" }],
    locale: "fr_FR",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: "Beatmakerz · Prods pour rappeurs", description, images: ["/opengraph-image"] },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#09090B", colorScheme: "dark" };

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Beatmakerz",
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  sameAs: ["https://www.tiktok.com/@beatmakerz.pro", "https://www.instagram.com/beatmakerz_pro/", "https://www.youtube.com/@BEATMAKERZ-PRO"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
        <AuthProvider>
          <CartProvider>
            <AudioPlayerProvider>
              <Header />
              <main className="w-full flex-1">{children}</main>
              <Footer />
              <PlayerBar />
              <CartDrawer />
            </AudioPlayerProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
