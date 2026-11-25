"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchDownloadUrl, fetchOrders, type Order, type PurchasedItem } from "@/lib/services/user-api";
import { FORMAT_LABEL } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";
import { Cover } from "@/components/shop/Cover";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/web/profil?next=/web/account");
      return;
    }
    fetchOrders()
      .then(setOrders)
      .catch(() => setError("Tes achats ne se chargent pas pour le moment."));
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated)
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-fg-faint" />
      </div>
    );

  const items = (orders ?? []).flatMap((o) => o.items.map((it) => ({ order: o, item: it })));

  return (
    <div className="container-site pt-10 sm:pt-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle eyebrow="Mon compte" title={user?.displayName ? `Salut ${user.displayName}` : "Mon compte"} text={user?.email} />
        <button
          type="button"
          onClick={() => void logout().then(() => router.replace("/"))}
          className="inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-[14px] text-fg-muted hover:text-fg sm:self-auto"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>

      <section className="mt-12">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em]">Mes prods</h2>
        <p className="mt-1 text-[14px] text-fg-muted">Télécharge tes fichiers quand tu veux. Chaque lien est valable quelques minutes, un nouveau se crée à chaque clic.</p>
        <div className="mt-6">
          {error ? (
            <p className="card px-6 py-10 text-center text-fg-muted">{error}</p>
          ) : orders === null ? (
            <div className="grid min-h-[20vh] place-items-center">
              <Loader2 className="h-6 w-6 animate-spin text-fg-faint" />
            </div>
          ) : items.length === 0 ? (
            <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
              <p className="font-medium">Pas encore d’achat</p>
              <p className="text-[14px] text-fg-muted">Tes prods achetées apparaîtront ici, prêtes à télécharger.</p>
              <ButtonLink href="/web/catalogue" variant="secondary">
                Voir le catalogue
              </ButtonLink>
            </div>
          ) : (
            <ul className="divide-y divide-line rounded-card border border-line bg-ink-850">
              {items.map(({ order, item }) => (
                <Purchase key={item._id} order={order} item={item} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Purchase({ order, item }: { order: Order; item: PurchasedItem }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const files = item.files ?? ["mp3"];
  const title = item.beat?.title ?? "Prod";

  const download = async (type: string) => {
    setBusy(type);
    setError(null);
    try {
      window.location.href = await fetchDownloadUrl(order._id, item._id, type);
    } catch {
      setError("Le téléchargement ne démarre pas. Réessaie, ou écris-nous si ça continue.");
    } finally {
      setTimeout(() => setBusy(null), 1500);
    }
  };

  return (
    <li className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Cover id={item.beatId} url={item.beat?.coverUrl ?? null} title={title} genres={item.beat?.genres} className="h-14 w-14 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <Link href={`/web/prod/${item.beatId}`} className="block truncate font-medium hover:underline">
            {title}
          </Link>
          <p className="meta mt-1">
            Licence {item.license?.code ?? "—"} · {formatDate(order.createdAt)} · {formatPrice(item.unitPriceCents, order.currency)}
          </p>
          {error && <p className="mt-1 text-[13px] text-fg">{error}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        {order.status === "refunded" ? (
          <span className="text-[13px] text-fg-faint">Remboursée</span>
        ) : !item.downloadable || files.length === 0 ? (
          <span className="text-[13px] text-fg-faint">Fichiers en préparation, écris-nous si ça dure.</span>
        ) : (
          files.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => void download(f)}
              disabled={busy !== null}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] font-medium transition-colors hover:bg-fg hover:text-ink disabled:opacity-50"
            >
              {busy === f ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              {FORMAT_LABEL[f] ?? f.toUpperCase()}
            </button>
          ))
        )}
      </div>
    </li>
  );
}
