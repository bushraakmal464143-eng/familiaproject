import { NextResponse } from "next/server";
import { registerCamping } from "@/lib/campings-store";
import { createRoleToken, roleCookieOptions } from "@/lib/role-session";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    location?: string;
    region?: string;
    description?: string;
  };

  try {
    const camping = await registerCamping({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      phone: body.phone,
      location: body.location ?? "",
      region: body.region ?? "",
      description: body.description ?? "",
    });
    const token = createRoleToken("camping", camping.id);
    const response = NextResponse.json({ ok: true, status: camping.status });
    const opts = roleCookieOptions("camping", token);
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
