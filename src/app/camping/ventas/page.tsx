import { getBookings } from "@/lib/bookings-store";
import { formatBookingStatus } from "@/lib/stats";
import { getSessionSubject } from "@/lib/role-session";

export default async function CampingVentasPage() {
  const campingId = await getSessionSubject("camping");
  if (!campingId) return null;
  const bookings = (await getBookings())
    .filter((b) => b.campingId === campingId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const paid = bookings.filter((b) => b.status === "paid");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Ventas y reservas</h1>
      <p className="mt-1 text-gray-600">
        {paid.length} ventas cobradas ·{" "}
        {paid.reduce((s, b) => s + b.totalAmount, 0)} € en total
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fechas</th>
              <th className="px-4 py-3">Importe</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{b.customerName}</p>
                  <p className="text-xs text-gray-500">{b.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {b.checkIn} → {b.checkOut}
                  <br />
                  <span className="text-xs">{b.guests} pers. · {b.nights} noches</span>
                </td>
                <td className="px-4 py-3 font-medium">{b.totalAmount} €</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      b.status === "paid"
                        ? "text-brand-green"
                        : b.status === "pending"
                          ? "text-brand-accent"
                          : "text-gray-500"
                    }
                  >
                    {formatBookingStatus(b.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="px-4 py-12 text-center text-gray-500">Sin reservas todavía.</p>
        )}
      </div>
    </div>
  );
}
