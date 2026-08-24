export default function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-gray-200 px-5 py-4 last:border-b-0">
      <div className="text-[15px] text-gray-500">{label}</div>
      <div className="text-[15px] font-semibold text-gray-900">{value}</div>
    </div>
  );
}
