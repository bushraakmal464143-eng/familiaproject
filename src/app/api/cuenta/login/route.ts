import { NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/customers-store";
import { verifyPassword } from "@/lib/password";
import { createRoleToken, roleCookieOptions } from "@/lib/role-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const customer = await getCustomerByEmail(body.email ?? "");
  if (
    !customer ||
    !customer.passwordHash ||
    !verifyPassword(body.password ?? "", customer.passwordHash)
  ) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }
  const token = createRoleToken("customer", customer.id);
  const response = NextResponse.json({ ok: true });
  const opts = roleCookieOptions("customer", token);
  response.cookies.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });
  return response;
}
