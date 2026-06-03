import { NextResponse } from "next/server";
import { getCampingByEmail } from "@/lib/campings-store";
import { verifyPassword } from "@/lib/password";
import { createRoleToken, roleCookieOptions } from "@/lib/role-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const camping = await getCampingByEmail(body.email ?? "");
  if (!camping || !verifyPassword(body.password ?? "", camping.passwordHash)) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }
  const token = createRoleToken("camping", camping.id);
  const response = NextResponse.json({ ok: true, campingId: camping.id });
  const opts = roleCookieOptions("camping", token);
  response.cookies.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });
  return response;
}
