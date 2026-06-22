import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/role-session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIES.customer, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
