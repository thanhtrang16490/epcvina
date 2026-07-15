"use client";

import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-panel grid w-full overflow-hidden rounded-[2rem] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
      <aside className="login-panel__aside relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="login-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.28em]">
            EPCVINA Admin
          </div>
          <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-tight text-[color:var(--text)]">
            Quản lý combo, sản phẩm và API từ một nơi duy nhất.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[color:var(--muted)]">
            Trang đăng nhập này kết nối thẳng Supabase Auth để đăng nhập thật, rồi chuyển vào dashboard admin.
          </p>
        </div>

        <div className="grid gap-4 text-sm text-[color:var(--muted)]">
          <div className="login-info-card rounded-2xl p-4">
            <div className="text-[color:var(--accent-2)]">Sẵn cho Supabase</div>
            <div className="mt-1">Session được tạo bằng `signInWithPassword` trên browser.</div>
          </div>
          <div className="login-info-card rounded-2xl p-4">
            <div className="text-[color:var(--accent-2)]">Sẵn cho Admin</div>
            <div className="mt-1">Đăng nhập xong sẽ đi vào dashboard và dùng Supabase trực tiếp.</div>
          </div>
        </div>
      </aside>

      <section className="flex items-center p-6 sm:p-8 lg:p-10">
        <div className="mx-auto flex w-full max-w-md flex-col">
          <div className="mb-8 lg:hidden">
            <div className="login-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.28em]">
              EPCVINA Admin
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-[color:var(--text)]">Đăng nhập quản trị</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Dùng Supabase Auth để vào hệ thống.</p>
          </div>

          <form onSubmit={submit} autoComplete="off" className="mt-6 grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="epcvina-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Nhập email"
                className="login-input h-12 w-full rounded-2xl px-4 outline-none ring-0 transition placeholder:text-[color:var(--muted)] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                  Mật khẩu
                </label>
              </div>
              <input
                id="password"
                name="epcvina-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Nhập mật khẩu"
                className="login-input h-12 w-full rounded-2xl px-4 outline-none ring-0 transition placeholder:text-[color:var(--muted)] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isReady}
              className="login-submit mt-2 inline-flex h-12 items-center justify-center rounded-2xl px-4 font-semibold transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            {message ? (
              <div className="login-message-success rounded-2xl px-4 py-3 text-sm">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="login-message-error rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

          </form>
        </div>
      </section>
    </div>
  );
}
