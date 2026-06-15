import { NextResponse } from "next/server";
import { savePartnerContact } from "@/lib/partner-contacts-store";
import { sendPartnerContactEmail } from "@/lib/send-partner-contact-email";
import { getSiteSettings } from "@/lib/site-settings-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    campingName?: string;
    phone?: string;
    email?: string;
    message?: string;
  };

  const name = body.name?.trim() ?? "";
  const campingName = body.campingName?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !campingName || !phone || !email) {
    return NextResponse.json(
      { error: "Nombre, camping, teléfono y email son obligatorios." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email no válido." }, { status: 400 });
  }

  const settings = await getSiteSettings();
  const inquiry = { name, campingName, phone, email, message };

  await savePartnerContact(inquiry);
  await sendPartnerContactEmail(settings.contactEmail, inquiry);

  return NextResponse.json({
    ok: true,
    message: "Gracias. Hemos recibido tu consulta y te contactaremos pronto.",
  });
}
