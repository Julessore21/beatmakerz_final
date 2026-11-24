import Link from "next/link";
import { LEGAL, NAV, SITE } from "@/lib/site";

const link = "font-mono text-[11px] uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white";

/** Le pied de page : un grand bloc violet, le nom en très grand, les liens en mono entre crochets. */
export function Footer() {
  return (
    <footer className="mt-32 bg-accent-deep text-white">
      <div className="container-site pb-8 pt-14 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Col title="Navigation">
            {[...NAV].map((n) => (
              <Link key={n.href} href={n.href} className={link}>
                [ {n.label} ]
              </Link>
            ))}
          </Col>
          <Col title="Contact">
            <a href={`mailto:${SITE.email}`} className={`${link} normal-case`}>
              [ {SITE.email} ]
            </a>
            <Link href="/web/contact" className={link}>
              [ Écrire un message ]
            </Link>
            <Link href="/web/account" className={link}>
              [ Mon compte ]
            </Link>
          </Col>
          <Col title="Réseaux">
            <a href={SITE.socials.tiktok} target="_blank" rel="noreferrer" className={link}>
              [ TikTok ]
            </a>
            <a href={SITE.socials.instagram} target="_blank" rel="noreferrer" className={link}>
              [ Instagram ]
            </a>
            <a href={SITE.socials.youtube} target="_blank" rel="noreferrer" className={link}>
              [ YouTube ]
            </a>
          </Col>
          <Col title="Légal">
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className={link}>
                [ {l.label} ]
              </Link>
            ))}
          </Col>
        </div>

        {/* Le nom remplit exactement la largeur, quelle que soit l'écran. */}
        <svg viewBox="0 0 1000 132" className="mt-16 block w-full select-none sm:mt-24" aria-hidden="true">
          <text x="0" y="118" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="currentColor" style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 600, fontSize: 158, letterSpacing: "-0.04em" }}>
            BEATMAKERZ
          </text>
        </svg>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/20 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Beatmakerz</span>
          <span>Paiement sécurisé par Stripe</span>
          <span>Tous droits réservés</span>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{title}</p>
      <div className="mt-4 flex flex-col items-start gap-2.5">{children}</div>
    </div>
  );
}
