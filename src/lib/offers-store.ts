import { defaultOffers, type OfferCategory } from "@/lib/offers";
import { readJson, writeJson } from "@/lib/json-store";
import { getCampings } from "@/lib/campings-store";
import { campingIdByOfferIndex } from "@/lib/seed-data";
import type { OfferRecord, OfferStatus } from "@/lib/types";

const FILE = "offers.json";

function migrateLegacyOffer(
  raw: Record<string, unknown>,
  index: number
): OfferRecord {
  const category = (raw.category as OfferCategory) ?? "new";
  const safeCategory =
    category === "all" ? "new" : (category as Exclude<OfferCategory, "all">);
  return {
    id: String(raw.id ?? index),
    campingId:
      (raw.campingId as string) ??
      campingIdByOfferIndex[index] ??
      "camp_1",
    title: String(raw.title ?? ""),
    subtitle: String(raw.subtitle ?? ""),
    rating: Number(raw.rating) || 0,
    reviews: Number(raw.reviews) || 0,
    location: String(raw.location ?? ""),
    region: String(raw.region ?? ""),
    mealPlan: raw.mealPlan as string | undefined,
    highlights: Array.isArray(raw.highlights)
      ? (raw.highlights as string[])
      : [],
    description: String(raw.description ?? ""),
    freeCancellation: raw.freeCancellation as string | undefined,
    travelDates: String(raw.travelDates ?? ""),
    priceFrom: Number(raw.priceFrom) || 0,
    image: String(raw.image ?? "/offers/cabin-style.png"),
    gallery: raw.gallery as string[] | undefined,
    badge: raw.badge as string | undefined,
    saves: raw.saves as number | undefined,
    countdown: raw.countdown as string | undefined,
    category: safeCategory,
    status: (raw.status as OfferStatus) ?? "active",
    featured: Boolean(raw.featured),
  };
}

function buildSeedOffers(): OfferRecord[] {
  return defaultOffers.map((o, i) =>
    migrateLegacyOffer(o as unknown as Record<string, unknown>, i)
  );
}

export async function getOffers(): Promise<OfferRecord[]> {
  const raw = await readJson<unknown[]>(FILE, buildSeedOffers());
  return raw.map((item, i) =>
    migrateLegacyOffer(item as Record<string, unknown>, i)
  );
}

export async function saveOffers(offers: OfferRecord[]): Promise<void> {
  await writeJson(FILE, offers);
}

export async function getOfferById(id: string): Promise<OfferRecord | undefined> {
  const offers = await getOffers();
  return offers.find((o) => o.id === id);
}

export async function getOffersByCamping(
  campingId: string
): Promise<OfferRecord[]> {
  const offers = await getOffers();
  return offers.filter((o) => o.campingId === campingId);
}

export async function upsertOffer(offer: OfferRecord): Promise<OfferRecord> {
  const offers = await getOffers();
  const index = offers.findIndex((o) => o.id === offer.id);
  if (index >= 0) {
    offers[index] = offer;
  } else {
    offers.push(offer);
  }
  await saveOffers(offers);
  return offer;
}

export async function deleteOffer(id: string): Promise<boolean> {
  const offers = await getOffers();
  const next = offers.filter((o) => o.id !== id);
  if (next.length === offers.length) return false;
  await saveOffers(next);
  return true;
}

export function generateOfferId(existing: OfferRecord[]): string {
  const numeric = existing
    .map((o) => parseInt(o.id, 10))
    .filter((n) => !Number.isNaN(n));
  const max = numeric.length ? Math.max(...numeric) : -1;
  return String(max + 1);
}

export async function getPublicOffers(): Promise<OfferRecord[]> {
  const [offers, campings] = await Promise.all([getOffers(), getCampings()]);
  const activeCampingIds = new Set(
    campings.filter((c) => c.status === "active").map((c) => c.id)
  );
  return offers.filter(
    (o) => o.status === "active" && activeCampingIds.has(o.campingId)
  );
}
