import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHead({ eyebrow, title, text, link }: { eyebrow?: string; title: string; text?: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">{title}</h2>
        {text && <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">{text}</p>}
      </div>
      {link && (
        <Link href={link.href} className="group inline-flex shrink-0 items-center gap-1.5 text-[14px] font-medium text-fg-muted transition-colors hover:text-fg">
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
