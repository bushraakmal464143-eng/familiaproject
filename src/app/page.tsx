import Image from "next/image";
import Link from "next/link";
import OffersSection from "@/components/OffersSection";
import SearchForm from "@/components/SearchForm";
import { SITE_NAME } from "@/lib/site";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1920&q=80";

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

const trustPoints = ["Confirmación al instante"];

export default function HomePage() {
  return (
    <>
      {/* Hero con imagen de fondo */}
      <section className="relative min-h-[520px] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt="Tienda de campaña al atardecer en la montaña"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-forest-dark/90 via-brand-forest/75 to-brand-forest-dark/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="text-lg font-medium text-brand-sun sm:text-xl">
            Vive la aventura al aire libre
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Descubre campings, glamping y parques en toda España
          </h1>
          <p className="mt-4 max-w-xl text-lg text-green-100">
            Encuentra tu parcela perfecta entre montañas, playas y bosques.
            Reserva fácil con {SITE_NAME}.
          </p>

          <div className="mt-10 max-w-4xl rounded-xl bg-white/95 p-4 shadow-2xl backdrop-blur sm:p-6">
            <SearchForm />
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                href="/mapa"
                className="font-medium text-brand-green hover:underline"
              >
                Buscar en el mapa
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/ofertas"
                className="font-medium text-brand-green hover:underline"
              >
                Ver ofertas de última hora
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-brand-cream py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 px-4 sm:gap-10">
          {trustPoints.map((point) => (
            <span
              key={point}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <span className="text-brand-accent" aria-hidden>
                ✓
              </span>
              {point}
            </span>
          ))}
        </div>
      </section>

      <OffersSection />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Búsquedas populares</h2>
        <p className="mt-1 text-gray-600">
          Lo que más buscan los campistas este año
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularSearches.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-accent hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>
                {item.icon}
              </span>
              <span className="font-medium text-gray-800 group-hover:text-brand-accent">
                {item.label}
              </span>
            </Link>
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Parques naturales</h2>
        <p className="mt-2 max-w-2xl text-gray-600">
          Desde los Pirineos hasta Doñana: explora los espacios
          protegidos de España y reserva tu estancia en plena naturaleza.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            "Campings cerca de mí",
            "Áreas de autocaravanas",
            "Cabañas y bungalows",
          ].map((label) => (
            <Link
              key={label}
              href="/cerca"
              className="rounded-full border border-brand-green px-4 py-2 text-sm font-medium text-brand-forest transition hover:bg-brand-green hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-sand">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ¿Tienes un camping o glamping?
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Únete a {SITE_NAME} y recibe más reservas con total control de
              precios y disponibilidad. Publica tu establecimiento hoy mismo.
            </p>
          </div>
          <Link
            href="/publicar"
            className="shrink-0 rounded-lg bg-brand-accent px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Más información
          </Link>
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
