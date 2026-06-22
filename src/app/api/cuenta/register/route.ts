import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerCustomer, stripCustomerSecrets } from "@/lib/customers-store";
import { isStrongPassword, STRONG_PASSWORD_MESSAGE } from "@/lib/password-rules";
import { createRoleToken, roleCookieOptions } from "@/lib/role-session";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nombre, email y contraseña son obligatorios." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email no válido." }, { status: 400 });
  }

  if (!isStrongPassword(password)) {
    return NextResponse.json({ error: STRONG_PASSWORD_MESSAGE }, { status: 400 });
  }

  try {
    const customer = await registerCustomer({ name, email, password });
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
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Error al crear la cuenta." },
      { status: 500 }
    );
  }
}
