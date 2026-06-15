import Image from "next/image";
import Link from "next/link";
import type { OfferRecord } from "@/lib/types";
import { cleanSubtitle } from "@/lib/clean-offer-text";

type OfferCardProps = {
  offer: OfferRecord;
  featured?: boolean;
};

export default function OfferCard({ offer, featured = false }: OfferCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${
        featured ? "lg:flex lg:min-h-[280px]" : ""
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-gray-100 ${
          featured
            ? "aspect-[16/10] min-h-[200px] lg:aspect-auto lg:min-h-[280px] lg:w-[42%]"
            : "aspect-[16/10]"
        }`}
      >
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          className="object-cover"
          sizes={featured ? "(max-width: 1024px) 100vw, 42vw" : "(max-width: 768px) 100vw, 50vw"}
        />

        {offer.badge && (
          <span className="absolute left-3 top-3 rounded bg-brand-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {offer.badge}
          </span>
        )}

        {offer.saves != null && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-medium text-gray-700 shadow">
            <span aria-hidden>♥</span> {offer.saves}
          </span>
        )}

        {offer.countdown && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
            <p className="text-xs font-semibold text-white">
              ¡Tiempo extra! {offer.countdown}
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-2/3 rounded-full bg-brand-accent" />
            </div>
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-4 sm:p-5 ${featured ? "lg:justify-between" : ""}`}>
        <div>
          <h3 className="text-base font-bold leading-snug text-gray-900 sm:text-lg">
            {offer.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{cleanSubtitle(offer.subtitle)}</p>

          <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-brand-accent" aria-hidden>
                📍
              </span>
              {offer.location}, {offer.region}
            </li>
            {offer.mealPlan && (
              <li className="flex items-start gap-2">
                <span className="text-brand-accent" aria-hidden>
                  🍽️
                </span>
                {offer.mealPlan}
              </li>
            )}
          </ul>

          <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
            {offer.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>

          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {offer.description}
          </p>

          <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <span aria-hidden>📅</span> {offer.travelDates}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4 border-t border-gray-100 pt-4">
          <Link
            href={`/ofertas/${offer.id}`}
            className="text-sm font-medium text-brand-accent hover:underline"
          >
            Ver detalles →
          </Link>
          <Link
            href={`/ofertas/${offer.id}`}
            className="shrink-0 rounded-lg bg-brand-accent px-4 py-2 text-right text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            aria-label={`Contratar ${offer.title} desde ${offer.priceFrom} euros`}
          >
            <p className="text-[10px] font-medium uppercase leading-none opacity-90">
              1 noche desde
            </p>
            <p className="text-xl font-bold leading-tight">
              {offer.priceFrom} €
              <span className="text-sm font-semibold">/pers.</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide">
              Contratar
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
