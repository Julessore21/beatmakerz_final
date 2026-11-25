/** Prix en euros à la française : « 9,99 € ». Inconnu = null, jamais « 0 € ». */
export function formatPrice(cents: number | null | undefined, currency = "EUR"): string | null {
  if (cents == null || !Number.isFinite(cents)) return null;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency.toUpperCase() })
    .format(cents / 100)
    .replace(/ | /g, " ");
}

/** Durée « 2:05 ». */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Date courte « 23 nov. 2026 ». */
export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
