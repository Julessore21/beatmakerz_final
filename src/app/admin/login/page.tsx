"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginSchema, type AdminLoginInput } from "@/schemas/forms/adminLoginSchema";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminLoginInput>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof AdminLoginInput, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    const result = adminLoginSchema.safeParse(updated);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setFieldErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = adminLoginSchema.safeParse(formData);
    if (!result.success) {
      const errs: Partial<Record<keyof AdminLoginInput, string>> = {};
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof AdminLoginInput;
        if (key && !errs[key]) errs[key] = i.message;
      });
      setFieldErrors(errs);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json() as { user?: { role?: string }; tokens?: { accessToken?: string } };

      if (data.user?.role !== "admin") {
        throw new Error("Access denied: Admin role required");
      }

      if (data.tokens?.accessToken) {
        sessionStorage.setItem("access_token", data.tokens.accessToken);
      }

      router.push("/admin/catalogue");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Login failed");
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

          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin@beatmakerz.fr"
              />
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
            </div>

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
