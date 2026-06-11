import { NextResponse } from "next/server";
import { createContactInquiry } from "@/lib/contact-inquiries-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    campsiteName?: string;
    email?: string;
    phone?: string;
    comments?: string;
  };

  const name = body.name?.trim() ?? "";
  const campsiteName = body.campsiteName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const comments = body.comments?.trim() ?? "";

  if (!name || !campsiteName || !email || !phone) {
    return NextResponse.json(
      { error: "Nombre, camping, email y teléfono son obligatorios." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email no válido." }, { status: 400 });
  }

  const inquiry = await createContactInquiry({
    name,
    campsiteName,
    email,
    phone,
    comments,
  });

  return NextResponse.json({ ok: true, id: inquiry.id });
}
