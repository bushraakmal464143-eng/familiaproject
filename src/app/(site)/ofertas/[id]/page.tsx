import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";
import OfferGalleryMosaic from "@/components/OfferGalleryMosaic";
import ReserveForm from "@/components/cuenta/ReserveForm";
import { getOfferById, getPublicOffers } from "@/lib/offers-store";
import { getCampingById, stripCampingSecrets } from "@/lib/campings-store";
import { getSessionSubject } from "@/lib/role-session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OfertaDetailPage({ params }: Props) {
  const { id } = await params;
  const offer = await getOfferById(id);
  const publicOffers = await getPublicOffers();
  if (!offer || !publicOffers.some((o) => o.id === id)) notFound();

  const camping = await getCampingById(offer.campingId);
  const customerId = await getSessionSubject("customer");
  const accommodationName =
    offer.accommodationName?.trim() ||
    (camping ? stripCampingSecrets(camping).name : offer.subtitle);
  const accommodationLinkText =
    offer.accommodationLinkText?.trim() || "Ver alojamiento →";
  const mapLabel = offer.mapLabel?.trim() || `${offer.location}, ${offer.region}`;
  const nightsOptions =
    offer.nightsOptions?.length ? offer.nightsOptions : [1, 2, 3, 4, 5];
  const ctaTextTemplate =
    offer.ctaText?.trim() || "Ver fechas desde {price} €/persona";
  const ctaText = ctaTextTemplate.replaceAll("{price}", String(offer.priceFrom));
  const countdownProgress =
    offer.countdownProgress != null
      ? Math.max(0, Math.min(100, offer.countdownProgress))
      : 75;

  const allImages = (() => {
    const placeholders = [
      "/offers/montana-1.svg",
      "/offers/montana-2.svg",
      "/offers/montana-3.svg",
      "/offers/montana-4.svg",
      "/offers/montana-5.svg",
    ];

    const raw = [offer.image, ...(offer.gallery ?? [])].filter(Boolean) as string[];
    const unique = raw.filter((src, idx) => raw.indexOf(src) === idx);
    const withFallbacks = [...unique, ...placeholders].filter(Boolean) as string[];
    const finalUnique = withFallbacks.filter(
      (src, idx) => withFallbacks.indexOf(src) === idx
    );
    return finalUnique;
  })();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {offer.title}
          </h1>
          {camping && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-brand-forest">
                {stripCampingSecrets(camping).name}
              </span>{" "}
              · {offer.location}, {offer.region}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ShareButton title={offer.title} />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <OfferGalleryMosaic images={allImages} title={offer.title} />

          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Descubre tu alojamiento
            </h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={allImages[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {accommodationName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {offer.location}, {offer.region}
                  </p>
                  {offer.mealPlan && (
                    <p className="mt-1 text-sm text-gray-600">{offer.mealPlan}</p>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-brand-accent">
                {accommodationLinkText}
              </span>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">¿Dónde está?</h2>
            <div className="mt-4 overflow-hidden rounded-xl bg-gray-100">
              <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                Mapa (próximamente) · {mapLabel}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              ¿Qué disfrutarás en tu escapada?
            </h2>
            <div className="mt-4 rounded-xl bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Esta oferta incluye
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {offer.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-700">{offer.description}</p>
            </div>
          </section>

          <section className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span aria-hidden className="text-xl">
              📅
            </span>
            <p className="text-sm text-gray-700">
              Fechas para viajar: <span className="font-semibold">{offer.travelDates}</span>
            </p>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-extrabold text-gray-900">
                    {offer.subtitle}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <span aria-hidden className="mr-1">
                      📍
                    </span>
                    {offer.location}
                  </p>
                  {offer.mealPlan && (
                    <p className="mt-1 text-sm text-gray-600">
                      <span aria-hidden className="mr-1">
                        🍽️
                      </span>
                      {offer.mealPlan}
                    </p>
                  )}
                </div>
                <div className="rounded-xl bg-brand-cream px-3 py-2 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Desde
                  </p>
                  <p className="text-xl font-extrabold text-brand-accent">
                    {offer.priceFrom}€
                  </p>
                  <p className="text-[11px] font-medium text-gray-600">
                    /persona
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-gray-800">
                  Duración
                </label>
                <select className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent">
                  {nightsOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "noche" : "noches"}
                    </option>
                  ))}
                </select>
              </div>

              {offer.countdown && (
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-gray-700">
                      {offer.countdown}
                    </p>
                    <span className="text-[11px] font-semibold text-gray-600">
                      {countdownProgress}%
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-brand-accent"
                      style={{ width: `${countdownProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                className="mt-5 w-full rounded-xl bg-brand-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                {ctaText}
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Precio orientativo. Confirmarás fechas y personas en el siguiente paso.
              </p>
            </div>

            {customerId ? (
              <ReserveForm offer={offer} />
            ) : (
              <div className="rounded-2xl border border-brand-accent/30 bg-orange-50 p-6">
                <p className="text-sm text-gray-800">
                  Inicia sesión para contratar y pagar esta oferta.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/cuenta/login?from=/ofertas/${offer.id}`}
                    className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/cuenta/registro"
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white"
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
