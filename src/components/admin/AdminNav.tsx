"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/site", label: "Web", exact: false },
  { href: "/admin/campings", label: "Campings", exact: false },
  { href: "/admin/offers", label: "Ofertas", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-brand-forest">
            {SITE_NAME} <span className="text-brand-accent">Admin</span>
          </Link>
          <nav className="flex gap-1" aria-label="Admin">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-forest text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-gray-500 hover:text-brand-accent"
          >
            Ver web →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
