import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-center text-white">
        <div className="text-sm uppercase tracking-[0.28em] text-cyan-300">404</div>
        <h1 className="mt-3 text-3xl font-semibold">Không tìm thấy trang</h1>
        <p className="mt-3 text-sm text-slate-400">
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">
          Về dashboard
        </Link>
      </div>
    </main>
  );
}
