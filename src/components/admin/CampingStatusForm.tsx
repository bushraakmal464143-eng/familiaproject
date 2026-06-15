"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CampingStatus } from "@/lib/types";

const statusOptions: { value: CampingStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "active", label: "Activo" },
  { value: "suspended", label: "Suspendido" },
];

type CampingStatusFormProps = {
  campingId: string;
  currentStatus: CampingStatus;
};

export default function CampingStatusForm({
  campingId,
  currentStatus,
}: CampingStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<CampingStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === currentStatus) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/campings/${campingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "No se pudo actualizar el estado.");
        return;
      }

      router.refresh();
    } catch {
      setError("No se pudo actualizar el estado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="camping-status" className="text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="camping-status"
          value={status}
          disabled={loading}
          onChange={(e) => setStatus(e.target.value as CampingStatus)}
          className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || status === currentStatus}
        className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
      >
        {loading ? "Guardando…" : "Guardar estado"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
