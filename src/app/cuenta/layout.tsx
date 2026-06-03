import PortalShell from "@/components/portal/PortalShell";

export const metadata = {
  title: "Mi cuenta | CampoLibre",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/cuenta", label: "Mis reservas", exact: true },
];

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      title="CampoLibre"
      titleAccent="Cliente"
      nav={nav}
      loginPath="/cuenta/login"
      logoutApi="/api/cuenta/logout"
      publicLink={{ href: "/", label: "Buscar ofertas →" }}
    >
      {children}
    </PortalShell>
  );
}
