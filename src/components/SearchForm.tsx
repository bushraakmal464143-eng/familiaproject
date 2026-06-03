"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { format } from "date-fns";

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

function formatGuests(adults: number, children: number): string {
  const total = adults + children;
  if (total === 1) return "1 persona";
  return `${total} personas`;
}

export default function SearchForm() {
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (dateRef.current && !dateRef.current.contains(target)) {
        setDateOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(target)) {
        setGuestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalGuests = adults + children;
  const fechasValue = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "yyyy-MM-dd")}|${format(dateRange.to, "yyyy-MM-dd")}`
      : format(dateRange.from, "yyyy-MM-dd")
    : "";

  return (
    <form
      className="grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_1fr_1.1fr_auto] md:items-stretch"
      onSubmit={(e) => {
        if (!dateRange?.from || !dateRange?.to) {
          e.preventDefault();
          setDateOpen(true);
        }
      }}
    >
      <div className="min-w-0">
        <input
          id="destino"
          name="destino"
          type="text"
          defaultValue="Cualquier destino disponible"
          className="h-12 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      {/* Calendario desplegable */}
      <div ref={dateRef} className="relative">
        <input type="hidden" name="fechas" value={fechasValue} />
        <button
          type="button"
          aria-label="Seleccionar fecha de entrada y salida"
          aria-expanded={dateOpen}
          aria-haspopup="dialog"
          onClick={() => {
            setDateOpen((o) => !o);
            setGuestOpen(false);
          }}
          className={`flex h-12 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-green/30 ${
            dateOpen
              ? "border-brand-green ring-2 ring-brand-green/30"
              : "border-gray-300 hover:border-gray-400"
          } ${dateRange?.from ? "text-gray-900" : "text-gray-500"}`}
        >
          <span className="truncate">
            {dateRange?.from ? formatDateRange(dateRange) : "Entrada"}
          </span>
          <CalendarIcon />
        </button>

        {dateOpen && (
          <div
            role="dialog"
            aria-label="Seleccionar fechas"
            className="absolute left-0 top-full z-50 mt-2 min-w-[min(100vw-2rem,340px)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:left-auto sm:right-0"
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
          </div>
        )}
      </div>

      {/* Personas desplegable */}
      <div className="hidden items-center justify-center text-gray-500 md:flex">
        <span aria-hidden className="text-lg font-semibold">→</span>
      </div>

      <div ref={guestRef} className="relative">
        <input type="hidden" name="personas" value={totalGuests} />
        <input type="hidden" name="adultos" value={adults} />
        <input type="hidden" name="ninos" value={children} />
        <button
          type="button"
          aria-label="Seleccionar numero de personas"
          aria-expanded={guestOpen}
          aria-haspopup="listbox"
          onClick={() => {
            setGuestOpen((o) => !o);
            setDateOpen(false);
          }}
          className={`flex h-12 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-green/30 ${
            guestOpen
              ? "border-brand-green ring-2 ring-brand-green/30"
              : "border-gray-300 hover:border-gray-400"
          } text-gray-900`}
        >
          <span>{adults} adultos</span>
          <ChevronIcon open={guestOpen} />
        </button>

        {guestOpen && (
          <div
            role="listbox"
            aria-label="Número de personas"
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
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
        className="h-12 w-full rounded-md bg-[#b0003a] px-8 text-sm font-semibold text-white transition hover:bg-[#930030] md:w-auto md:min-w-[170px]"
      >
        Buscar
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
