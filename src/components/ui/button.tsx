import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Bouton unique du site. Toujours passer par ce composant (ou `buttonClasses`
 * pour styliser un <Link>/<a>) plutôt que de réécrire des classes à la main.
 *
 * - primary   : action principale de la page (1 seule par écran idéalement)
 * - secondary : action secondaire, fond verre
 * - outline   : action tertiaire, contour seul
 * - ghost     : action discrète (fermer, retour…)
 * - danger    : suppression / déconnexion
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-night " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-white/10 text-white hover:bg-white/20",
  outline: "border border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/5",
  ghost: "bg-transparent text-zinc-300 hover:bg-white/10 hover:text-white",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
  icon: "h-9 w-9",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...props} />
  )
);
Button.displayName = "Button";

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, fullWidth, className })} {...props} />;
}
