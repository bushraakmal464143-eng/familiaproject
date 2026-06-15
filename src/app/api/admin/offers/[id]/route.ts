import { NextResponse } from "next/server";
import { deleteOffer, getOfferById, upsertOffer } from "@/lib/offers-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { OfferRecord } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const offer = await getOfferById(id);
  if (!offer) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  return NextResponse.json(offer);
}

export async function PUT(request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const current = await getOfferById(id);
  if (!current) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  const body = (await request.json()) as Partial<OfferRecord>;
  const offer: OfferRecord = {
    ...current,
    ...body,
    id,
    priceFrom: Number(body.priceFrom ?? current.priceFrom),
    highlights: Array.isArray(body.highlights)
      ? body.highlights.filter(Boolean)
      : current.highlights,
    saves: body.saves != null ? Number(body.saves) : current.saves,
    featured:
      body.featured !== undefined ? Boolean(body.featured) : current.featured,
  };

  await upsertOffer(offer);
  return NextResponse.json(offer);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const removed = await deleteOffer(id);
  if (!removed) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
