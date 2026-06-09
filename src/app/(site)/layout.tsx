import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toBranding } from "@/lib/branding";
import { getSiteSettings } from "@/lib/site-settings-store";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const branding = toBranding(settings);

  return (
    <>
      <Header branding={branding} />
      <main className="flex-1">{children}</main>
      <Footer branding={branding} />
    </>
  );
}
