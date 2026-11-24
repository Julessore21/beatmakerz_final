"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";
import { Cover } from "@/components/shop/Cover";
import { WaiverCheck } from "@/components/shop/WaiverCheck";

export default function PanierPage() {
  const { lines, totalCents, currency, remove, checkout, isLoading, error } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [waiver, setWaiver] = useState(false);

  const pay = async () => {
    setPaying(true);
    setMessage(null);
    const r = await checkout();
    if (r === "login") router.push("/web/profil?next=/web/panier&raison=paiement");
    else if (r) setMessage(r);
    setPaying(false);
  };

  return (
    <div className="container-site pt-10 sm:pt-14">
      <PageTitle title="Panier" />
      {isLoading && lines.length === 0 ? (
        <div className="grid min-h-[30vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-fg-faint" />
        </div>
      ) : lines.length === 0 ? (
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.05]">
            <ShoppingBag className="h-6 w-6 text-fg-muted" />
          </span>
          <p className="font-medium">Ton panier est vide</p>
          <ButtonLink href="/web/catalogue" variant="secondary">
            Voir le catalogue
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-line rounded-card border border-line bg-ink-850">
            {lines.map((l) => (
              <li key={l.beatId} className="flex items-center gap-4 p-4 sm:p-5">
                <Cover id={l.beatId} url={l.coverUrl} title={l.title} className="h-16 w-16 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <Link href={`/web/prod/${l.beatId}`} className="block truncate text-[16px] font-medium hover:underline">
                    {l.title}
                  </Link>
                  <p className="meta mt-1">Licence {l.licenseCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono tabular-nums">{formatPrice(l.priceCents, l.currency)}</p>
                  <button type="button" onClick={() => void remove(l.beatId)} className="mt-1 text-[13px] text-fg-faint hover:text-fg">
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="card space-y-5 p-6 lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between">
              <span className="text-fg-muted">
                {lines.length} prod{lines.length > 1 ? "s" : ""}
              </span>
              <span className="text-[28px] font-semibold tracking-[-0.02em] tabular-nums">{formatPrice(totalCents, currency)}</span>
            </div>
            {(message ?? error) && <p className="rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] text-fg-muted">{message ?? error}</p>}
            <WaiverCheck checked={waiver} onChange={setWaiver} />
            <Button size="lg" className="w-full" onClick={() => void pay()} disabled={paying || !waiver}>
              {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {isAuthenticated ? "Payer" : "Continuer vers le paiement"}
            </Button>
            {!isAuthenticated && <p className="text-[13px] text-fg-muted">Tu crées ton compte (ou tu te connectes) juste avant de payer : c’est là que tes fichiers t’attendront.</p>}
            <p className="border-t border-line pt-4 text-[12px] leading-relaxed text-fg-faint">
              Paiement par carte, sécurisé par Stripe. En payant, tu acceptes les{" "}
              <Link href="/web/cgv" className="underline underline-offset-2 hover:text-fg">
                conditions de vente
              </Link>
              .
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
