"use client";

import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent";

export default function CampingPartnerContact() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [campingName, setCampingName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) setOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, loading]);

  function resetForm() {
    setName("");
    setCampingName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setError("");
    setSuccess("");
  }

  function closeModal() {
    if (loading) return;
    setOpen(false);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/partner-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, campingName, phone, email, message }),
      });
      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar la consulta.");
        return;
      }

      setSuccess(data.message ?? "Gracias. Te contactaremos pronto.");
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    } catch {
      setError("No se pudo enviar la consulta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-brand-sand">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ¿Tienes un camping o glamping?
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Únete a {SITE_NAME} y recibe más reservas con total control
              de precios y disponibilidad. Publica tu establecimiento hoy mismo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-lg bg-brand-accent px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Más información
          </button>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Cerrar formulario"
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="camping-contact-title"
            className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="camping-contact-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Contacta con nosotros
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Cuéntanos sobre tu camping o glamping y nos pondremos en
                  contacto contigo lo antes posible.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  autoFocus
                  disabled={loading}
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contact-camping" className="text-sm font-medium text-gray-700">
                  Nombre del camping / glamping
                </label>
                <input
                  id="contact-camping"
                  type="text"
                  required
                  disabled={loading}
                  className={inputClass}
                  value={campingName}
                  onChange={(e) => setCampingName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  disabled={loading}
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  disabled={loading}
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium text-gray-700">
                  Mensaje <span className="font-normal text-gray-500">(opcional)</span>
                </label>
                <textarea
                  id="contact-message"
                  disabled={loading}
                  className={`${inputClass} min-h-[96px] resize-y`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand-accent py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? "Enviando…" : "Enviar consulta"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
