import { useState } from 'react';
import { Clock, ArrowLeft } from '@phosphor-icons/react';

export default function ThoiGianHoanVonPage() {
  const [cost, setCost] = useState(80);
  const [monthlySaving, setMonthlySaving] = useState(2);
  const paybackYears = (cost / (monthlySaving * 12)).toFixed(1);

  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/calculator" className="inline-flex items-center gap-2 text-orange-600 mb-6"><ArrowLeft className="w-4 h-4" /> Quay lại</a>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Clock className="text-orange-500" /> Tính Thời Gian Hoàn Vốn</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tổng chi phí đầu tư (triệu đồng)</label>
              <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tiết kiệm điện hàng tháng (triệu đồng)</label>
              <input type="number" value={monthlySaving} step="0.1" onChange={(e) => setMonthlySaving(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Kết Quả</h2>
          <div className="text-center py-8 bg-orange-50 rounded-lg">
            <p className="text-lg text-slate-600 mb-2">Thời gian hoàn vốn</p>
            <p className="text-5xl font-bold text-orange-600">{paybackYears} năm</p>
            <p className="text-sm text-slate-500 mt-2">Sau hoàn vốn, tiết kiệm {monthlySaving} triệu/tháng × 20+ năm</p>
          </div>
          <a href="/lien-he" className="block text-center mt-8 bg-orange-500 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-all">Tư Vấn Miễn Phí</a>
        </div>
      </div>
    </div>
  );
}
