import { useState } from 'react';
import { Car, ArrowLeft } from '@phosphor-icons/react';

export default function SacXeDienCalcPage() {
  const [batterySize, setBatterySize] = useState(60);
  const [chargePerWeek, setChargePerWeek] = useState(2);
  const electricityPrice = 3500;
  const costPerCharge = batterySize * electricityPrice / 1000000;
  const weeklyCost = costPerCharge * chargePerWeek;
  const monthlyCost = weeklyCost * 4;
  const solarSaving = monthlyCost * 0.6;

  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/calculator" className="inline-flex items-center gap-2 text-orange-600 mb-6"><ArrowLeft className="w-4 h-4" /> Quay lại</a>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Car className="text-orange-500" /> Tính Chi Phí Sạc Xe Điện</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Dung lượng pin xe (kWh)</label>
              <input type="number" value={batterySize} onChange={(e) => setBatterySize(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số lần sạc/tuần</label>
              <input type="number" value={chargePerWeek} onChange={(e) => setChargePerWeek(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Chi Phí Hàng Tháng</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b"><span>Chi phí mỗi lần sạc:</span><span className="font-bold">{costPerCharge.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</span></div>
            <div className="flex justify-between py-3 border-b"><span>Chi phí/tháng (sạc thường):</span><span className="font-bold">{monthlyCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</span></div>
            <div className="flex justify-between py-3 bg-green-50 -mx-4 px-4 rounded"><span className="font-bold">Tiết kiệm với solar:</span><span className="font-bold text-green-600">{solarSaving.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ/tháng</span></div>
          </div>
          <a href="/sac-xe-dien-tai-nha" className="block text-center mt-8 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-all">Xem Giải Pháp Sạc Xe</a>
        </div>
      </div>
    </div>
  );
}
