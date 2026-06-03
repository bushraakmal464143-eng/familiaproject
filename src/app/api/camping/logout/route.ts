import { NextResponse } from "next/server";
import { COOKIES } from "@/lib/role-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIES.camping, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
