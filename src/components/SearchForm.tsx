"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { isAnyDestination } from "@/lib/search-offers";

type SearchFormProps = {
  target?: "home" | "campings";
  initialDestino?: string;
  initialEntrada?: string;
  initialSalida?: string;
  initialAdults?: number;
  initialChildren?: number;
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateRange(range: DateRange | undefined): string {
  if (!range?.from) return "Entrada – Salida";
  if (!range.to) return format(range.from, "d MMM yyyy", { locale: es });
  return `${format(range.from, "d MMM", { locale: es })} – ${format(range.to, "d MMM yyyy", { locale: es })}`;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  try {
    const date = parseISO(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

function buildInitialDateRange(
  entrada?: string,
  salida?: string
): DateRange | undefined {
  const from = parseDate(entrada);
  const to = parseDate(salida);
  if (!from) return undefined;
  return { from, to: to ?? from };
}

export default function SearchForm({
  target = "campings",
  initialDestino = "",
  initialEntrada,
  initialSalida,
  initialAdults = 2,
  initialChildren = 0,
}: SearchFormProps) {
  const router = useRouter();
  const [destino, setDestino] = useState(initialDestino);
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() =>
    buildInitialDateRange(initialEntrada, initialSalida)
  );
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [searching, setSearching] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const targetNode = e.target as Node;
      if (dateRef.current && !dateRef.current.contains(targetNode)) {
        setDateOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(targetNode)) {
        setGuestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function performSearch() {
    setSearching(true);
    setDateOpen(false);
    setGuestOpen(false);

    const params = new URLSearchParams();
    const trimmedDestino = destino.trim();
    if (trimmedDestino && !isAnyDestination(trimmedDestino)) {
      params.set("destino", trimmedDestino);
    }

    const from = dateRange?.from;
    const to = dateRange?.to ?? dateRange?.from;
    if (from && to) {
      params.set("entrada", format(from, "yyyy-MM-dd"));
      params.set("salida", format(to, "yyyy-MM-dd"));
    }

    params.set("adultos", String(adults));
    if (children > 0) {
      params.set("ninos", String(children));
    }

    const query = params.toString();
    const base = target === "home" ? "/" : "/campings";
    const url = query
      ? `${base}?${query}${target === "home" ? "#ofertas" : ""}`
      : `${base}${target === "home" ? "#ofertas" : ""}`;

    router.push(url);

    if (target === "home") {
      window.setTimeout(() => {
        document.getElementById("ofertas")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setSearching(false);
      }, 300);
    } else {
      window.setTimeout(() => setSearching(false), 500);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    performSearch();
  }

  return (
    <form
      className="grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_auto_1.1fr_auto] md:items-stretch"
      onSubmit={handleSubmit}
    >
      <div className="min-w-0">
        <input
          id="destino"
          name="destino"
          type="text"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          placeholder="Cualquier destino disponible"
          className="h-12 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      <div ref={dateRef} className="relative min-w-0">
        <button
          type="button"
          aria-label="Seleccionar fecha de entrada y salida"
          aria-expanded={dateOpen}
          aria-haspopup="dialog"
          onClick={() => {
            setDateOpen((open) => !open);
            setGuestOpen(false);
          }}
          className={`flex h-12 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-green/30 ${
            dateOpen
              ? "border-brand-green ring-2 ring-brand-green/30"
              : "border-gray-300 hover:border-gray-400"
          } ${dateRange?.from ? "text-gray-900" : "text-gray-500"}`}
        >
          <span className="truncate">
            {dateRange?.from ? formatDateRange(dateRange) : "Entrada – Salida"}
          </span>
          <CalendarIcon />
        </button>

        {dateOpen && (
          <div
            role="dialog"
            aria-label="Seleccionar fechas"
            className="absolute left-0 top-full z-[100] mt-2 min-w-[min(100vw-2rem,340px)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
          >
            <p className="mb-3 text-xs font-medium text-gray-500">
              Elige entrada y salida
            </p>
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  setDateOpen(false);
                }
              }}
              locale={es}
              disabled={{ before: startOfToday() }}
              numberOfMonths={1}
              className="campo-libre-calendar !mx-0 text-gray-900"
              showOutsideDays
            />
            {dateRange?.from && !dateRange?.to && (
              <p className="mt-1 text-center text-xs text-brand-accent">
                Ahora elige la fecha de salida
              </p>
            )}
            {dateRange?.from && (
              <button
                type="button"
                onClick={() => setDateOpen(false)}
                className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Listo
              </button>
            )}
          </div>
        )}
      </div>

      <div className="hidden items-center justify-center px-1 text-gray-500 md:flex">
        <span aria-hidden className="text-lg font-semibold">
          →
        </span>
      </div>

      <div ref={guestRef} className="relative min-w-0">
        <button
          type="button"
          aria-label="Seleccionar número de personas"
          aria-expanded={guestOpen}
          aria-haspopup="listbox"
          onClick={() => {
            setGuestOpen((open) => !open);
            setDateOpen(false);
          }}
          className={`flex h-12 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-green/30 ${
            guestOpen
              ? "border-brand-green ring-2 ring-brand-green/30"
              : "border-gray-300 hover:border-gray-400"
          } text-gray-900`}
        >
          <span className="truncate">
            {children > 0
              ? `${adults} adultos, ${children} niños`
              : `${adults} adultos`}
          </span>
          <ChevronIcon open={guestOpen} />
        </button>

        {guestOpen && (
          <div
            role="listbox"
            aria-label="Número de personas"
            className="absolute left-0 top-full z-[100] mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
          >
            <GuestRow
              label="Adultos"
              hint="Mayores de 18 años"
              value={adults}
              min={1}
              max={20}
              onChange={setAdults}
            />
            <GuestRow
              label="Niños"
              hint="Menores de 18 años"
              value={children}
              min={0}
              max={20 - adults}
              onChange={setChildren}
            />
            <button
              type="button"
              onClick={() => setGuestOpen(false)}
              className="mt-4 w-full rounded-lg bg-brand-green py-2.5 text-sm font-semibold text-white transition hover:bg-brand-forest"
            >
              Listo
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={searching}
        className="h-12 w-full rounded-md bg-[#b0003a] px-8 text-sm font-semibold text-white transition hover:bg-[#930030] disabled:opacity-70 md:min-w-[170px]"
      >
        {searching ? "Buscando…" : "Buscar"}
      </button>
    </form>
  );
}

function GuestRow({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <CounterButton
          label={`Quitar ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </CounterButton>
        <span className="w-6 text-center font-semibold text-gray-900">{value}</span>
        <CounterButton
          label={`Añadir ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </CounterButton>
      </div>
    </div>
  );
}

function CounterButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-medium text-gray-700 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
    >
      {children}
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
