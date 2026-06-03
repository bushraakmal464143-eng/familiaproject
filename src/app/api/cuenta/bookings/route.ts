import { NextResponse } from "next/server";
import { createBooking, getBookings } from "@/lib/bookings-store";
import { getOfferById } from "@/lib/offers-store";
import { getCustomerById } from "@/lib/customers-store";
import { getSessionSubject } from "@/lib/role-session";

export async function GET() {
  const customerId = await getSessionSubject("customer");
  if (!customerId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const bookings = await getBookings();
  return NextResponse.json(
    bookings
      .filter((b) => b.customerId === customerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export async function POST(request: Request) {
  const customerId = await getSessionSubject("customer");
  if (!customerId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    offerId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };

  const customer = await getCustomerById(customerId);
  const offer = await getOfferById(body.offerId ?? "");
  if (!customer || !offer || offer.status !== "active") {
    return NextResponse.json({ error: "Oferta no disponible" }, { status: 400 });
  }

  const checkIn = body.checkIn ?? "";
  const checkOut = body.checkOut ?? "";
  const guests = Math.max(1, Number(body.guests) || 1);
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "Fechas no válidas" }, { status: 400 });
  }
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const booking = await createBooking({
    offerId: offer.id,
    campingId: offer.campingId,
    customerId,
    customerName: customer.name,
    customerEmail: customer.email,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight: offer.priceFrom,
  });

  return NextResponse.json(booking, { status: 201 });
}
