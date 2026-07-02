import { useState } from 'react';
import { Sun, ArrowLeft } from '@phosphor-icons/react';

export default function SanLuongDienPage() {
  const [systemSize, setSystemSize] = useState(5);
  const [location, setLocation] = useState('hanoi');
  const sunHours: Record<string, number> = { hanoi: 4.2, hochiminh: 4.8, danang: 4.5, haiphong: 4.0, hue: 4.3 };
  const monthlyProduction = Math.round(systemSize * (sunHours[location] || 4.2) * 30 * 0.8);
  const yearlyProduction = monthlyProduction * 12;

  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/calculator" className="inline-flex items-center gap-2 text-orange-600 mb-6"><ArrowLeft className="w-4 h-4" /> Quay lại</a>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Sun className="text-orange-500" /> Tính Sản Lượng Điện</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Công suất hệ thống (kWp)</label>
              <input type="range" min="3" max="20" value={systemSize} onChange={(e) => setSystemSize(Number(e.target.value))} className="w-full" />
              <div className="text-center text-2xl font-bold text-orange-500 mt-2">{systemSize} kWp</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Khu vực</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                <option value="hanoi">Hà Nội</option>
                <option value="hochiminh">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="hue">Huế</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Sản Lượng Ước Tính</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <p className="text-sm text-slate-600">Hàng tháng</p>
              <p className="text-3xl font-bold text-orange-600">{monthlyProduction}</p>
              <p className="text-sm text-slate-500">kWh/tháng</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-sm text-slate-600">Hàng năm</p>
              <p className="text-3xl font-bold text-green-600">{yearlyProduction.toLocaleString()}</p>
              <p className="text-sm text-slate-500">kWh/năm</p>
            </div>
          </div>
          <a href="/lien-he" className="block text-center mt-8 bg-orange-500 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-all">Nhận Tư Vấn</a>
        </div>
      </div>
    </div>
  );
}
