import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PayBookingButton from "@/components/cuenta/PayBookingButton";
import { getBookingById } from "@/lib/bookings-store";
import { getOfferById } from "@/lib/offers-store";
import { getSessionSubject } from "@/lib/role-session";
import { formatBookingStatus } from "@/lib/stats";

type PagoPageProps = {
  searchParams: Promise<{ booking?: string }>;
};

export default async function PagoPage({ searchParams }: PagoPageProps) {
  const params = await searchParams;
  const bookingId = params.booking;

  if (!bookingId) {
    redirect("/cuenta/login?from=/pago");
  }

  const customerId = await getSessionSubject("customer");
  if (!customerId) {
    redirect(`/cuenta/login?from=/pago?booking=${bookingId}`);
  }

  const booking = await getBookingById(bookingId);
  if (!booking || booking.customerId !== customerId) notFound();

  const offer = await getOfferById(booking.offerId);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Pago de reserva</h1>
        <p className="mt-2 text-sm text-gray-500">
          Estado: {formatBookingStatus(booking.status)}
        </p>

        <div className="mt-6 space-y-2 text-gray-700">
          <p>
            <strong>Oferta:</strong> {offer?.title ?? booking.offerId}
          </p>
          <p>
            <strong>Fechas:</strong> {booking.checkIn} → {booking.checkOut}
          </p>
          <p>
            <strong>Personas:</strong> {booking.guests} · <strong>Noches:</strong>{" "}
            {booking.nights}
          </p>
          <p className="text-2xl font-bold text-brand-accent pt-2">
            Total: {booking.totalAmount} €
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Simulación de pago — conecta aquí Stripe o PayPal en producción.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {booking.status === "pending" ? (
            <PayBookingButton bookingId={booking.id} />
          ) : (
            <span className="rounded-md bg-brand-green/10 px-5 py-2.5 text-sm font-semibold text-brand-green">
              Pago completado
            </span>
          )}
          <Link
            href="/cuenta"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Mis reservas
          </Link>
        </div>
      </div>
    </section>
  );
}
