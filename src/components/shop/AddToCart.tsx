"use client";

import { Check, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cheapest, type Beat, type BeatPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Bouton d'achat d'une prod : son prix, un clic l'ajoute au panier (licence la moins chère,
 * ou celle choisie). Déjà dans le panier : il le dit et ouvre le panier.
 */
export function AddToCart({ beat, price, size = "sm", className }: { beat: Beat; price?: BeatPrice; size?: "sm" | "lg"; className?: string }) {
  const { has, add, open, lines } = useCart();
  const chosen = price ?? cheapest(beat);
  const inCart = has(beat.id) && (!price || lines.some((l) => l.beatId === beat.id && l.licenseTypeId === price.licenseTypeId));
  const label = chosen ? formatPrice(chosen.priceCents, chosen.currency) : null;
  const big = size === "lg";
  const cls = cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium tabular-nums transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
    big ? "h-12 px-6 text-[15px]" : "h-8 px-3 text-[13px]",
    className,
  );
  if (!chosen || !label)
    return (
      <span className={cn(cls, "cursor-default border border-line text-fg-faint")} title="Pas encore en vente">
        Bientôt
      </span>
    );
  if (inCart)
    return (
      <button type="button" onClick={(e) => (e.stopPropagation(), open())} className={cn(cls, "bg-accent-soft text-accent hover:bg-accent/25")} aria-label={`${beat.title} est dans le panier`}>
        <Check className={big ? "h-4 w-4" : "h-3.5 w-3.5"} strokeWidth={2.5} />
        {big ? "Dans le panier" : "Ajoutée"}
      </button>
    );
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void add(beat, chosen);
      }}
      className={cn(cls, big ? "bg-fg text-ink hover:bg-white/85" : "border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-ink")}
      aria-label={`Ajouter ${beat.title} au panier pour ${label}`}
    >
      <Plus className={big ? "h-4 w-4" : "h-3.5 w-3.5"} strokeWidth={2.5} />
      {big ? `Ajouter au panier · ${label}` : label}
    </button>
  );
}
