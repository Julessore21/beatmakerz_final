"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Download,
  Crown,
  Mail,
  LogOut,
  Music2,
  Info,
  X,
  ChevronRight,
  PlayCircle,
  Sparkles,
  CreditCard,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchFavorites, fetchOrders, fetchSettings, toggleFavorite, updateSettings, type UserSettings, type FavoriteItem, type OrderItem } from "@/lib/services/user-api";
import { type AuthUser } from "@/lib/auth.service";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof motion.div>>(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("w-full h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl", className)}
    {...props}
  >
    {children}
  </motion.div>
));
Card.displayName = "Card";

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-300">{children}</span>
);

const Button: React.FC<React.ComponentProps<"button"> & { variant?: "primary" | "ghost" | "secondary" | "danger" }> = ({
  className,
  variant = "primary",
  children,
  ...props
}) => (
  <button
    className={cn(
      "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
      variant === "primary" && "text-white bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-strong)] border border-white/10",
      variant === "secondary" && "bg-white/10 hover:bg-white/20 text-white",
      variant === "ghost" && "bg-transparent hover:bg-white/10 text-zinc-200 border border-white/10",
      variant === "danger" && "bg-rose-600 hover:bg-rose-500 text-white",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!checked)} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", checked ? "bg-indigo-600" : "bg-white/15")}>
    <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white transition-transform", checked ? "translate-x-5" : "translate-x-1")} />
  </button>
);

const formatId = (id?: string) => (id ? `${id.slice(0, 8)}...${id.slice(-4)}` : "--");
const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString("fr-FR") : "");
const formatPrice = (cents?: number, currency = "EUR") => (cents != null ? `${(cents / 100).toFixed(2)} ${currency}` : "--");

