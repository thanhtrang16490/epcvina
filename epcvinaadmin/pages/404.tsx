export default function NotFoundPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#020617", color: "#e2e8f0", padding: 24 }}>
      <div style={{ maxWidth: 560, width: "100%", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: 32, background: "rgba(15,23,42,0.72)" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#67e8f9" }}>404</div>
        <h1 style={{ marginTop: 12, fontSize: 32, lineHeight: 1.1 }}>Trang không tồn tại</h1>
        <p style={{ marginTop: 12, color: "#94a3b8", lineHeight: 1.7 }}>Trang này chỉ dùng làm fallback cho Pages Router để Next build không vấp khi prerender.</p>
      </div>
    </main>
  );
}
