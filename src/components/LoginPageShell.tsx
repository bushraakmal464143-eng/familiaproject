import Header from "@/components/Header";
import { SITE_NAME } from "@/lib/site";

type LoginPageShellProps = {
  children: React.ReactNode;
};

export default function LoginPageShell({ children }: LoginPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white px-4 py-5 text-center text-xs text-gray-500">
        <p>All rights reserved.</p>
        <p>
          Copyright (2006-2026) – {SITE_NAME}™
        </p>
      </footer>
    </div>
  );
}
