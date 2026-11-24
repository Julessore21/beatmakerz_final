import Link from "next/link";
import React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,border-color,transform,opacity] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary: "bg-fg text-ink hover:bg-white/85",
  secondary: "border border-line-strong bg-white/[0.04] text-fg hover:bg-white/[0.08]",
  ghost: "text-fg-muted hover:bg-white/[0.06] hover:text-fg",
  accent: "bg-accent text-white hover:bg-accent/85",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size; href: string }) {
  const external = /^(https?:|mailto:)/.test(href);
  if (external) return <a href={href} className={buttonClass(variant, size, className)} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" {...props} />;
  return <Link href={href} className={buttonClass(variant, size, className)} {...props} />;
}
