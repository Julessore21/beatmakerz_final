"use client";

import Link from "next/link";
import { ArrowRight, Check, Download, Headphones, ShoppingBag } from "lucide-react";
import { useAudio } from "@/context/AudioPlayerContext";
import { useCatalog } from "@/lib/useCatalog";
import { useOffers } from "@/lib/useOffers";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHead } from "@/components/ui/SectionHead";
import { Cover } from "@/components/shop/Cover";
import { EqBars, PlayToggle } from "@/components/shop/PlayToggle";
import { TrackList, TrackListSkeleton } from "@/components/shop/TrackList";

export default function Home() {
  const { beats, error, retry } = useCatalog();
  const { basic, custom } = useOffers();
  const latest = beats?.slice(0, 8) ?? [];
  const basicPrice = basic ? formatPrice(basic.priceCents, basic.currency) : null;
  const customPrice = custom?.priceCents != null ? formatPrice(custom.priceCents, custom.currency) : null;

  return (
    <>
      {/* Ouverture */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,rgba(124,92,255,0.18),transparent_70%)]" />
        <div className="container-site relative grid items-center gap-12 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
          <div className="animate-rise">
            <p className="eyebrow mb-5">Beatmakerz · prods pour rappeurs</p>
            <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[64px]">
              Des prods
              <br />
              prêtes à poser.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-fg-muted">
              Trap, drill, cloud, lofi. Écoute les extraits, prends la licence, et télécharge tes fichiers dès le paiement.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/web/catalogue" size="lg" className="w-full sm:w-auto">
                Écouter le catalogue
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/web/prodsurmesure" size="lg" variant="secondary" className="w-full sm:w-auto">
                Prod sur mesure
              </ButtonLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-fg-muted">
              {["Licence commerciale", "Téléchargement immédiat", "Paiement sécurisé Stripe"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual latest={latest[0] ?? null} queue={latest} />
        </div>
      </section>

      {/* Repères */}
      <section className="border-y border-line bg-ink-850/50">
        <div className="container-site grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Fact value={SITE.tiktokFollowers} label="abonnés sur TikTok" />
          <Fact value={basicPrice ?? "—"} label="la licence d’une prod" />
          <Fact value="Tout de suite" label="tes fichiers, après paiement" />
        </div>
      </section>

      {/* Dernières prods */}
      <section className="container-site pt-20">
        <SectionHead eyebrow="Nouveautés" title="Les dernières prods" link={{ href: "/web/catalogue", label: "Tout le catalogue" }} />
        {error ? (
          <CatalogError onRetry={retry} />
        ) : !beats ? (
          <TrackListSkeleton rows={6} />
        ) : latest.length ? (
          <TrackList beats={latest} />
        ) : (
          <p className="card px-6 py-10 text-center text-fg-muted">Les premières prods arrivent très bientôt.</p>
        )}
      </section>

      {/* Offres */}
      <section id="licence" className="container-site scroll-mt-24 pt-24">
        <SectionHead eyebrow="Deux façons d’acheter" title="Une prod du catalogue, ou la tienne" text="Sans abonnement, sans surprise : tu paies la prod, tu repars avec tes fichiers et ta licence." />
        <div className="grid gap-4 md:grid-cols-2">
          <Offer
            title="Licence prod"
            price={basicPrice}
            unit="la prod"
            text="Pour poser sur une prod du catalogue et la sortir."
            points={["Usage commercial : streaming, clips, scène", "MP3 haute qualité, WAV selon la prod", "Fichiers à télécharger depuis ton compte", "Licence non exclusive, revente interdite"]}
            cta={{ href: "/web/catalogue", label: "Choisir une prod" }}
            primary
          />
          <Offer
            title="Prod sur mesure"
            price={customPrice}
            unit="la prod"
            text="Une prod faite pour toi, à partir de tes références."
            points={["Licence exclusive : elle n’est vendue qu’à toi", "Contrat de cession fourni", "Jamais remise en vente sur le site", "Brief simple : genre, tempo, ambiance, références"]}
            cta={{ href: "/web/prodsurmesure", label: "Faire ma demande" }}
          />
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="container-site pt-24">
        <SectionHead eyebrow="Comment ça marche" title="De l’écoute au studio en trois minutes" />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Headphones, title: "Écoute", text: "Lance les extraits, filtre par genre et tempo. Le lecteur te suit partout sur le site." },
            { icon: ShoppingBag, title: "Ajoute au panier", text: "Un clic par prod. Tu crées ton compte seulement au moment de payer." },
            { icon: Download, title: "Télécharge", text: "Paiement par carte via Stripe. Tes fichiers sont dans ton compte aussitôt." },
          ].map((s, i) => (
            <li key={s.title} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06]">
                  <s.icon className="h-[18px] w-[18px]" />
                </span>
                <span className="meta">0{i + 1}</span>
              </div>
              <p className="mt-6 text-[17px] font-medium">{s.title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TikTok */}
      <section className="container-site pt-24">
        <div className="relative overflow-hidden rounded-card border border-line bg-ink-800 px-6 py-12 sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <p className="eyebrow mb-3">Sur TikTok</p>
              <p className="text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">{SITE.tiktokFollowers} abonnés écoutent nos prods.</p>
              <p className="mt-3 text-fg-muted">On y poste nos prods. Rejoins-les, et pose sur la prochaine.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={SITE.socials.tiktok} size="lg">
                Suivre sur TikTok
              </ButtonLink>
              <ButtonLink href={SITE.socials.instagram} size="lg" variant="secondary">
                Instagram
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="container-site grid gap-8 pt-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Questions</p>
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">Avant d’acheter</h2>
          <Link href="/web/faq" className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-fg-muted transition-colors hover:text-fg">
            Toutes les questions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <Accordion
          items={[
            { q: "Qu’est-ce que je reçois après l’achat ?", a: "Le fichier MP3 de la prod, et le WAV quand la prod en a un. Ils sont à télécharger dans ton compte dès que le paiement est validé." },
            { q: "Je peux sortir mon morceau sur les plateformes ?", a: "Oui. La licence permet l’usage commercial : streaming, clips, scène. Elle n’est pas exclusive, et la revente de la prod est interdite." },
            { q: "Comment marche la prod sur mesure ?", a: "Tu remplis un brief (genre, tempo, ambiance, références), tu paies, et on compose ta prod. Elle est exclusive et n’est jamais remise en vente." },
            { q: "Je dois créer un compte ?", a: "Seulement au moment de payer : c’est là que tes fichiers t’attendent. Tu peux écouter et remplir ton panier sans compte." },
          ]}
        />
      </section>

      {/* Fin */}
      <section className="container-site pt-24 text-center">
        <p className="mx-auto max-w-xl text-[32px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">Ta prochaine prod est dans le catalogue.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/web/catalogue" size="lg">
            Écouter le catalogue
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function HeroVisual({ latest, queue }: { latest: import("@/lib/catalog").Beat | null; queue: import("@/lib/catalog").Beat[] }) {
  const { track, isPlaying } = useAudio();
  return (
    <div className="relative animate-rise [animation-delay:120ms]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-line bg-ink-800 sm:aspect-[5/4] lg:aspect-[4/5]">
        <video className="h-full w-full object-cover opacity-90" src="/videos/videotest2.mp4" poster="/videos/poster2.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
      </div>
      {latest && (
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-line-strong bg-ink/75 p-3 backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
          <Cover id={latest.id} url={latest.coverUrl} title={latest.title} className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="eyebrow flex items-center gap-2 text-[10px]">
              {track?.id === latest.id && isPlaying ? <EqBars className="h-2.5" /> : null}
              Dernière prod
            </p>
            <Link href={`/web/prod/${latest.id}`} className="mt-0.5 block truncate font-medium hover:underline">
              {latest.title}
            </Link>
          </div>
          <PlayToggle beat={latest} queue={queue} />
        </div>
      )}
    </div>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 px-1 py-6 sm:flex-col sm:gap-1 sm:px-8 sm:first:pl-0">
      <span className="text-[26px] font-semibold tracking-[-0.02em] tabular-nums">{value}</span>
      <span className="text-[14px] text-fg-muted">{label}</span>
    </div>
  );
}

function Offer({ title, price, unit, text, points, cta, primary }: { title: string; price: string | null; unit: string; text: string; points: string[]; cta: { href: string; label: string }; primary?: boolean }) {
  return (
    <div className={`flex flex-col rounded-card border p-7 sm:p-8 ${primary ? "border-line-strong bg-ink-800" : "border-line bg-ink-850"}`}>
      <p className="text-[15px] font-medium">{title}</p>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-[40px] font-semibold tracking-[-0.03em] tabular-nums">{price ?? "—"}</span>
        {price && <span className="text-fg-muted">{unit}</span>}
      </p>
      <p className="mt-2 text-[15px] text-fg-muted">{text}</p>
      <ul className="mt-7 space-y-3 border-t border-line pt-7">
        {points.map((p) => (
          <li key={p} className="flex gap-3 text-[14px] text-fg-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-1">
        <ButtonLink href={cta.href} variant={primary ? "primary" : "secondary"} className="w-full">
          {cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}

function CatalogError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-12 text-center">
      <p className="font-medium">Le catalogue ne répond pas pour le moment.</p>
      <p className="text-[14px] text-fg-muted">Ça arrive au premier chargement de la journée : il se réveille en quelques secondes.</p>
      <button type="button" onClick={onRetry} className="rounded-full border border-line-strong px-4 py-2 text-[14px] hover:bg-white/[0.06]">
        Réessayer
      </button>
    </div>
  );
}
