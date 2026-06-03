import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/customers-store";
import { createRoleToken, roleCookieOptions } from "@/lib/role-session";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  try {
    const customer = await registerCustomer({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
    });
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
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error al registrar" }, { status: 400 });
  }
}
