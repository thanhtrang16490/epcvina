import { useState } from 'react';
import { Battery, ArrowLeft } from 'lucide-react';

export default function PinLuuTruPage() {
  const [monthlyBill, setMonthlyBill] = useState(3);
  const [backupHours, setBackupHours] = useState(8);
  const avgConsumption = monthlyBill / 3000 * 1000;
  const hourlyLoad = avgConsumption / 24;
  const requiredCapacity = Math.ceil(hourlyLoad * backupHours * 1.2);

  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/calculator" className="inline-flex items-center gap-2 text-orange-600 mb-6"><ArrowLeft className="w-4 h-4" /> Quay lại</a>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Battery className="text-orange-500" /> Tính Pin Lưu Trữ</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Hóa đơn điện/tháng (triệu đồng)</label>
              <input type="number" value={monthlyBill} step="0.5" onChange={(e) => setMonthlyBill(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thời gian dự phòng mong muốn (giờ)</label>
              <input type="range" min="4" max="24" value={backupHours} onChange={(e) => setBackupHours(Number(e.target.value))} className="w-full" />
              <div className="text-center text-2xl font-bold text-orange-500 mt-2">{backupHours} giờ</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Kết Quả</h2>
          <div className="text-center py-8 bg-orange-50 rounded-lg">
            <p className="text-lg text-slate-600 mb-2">Dung lượng pin đề xuất</p>
            <p className="text-5xl font-bold text-orange-600">{requiredCapacity} kWh</p>
            <p className="text-sm text-slate-500 mt-2">Công suất tải trung bình: {hourlyLoad.toFixed(1)} kW</p>
          </div>
          <a href="/lien-he" className="block text-center mt-8 bg-orange-500 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-all">Tư Vấn Pin Phù Hợp</a>
        </div>
      </div>
    </div>
  );
}
