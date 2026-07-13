"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-center text-white">
        <div className="text-sm uppercase tracking-[0.28em] text-rose-300">Error</div>
        <h1 className="mt-3 text-3xl font-semibold">Có lỗi xảy ra</h1>
        <p className="mt-3 text-sm text-slate-400">
          Vui lòng thử lại hoặc quay về dashboard để tiếp tục thao tác.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">
            Thử lại
          </button>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
