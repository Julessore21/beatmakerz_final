"use client";

// app/(web)/account/AccountClient.tsx
// Beatmakerz — Account Page (React + Tailwind + Framer Motion + lucide-react)
// Client component

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User as UserIcon,
  Music2,
  ShoppingCart,
  Settings,
  ShieldCheck,
  LogOut,
  Crown,
  Heart,
  Download,
  Bell,
  CreditCard,
  Mail,
  ArrowRight,
  ChevronRight,
  Sparkles,
  PlayCircle,
  Star,
  Info,
  X,
  ShoppingCart as CartIcon,
} from "lucide-react";

// ---------- Reusable bits ----------
const cn = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

const fadeIn: any = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.5, ease: "easeOut" },
  }),
};

const Card: React.FC<React.ComponentProps<typeof motion.div> & { hover?: boolean }> = ({
  className,
  hover = true,
  children,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={hover ? { y: -2 } : undefined}
    className={cn(
      // changements clés : overflow-hidden, transition-colors, hover:bg-…
      "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-colors",
      "hover:bg-white/[0.08]",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_10px_30px_-10px_rgba(0,0,0,0.5)]",
      className
    )}
    {...props}
  >
    {/* ❌ on supprime l’overlay absolu qui causait le noir */}
    {children}
  </motion.div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-300">
    {children}
  </span>
);

const Button: React.FC<
  React.ComponentProps<"button"> & {
    variant?: "primary" | "ghost" | "danger" | "secondary";
  }
> = ({ className, variant = "primary", children, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/60",
      variant === "primary" && "bg-indigo-600 hover:bg-indigo-500 text-white",
      variant === "secondary" && "bg-white/10 hover:bg-white/20 text-white",
      variant === "ghost" &&
        "bg-transparent hover:bg-white/10 text-zinc-200 border border-white/10",
      variant === "danger" && "bg-rose-600 hover:bg-rose-500 text-white",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
      checked ? "bg-indigo-600" : "bg-white/15"
    )}
    aria-pressed={checked}
  >
    <span
      className={cn(
        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-1"
      )}
    />
  </button>
);

