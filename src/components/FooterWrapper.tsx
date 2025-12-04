"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname === "/") return null; // Hero page gère son footer custom
  return <Footer />;
}
