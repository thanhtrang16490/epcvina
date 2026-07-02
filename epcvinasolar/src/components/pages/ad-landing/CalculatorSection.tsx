import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Lightning, TrendDown, CheckCircle, CurrencyCircleDollar, Shield, Car } from '@phosphor-icons/react';
import { POPULAR_COMBOS } from './data';

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

    setResults({ combo: bestCombo, monthlySavings, comboIndex });
    setShowComparison(true);
  };

  const needOptions = [
    { id: 'backup', label: 'Dùng điện khi mất điện', icon: Shield },
    { id: 'independent', label: 'Tự chủ hoàn toàn', icon: Lightning },
    { id: 'ev_charger', label: 'Sạc xe điện', icon: Car },
    { id: 'battery_later', label: 'Lắp pin lưu trữ sau', icon: Lightning },
  ];

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Nhận Thiết Kế & Báo Giá Trong 30 Giây
          </h2>
          <p className="text-lg text-slate-600">Điền thông tin cơ bản, chúng tôi tính toán hệ tối ưu nhất</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input form */}
          <motion.div
            className="bg-slate-50 rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200/60"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h3 className="text-lg font-bold text-slate-900">Thông Tin Cơ Bản</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tiền điện trung bình / tháng</label>
              <div className="relative">
                <input
                  type="number"
                  value={calc.billAmount}
                  onChange={(e) => setCalc({ ...calc, billAmount: e.target.value })}
                  className="w-full px-4 py-3 pr-14 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base"
                  placeholder="VD: 3000000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">VNĐ</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Diện tích mái có thể sử dụng</label>
              <div className="relative">
                <input
                  type="number"
                  value={calc.roofArea}
                  onChange={(e) => setCalc({ ...calc, roofArea: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base"
                  placeholder="VD: 50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">m²</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nhu cầu đặc biệt</label>
              <div className="space-y-2">
                {needOptions.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all active:scale-[0.99] ${
                      calc.needs.includes(id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <input type="checkbox" checked={calc.needs.includes(id)} onChange={() => toggleNeed(id)} className="hidden" />
                    <Icon className={`w-5 h-5 ${calc.needs.includes(id) ? 'text-orange-500' : 'text-slate-400'}`} weight={calc.needs.includes(id) ? 'fill' : 'regular'} />
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-base transition-colors"
            >
              Xem Kết Quả & Báo Giá
            </button>
          </motion.div>

          {/* Results */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            {!showComparison ? (
              <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center h-full border border-slate-200/60 border-dashed">
                <div className="text-center">
                  <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" weight="duotone" />
                  <p className="text-slate-500 text-sm">Điền thông tin bên trái để xem hệ đề xuất</p>
                </div>
              </div>
            ) : results?.combo ? (
              <>
                {/* Main result card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-emerald-600" weight="fill" />
                    <h3 className="text-lg font-bold text-emerald-900">Hệ Đề Xuất Cho Bạn</h3>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900 mb-4">{results.combo.title}</h4>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { icon: Lightning, label: 'Công suất', value: `${results.combo.power_kw} kWp`, color: 'text-orange-500' },
                      { icon: TrendDown, label: 'Tiết kiệm/tháng', value: `${(results.monthlySavings / 1000000).toFixed(1)} tr`, color: 'text-emerald-500' },
                      { icon: CurrencyCircleDollar, label: 'Đầu tư', value: `${results.combo.investment_million_vnd} tr`, color: 'text-blue-500' },
                      { icon: Shield, label: 'Hoàn vốn', value: results.combo.payback_label, color: 'text-purple-500' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/70 rounded-xl p-3.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} weight="duotone" />
                          <span className="text-xs text-slate-500">{stat.label}</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* 25-Year projection */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                    <p className="font-bold text-blue-900 text-sm mb-2">Dự Kiến Tiết Kiệm 25 Năm</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { years: '5 năm', val: results.monthlySavings * 12 * 5 / 1000000 },
                        { years: '10 năm', val: results.monthlySavings * 12 * 10 / 1000000 },
                        { years: '25 năm', val: results.monthlySavings * 12 * 25 / 1000000 },
                      ].map((item, i) => (
                        <div key={i}>
                          <p className="text-xs text-blue-600">{item.years}</p>
                          <p className="text-base font-bold text-blue-900">{item.val.toFixed(0)} tr</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* On-Grid vs Hybrid */}
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full mb-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-900 font-semibold py-2.5 rounded-xl transition-all text-sm"
                  >
                    {showComparison ? 'Ẩn' : 'Xem'} So Sánh On-Grid vs Hybrid
                  </button>

                  {showComparison && (
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5">
                        <p className="font-bold text-orange-900 text-sm mb-2">On-Grid</p>
                        <ul className="text-xs space-y-1 text-slate-700">
                          <li>Giá rẻ hơn 40-50%</li>
                          <li>Tiết kiệm tối đa</li>
                          <li className="text-slate-400">Mất điện = ngừng</li>
                          <li>Hoàn vốn nhanh</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                        <p className="font-bold text-blue-900 text-sm mb-2">Hybrid</p>
                        <ul className="text-xs space-y-1 text-slate-700">
                          <li>Có pin lưu trữ</li>
                          <li>Dùng khi mất điện</li>
                          <li>Độc lập lưới điện</li>
                          <li className="text-slate-400">Đầu tư cao hơn</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {results.combo.battery_kwh && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3.5 mb-5">
                      <Lightning className="w-5 h-5 text-blue-600 flex-shrink-0" weight="duotone" />
                      <div>
                        <p className="font-semibold text-blue-900 text-sm">Pin lưu trữ tích hợp</p>
                        <p className="text-xs text-blue-600">Dùng điện thoải mái khi mất điện và buổi tối</p>
                      </div>
                    </div>
                  )}

                  <a
                    href="#contact"
                    onClick={() => onSubmit({ system_size: results.combo.power_kw, combo_index: results.comboIndex })}
                    className="block w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-center transition-colors"
                  >
                    Liên Hệ Tư Vấn Chi Tiết
                  </a>
                </div>

                {/* Other combos */}
                {POPULAR_COMBOS.slice(0, 3).map((combo, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                    <h4 className="text-base font-bold text-slate-900 mb-2">{combo.title}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-slate-500">Công suất: <span className="font-semibold text-slate-900">{combo.power_kw} kWp</span></span>
                      <span className="text-slate-500">Đầu tư: <span className="font-semibold text-slate-900">{combo.investment_million_vnd} tr</span></span>
                      <span className="text-slate-500">Sản lượng: <span className="font-semibold text-slate-900">{combo.production_min_kwh}-{combo.production_max_kwh} kWh</span></span>
                      <span className="text-slate-500">Hoàn vốn: <span className="font-semibold text-slate-900">{combo.payback_label}</span></span>
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
