"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import type { SiteBranding } from "@/lib/branding";
import type { CurrentCustomer } from "@/lib/current-customer";
import { customerFirstName } from "@/lib/customer-display";

const navLinks = [
  { href: "/campings", label: "Campings de montaña" },
];

type HeaderProps = {
  branding?: SiteBranding;
  customer?: CurrentCustomer | null;
};

export default function Header({ branding, customer }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loginHref = `/cuenta/login?from=${encodeURIComponent(pathname || "/")}`;

  const closeMenu = () => setIsMenuOpen(false);
  const isLoggedIn = Boolean(customer);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/cuenta/logout", { method: "POST", credentials: "include" });
      closeMenu();
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      {isLoggedIn && customer && (
        <div className="border-b border-brand-accent/20 bg-orange-50">
          <div className="mx-auto max-w-7xl px-4 py-2 text-sm text-gray-800 sm:px-6 lg:px-8">
            Bienvenido,{" "}
            <span className="font-semibold text-brand-accent">
              {customerFirstName(customer.name)}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="transition opacity-90 hover:opacity-100"
          onClick={closeMenu}
        >
          <Logo branding={branding} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-brand-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/camping/login"
            className="hidden text-sm font-medium text-gray-600 hover:text-brand-accent sm:inline"
          >
            Espacio campings
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/cuenta"
                className="hidden rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:inline"
                onClick={closeMenu}
              >
                Mis reservas
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="hidden rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 sm:inline"
              >
                {loggingOut ? "Saliendo…" : "Salir"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="hidden rounded-md border border-brand-accent px-3 py-1.5 text-sm font-medium text-brand-accent transition hover:bg-orange-50 sm:inline"
                onClick={closeMenu}
              >
                Registrarse
              </Link>
              <Link
                href={loginHref}
                className="rounded-md border border-brand-green bg-brand-green px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-forest"
                onClick={closeMenu}
              >
                Iniciar sesión
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 md:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className={`${isMenuOpen ? "flex" : "hidden"} flex-col gap-2 border-t border-gray-100 px-4 py-3 md:hidden`}
        aria-label="Móvil"
      >
        {isLoggedIn && customer && (
          <p className="rounded-md bg-orange-50 px-2 py-2 text-sm text-gray-800">
            Bienvenido,{" "}
            <span className="font-semibold text-brand-accent">
              {customerFirstName(customer.name)}
            </span>
          </p>
        )}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-brand-accent"
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/camping/login"
          className="rounded-md px-2 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-brand-accent"
          onClick={closeMenu}
        >
          Espacio campings
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              href="/cuenta"
              className="rounded-md px-2 py-1 text-sm font-medium text-brand-forest transition hover:bg-gray-50"
              onClick={closeMenu}
            >
              Mis reservas
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md px-2 py-1 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {loggingOut ? "Saliendo…" : "Salir"}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="rounded-md px-2 py-1 text-sm font-medium text-brand-accent transition hover:bg-orange-50"
              onClick={closeMenu}
            >
              Registrarse
            </Link>
            <Link
              href={loginHref}
              className="rounded-md px-2 py-1 text-sm font-medium text-brand-forest transition hover:bg-gray-50"
              onClick={closeMenu}
            >
              Iniciar sesión
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
