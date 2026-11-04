import * as React from "react";
import { cn } from "@/lib/cn";

/** Carte "verre" standard du site. `raised` pour les modales et panneaux opaques. */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { raised?: boolean }>(
  ({ className, raised = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/10 p-6",
        raised ? "bg-brand-card shadow-2xl" : "bg-white/5 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
