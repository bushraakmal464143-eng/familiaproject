import AuthForm from "@/components/portal/AuthForm";
import { isGoogleAuthConfigured } from "@/lib/google-oauth";

export default function CuentaLoginPage() {
  return (
    <AuthForm
      title="Panel del cliente"
      subtitle="Contrata ofertas, paga online y consulta tus reservas."
      apiPath="/api/cuenta/login"
      registerPath="/signup"
      registerLabel="Crear cuenta"
      fields="login"
      showGoogleLogin
      googleSignInEnabled={isGoogleAuthConfigured()}
    />
  );
}
