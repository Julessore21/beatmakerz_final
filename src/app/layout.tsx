// src/app/layout.tsx
import React from "react";
import NavBar from "@/components/Navbar";
import "../styles/globals.css"; // si tu as des styles globaux

export const metadata = {
  title: "Beatmakerz",
  description: "Catalogue de beats & services audio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <NavBar />
          <main className="flex-grow">{children}</main>
          {/* Optionnel : Footer ici */}
        </div>
      </body>
    </html>
  );
}
