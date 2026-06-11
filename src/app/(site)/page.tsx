import Image from "next/image";
import Link from "next/link";
import CampingContactCTA from "@/components/CampingContactCTA";
import OffersSection from "@/components/OffersSection";
import SearchForm from "@/components/SearchForm";
import { getPublicOffers } from "@/lib/offers-store";
import { getSiteSettings } from "@/lib/site-settings-store";

const popularSearches = [
  { href: "/destinos", label: "Destinos destacados", icon: "🗺️" },
  { href: "/electricidad", label: "Conexión eléctrica", icon: "⚡" },
  { href: "/playa", label: "Campings junto al mar", icon: "🏖️" },
  { href: "/jacuzzi", label: "Glamping con jacuzzi", icon: "🛁" },
];

const features = [
  { href: "/bar", label: "Bar o restaurante", icon: "🍺" },
  { href: "/piscina", label: "Piscina", icon: "🏊" },
  { href: "/parque-infantil", label: "Parque infantil", icon: "🎠" },
  { href: "/wifi", label: "Wi-Fi en el recinto", icon: "📶" },
];

export default async function HomePage() {
  const [offers, settings] = await Promise.all([
    getPublicOffers(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="relative min-h-[50vh] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={settings.heroImageUrl}
            alt="Tienda de campaña al atardecer en la montaña"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-forest-dark/55" />
        </div>

        <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="w-full rounded-xl border border-white/20 bg-brand-forest/65 p-5 shadow-xl backdrop-blur-sm sm:p-7">
            <h1 className="text-xl font-bold leading-tight sm:text-3xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-2 text-sm text-green-100">
              {settings.heroSubtitle}
            </p>
            <div className="mt-4 rounded-lg bg-white p-2 sm:p-3">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-brand-cream py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 px-4 sm:gap-10">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-brand-accent" aria-hidden>
              ✓
            </span>
            {settings.trustPoint}
          </span>
        </div>
      </section>

      <OffersSection
        initialOffers={offers}
        heading={settings.offersHeading}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Búsquedas populares</h2>
        <p className="mt-1 text-gray-600">
          Lo que más buscan los campistas este año
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularSearches.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <span className="text-3xl" aria-hidden>
                {item.icon}
              </span>
              <span className="font-medium text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Servicios más solicitados
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition hover:ring-2 hover:ring-brand-accent/40"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    

      <section className="bg-brand-sand">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ¿Tienes un camping o glamping?
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Únete ofertasdecamping.com y recibe más reservas con total control
              de precios y disponibilidad. Publica tu establecimiento hoy mismo.
            </p>
          </div>
          <CampingContactCTA />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Guías y consejos</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Guía para principiantes",
              desc: "Todo lo que necesitas saber antes de tu primera noche bajo las estrellas.",
              href: "/guias/camping",
            },
            {
              title: "Camping salvaje en España",
              desc: "Normas, consejos de seguridad y los mejores rincones legales.",
              href: "/guias/salvaje",
            },
            {
              title: "Viajar con tu mascota",
              desc: "Campings que admiten perros y cómo preparar el viaje.",
              href: "/guias/perros",
            },
          ].map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-xl border border-gray-200 p-6 transition hover:border-brand-accent hover:shadow-md"
            >
              <h3 className="font-semibold text-brand-forest">{guide.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{guide.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-brand-accent">
                Leer más →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
