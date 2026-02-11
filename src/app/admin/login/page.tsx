"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();

      // Vérifier que l'utilisateur est admin
      if (data.user.role !== "admin") {
        throw new Error("Access denied: Admin role required");
      }

      // Stocker le token dans sessionStorage (même système que les users publics)
      if (data.tokens?.accessToken) {
        sessionStorage.setItem("access_token", data.tokens.accessToken);
      }

      // Rediriger vers le dashboard
      router.push("/admin/catalogue");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040410] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin</p>
            <h1 className="text-3xl font-semibold mt-2">Beatmakerz Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-2">Login to manage beats</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <label className="block text-sm font-medium text-zinc-200">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin@beatmakerz.fr"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-200">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500">
            <p>For admin access only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
