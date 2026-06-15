import type { OfferRecord } from "@/lib/types";

const ANY_DESTINATION = "cualquier destino disponible";

export function normalizeDestination(destino: string | undefined): string {
  return destino?.trim() ?? "";
}

export function isAnyDestination(destino: string): boolean {
  const normalized = destino.trim().toLowerCase();
  return !normalized || normalized === ANY_DESTINATION;
}

export function filterOffersByDestination(
  offers: OfferRecord[],
  destino: string | undefined
): OfferRecord[] {
  const query = normalizeDestination(destino);
  if (isAnyDestination(query)) return offers;

  const q = query.toLowerCase();
  return offers.filter((offer) =>
    [offer.title, offer.subtitle, offer.location, offer.region, offer.description]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

export type SearchQuery = {
  destino?: string;
  entrada?: string;
  salida?: string;
  adultos?: string;
  ninos?: string;
};

export function hasActiveSearch(params: SearchQuery): boolean {
  return Boolean(params.entrada && params.salida);
}
