import { useState } from 'react';
import { Calculator, Zap, TrendingDown, ArrowRight, CheckCircle, DollarSign, Shield, Car, Battery } from 'lucide-react';
import { POPULAR_COMBOS, type Combo } from './data';

export default function CalculatorSection({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [calc, setCalc] = useState({
    billAmount: '',
    roofArea: '',
    needs: [] as string[],
  });
  const [showComparison, setShowComparison] = useState(false);
  const [results, setResults] = useState<any>(null);

  const toggleNeed = (need: string) => {
    setCalc(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need],
    }));
  };

  const calculate = () => {
    const bill = parseFloat(calc.billAmount) || 0;
    const roofArea = parseInt(calc.roofArea) || 0;
    const requiredKwp = bill * 1.7;

    let filteredCombos = [...POPULAR_COMBOS];

    if (calc.needs.includes('backup') || calc.needs.includes('independent')) {
      filteredCombos = filteredCombos.filter(c => c.system_type === 'hybrid');
    } else if (calc.needs.includes('ev_charger')) {
      filteredCombos = filteredCombos.filter(c => c.system_type === 'hybrid' && c.power_kw >= 8);
    }

    if (roofArea > 0) {
      filteredCombos = filteredCombos.filter(c => !c.roof_area_m2 || c.roof_area_m2 <= roofArea * 1.2);
    }

    if (filteredCombos.length === 0) filteredCombos = POPULAR_COMBOS;

    const bestCombo = filteredCombos.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.power_kw - requiredKwp);
      const currDiff = Math.abs(curr.power_kw - requiredKwp);
      return currDiff < prevDiff ? curr : prev;
    }, filteredCombos[0]);

    const monthlyProd = Math.round((bestCombo.production_min_kwh + bestCombo.production_max_kwh) / 2);
    const monthlySavings = monthlyProd * 4000;
    const comboIndex = POPULAR_COMBOS.indexOf(bestCombo);

    setResults({
      combo: bestCombo,
      monthlySavings,
      comboIndex,
    });
    setShowComparison(true);
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Nhận Thiết Kế & Báo Giá Trong 30 Giây
          </h2>
          <p className="text-xl text-slate-600">Điền thông tin cơ bản, chúng tôi tính toán hệ tối ưu nhất cho bạn</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Thông Tin Cơ Bản</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tiền điện trung bình / tháng</label>
              <div className="relative">
                <input
                  type="number"
                  value={calc.billAmount}
                  onChange={(e) => setCalc({ ...calc, billAmount: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="VD: 3000000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">VNĐ</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Diện tích mái có thể sử dụng</label>
              <div className="relative">
                <input
                  type="number"
                  value={calc.roofArea}
                  onChange={(e) => setCalc({ ...calc, roofArea: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="VD: 50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">m²</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Nhu cầu đặc biệt (tùy chọn)</label>
              <div className="space-y-3">
                {[
                  { id: 'backup', label: 'Dùng điện khi mất điện', icon: Shield },
                  { id: 'independent', label: 'Tự chủ hoàn toàn', icon: Zap },
                  { id: 'ev_charger', label: 'Sạc xe điện', icon: Car },
                  { id: 'battery_later', label: 'Lắp pin lưu trữ sau', icon: Battery },
                ].map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      calc.needs.includes(id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={calc.needs.includes(id)}
                      onChange={() => toggleNeed(id)}
                      className="hidden"
                    />
                    <Icon className={`w-5 h-5 ${calc.needs.includes(id) ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg text-lg transition-all"
            >
              Xem Kết Quả & Báo Giá
            </button>
          </div>

          <div className="space-y-6">
            {!showComparison ? (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 flex items-center justify-center h-full">
                <div className="text-center">
                  <Calculator className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-slate-600">Điền thông tin bên trái để xem hệ đề xuất</p>
                </div>
              </div>
            ) : results && results.combo ? (
              <>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-2xl font-bold text-green-900">Hệ Đề Xuất Cho Bạn</h3>
                  </div>

                  <h4 className="text-2xl font-bold text-slate-900 mb-4">{results.combo.title}</h4>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-slate-600">Công suất</span>
                      </div>
                      <p className="text-xl font-bold text-slate-900">{results.combo.power_kw} kWp</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-600">Tiết kiệm/tháng</span>
                      </div>
                      <p className="text-xl font-bold text-green-600">{(results.monthlySavings / 1000000).toFixed(1)} tr</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600">Đầu tư</span>
                      </div>
                      <p className="text-xl font-bold text-slate-900">{results.combo.investment_million_vnd} tr</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-slate-600">Hoàn vốn</span>
                      </div>
                      <p className="text-xl font-bold text-slate-900">{results.combo.payback_label}</p>
                    </div>
                  </div>

                  {/* 25-Year Savings Projection */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h5 className="font-bold text-blue-900 mb-3">📊 Dự Kiến Tiết Kiệm 25 Năm</h5>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-blue-700">5 năm</p>
                        <p className="text-lg font-bold text-blue-900">{(results.monthlySavings * 12 * 5 / 1000000).toFixed(0)} tr</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">10 năm</p>
                        <p className="text-lg font-bold text-blue-900">{(results.monthlySavings * 12 * 10 / 1000000).toFixed(0)} tr</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">25 năm</p>
                        <p className="text-lg font-bold text-blue-900">{(results.monthlySavings * 12 * 25 / 1000000).toFixed(0)} tr</p>
                      </div>
                    </div>
                  </div>

                  {/* On-Grid vs Hybrid Comparison */}
                  <button 
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full mb-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg transition-all"
                  >
                    {showComparison ? '▼' : '▶'} So Sánh On-Grid vs Hybrid
                  </button>

                  {showComparison && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                        <h5 className="font-bold text-orange-900 mb-2">On-Grid</h5>
                        <ul className="text-sm space-y-1 text-slate-700">
                          <li>✅ Giá rẻ hơn 40-50%</li>
                          <li>✅ Tiết kiệm tối đa</li>
                          <li>❌ Mất điện = ngừng</li>
                          <li>✅ Hoàn vốn nhanh</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <h5 className="font-bold text-blue-900 mb-2">Hybrid</h5>
                        <ul className="text-sm space-y-1 text-slate-700">
                          <li>✅ Có pin lưu trữ</li>
                          <li>✅ Dùng khi mất điện</li>
                          <li>✅ Độc lập lưới điện</li>
                          <li>❌ Đầu tư cao hơn</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {results.combo.battery_kwh && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Pin lưu trữ tích hợp</span>
                      </div>
                      <p className="text-sm text-blue-700">Dùng điện thoải mái khi mất điện và buổi tối</p>
                    </div>
                  )}

                  <a
                    href="#contact"
                    onClick={() => onSubmit({ system_size: results.combo.power_kw, combo_index: results.comboIndex })}
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-center text-lg transition-all"
                  >
                    Liên Hệ Tư Vấn Chi Tiết →
                  </a>
                </div>

                {POPULAR_COMBOS.slice(0, 3).map((combo, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">{combo.title}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500">Công suất:</span>
                        <span className="ml-2 font-semibold">{combo.power_kw} kWp</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Đầu tư:</span>
                        <span className="ml-2 font-semibold">{combo.investment_million_vnd} tr</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Sản lượng:</span>
                        <span className="ml-2 font-semibold">{combo.production_min_kwh}-{combo.production_max_kwh} kWh</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Hoàn vốn:</span>
                        <span className="ml-2 font-semibold">{combo.payback_label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
