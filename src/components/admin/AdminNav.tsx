"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/site", label: "Web", exact: false },
  { href: "/admin/campings", label: "Campings", exact: false },
  { href: "/admin/offers", label: "Ofertas", exact: false },
];

function linkClass(active: boolean) {
  return `rounded-md px-3 py-2 text-sm font-medium transition ${
    active
      ? "bg-brand-forest text-white"
      : "text-gray-600 hover:bg-gray-100"
  }`;
}

export default function AdminNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  async function logout() {
    closeMenu();
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.href = "/cuenta/login";
  }

  function isActive(link: (typeof links)[number]) {
    return link.exact
      ? pathname === link.href
      : pathname.startsWith(link.href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/admin"
          className="shrink-0 font-bold text-brand-forest"
          onClick={closeMenu}
        >
          {SITE_NAME} <span className="text-brand-accent">Admin</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Admin"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(isActive(link))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 md:hidden"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="admin-mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav
        id="admin-mobile-menu"
        className={`${isMenuOpen ? "flex" : "hidden"} flex-col gap-1 border-t border-gray-100 px-4 py-3 md:hidden`}
        aria-label="Admin móvil"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClass(isActive(link))}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            onClick={closeMenu}
          >
            Ver web →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-200 px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
}
