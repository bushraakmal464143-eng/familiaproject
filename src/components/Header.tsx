"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/campings", label: "Campings de montaña" },
  { href: "/contacto", label: "Contacta con nosotros" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="transition opacity-90 hover:opacity-100"
          onClick={closeMenu}
        >
          <Logo />
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
          <Link
            href="/cuenta"
            className="rounded-md border border-brand-green bg-brand-green px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-forest"
            onClick={closeMenu}
          >
            Iniciar sesión
          </Link>
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
          className="rounded-md px-2 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-brand-accent sm:hidden"
          onClick={closeMenu}
        >
          Espacio campings
        </Link>
      </nav>
    </header>
  );
}
