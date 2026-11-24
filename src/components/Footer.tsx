import Link from "next/link";
import { LEGAL, SITE } from "@/lib/site";
import { Logo } from "./Logo";

const SOCIALS = [
  { href: SITE.socials.tiktok, label: "TikTok" },
  { href: SITE.socials.instagram, label: "Instagram" },
  { href: SITE.socials.youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-site grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo className="flex" />
          <p className="mt-4 text-[14px] leading-relaxed text-fg-muted">Des prods pour rappeurs, prêtes à poser. Écoute, choisis, télécharge.</p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-1.5 text-[13px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Boutique" links={[{ href: "/web/catalogue", label: "Catalogue" }, { href: "/web/prodsurmesure", label: "Prod sur mesure" }, { href: "/#licence", label: "La licence" }]} />
        <FooterCol title="Aide" links={[{ href: "/web/faq", label: "Questions fréquentes" }, { href: "/web/contact", label: "Contact" }, { href: "/web/account", label: "Mon compte" }]} />
        <FooterCol title="Légal" links={[...LEGAL]} />
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-[12px] text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Beatmakerz. Tous droits réservés.</p>
          <p>Paiement sécurisé par Stripe</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
