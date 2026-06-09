import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReserveForm from "@/components/cuenta/ReserveForm";
import { getOfferById, getPublicOffers } from "@/lib/offers-store";
import { getCampingById, stripCampingSecrets } from "@/lib/campings-store";
import { getSessionSubject } from "@/lib/role-session";

type Props = { params: Promise<{ id: string }> };

export default async function OfertaDetailPage({ params }: Props) {
  const { id } = await params;
  const offer = await getOfferById(id);
  const publicOffers = await getPublicOffers();
  if (!offer || !publicOffers.some((o) => o.id === id)) notFound();

  const camping = await getCampingById(offer.campingId);
  const customerId = await getSessionSubject("customer");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {camping && camping.photos.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {camping.photos.slice(0, 4).map((photo) => (
                <div key={photo} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image src={photo} alt="" fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{offer.title}</h1>
          {camping && (
            <p className="mt-2 text-sm text-brand-forest">
              {stripCampingSecrets(camping).name} · {offer.location},{" "}
              {offer.region}
            </p>
          )}
          <p className="mt-4 text-gray-700">{offer.description}</p>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            {offer.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
          <p className="mt-6 text-3xl font-bold text-brand-accent">
            {offer.priceFrom} €
            <span className="text-base font-normal text-gray-500"> /pers./noche</span>
          </p>

          {customerId ? (
            <div className="mt-8">
              <ReserveForm offer={offer} />
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-brand-accent/30 bg-orange-50 p-6">
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
      </div>
    </div>
  );
}
