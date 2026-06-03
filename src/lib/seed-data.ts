import type { Camping, Customer } from "@/lib/types";
import { hashPassword } from "@/lib/password";

export const defaultCampings: Omit<Camping, "passwordHash">[] = [
  {
    id: "camp_1",
    name: "Camping Vidrà",
    email: "vidra@demo.campolibres",
    phone: "972 000 001",
    location: "Vidrà",
    region: "Girona, España",
    description: "Bungalows y parcelas en plena naturaleza.",
    photos: ["/offers/cabin-style.png"],
    status: "active",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "camp_2",
    name: "Camping Valle Alto",
    email: "valle@demo.campolibres",
    location: "Benasque",
    region: "Huesca, Pirineos",
    description: "Vistas a la montaña y rutas de senderismo.",
    photos: ["/offers/pirineos-2.png"],
    status: "active",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "camp_3",
    name: "Eco Glamp Sierra",
    email: "glamp@demo.campolibres",
    location: "Monachil",
    region: "Granada",
    description: "Glamping de lujo bajo las estrellas.",
    photos: ["/offers/third-offer.png"],
    status: "active",
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "camp_4",
    name: "Lago Azul Camping",
    email: "lago@demo.campolibres",
    location: "Riaño",
    region: "León, Picos de Europa",
    description: "Camping familiar junto al lago.",
    photos: ["/offers/lago-azul.png"],
    status: "active",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "camp_5",
    name: "Altura 1800 Camping",
    email: "altura@demo.campolibres",
    location: "Cerler",
    region: "Huesca",
    description: "Camping de altura para 4x4 y autocaravanas.",
    photos: ["/offers/altura-1800.png"],
    status: "pending",
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "camp_6",
    name: "Monte Verde Spa Camping",
    email: "spa@demo.campolibres",
    location: "La Molina",
    region: "Girona, Pirineos",
    description: "Wellness, spa y yoga al amanecer.",
    photos: ["/offers/monte-verde.png"],
    status: "active",
    createdAt: "2026-01-20T10:00:00.000Z",
  },
];

export function buildSeedCampings(): Camping[] {
  const demoHash = hashPassword("camping123");
  return defaultCampings.map((c) => ({
    ...c,
    passwordHash: demoHash,
  }));
}

export const defaultCustomers: Customer[] = [];

export const campingIdByOfferIndex = [
  "camp_1",
  "camp_2",
  "camp_3",
  "camp_4",
  "camp_5",
  "camp_6",
] as const;
