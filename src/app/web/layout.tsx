// src/app/web/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Beatmakerz",
    template: "%s | Beatmakerz",
  },
};
export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
