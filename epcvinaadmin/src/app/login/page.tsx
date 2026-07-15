import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="login-page relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="login-page__bg absolute inset-0" />
      <div className="login-page__grid absolute inset-0 opacity-40" />
      <Suspense
        fallback={
          <div className="login-panel relative mx-auto w-full max-w-6xl rounded-[2rem] p-8">
            Đang tải...
          </div>
        }
      >
        <div className="relative mx-auto w-full max-w-6xl">
          <LoginForm />
        </div>
      </Suspense>
    </main>
  );
}
