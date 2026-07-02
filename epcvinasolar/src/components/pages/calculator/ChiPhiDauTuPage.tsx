import { useState } from 'react';
import { CurrencyDollar, ArrowLeft } from '@phosphor-icons/react';

export default function ChiPhiDauTuPage() {
  const [systemSize, setSystemSize] = useState(5);
  const [systemType, setSystemType] = useState('on-grid');
  const costPerKwp = systemType === 'hybrid' ? 25 : 12;
  const totalCost = systemSize * costPerKwp;
  const batteryCost = systemType === 'hybrid' ? systemSize * 5 : 0;
  const grandTotal = totalCost + batteryCost;

  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/calculator" className="inline-flex items-center gap-2 text-orange-600 mb-6"><ArrowLeft className="w-4 h-4" /> Quay lại</a>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><CurrencyDollar className="text-orange-500" /> Tính Chi Phí Đầu Tư</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Công suất hệ thống (kWp)</label>
              <input type="range" min="3" max="20" value={systemSize} onChange={(e) => setSystemSize(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-sm text-slate-500"><span>3 kWp</span><span className="text-2xl font-bold text-orange-500">{systemSize} kWp</span><span>20 kWp</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loại hệ thống</label>
              <select value={systemType} onChange={(e) => setSystemType(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                <option value="on-grid">On-Grid (không pin lưu trữ)</option>
                <option value="hybrid">Hybrid (có pin lưu trữ)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Kết Quả Tính Toán</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b"><span>Chi phí hệ thống {systemSize}kWp:</span><span className="font-bold">{totalCost.toLocaleString()} triệu</span></div>
            {systemType === 'hybrid' && <div className="flex justify-between py-3 border-b"><span>Chi phí pin lưu trữ:</span><span className="font-bold">{batteryCost.toLocaleString()} triệu</span></div>}
            <div className="flex justify-between py-3 bg-orange-50 -mx-4 px-4 rounded"><span className="font-bold text-lg">Tổng chi phí:</span><span className="font-bold text-xl text-orange-600">{grandTotal.toLocaleString()} triệu</span></div>
          </div>
          <a href="/lien-he" className="block text-center mt-8 bg-orange-500 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-all">Nhận Báo Giá Chi Tiết</a>
        </div>
      </div>
    </div>
  );
}
