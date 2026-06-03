import type { OfferRecord } from "@/lib/types";

export type OfferCategory = "all" | "new" | "bestseller" | "coming";

/** @deprecated Use OfferRecord from @/lib/types */
export type Offer = OfferRecord;

export const offerTabs: { id: OfferCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "new", label: "Novedades" },
  { id: "bestseller", label: "Más vendidos" },
  { id: "coming", label: "Próximamente a la venta" },
];

/** Seed data; migration in offers-store adds campingId and status */
export const defaultOffers = [
  {
    id: "0",
    title: "Oferta especial en bungalow en Camping Vidrà",
    subtitle: "Camping Vidrà ★★★★",
    rating: 8.8,
    reviews: 173,
    location: "Vidrà",
    region: "Girona, España",
    mealPlan: "Bungalow completo",
    highlights: ["Bungalow equipado", "Entorno de montaña", "Ideal para familias"],
    description:
      "Escapada en bungalow en plena naturaleza de Vidrà, con acceso rápido a rutas y pueblos con encanto.",
    freeCancellation: "Cancelación GRATIS hasta 7 días antes",
    travelDates: "Disponible todo el año 2026",
    priceFrom: 30,
    image: "/offers/cabin-style.png",
    badge: "Oferta en bungalow",
    saves: 244,
    countdown: "Quedan 5 días",
    category: "new",
    featured: true,
  },
  {
    id: "1",
    title: "Desconexión en los Pirineos con vistas a la montaña",
    subtitle: "Camping Valle Alto ★★★★",
    rating: 8.6,
    reviews: 412,
    location: "Benasque",
    region: "Huesca, Pirineos",
    mealPlan: "Media pensión opcional",
    highlights: ["15% dto. en actividades de montaña", "Parcelas con sombra"],
    description:
      "Parcelas amplias, duchas calientes y acceso directo a rutas de senderismo. Incluye parking y Wi‑Fi en zonas comunes.",
    freeCancellation: "Cancelación GRATIS hasta 7 días antes",
    travelDates: "Válido del 15 jun al 30 sep 2026",
    priceFrom: 32,
    image: "/offers/pirineos-2.png",
    badge: "Chollo destacado del día",
    saves: 284,
    countdown: "Quedan 4 días 7 horas",
    category: "bestseller",
  },
  {
    id: "2",
    title: "Glamping bajo las estrellas en Sierra Nevada",
    subtitle: "Eco Glamp Sierra ★★★★★",
    rating: 9.1,
    reviews: 198,
    location: "Monachil",
    region: "Granada",
    mealPlan: "Desayuno incluido",
    highlights: ["Jacuzzi privado", "Cena romántica opcional"],
    description:
      "Tiendas de lujo con calefacción, terraza privada y vistas al valle. Perfecto para parejas.",
    freeCancellation: "Cancelación GRATIS hasta 5 días antes",
    travelDates: "Válido todo el verano 2026",
    priceFrom: 89,
    image: "/offers/third-offer.png",
    saves: 156,
    category: "new",
  },
  {
    id: "3",
    title: "Camping familiar junto al lago de montaña",
    subtitle: "Lago Azul Camping ★★★",
    rating: 8.2,
    reviews: 620,
    location: "Riaño",
    region: "León, Picos de Europa",
    highlights: ["Parque infantil", "Alquiler de kayaks"],
    description:
      "Parcelas junto al agua, zona de barbacoa y animación infantil los fines de semana.",
    travelDates: "Del 1 jul al 31 ago 2026",
    priceFrom: 28,
    image: "/offers/lago-azul.png",
    saves: 91,
    category: "bestseller",
  },
  {
    id: "4",
    title: "Ruta 4x4 y pernocta en camping de altura",
    subtitle: "Altura 1800 Camping ★★★★",
    rating: 8.4,
    reviews: 87,
    location: "Cerler",
    region: "Huesca",
    mealPlan: "Sin comidas",
    highlights: ["Admite mascotas", "Zona de fuego controlada"],
    description:
      "Ideal para autocaravanas y tiendas de montaña. Conexión eléctrica en parcela premium.",
    freeCancellation: "Cancelación GRATIS hasta 10 días antes",
    travelDates: "Próxima apertura: mayo 2026",
    priceFrom: 24,
    image: "/offers/altura-1800.png",
    category: "coming",
  },
  {
    id: "5",
    title: "Escapada wellness en camping de montaña",
    subtitle: "Monte Verde Spa Camping ★★★★",
    rating: 8.9,
    reviews: 305,
    location: "La Molina",
    region: "Girona, Pirineos",
    mealPlan: "Media pensión",
    highlights: ["10% dto. en tratamiento de spa", "Yoga al amanecer"],
    description:
      "Acceso al spa, clases de yoga y parcelas premium con vistas panorámicas.",
    freeCancellation: "Cancelación GRATIS hasta 8 días antes",
    travelDates: "Válido del 1 jun al 15 oct 2026",
    priceFrom: 48,
    image: "/offers/monte-verde.png",
    badge: "Novedad",
    saves: 412,
    countdown: "Quedan 2 días 12 horas",
    category: "new",
  },
];

export function filterOffers(
  offersList: OfferRecord[],
  category: OfferCategory | "all"
): OfferRecord[] {
  if (category === "all") return offersList;
  return offersList.filter((o) => o.category === category);
}
