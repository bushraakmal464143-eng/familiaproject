import { readJson, writeJson } from "@/lib/json-store";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

const FILE = "site-settings.json";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1920&q=80";

export function defaultSiteSettings(): SiteSettings {
  return {
    siteName: SITE_NAME,
    siteTagline: SITE_TAGLINE,
    logoPart1: "Ofertas",
    logoAccent: "de",
    logoPart2: "Camping",
    logoSuffix: ".com",
    heroTitle: "Las mejores ofertas de campings por tiempo limitado",
    heroSubtitle: `Encuentra tu parcela perfecta en España con ${SITE_NAME}.`,
    heroImageUrl: HERO_IMAGE,
    offersHeading: "Ofertas de campings de montaña",
    trustPoint: "Confirmación al instante",
    footerText:
      "Reserva campings, glamping y parques vacacionales en España.",
    contactEmail: "info@ofertasdecamping.com",
    contactPhone: "",
    updatedAt: new Date().toISOString(),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await readJson<Partial<SiteSettings> | null>(FILE, null);
  if (!raw) return defaultSiteSettings();
  return { ...defaultSiteSettings(), ...raw };
}

export async function saveSiteSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const next: SiteSettings = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(FILE, next);
  return next;
}
