import Link from "next/link";
import { SITE } from "@/lib/site";
import { Accordion } from "@/components/ui/Accordion";
import { PageTitle } from "@/components/ui/PageTitle";
import { ButtonLink } from "@/components/ui/Button";

const GROUPS: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Acheter une prod",
    items: [
      { q: "Qu’est-ce que je reçois après l’achat ?", a: "Le fichier MP3 de la prod, et le WAV quand la prod en a un (c’est indiqué sur sa fiche). Ils sont à télécharger dans ton compte dès que le paiement est validé." },
      { q: "Je dois créer un compte ?", a: "Seulement au moment de payer. Tu peux écouter et remplir ton panier sans compte ; il te suit quand tu te connectes." },
      { q: "Quels moyens de paiement ?", a: "La carte bancaire (Visa, Mastercard, American Express) via Stripe, notre prestataire de paiement sécurisé. Nous ne voyons jamais tes données bancaires." },
      { q: "Je peux écouter avant d’acheter ?", a: "Oui, chaque prod a son extrait. Lance-le depuis le catalogue ou sa fiche : le lecteur te suit sur tout le site." },
      { q: "Je n’arrive pas à télécharger mon fichier.", a: <>Chaque clic sur « MP3 » ou « WAV » dans ton compte crée un lien valable quelques minutes. Si ça bloque encore, écris-nous à <a className="text-fg underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</> },
    ],
  },
  {
    title: "La licence",
    items: [
      { q: "Je peux sortir mon morceau sur les plateformes ?", a: "Oui. La licence permet l’usage personnel et commercial : streaming, clips, scène." },
      { q: "La prod est exclusive ?", a: "Non, la licence du catalogue n’est pas exclusive : d’autres artistes peuvent acheter la même prod. Tu veux une exclusivité ? Demande une prod sur mesure, ou écris-nous pour une prod du catalogue." },
      { q: "Je peux revendre la prod ?", a: "Non. La revente ou la redistribution de la prod elle-même est interdite, quelle que soit la licence." },
    ],
  },
  {
    title: "Prod sur mesure",
    items: [
      { q: "Comment ça marche ?", a: "Tu remplis un court brief (genre, ambiance, tempo, références), tu paies, et on compose ta prod. On te recontacte par mail pour la suite et la livraison." },
      { q: "Qu’est-ce qui change avec une prod sur mesure ?", a: "Elle est exclusive : elle n’est vendue qu’à toi, n’est jamais remise en vente sur le site, et tu reçois un contrat de cession." },
    ],
  },
  {
    title: "Remboursement",
    items: [
      { q: "Je peux être remboursé ?", a: <>Les fichiers étant livrés tout de suite, le droit de rétractation prend fin au premier téléchargement (tu l’acceptes en cochant la case avant de payer). En cas de problème technique avéré avec un fichier, écris-nous. Détails sur la page <Link className="text-fg underline underline-offset-4" href="/web/retractation">rétractation</Link>.</> },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container-site pt-10 sm:pt-14">
      <PageTitle eyebrow="Aide" title="Questions fréquentes" text="Tout ce qu’il faut savoir avant et après l’achat." />
      <div className="mt-12 space-y-14">
        {GROUPS.map((g) => (
          <section key={g.title} className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <h2 className="text-[17px] font-semibold">{g.title}</h2>
            <Accordion items={g.items} />
          </section>
        ))}
      </div>
      <div className="card mt-16 flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Pas trouvé ta réponse ?</p>
          <p className="mt-1 text-[14px] text-fg-muted">On répond par mail, en général dans la journée.</p>
        </div>
        <ButtonLink href="/web/contact" variant="secondary">
          Nous écrire
        </ButtonLink>
      </div>
    </div>
  );
}
