import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.2),_transparent_28%),linear-gradient(180deg,_#020617,_#08111f)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
      <Suspense
        fallback={
          <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-slate-300">
            Đang tải...
          </div>
        }
      >
        <div className="relative w-full">
          <LoginForm />
        </div>
      </Suspense>
    </main>
  );
}
