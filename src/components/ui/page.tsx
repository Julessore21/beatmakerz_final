import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Gabarit commun des pages internes : laisse la place à la navbar fixe et
 * s'appuie sur le fond global du <body> (pas de fond propre à chaque page).
 */
export function PageShell({
  className,
  size = "lg",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "md" | "lg" | "xl" }) {
  const width = { md: "max-w-3xl", lg: "max-w-6xl", xl: "max-w-7xl" }[size];
  return <div className={cn("relative mx-auto w-full px-4 pb-24 pt-28 text-white sm:px-6", width, className)} {...props} />;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-lavender">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
