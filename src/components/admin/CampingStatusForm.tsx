"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CampingStatus } from "@/lib/types";

export default function CampingStatusForm({
  campingId,
  currentStatus,
}: {
  campingId: string;
  currentStatus: CampingStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/admin/campings/${campingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as CampingStatus)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="pending">Pendiente</option>
        <option value="active">Activo</option>
        <option value="suspended">Suspendido</option>
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="rounded-lg bg-brand-forest px-4 py-2 text-sm font-medium text-white hover:bg-brand-forest-dark disabled:opacity-60"
      >
        {loading ? "Guardando…" : "Actualizar estado"}
      </button>
    </div>
  );
}