export default function AccountPage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFavs, setOpenFavs] = useState(false);
  const [openModal, setOpenModal] = useState<null | "orders" | "downloads" | "notifications" | "security">(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const ordersRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const securityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    Promise.all([fetchFavorites().catch(() => []), fetchOrders().catch(() => []), fetchSettings().catch(() => null)])
      .then(([f, o, s]) => {
        setFavorites(f || []);
        setOrders(o || []);
        setSettings(s);
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  const isGuest = !authUser;

  useEffect(() => {
    if (isGuest) {
      router.replace("/web/profil");
    }
  }, [isGuest, router]);

  const displayName = (authUser as AuthUser | null)?.displayName || (authUser as AuthUser | null)?.email || "Invite";
  const email = (authUser as AuthUser | null)?.email || "";

  const stats = useMemo(
    () => [
      { label: "Beats achetes", value: orders?.length ?? 0, icon: <ShoppingCart className="h-4 w-4" /> },
      { label: "Favoris", value: favorites?.length ?? 0, icon: <Heart className="h-4 w-4" /> },
      { label: "Telechargements", value: (orders || []).reduce((acc, o) => acc + (o.items?.length || 0), 0), icon: <Download className="h-4 w-4" /> },
    ],
    [orders, favorites]
  );

  const downloads = useMemo(
    () =>
      (orders || []).flatMap((o) =>
        (o.items || []).map((it) => ({
          id: it._id || it.id,
          beatId: it.beatId,
          beatTitle: it.beat?.title || it.title,
          licenseTypeId: it.licenseTypeId,
          orderId: o._id || o.id,
          status: o.status,
          date: o.createdAt,
          expires: it.downloadExpiresAt,
          downloadUrl: it.downloadUrl,
          url: it.url,
          presignedUrl: it.presignedUrl,
          presignedKey: it.presignedKey,
          downloadGrant: it.downloadGrant,
        }))
      ),
    [orders]
  );

  const updateSettingSafely = async (patch: Partial<UserSettings>) => {
    const previous = settings;
    setSettings((prev: UserSettings | null) =>
      prev
        ? { ...prev, ...patch }
        : {
            marketingOptIn: patch.marketingOptIn ?? false,
            dropsOptIn: patch.dropsOptIn ?? false,
            securityOptIn: patch.securityOptIn ?? false,
            twoFAEnabled: patch.twoFAEnabled ?? false,
            anonymousMode: patch.anonymousMode ?? false,
          }
    );
    try {
      const next = await updateSettings(patch);
      setSettings(next);
      setSettingsError(null);
    } catch {
      setSettings(previous);
      setSettingsError("Impossible de mettre à jour tes préférences pour le moment.");
    }
  };

  const handleManageBilling = () => router.push("/web/abonnements?portal=1");

  const handleExportData = () => {
    const payload = {
      favorites,
      orders,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "beatmakerz-donnees.json";
    link.click();
    URL.revokeObjectURL(url);
    setInfoMessage("Export généré et téléchargé localement.");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Confirmer la demande de suppression ? Nous te redirigerons vers le support pour finaliser la démarche."
    );
    if (confirmed) {
      router.push("/web/contact?subject=suppression-compte");
    }
  };

  return (
    <div className="relative min-h-[100svh] bg-[#0A0A12] text-white">
      <AnimatedAmbient />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-28">
        {isGuest ? null : (
          <>
            <Header currentUserName={displayName} currentUserEmail={email} onLogout={logout} />

            {infoMessage ? (
              <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {infoMessage}
              </div>
            ) : null}
            {settingsError ? (
              <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                {settingsError}
              </div>
            ) : null}

            <section className="mt-10">
              <Card className="min-h-[260px]">
                <div className="grid items-stretch gap-6 lg:grid-cols-[1.2fr_1.8fr]">
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-700/40 via-[#0f0f1a] to-black/70 p-6 lg:p-7 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/95">
                          <Crown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold leading-tight">Abonnement Platinum</h3>
                            <Pill>actif</Pill>
                          </div>
                          <p className="text-sm text-zinc-200">Renouvellement: 2025-10-01</p>
                        </div>
                      </div>
                      <Button variant="secondary" className="shrink-0" onClick={handleManageBilling}>
                        Gerer <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-400">Avantages</p>
                      <ul className="mt-3 space-y-2 text-sm text-zinc-100">
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-300" /> Licence Premium
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-300" /> 20 telechargements/mois
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-300" /> Acces prioritaire aux drops
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Raccourcis & Statistiques</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Shortcut label="Mon panier" sub="Payer en 1 clic" icon={<ShoppingCart className="h-5 w-5" />} onClick={() => router.push("/web/panier")} />
                      <Shortcut label="Commandes" sub="Historique" icon={<Music2 className="h-5 w-5" />} onClick={() => setOpenModal("orders")} />
                      <Shortcut label="Paiements" sub="CB, PayPal" icon={<CreditCard className="h-5 w-5" />} onClick={() => alert("Bientot dispo")} />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {stats.map((s) => (
                        <motion.button
                          key={s.label}
                          className={cn(
                            "h-full rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:border-indigo-300/40 flex flex-col justify-between min-h-[110px]",
                            s.label === "Favoris" && "cursor-pointer"
                          )}
                          onClick={() => {
                            if (s.label === "Favoris") setOpenFavs(true);
                            if (s.label === "Beats achetes") setOpenModal("orders");
                            if (s.label === "Telechargements") setOpenModal("downloads");
                          }}
                        >
                          <p className="text-xs uppercase tracking-wider text-zinc-400">{s.label}</p>
                          <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
                            {s.value} <span className="rounded-lg bg-white/10 p-1">{s.icon}</span>
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            <section className="mt-10">
              <Card ref={ordersRef}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Achats recents</h3>
                  <Button variant="ghost" onClick={() => setOpenModal("orders")}>
                    Voir tout <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Commande</th>
                        <th className="px-4 py-3 text-left font-medium">Titre</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-right font-medium">Prix</th>
                        <th className="px-4 py-3 text-right font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o, i) => (
                        <tr key={o._id || o.id || i} className="border-t border-white/10 align-top">
                          <td className="px-4 py-3 font-medium">{formatId(o._id || o.id)}</td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              {(o.items || []).map((it, idx) => {
                                const title = it.beat?.title || it.title || it.beatId || "Beat";
                                const license = it.licenseType?.code || it.licenseTypeId || "Licence";
                                const dl = it.downloadUrl || it.url || it.presignedUrl || it.presignedKey || it.downloadGrant?.url;
                                return (
                                  <div key={it._id || it.id || idx} className="flex items-center gap-2 text-sm text-white/90">
                                    <PlayCircle className="h-4 w-4 text-white/60" />
                                    <span className="truncate font-semibold">{title}</span>
                                    <span className="text-xs text-zinc-400">({license})</span>
                                    {dl ? (
                                      <a
                                        href={dl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-auto rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                                      >
                                        Télécharger
                                      </a>
                                    ) : (
                                      <span className="ml-auto text-xs text-zinc-500">Pas de lien</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-300">{formatDate(o.createdAt)}</td>
                          <td className="px-4 py-3 text-right">{formatPrice(o.totalCents, o.currency)}</td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                o.status === "paid" && "bg-emerald-500/20 text-emerald-300",
                                o.status === "refunded" && "bg-rose-500/20 text-rose-300",
                                o.status === "pending" && "bg-amber-500/20 text-amber-300"
                              )}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            <section className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
              <Card ref={notificationsRef} className="lg:col-span-1">
                <h3 className="mb-4 text-base font-semibold">Notifications</h3>
                <div className="space-y-3 text-sm">
                  <ToggleRow label="Nouveaux drops" checked={settings?.dropsOptIn ?? true} onChange={(v) => updateSettingSafely({ dropsOptIn: v })} />
                  <ToggleRow label="Recommandations" checked={settings?.marketingOptIn ?? true} onChange={(v) => updateSettingSafely({ marketingOptIn: v })} />
                  <ToggleRow label="Alertes securite" checked={settings?.securityOptIn ?? true} onChange={(v) => updateSettingSafely({ securityOptIn: v })} />
                </div>
              </Card>

              <Card ref={securityRef} className="h-full lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Securite & preferences</h3>
                  <Pill>recommande</Pill>
                </div>
                <div className="space-y-3 text-sm">
                  <ToggleRow label="2FA active" checked={settings?.twoFAEnabled ?? true} onChange={(v) => updateSettingSafely({ twoFAEnabled: v })} />
                  <ToggleRow label="Mode anonyme" checked={settings?.anonymousMode ?? false} onChange={(v) => updateSettingSafely({ anonymousMode: v })} />
                  <div className="rounded-xl bg-white/5 p-3 text-zinc-300">
                    <div className="mb-2 flex items-center gap-2 font-medium">
                      <Info className="h-4 w-4" /> Conseils
                    </div>
                    Utilise des mots de passe uniques, active les notifications de connexion, et garde des codes de secours.
                  </div>
                </div>
              </Card>
            </section>

            <section className="mt-10">
              <Card className="border-rose-500/30">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-rose-200">Zone sensible</h3>
                  <Pill>attention</Pill>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-2xl text-sm text-zinc-300">Sauvegarde tes donnees et verifie tes licences avant toute suppression. Ces actions sont definitives.</p>
                  <div className="flex gap-3 max-sm:flex-col">
                    <Button variant="ghost" onClick={handleExportData}>
                      Exporter mes donnees
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                      <LogOut className="h-4 w-4" /> Supprimer le compte
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            <FavsModal
              open={openFavs}
              onClose={() => setOpenFavs(false)}
              favorites={favorites}
              onRefresh={() => fetchFavorites().then(setFavorites).catch(() => {})}
            />

            <InfoModal
              open={openModal === "orders"}
              onClose={() => setOpenModal(null)}
              title="Commandes & telechargements"
              actionLabel="Voir mes commandes"
              onAction={() => {
                setOpenModal(null);
                ordersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="mt-3 space-y-2">
                {(orders || []).slice(0, 5).map((o) => (
                  <div key={o._id || o.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Commande {formatId(o._id || o.id)}</span>
                      <span className="text-xs uppercase text-zinc-400">{o.status}</span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-300">
                      {formatDate(o.createdAt)} · {formatPrice(o.totalCents, o.currency)}
                    </div>
                    <div className="mt-2 space-y-1">
                      {(o.items || []).map((it: any, idx: number) => {
                        const title = it.beat?.title || it.title || it.beatId || "Beat";
                        const license = it.licenseType?.code || it.licenseTypeId || "Licence";
                        const dl = it.downloadUrl || it.url || it.presignedUrl || it.presignedKey || it.downloadGrant?.url;
                        return (
                          <div key={it._id || it.id || idx} className="flex items-center gap-2 text-xs text-white/90">
                            <PlayCircle className="h-3 w-3 text-white/60" />
                            <span className="truncate font-semibold">{title}</span>
                            <span className="text-[11px] text-zinc-400">({license})</span>
                            {dl ? (
                              <a
                                href={dl}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-auto rounded-full border border-white/10 bg-white/10 px-2 py-1 hover:bg-white/20"
                              >
                                Télécharger
                              </a>
                            ) : (
                              <span className="ml-auto text-[11px] text-zinc-500">Pas de lien</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {(orders || []).length === 0 && <p className="text-sm text-zinc-400">Aucune commande pour le moment.</p>}
              </div>
            </InfoModal>

            <InfoModal
              open={openModal === "downloads"}
              onClose={() => setOpenModal(null)}
              title="Telechargements"
              actionLabel="Aller a l&#39;historique"
              onAction={() => {
                setOpenModal(null);
                ordersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="mt-3 space-y-2">
                {downloads.slice(0, 6).map((d) => {
                  const _d = d as typeof d & { downloadUrl?: string; url?: string; presignedUrl?: string; presignedKey?: string; downloadGrant?: { url?: string } };
                  const dl = _d.downloadUrl || _d.url || _d.presignedUrl || _d.presignedKey || _d.downloadGrant?.url;
                  return (
                    <div key={d.id || `${d.orderId}-${d.beatId}`} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{d.beatTitle || `Beat ${formatId(d.beatId)}`}</span>
                        <span className="text-xs uppercase text-zinc-400">{d.status}</span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-300">Commande {formatId(d.orderId)}</div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {formatDate(d.date)} {d.expires ? `· expire le ${formatDate(d.expires)}` : ""}
                      </div>
                      <div className="mt-2">
                        {dl ? (
                          <a
                            href={dl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                          >
                            Télécharger
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-500">Lien non disponible</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {downloads.length === 0 && <p className="text-sm text-zinc-400">Aucun telechargement disponible.</p>}
              </div>
            </InfoModal>

            <InfoModal
              open={openModal === "notifications"}
              onClose={() => setOpenModal(null)}
              title="Notifications"
              actionLabel="Gerer mes notifications"
              onAction={() => {
                setOpenModal(null);
                notificationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Active ou desactive les drops, recommandations et alertes de securite.
            </InfoModal>

            <InfoModal
              open={openModal === "security"}
              onClose={() => setOpenModal(null)}
              title="Securite & confidentialite"
              actionLabel="Aller a la section securite"
              onAction={() => {
                setOpenModal(null);
                securityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Active la 2FA, ajuste le mode anonyme et securise tes appareils.
            </InfoModal>
          </>
        )}
      </main>

      {loading && !isGuest && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-sm text-white">Chargement...</div>}
    </div>
  );
}

function Header({
  currentUserName,
  currentUserEmail,
  onLogout,
}: {
  currentUserName: string;
  currentUserEmail: string;
  onLogout: () => Promise<void>;
}) {
  const router = useRouter();
  return (
    <Card className="flex flex-col items-start gap-4 bg-white/5 sm:flex-row sm:items-center sm:justify-between min-h-[120px]">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#0B0B14]">
            <User className="h-8 w-8 opacity-80" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bonjour {currentUserName}</h1>
          {currentUserEmail && (
            <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="h-4 w-4" /> {currentUserEmail}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          onClick={async () => {
            await onLogout();
            router.push("/web/profil");
          }}
        >
          <LogOut className="h-4 w-4" /> Se deconnecter
        </Button>
      </div>
    </Card>
  );
}

function Shortcut({ label, sub, icon, onClick }: { label: string; sub: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="flex h-full w-full flex-col items-start gap-1 rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10 min-h-[120px]"
    >
      <div className="flex items-center gap-2 text-white">
        {icon} <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-xs text-zinc-400">{sub}</span>
    </motion.button>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
      <span>{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function FavsModal({ open, onClose, favorites, onRefresh }: { open: boolean; onClose: () => void; favorites: FavoriteItem[]; onRefresh: () => void }) {
  const router = useRouter();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-[min(720px,94vw)] max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f14]/90 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Mes favoris</h3>
          <button onClick={onClose} className="rounded-full border border-white/10 p-1 text-white/80 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        {favorites.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-400">Aucun favori pour l&#39;instant.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {favorites.map((fav) => {
              const id = fav.beatId;
              const b = fav.beat;
              const title = b?.title || `Beat ${formatId(id)}`;
              const _b = b as typeof b & { artist?: string; artistName?: string };
              const artist = _b?.artist || _b?.artistName || "Beatmaker";
              return (
                <li key={fav.id || fav._id || id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 px-2 text-xs text-center truncate">
                    {title}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{title}</div>
                    <div className="truncate text-xs text-zinc-400">{artist}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        router.push("/web/marketplace");
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      Ecouter
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        router.push("/web/panier");
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-100"
                    >
                      <ShoppingCart className="h-3 w-3" /> Acheter
                    </button>
                    <button
                      onClick={() => toggleFavorite(id).then(onRefresh).catch(() => {})}
                      className="rounded-full border border-white/10 bg-white/5 p-1 hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

function InfoModal({
  open,
  onClose,
  title,
  children,
  actionLabel,
  onAction,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-[min(560px,94vw)] rounded-2xl border border-white/10 bg-[#0f0f14]/90 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-full border border-white/10 p-1 text-white/80 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 text-sm text-zinc-300">{children}</div>
        {actionLabel && onAction && (
          <div className="mt-4">
            <Button variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function AnimatedAmbient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1.2 }} className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <motion.div animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute right-[-10rem] top-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/25 blur-[100px]" />
      <motion.div animate={{ x: [0, -10, 15, 0], y: [0, 12, -8, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-12rem] left-20 h-[26rem] w-[26rem] rounded-full bg-cyan-500/25 blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.04),transparent_60%)]" />
    </div>
  );
}
