import AuthForm from "@/components/portal/AuthForm";

export default function CuentaLoginPage() {
  return (
    <AuthForm
      title="Panel del cliente"
      subtitle="Contrata ofertas, paga online y consulta tus reservas."
      apiPath="/api/cuenta/login"
      registerPath="/signup"
      registerLabel="Crear cuenta"
      fields="login"
    />
  );
}
