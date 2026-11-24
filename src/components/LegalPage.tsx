import Link from "next/link";
import { LEGAL } from "@/lib/site";
import { cn } from "@/lib/cn";

export type LegalSection = { title: string; content: string | string[]; link?: { href: string; label: string } };

/** Mise en page commune des textes légaux : sommaire à gauche, texte lisible à droite. */
export function LegalPage({ title, updated, current, sections }: { title: string; updated?: string; current: string; sections: LegalSection[] }) {
  return (
    <div className="container-site grid gap-12 pt-10 sm:pt-14 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Textes légaux" className="hidden lg:block">
        <ul className="sticky top-24 space-y-1">
          {LEGAL.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cn("block rounded-lg px-3 py-2 text-[14px] transition-colors", l.href === current ? "bg-white/[0.06] text-fg" : "text-fg-muted hover:text-fg")}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article>
        <p className="eyebrow mb-3">Informations légales</p>
        <h1 className="text-[34px] font-semibold tracking-[-0.03em] sm:text-[42px]">{title}</h1>
        {updated && <p className="mt-2 text-[14px] text-fg-faint">Mise à jour : {updated}</p>}
        <div className="prose-legal mt-4">
          {sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {typeof s.content === "string" ? (
                <p>{s.content}</p>
              ) : (
                <ul>
                  {s.content.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
              {s.link && (
                <p>
                  <Link href={s.link.href}>{s.link.label}</Link>
                </p>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
