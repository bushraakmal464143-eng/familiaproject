import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerByEmail, stripCustomerSecrets } from "@/lib/customers-store";
import { verifyPassword } from "@/lib/password";
import { createRoleToken, roleCookieOptions } from "@/lib/role-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña son obligatorios." },
      { status: 400 }
    );
  }

  const customer = await getCustomerByEmail(email);
  if (
    !customer?.passwordHash ||
    !verifyPassword(password, customer.passwordHash)
  ) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos." },
      { status: 401 }
    );
  }

  const token = createRoleToken("customer", customer.id);
  const opts = roleCookieOptions("customer", token);
  const cookieStore = await cookies();
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });

  const safe = stripCustomerSecrets(customer);
  return NextResponse.json({
    ok: true,
    user: { id: safe.id, name: safe.name, email: safe.email },
  });
}
