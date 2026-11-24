"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Lock, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Cover } from "./Cover";
import { WaiverCheck } from "./WaiverCheck";

/** Le panier, glissé depuis la droite : ce qu'on achète, le total, le paiement. */
export function CartDrawer() {
  const { isOpen, close, lines, totalCents, currency, remove, checkout, error } = useCart();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [waiver, setWaiver] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setMessage(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  const pay = async () => {
    setPaying(true);
    const r = await checkout();
    if (r === "login") {
      close();
      router.push("/web/profil?next=/web/panier&raison=paiement");
    } else if (r) setMessage(r);
    setPaying(false);
  };

  return (
    // Fermé : invisible et inerte (ni lu, ni atteint au clavier), après la fin de la glissade.
    <div
      className={isOpen ? "fixed inset-0 z-50" : "pointer-events-none fixed inset-0 z-50"}
      aria-hidden={!isOpen}
      inert={!isOpen}
      style={{ visibility: isOpen ? "visible" : "hidden", transition: `visibility 0s linear ${isOpen ? "0s" : "300ms"}` }}
    >
      <div onClick={close} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-ink-850 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <p className="text-[15px] font-semibold">Panier {lines.length > 0 && <span className="meta ml-1">{lines.length}</span>}</p>
          <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-fg-muted hover:bg-white/[0.06] hover:text-fg" aria-label="Fermer le panier">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.05]">
              <ShoppingBag className="h-6 w-6 text-fg-muted" />
            </span>
            <div>
              <p className="font-medium">Ton panier est vide</p>
              <p className="mt-1 text-[14px] text-fg-muted">Écoute le catalogue et ajoute les prods qui te parlent.</p>
            </div>
            <ButtonLink href="/web/catalogue" variant="secondary" onClick={close}>
              Voir le catalogue
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.beatId} className="flex items-center gap-3 py-4">
                  <Cover id={l.beatId} url={l.coverUrl} title={l.title} className="h-14 w-14 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/web/prod/${l.beatId}`} onClick={close} className="block truncate font-medium hover:underline">
                      {l.title}
                    </Link>
                    <p className="meta mt-0.5">Licence {l.licenseCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[14px] tabular-nums">{formatPrice(l.priceCents, l.currency)}</p>
                    <button type="button" onClick={() => void remove(l.beatId)} className="mt-0.5 text-[12px] text-fg-faint hover:text-fg">
                      Retirer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-line p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-fg-muted">Total</span>
                <span className="text-[22px] font-semibold tracking-[-0.02em] tabular-nums">{formatPrice(totalCents, currency)}</span>
              </div>
              {(message ?? error) && <p className="rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] text-fg-muted">{message ?? error}</p>}
              <WaiverCheck checked={waiver} onChange={setWaiver} />
              <Button size="lg" className="w-full" onClick={() => void pay()} disabled={paying || !waiver}>
                {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Payer
              </Button>
              <p className="text-center text-[12px] leading-relaxed text-fg-faint">
                Paiement sécurisé par Stripe. Tes fichiers sont à télécharger dans ton compte dès le paiement reçu.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
