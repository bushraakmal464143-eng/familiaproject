import { revalidatePath } from "next/cache";

export function revalidateOfferPages(offerId?: string) {
  revalidatePath("/");
  revalidatePath("/campings");
  revalidatePath("/admin/offers");
  revalidatePath("/camping/ofertas");

  if (offerId) {
    revalidatePath(`/ofertas/${offerId}`);
  }
}
