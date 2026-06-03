"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type NavLink = { href: string; label: string; exact?: boolean };

type PortalShellProps = {
  children: React.ReactNode;
  title: string;
  titleAccent?: string;
  nav: NavLink[];
  loginPath: string;
  logoutApi: string;
  publicLink?: { href: string; label: string };
};

export default function PortalShell({
  children,
  title,
  titleAccent,
  nav,
  loginPath,
  logoutApi,
  publicLink,
}: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === loginPath || pathname.endsWith("/registro");

  async function logout() {
    await fetch(logoutApi, { method: "POST" });
    router.push(loginPath);
    router.refresh();
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href={nav[0]?.href ?? "/"} className="font-bold text-brand-forest">
            {title}
            {titleAccent && (
              <span className="text-brand-accent"> {titleAccent}</span>
            )}
          </Link>
          <nav className="flex flex-wrap gap-1">
            {nav.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
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
          <div className="flex items-center gap-2">
            {publicLink && (
              <Link
                href={publicLink.href}
                target="_blank"
                className="text-sm text-gray-500 hover:text-brand-accent"
              >
                {publicLink.label}
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
