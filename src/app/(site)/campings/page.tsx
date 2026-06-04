import OffersSection from "@/components/OffersSection";
import { getPublicOffers } from "@/lib/offers-store";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: `Campings de montaña | ${SITE_NAME}`,
  description:
    "Ofertas en campings de montaña: Pirineos, Picos de Europa, Sierra Nevada y más.",
};

export default async function CampingsMontanaPage() {
  const offers = await getPublicOffers();

  return (
    <>
      <section className="border-b border-brand-forest/20 bg-brand-forest px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Campings de montaña
          </h1>
          <p className="mt-3 max-w-2xl text-green-100">
            Bungalows, parcelas y glamping con vistas a la montaña. Reserva con
            confirmación al instante en {SITE_NAME}.
          </p>
        </div>
      </section>
      <OffersSection initialOffers={offers} heading="offer da montana" />
    </>
  );
}
