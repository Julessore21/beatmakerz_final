"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Heart, Loader2, LogOut, Mail, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchDownloadUrl,
  fetchFavorites,
  fetchOrders,
  fetchSettings,
  toggleFavorite,
  updateSettings,
  type FavoriteItem,
  type Order,
  type UserSettings,
} from "@/lib/services/user-api";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import { PageShell } from "@/components/ui/page";
import { cn } from "@/lib/cn";

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString("fr-FR") : "");
const formatPrice = (cents: number, currency = "EUR") =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency });

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/web/profil?mode=login&next=/web/account");
      return;
    }
    setLoading(true);
    Promise.all([fetchOrders().catch(() => []), fetchFavorites().catch(() => []), fetchSettings().catch(() => null)])
      .then(([o, f, s]) => {
        setOrders(o);
        setFavorites(f);
        setSettings(s);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (!user) return null;

  const purchases = orders.flatMap((order) => order.items.map((item) => ({ ...item, order })));

  const handleDownload = async (orderId: string, itemId: string) => {
    setDownloadingId(itemId);
    setNotice(null);
    try {
      // Lien signé : le navigateur télécharge directement le fichier (Content-Disposition)
      window.location.href = await fetchDownloadUrl(orderId, itemId);
    } catch {
      setNotice({ tone: "error", text: "Fichier indisponible pour le moment. Contacte-nous si le problème persiste." });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRemoveFavorite = async (beatId: string) => {
    setFavorites((prev) => prev.filter((f) => f.beatId !== beatId));
    await toggleFavorite(beatId).catch(() => fetchFavorites().then(setFavorites));
  };

  const handleSetting = async (patch: Partial<UserSettings>) => {
    const previous = settings;
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
    try {
      setSettings(await updateSettings(patch));
    } catch {
      setSettings(previous);
      setNotice({ tone: "error", text: "Impossible d'enregistrer tes préférences pour le moment." });
    }
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify({ orders, favorites, settings, exportedAt: new Date().toISOString() }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "beatmakerz-donnees.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell>
      {/* En-tête */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-brand-lavender">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Bonjour {user.displayName || user.email}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            router.push("/web/profil");
          }}
        >
          <LogOut className="h-4 w-4" /> Se déconnecter
        </Button>
      </Card>

      {notice && (
        <p
          className={cn(
            "mt-4 rounded-xl border px-4 py-3 text-sm",
            notice.tone === "error"
              ? "border-rose-400/40 bg-rose-500/10 text-rose-100"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
          )}
        >
          {notice.text}
        </p>
      )}

      {/* Achats */}
      <Card id="achats" className="mt-8 scroll-mt-28">
        <div className="mb-4 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-brand-lavender" />
          <h2 className="text-base font-semibold">Mes achats</h2>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </p>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-start gap-3 text-sm text-zinc-400">
            <p>Tu n’as encore acheté aucun beat.</p>
            <ButtonLink href="/web/catalogue" size="sm">
              Découvrir le catalogue
            </ButtonLink>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {purchases.map((item) => (
              <li key={item._id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.beat?.title ?? "Beat"}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                    <Badge>{item.license?.code ?? "Licence"}</Badge>
                    {formatDate(item.order.createdAt)} · {formatPrice(item.unitPriceCents, item.order.currency)}
                  </p>
                </div>
                {item.downloadable ? (
                  <Button size="sm" onClick={() => handleDownload(item.order._id, item._id)} disabled={downloadingId === item._id}>
                    {downloadingId === item._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Télécharger
                  </Button>
                ) : (
                  <Badge className="self-start sm:self-auto">Remboursé</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Favoris */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-brand-lavender" />
            <h2 className="text-base font-semibold">Mes favoris</h2>
          </div>
          {favorites.length === 0 ? (
            <p className="text-sm text-zinc-400">Aucun favori pour l’instant. Clique sur le cœur d’un beat pour le retrouver ici.</p>
          ) : (
            <ul className="space-y-2">
              {favorites.map((fav) => (
                <li
                  key={fav.beatId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
                >
                  <span className="truncate text-sm font-medium">{fav.beat?.title ?? "Beat"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFavorite(fav.beatId)}
                    aria-label="Retirer des favoris"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Préférences */}
        <Card>
          <h2 className="mb-4 text-base font-semibold">Préférences e-mail</h2>
          <div className="space-y-3 text-sm">
            <ToggleRow
              label="Nouveaux beats et drops"
              checked={settings?.dropsOptIn ?? false}
              disabled={!settings}
              onChange={(v) => handleSetting({ dropsOptIn: v })}
            />
            <ToggleRow
              label="Offres et recommandations"
              checked={settings?.marketingOptIn ?? false}
              disabled={!settings}
              onChange={(v) => handleSetting({ marketingOptIn: v })}
            />
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-sm font-semibold">Mes données</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Conformément au RGPD, tu peux exporter tes données ou demander la suppression de ton compte.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleExportData}>
                Exporter mes données
              </Button>
              <ButtonLink href="/web/contact?subject=suppression-compte" variant="ghost" size="sm" className="text-rose-300">
                Supprimer mon compte
              </ButtonLink>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

function ToggleRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-3 py-2.5">
      <span className="text-zinc-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
          checked ? "bg-brand" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}
