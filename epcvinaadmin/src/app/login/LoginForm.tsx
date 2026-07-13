"use client";

import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type Mode = "login" | "register";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("admin2@epcvina.com");
  const [password, setPassword] = useState("Temp@123456");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isReady = useMemo(() => Boolean(supabaseBrowserClient), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabaseBrowserClient) {
      setError("Thiếu cấu hình Supabase trong biến môi trường.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error: signInError } = await supabaseBrowserClient.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (!data.session) {
          throw new Error("Không tạo được phiên đăng nhập.");
        }

        setMessage("Đăng nhập thành công, đang chuyển vào trang quản trị...");
        router.replace("/");
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!data.session) {
        setMessage("Đã tạo tài khoản. Nếu Supabase yêu cầu xác thực email, hãy kiểm tra hộp thư.");
      } else {
        setMessage("Tạo tài khoản thành công, đang chuyển vào trang quản trị...");
        router.replace("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_30px_120px_rgba(2,6,23,0.55)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
      <aside className="relative hidden overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_38%),linear-gradient(160deg,_rgba(15,23,42,0.95),_rgba(8,15,28,0.98))] p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
            EPCVINA Admin
          </div>
          <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-tight text-white">
            Quản lý combo, sản phẩm và API từ một nơi duy nhất.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Trang đăng nhập này kết nối thẳng Supabase Auth để đăng nhập thật, rồi chuyển vào dashboard admin.
          </p>
        </div>

        <div className="grid gap-4 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-cyan-200">Sẵn cho Supabase</div>
            <div className="mt-1">Session được tạo bằng `signInWithPassword` trên browser.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-cyan-200">Sẵn cho Admin</div>
            <div className="mt-1">Đăng nhập xong sẽ đi vào dashboard và dùng Supabase trực tiếp.</div>
          </div>
        </div>
      </aside>

      <section className="p-6 sm:p-8 lg:p-10">
        <div className="mx-auto flex w-full max-w-md flex-col">
          <div className="mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
              EPCVINA Admin
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">Đăng nhập quản trị</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Dùng Supabase Auth để vào hệ thống.</p>
          </div>

          <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                mode === "login" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                mode === "register" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Tạo tài khoản
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="admin2@epcvina.com"
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-slate-900 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setPassword("Temp@123456")}
                  className="text-xs font-medium text-cyan-200 underline underline-offset-4"
                >
                  Điền nhanh
                </button>
              </div>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="Nhập mật khẩu"
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-slate-900 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isReady}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-200 px-4 font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>

            {message ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm leading-6 text-slate-400">
              Tài khoản mẫu: <span className="text-slate-200">admin2@epcvina.com</span>
              <br />
              Mật khẩu: <span className="text-slate-200">Temp@123456</span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
