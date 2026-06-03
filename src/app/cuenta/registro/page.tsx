import AuthForm from "@/components/portal/AuthForm";

export default function CuentaRegistroPage() {
  return (
    <AuthForm
      title="Crear cuenta"
      subtitle="Regístrate para reservar y pagar tus escapadas."
      apiPath="/api/cuenta/register"
      fields="register-customer"
    />
  );
}
