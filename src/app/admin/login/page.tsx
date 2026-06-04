"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import LoginPageShell from "@/components/LoginPageShell";
import { SITE_NAME } from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Contraseña incorrecta");
      return;
    }

    router.push(from.startsWith("/admin") ? from : "/admin");
    router.refresh();
  }

  return (
    <LoginPageShell>
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold text-brand-forest">
          {SITE_NAME} Admin
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Panel de operaciones — campings, ofertas y ventas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-accent py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Por defecto: <code className="text-gray-500">admin123</code>
        </p>
      </div>
    </LoginPageShell>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <LoginPageShell>
          <p className="text-gray-500">Cargando…</p>
        </LoginPageShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