// ---------- Main Page ----------
export default function AccountPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [openFavs, setOpenFavs] = React.useState(false);

  React.useEffect(() => {
    if (!currentUser) {
      router.push("/web/profil");
    }
  }, [currentUser, router]);

  // Mocked data with dynamic user info
  const user = {
    username: currentUser ?? "Utilisateur",
    email: currentUser ? `${currentUser}@beatmakerz.com` : "user@beatmakerz.com",
    plan: {
      name: "Platinum",
      badge: <Crown className="h-4 w-4" />,
      renewsAt: "2025-10-01",
      benefits: [
        "Licence Premium",
        "20 téléchargements/mois",
        "Accès prioritaire aux drops",
      ],
    },
    stats: [
      {
        label: "Beats achetés",
        value: 12,
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      { label: "Favoris", value: 34, icon: <Heart className="h-4 w-4" /> },
      {
        label: "Téléchargements",
        value: 48,
        icon: <Download className="h-4 w-4" />,
      },
    ],
    recentOrders: [
      {
        id: "#B-2034",
        title: "Nocturne Drive",
        date: "2025-08-19",
        price: "29€",
        status: "Livré",
      },
      {
        id: "#B-2033",
        title: "Neon Mirage",
        date: "2025-08-16",
        price: "49€",
        status: "Livré",
      },
      {
        id: "#B-2032",
        title: "Waves 808",
        date: "2025-08-10",
        price: "19€",
        status: "Remboursé",
      },
    ],
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#0A0A12] text-white">
      {/* Ambient animated background */}
      <AnimatedAmbient />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Header */}
        <Header user={user} onOpenFavs={() => setOpenFavs(true)} />

        {/* Modal favoris */}
        <FavsModal open={openFavs} onClose={() => setOpenFavs(false)} />

        {/* Content grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left rail */}
          <div className="space-y-6 lg:col-span-4">
            <PlanCard plan={user.plan} />
            <QuickActions />
            <NotificationsCard />
          </div>

          {/* Right content */}
          <div className="space-y-6 lg:col-span-8">
            <StatsRow stats={user.stats} />
            <OrdersTable orders={user.recentOrders} />
            <SecurityPreferences />
            <DangerZone />
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------- Sections ----------
function Header({ user, onOpenFavs }: { user: any; onOpenFavs: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();
  const { user: currentUser } = useAuth();
  const [isBeat, setIsBeat] = React.useState<boolean>(false);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!currentUser) return;
    try {
      const flag = localStorage.getItem(`isBeatmaker:${currentUser}`) === "true";
      setIsBeat(flag);
      const raw = localStorage.getItem("beatmakerProfiles");
      if (raw) {
        const profiles = JSON.parse(raw);
        setProfileImage(profiles?.[currentUser]?.image || null);
      }
    } catch {}
  }, [currentUser]);
  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <Card className="relative z-10 flex flex-col items-start gap-6 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 16 }}
            className="relative"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#0B0B14] overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-8 w-8 opacity-80" />
                )}
              </div>
            </div>
            {isBeat && (
              <span className="absolute -bottom-2 -right-2">
                <span className="peer block h-7 w-7 overflow-hidden rounded-full">
                  <img src="/img/beatmakerz.png" alt="bmz" className="h-7 w-7 object-cover" />
                </span>
                <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-black opacity-0 transition-opacity peer-hover:opacity-100">
                  beatmakerz
                </span>
              </span>
            )}
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Bonjour {user.username}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => router.push("/web/profil")}>
            <Settings className="h-4 w-4" /> Paramètres du profil
          </Button>
          <Button variant="secondary" onClick={onOpenFavs}>
            <Heart className="h-4 w-4" /> Mes favoris
          </Button>
          <Button
            variant="ghost"
            className="group"
            onClick={() => {
              logout();
              router.push("/web/profil");
            }}
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function PlanCard({ plan }: { plan: any }) {
  return (
    <Card className="bg-gradient-to-br from-white/7 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/90">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Abonnement {plan.name}</h3>
              <Pill>actif</Pill>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Renouvellement: {plan.renewsAt}
            </p>
          </div>
        </div>
        <Button className="gap-1">
          Gérer <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {plan.benefits.map((b: string, i: number) => (
          <motion.li
            key={i}
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={i}
            className="flex items-center gap-2 text-sm text-zinc-300"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" /> {b}
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

function QuickActions() {
  const router = useRouter();
  const actions = [
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Mon panier",
      sub: "Payer en 1 clic",
      onClick: () => router.push("/web/panier"),
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Moyens de paiement",
      sub: "CB, PayPal, SEPA",
      onClick: () => alert("Fonctionnalité bientôt disponible"),
    },
    {
      icon: <Music2 className="h-5 w-5" />,
      label: "Licences",
      sub: "Suivre mes licences",
      onClick: () => alert("Fonctionnalité bientôt disponible"),
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: "Téléchargements",
      sub: "Historique complet",
      onClick: () => alert("Fonctionnalité bientôt disponible"),
    },
  ];
  return (
    <Card>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-400">
        Raccourcis
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={i}
            className="flex flex-col items-start gap-1 rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"
            onClick={a.onClick}
          >
            <div className="flex items-center gap-2 text-zinc-200">
              {a.icon}
              <span className="text-sm font-medium">{a.label}</span>
            </div>
            <span className="text-xs text-zinc-400">{a.sub}</span>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}

function NotificationsCard() {
  const [marketing, setMarketing] = React.useState(true);
  const [drops, setDrops] = React.useState(true);
  const [security, setSecurity] = React.useState(true);
  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold">Notifications</h3>
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Nouveaux drops
          </div>
          <Toggle checked={drops} onChange={setDrops} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" /> Recos personnalisées
          </div>
          <Toggle checked={marketing} onChange={setMarketing} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Alertes sécurité
          </div>
          <Toggle checked={security} onChange={setSecurity} />
        </div>
      </div>
    </Card>
  );
}

function StatsRow({
  stats,
}: {
  stats: { label: string; value: number; icon: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s, i) => (
        <Card key={s.label} className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                {s.label}
              </p>
              <motion.p
                initial={{ y: 8, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                className="mt-1 text-2xl font-semibold"
              >
                {s.value}
              </motion.p>
            </div>
            <div className="rounded-xl bg-white/10 p-2">{s.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function OrdersTable({
  orders,
}: {
  orders: {
    id: string;
    title: string;
    date: string;
    price: string;
    status: string;
  }[];
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Achats récents</h3>
        <Button variant="ghost" className="gap-1 text-zinc-300">
          Voir tout <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
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
              <motion.tr
                key={o.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "border-t border-white/10",
                  i % 2 === 1 && "bg-white/[0.02]"
                )}
              >
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" /> {o.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-300">{o.date}</td>
                <td className="px-4 py-3 text-right">{o.price}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      o.status === "Livré" &&
                        "bg-emerald-500/20 text-emerald-300",
                      o.status === "Remboursé" && "bg-rose-500/20 text-rose-300"
                    )}
                  >
                    {o.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ---------- Modal Favoris ----------
function FavsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [favs, setFavs] = React.useState<number[]>([]);
  const [beatsMap, setBeatsMap] = React.useState<Record<number, any>>({});
  React.useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem("favs") || "[]";
      setFavs(JSON.parse(raw));
      const rawMap = localStorage.getItem("favs:data") || "{}";
      setBeatsMap(JSON.parse(rawMap));
    } catch {}
  }, [open]);

  const removeFav = (id: number) => {
    const arr = favs.filter((x) => x !== id);
    setFavs(arr);
    try { localStorage.setItem("favs", JSON.stringify(arr)); } catch {}
  };

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
          <button onClick={onClose} className="rounded-full border border-white/10 p-1 text-white/80 hover:bg-white/10"><X className="h-4 w-4"/></button>
        </div>
        {favs.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-400">Aucun favori pour l’instant.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {favs.map((id) => {
              const b = beatsMap[id];
              return (
                <li key={id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-xs">#{id}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{b?.name || `Beat ${id}`}</div>
                    <div className="truncate text-xs text-zinc-400">{b?.artist || "Beatmaker"} • {b?.price ? `${b.price}€` : "—"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { onClose(); router.push('/web/marketplace'); }} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">Écouter</button>
                    <button onClick={() => alert('Achat (démo)')} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-100"><CartIcon className="h-3 w-3"/> Acheter</button>
                    <button onClick={() => removeFav(id)} className="rounded-full border border-white/10 bg-white/5 p-1 hover:bg-white/10" aria-label="Supprimer"><X className="h-4 w-4"/></button>
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

function SecurityPreferences() {
  const [twoFA, setTwoFA] = React.useState(true);
  const [anonymous, setAnonymous] = React.useState(false);
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Sécurité & Préférences</h3>
        <Pill>recommandé</Pill>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 2FA activée
            </div>
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" /> Mode anonyme
            </div>
            <Toggle checked={anonymous} onChange={setAnonymous} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <Info className="h-4 w-4" /> Conseils
            </div>
            Utilise des mots de passe uniques, active les notifications de
            connexion, et configure un backup code pour éviter les blocages.
          </div>
          <div className="flex items-center gap-3">
            <Button className="flex-1">
              <ShieldCheck className="h-4 w-4" /> Gérer les appareils
            </Button>
            <Button variant="secondary" className="flex-1">
              <Settings className="h-4 w-4" /> Préférences
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DangerZone() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleExport = () => {
    alert("Export de vos données...");
  };

  const handleDelete = () => {
    if (confirm("Supprimer définitivement votre compte ?")) {
      if (typeof window !== "undefined" && user) {
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        delete users[user];
        localStorage.setItem("users", JSON.stringify(users));
      }
      logout();
      router.push("/web/profil");
    }
  };

  return (
    <Card className="border-rose-500/30">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-rose-200">Zone sensible</h3>
        <Pill>attention</Pill>
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-zinc-300">
          Sauvegarde tes données et vérifie tes licences avant toute
          suppression. Ces actions sont définitives.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleExport}>
            Exporter mes données
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <LogOut className="h-4 w-4" /> Supprimer le compte
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ---------- Background ----------
function AnimatedAmbient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2 }}
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-10rem] top-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/25 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -10, 15, 0], y: [0, 12, -8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-12rem] left-20 h-[26rem] w-[26rem] rounded-full bg-cyan-500/25 blur-[100px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.04),transparent_60%)]" />
    </div>
  );
}
