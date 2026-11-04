import * as React from "react";
import { cn } from "@/lib/cn";

/** Pastille sélectionnable (filtres, choix de genre…). Active = violet de la marque. */
export function Chip({
  active = false,
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-brand bg-brand text-white"
          : "border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10",
        className
      )}
      {...props}
    />
  );
}

/** Étiquette non cliquable (statut, licence, genre). */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-300",
        className
      )}
      {...props}
    />
  );
}
