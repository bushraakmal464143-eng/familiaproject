"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OfferCategory } from "@/lib/offers";
import type { OfferRecord, OfferStatus } from "@/lib/types";

const categories: { value: Exclude<OfferCategory, "all">; label: string }[] = [
  { value: "new", label: "Novedades" },
  { value: "bestseller", label: "Más vendidos" },
  { value: "coming", label: "Próximamente" },
];

type OfferFormProps = {
  offer?: OfferRecord;
  mode: "create" | "edit";
  campings: { id: string; name: string }[];
};

function highlightsToText(highlights: string[]) {
  return highlights.join("\n");
}

function textToHighlights(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function OfferForm({ offer, mode, campings }: OfferFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(offer?.title ?? "");
  const [subtitle, setSubtitle] = useState(offer?.subtitle ?? "");
  const [rating, setRating] = useState(String(offer?.rating ?? 8));
  const [reviews, setReviews] = useState(String(offer?.reviews ?? 0));
  const [location, setLocation] = useState(offer?.location ?? "");
  const [region, setRegion] = useState(offer?.region ?? "");
  const [mealPlan, setMealPlan] = useState(offer?.mealPlan ?? "");
  const [highlights, setHighlights] = useState(
    highlightsToText(offer?.highlights ?? [])
  );
  const [description, setDescription] = useState(offer?.description ?? "");
  const [freeCancellation, setFreeCancellation] = useState(
    offer?.freeCancellation ?? ""
  );
  const [travelDates, setTravelDates] = useState(offer?.travelDates ?? "");
  const [priceFrom, setPriceFrom] = useState(String(offer?.priceFrom ?? 0));
  const [image, setImage] = useState(offer?.image ?? "/offers/cabin-style.png");
  const [badge, setBadge] = useState(offer?.badge ?? "");
  const [saves, setSaves] = useState(
    offer?.saves != null ? String(offer.saves) : ""
  );
  const [countdown, setCountdown] = useState(offer?.countdown ?? "");
  const [campingId, setCampingId] = useState(
    offer?.campingId ?? campings[0]?.id ?? ""
  );
  const [category, setCategory] = useState(
    offer?.category ?? "new"
  );
  const [status, setStatus] = useState<OfferStatus>(offer?.status ?? "active");
  const [featured, setFeatured] = useState(offer?.featured ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title,
      subtitle,
      rating: Number(rating),
      reviews: Number(reviews),
      location,
      region,
      mealPlan: mealPlan || undefined,
      highlights: textToHighlights(highlights),
      description,
      freeCancellation: freeCancellation || undefined,
      travelDates,
      priceFrom: Number(priceFrom),
      image,
      badge: badge || undefined,
      saves: saves ? Number(saves) : undefined,
      countdown: countdown || undefined,
      campingId,
      category,
      status,
      featured,
    };

    const url =
      mode === "create"
        ? "/api/admin/offers"
        : `/api/admin/offers/${offer!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Error al guardar");
      return;
    }

    router.push("/admin/offers");
    router.refresh();
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Título</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Subtítulo (camping + estrellas)</label>
          <input
            className={inputClass}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Valoración</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            className={inputClass}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Nº opiniones</label>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Localidad</label>
          <input
            className={inputClass}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Región</label>
          <input
            className={inputClass}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Precio desde (€/pers.)</label>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Camping</label>
          <select
            className={inputClass}
            value={campingId}
            onChange={(e) => setCampingId(e.target.value)}
            required
          >
            {campings.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as OfferStatus)}
          >
            <option value="active">Activa</option>
            <option value="draft">Borrador</option>
            <option value="inactive">Inactiva</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Categoría</label>
          <select
            className={inputClass}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Exclude<OfferCategory, "all">)
            }
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Ruta imagen (public/)</label>
          <input
            className={inputClass}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/offers/cabin-style.png"
          />
        </div>
        <div>
          <label className={labelClass}>Etiqueta (badge)</label>
          <input
            className={inputClass}
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Favoritos (saves)</label>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={saves}
            onChange={(e) => setSaves(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Cuenta atrás</label>
          <input
            className={inputClass}
            value={countdown}
            onChange={(e) => setCountdown(e.target.value)}
            placeholder="Quedan 5 días"
          />
        </div>
        <div>
          <label className={labelClass}>Régimen / comidas</label>
          <input
            className={inputClass}
            value={mealPlan}
            onChange={(e) => setMealPlan(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Fechas de viaje</label>
          <input
            className={inputClass}
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Cancelación gratuita</label>
          <input
            className={inputClass}
            value={freeCancellation}
            onChange={(e) => setFreeCancellation(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Destacados (uno por línea)</label>
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Descripción</label>
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Oferta destacada en la home
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
        >
          {saving ? "Guardando…" : mode === "create" ? "Crear oferta" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
