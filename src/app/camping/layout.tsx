import PortalShell from "@/components/portal/PortalShell";

export const metadata = {
  title: "Espacio camping | CampoLibre",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/camping", label: "Inicio", exact: true },
  { href: "/camping/fotos", label: "Fotos" },
  { href: "/camping/ofertas", label: "Ofertas" },
  { href: "/camping/ventas", label: "Ventas" },
];

export default function CampingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      title="CampoLibre"
      titleAccent="Camping"
      nav={nav}
      loginPath="/camping/login"
      logoutApi="/api/camping/logout"
      publicLink={{ href: "/", label: "Ver web →" }}
    >
      {children}
    </PortalShell>
  );
}
