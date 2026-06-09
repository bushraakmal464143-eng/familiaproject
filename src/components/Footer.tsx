import Link from "next/link";
import Logo from "@/components/Logo";
import type { SiteBranding } from "@/lib/branding";
import { SITE_NAME } from "@/lib/site";

const footerSections = [
  {
    title: "Explorar",
    links: [
      { href: "/campings", label: "Campings" },
      { href: "/glamping", label: "Glamping" },
      { href: "/autocaravanas", label: "Áreas de autocaravanas" },
      { href: "/playa", label: "Campings en la playa" },
      { href: "/mascotas", label: "Admite mascotas" },
    ],
  },
  {
    title: "Popular",
    links: [
      { href: "/electricidad", label: "Conexión eléctrica" },
      { href: "/jacuzzi", label: "Glamping con jacuzzi" },
      { href: "/parques-naturales", label: "Parques naturales" },
      { href: "/cerca", label: "Campings cerca de mí" },
    ],
  },
  {
    title: "Guías",
    links: [
      { href: "/guias/camping", label: "Guías de camping" },
      { href: "/guias/salvaje", label: "Camping salvaje" },
      { href: "/guias/hogueras", label: "Hogueras" },
      { href: "/guias/perros", label: "Camping con perro" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Sobre nosotros" },
      { href: "/publicar", label: "Publica tu camping" },
      { href: "/ayuda", label: "Centro de ayuda" },
    ],
  },
];

type FooterProps = {
  branding?: SiteBranding;
};

export default function Footer({ branding }: FooterProps) {
  const siteName = branding?.siteName ?? SITE_NAME;
  const footerText =
    branding?.footerText ??
    "Reserva campings, glamping y parques vacacionales en España.";
  return (
    <footer className="mt-auto border-t border-gray-200 bg-brand-forest-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block max-w-full">
              <Logo variant="light" branding={branding} />
            </Link>
            <p className="mt-4 text-sm text-green-100">{footerText}</p>
            {branding?.contactEmail && (
              <p className="mt-2 text-sm text-green-100">
                <a
                  href={`mailto:${branding.contactEmail}`}
                  className="hover:text-brand-sun"
                >
                  {branding.contactEmail}
                </a>
              </p>
            )}
            {branding?.contactPhone && (
              <p className="text-sm text-green-100">{branding.contactPhone}</p>
            )}
            <ul className="mt-4 space-y-1 text-sm text-green-100">
              <li>Confirmación inmediata</li>
            </ul>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-200">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-green-50 transition hover:text-brand-sun"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-green-900 pt-8 sm:flex-row">
          <p className="text-sm text-green-200">
            &copy; {new Date().getFullYear()} {siteName}. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6 text-sm text-green-100">
            <Link href="/privacidad" className="hover:text-white">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-white">
              Términos
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
