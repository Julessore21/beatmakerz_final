"use client";

import { useEffect, useState } from "react";
import { fetchCustomProdPrice, fetchLicenses, type License } from "@/lib/catalog";

/** Les prix affichés viennent de l'API (licences) et de Stripe (sur mesure) : jamais un prix écrit à la main. */
let licensesCache: Promise<License[]> | null = null;
let customCache: Promise<{ priceCents: number | null; currency: string }> | null = null;

export function useOffers() {
  const [licenses, setLicenses] = useState<License[] | null>(null);
  const [custom, setCustom] = useState<{ priceCents: number | null; currency: string } | null>(null);
  useEffect(() => {
    licensesCache ??= fetchLicenses().catch((e: unknown) => {
      licensesCache = null;
      throw e;
    });
    customCache ??= fetchCustomProdPrice().catch((e: unknown) => {
      customCache = null;
      throw e;
    });
    licensesCache.then(setLicenses).catch(() => setLicenses([]));
    customCache.then(setCustom).catch(() => setCustom({ priceCents: null, currency: "EUR" }));
  }, []);
  return { licenses, basic: licenses?.find((l) => l.code === "Basic") ?? licenses?.[0] ?? null, custom };
}
