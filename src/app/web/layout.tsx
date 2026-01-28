// src/app/web/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Beatmakerz",
    template: "%s | Beatmakerz",
  },
};

// Force dynamic rendering pour toutes les pages web
// (plusieurs pages utilisent useSearchParams)
export const dynamic = 'force-dynamic';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
