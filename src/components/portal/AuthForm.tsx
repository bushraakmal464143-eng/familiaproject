"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

type AuthFormProps = {
  title: string;
  subtitle: string;
  apiPath: string;
  registerPath?: string;
  registerLabel?: string;
  fields: "login" | "register-camping" | "register-customer";
};

function AuthFormInner({
  title,
  subtitle,
  apiPath,
  registerPath,
  registerLabel,
  fields,
}: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const body: Record<string, string> = { email, password };
    if (fields === "register-customer") body.name = name;
    if (fields === "register-camping") {
      body.name = name;
      body.phone = phone;
      body.location = location;
      body.region = region;
      body.description = description;
    }

    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Error al iniciar sesión");
      return;
    }

    router.push(from);
    router.refresh();
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green";

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold text-brand-forest">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {(fields === "register-camping" || fields === "register-customer") && (
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre</label>
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {fields === "register-camping" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Localidad</label>
                <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Región</label>
                <input className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea className={`${inputClass} min-h-[80px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-accent py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Espera…" : fields === "login" ? "Entrar" : "Registrarse"}
          </button>
        </form>

        {registerPath && fields === "login" && (
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href={registerPath} className="font-medium text-brand-accent hover:underline">
              {registerLabel}
            </Link>
          </p>
        )}
        {fields !== "login" && (
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href={apiPath.includes("camping") ? "/camping/login" : "/cuenta/login"} className="font-medium text-brand-accent hover:underline">
              Iniciar sesión
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthForm(props: AuthFormProps) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando…</div>}>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
