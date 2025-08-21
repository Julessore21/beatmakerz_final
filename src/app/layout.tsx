import "@/styles/globals.css";
import type { Metadata } from "next";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { CartProvider } from "@/context/CartContext";
import GlobalAudioPlayer from "@/components/GlobalAudioPlayer";
import NavBar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Beatmakerz",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>

        <CartProvider>

        <AuthProvider>

          <AudioPlayerProvider>
            <header>
              <NavBar />
            </header>

            {children}

            <GlobalAudioPlayer />
          </AudioPlayerProvider>

      </body>
    </html>
  );
}
