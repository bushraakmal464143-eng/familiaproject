import { NextResponse } from "next/server";
import {
  generateOfferId,
  getOffers,
  upsertOffer,
} from "@/lib/offers-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cleanSubtitle } from "@/lib/clean-offer-text";
import type { OfferRecord } from "@/lib/types";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const offers = await getOffers();
  return NextResponse.json(offers);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await request.json()) as Partial<OfferRecord>;
  const existing = await getOffers();

  const offer: OfferRecord = {
    id: body.id?.trim() || generateOfferId(existing),
    campingId: body.campingId?.trim() || "camp_1",
    title: body.title?.trim() ?? "",
    subtitle: cleanSubtitle(body.subtitle?.trim() ?? ""),
    location: body.location?.trim() ?? "",
    region: body.region?.trim() ?? "",
    mealPlan: body.mealPlan?.trim() || undefined,
    highlights: Array.isArray(body.highlights)
      ? body.highlights.filter(Boolean)
      : [],
    description: body.description?.trim() ?? "",
    travelDates: body.travelDates?.trim() ?? "",
    priceFrom: Number(body.priceFrom) || 0,
    image: body.image?.trim() ?? "/offers/cabin-style.png",
    badge: body.badge?.trim() || undefined,
    saves: body.saves != null ? Number(body.saves) : undefined,
    countdown: body.countdown?.trim() || undefined,
    category: body.category ?? "new",
    status: body.status ?? "active",
    featured: Boolean(body.featured),
  };

  if (!offer.title) {
    return NextResponse.json(
      { error: "El título es obligatorio" },
      { status: 400 }
    );
  }

  if (existing.some((o) => o.id === offer.id && body.id)) {
    return NextResponse.json(
      { error: "Ya existe una oferta con ese ID" },
      { status: 409 }
    );
  }

  await upsertOffer(offer);
  return NextResponse.json(offer, { status: 201 });
}
