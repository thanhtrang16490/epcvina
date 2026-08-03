import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Lightning, TrendDown, CheckCircle, CurrencyCircleDollar, Shield, Car, Ruler, ClipboardText } from '@phosphor-icons/react';
import { POPULAR_COMBOS } from './data';

const trackEvent = (eventName: string, params: Record<string, string | number> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export default function CalculatorSection({ onSubmit }: { onSubmit: (data: any) => void | Promise<unknown> }) {
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [calc, setCalc] = useState({
    billAmount: '3000000',
    roofArea: '60',
    needs: [] as string[],
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showMethod, setShowMethod] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [quickLead, setQuickLead] = useState({ name: '', phone: '' });
  const [quickLeadSubmitted, setQuickLeadSubmitted] = useState(false);
  const [quickLeadError, setQuickLeadError] = useState('');
  const [quickLeadSending, setQuickLeadSending] = useState(false);

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
    const billMillion = bill / 1000000;
    const requiredKwp = Math.max(3, billMillion * 2.75);

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
    setHasCalculated(true);
    setQuickLeadSubmitted(false);
    trackEvent('mini_calculator_completed', {
      bill_value: bill,
      roof_area: roofArea,
      needs_count: calc.needs.length,
    });
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const needOptions = [
    { id: 'backup', label: 'Dùng điện khi mất điện', icon: Shield },
    { id: 'independent', label: 'Tự chủ hoàn toàn', icon: Lightning },
    { id: 'ev_charger', label: 'Sạc xe điện', icon: Car },
    { id: 'battery_later', label: 'Lắp pin lưu trữ sau', icon: Lightning },
  ];
  const quickBillOptions = [
    { label: '2 triệu', value: '2000000' },
    { label: '3 triệu', value: '3000000' },
    { label: '5 triệu', value: '5000000' },
    { label: '8 triệu', value: '8000000' },
  ];
  const calculatorSteps = [
    { icon: CurrencyCircleDollar, title: 'Hóa đơn', desc: 'Nhập mức tiền điện trung bình' },
    { icon: Ruler, title: 'Mái nhà', desc: 'Ước lượng diện tích có thể lắp' },
    { icon: ClipboardText, title: 'Kết quả', desc: 'Nhận cấu hình trước khảo sát' },
  ];
  const quickLeadValid = quickLead.name.trim().length >= 2 && quickLead.phone.replace(/\D/g, '').length >= 9;

  const submitQuickLead = async () => {
    if (!results?.combo || !quickLeadValid) return;
    setQuickLeadSending(true);
    setQuickLeadError('');
    try {
      await onSubmit({ system_size: results.combo.power_kw, combo_index: results.comboIndex, name: quickLead.name.trim(), phone: quickLead.phone.trim(), source: 'inline_calculator_lead' });
      trackEvent('landing_inline_lead_submitted', { source: 'family_landing_calculator_result', system_size: results.combo.power_kw });
      setQuickLeadSubmitted(true);
    } catch (error) {
      setQuickLeadError(error instanceof Error ? error.message : 'Chưa gửi được thông tin.');
    } finally {
      setQuickLeadSending(false);
    }
  };

  return (
    <section id="calculator" className="scroll-mt-24 py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-6 max-w-3xl text-center sm:mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3 leading-tight">
            Tính nhanh hệ điện mặt trời cho gia đình
          </h2>
          <p className="text-[14px] sm:text-lg text-slate-600 leading-relaxed">Chỉ cần 2 thông tin chính để EPCVINA ước tính cấu hình tham chiếu trước khi kỹ sư kiểm tra thực tế.</p>
        </motion.div>

        <div className="mb-5 grid gap-2 sm:mb-7 sm:grid-cols-3">
          {calculatorSteps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                <Icon className="h-5 w-5" weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[.1em] text-slate-400">Bước {i + 1}</p>
                <p className="text-sm font-black text-slate-900">{title}</p>
                <p className="text-xs leading-snug text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Input form */}
          <motion.div
            className="bg-slate-50 rounded-[22px] p-4 sm:rounded-2xl sm:p-8 space-y-4 sm:space-y-5 border border-slate-200/60"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-orange-600">Máy tính sơ bộ</p>
              <h3 className="mt-1 text-[18px] sm:text-xl font-black text-slate-900 leading-tight">Nhà anh/chị đang trả bao nhiêu tiền điện?</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">Nếu chưa nhớ chính xác, chọn nhanh một mức gần đúng. EPCVINA sẽ đối chiếu hóa đơn khi khảo sát.</p>
            </div>

            <div>
              <label htmlFor="landing-bill-amount" className="block text-sm font-medium text-slate-700 mb-1.5">Tiền điện trung bình / tháng</label>
              <div className="relative">
                <input
                  id="landing-bill-amount"
                  name="monthly_bill"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  value={calc.billAmount}
                  onChange={(e) => setCalc({ ...calc, billAmount: e.target.value })}
                  className="w-full px-4 py-3.5 pr-14 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base"
                  placeholder="VD: 3000000..."
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">VNĐ</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
                {quickBillOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCalc({ ...calc, billAmount: item.value })}
                    className={`rounded-full px-2.5 py-2 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs font-bold transition-colors ${
                      calc.billAmount === item.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="landing-roof-area" className="block text-sm font-medium text-slate-700 mb-1.5">Diện tích mái có thể sử dụng</label>
              <div className="relative">
                <input
                  id="landing-roof-area"
                  name="usable_roof_area"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  value={calc.roofArea}
                  onChange={(e) => setCalc({ ...calc, roofArea: e.target.value })}
                  className="w-full px-4 py-3.5 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base"
                  placeholder="VD: 50..."
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">m²</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nhu cầu đặc biệt</label>
                <div className="grid gap-2 min-[420px]:grid-cols-2 sm:block sm:space-y-2">
                  {needOptions.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
	                    className={`flex min-h-[60px] items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors active:scale-[0.99] sm:min-h-0 sm:gap-3 ${
                      calc.needs.includes(id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <input type="checkbox" name="special_needs" value={id} checked={calc.needs.includes(id)} onChange={() => toggleNeed(id)} className="sr-only" />
                    <Icon className={`w-5 h-5 shrink-0 ${calc.needs.includes(id) ? 'text-orange-500' : 'text-slate-400'}`} weight={calc.needs.includes(id) ? 'fill' : 'regular'} />
                    <span className="text-[12px] sm:text-sm font-medium leading-tight text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={calculate}
              className="w-full min-h-[50px] bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-base transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Xem cấu hình tham chiếu
            </button>
            <p className="text-xs leading-relaxed text-slate-500">
              Kết quả chỉ dùng để sàng lọc nhanh. EPCVINA sẽ khảo sát mái và hóa đơn trước khi báo giá.
            </p>
          </motion.div>

          {/* Results */}
          <motion.div
            ref={resultRef}
            className="space-y-4 scroll-mt-24"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            {!hasCalculated ? (
              <div className="flex h-full min-h-[360px] items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-[radial-gradient(circle_at_50%_0%,rgba(245,130,32,.12),transparent_35%),#f8fafc] p-6 sm:p-8">
                <div className="max-w-sm text-center">
                  <Calculator className="w-12 h-12 text-orange-300 mx-auto mb-3" weight="duotone" />
                  <p className="text-base font-black text-slate-900">Kết quả sẽ hiện ngay tại đây</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">Sau khi bấm tính, anh/chị sẽ thấy công suất, mức đầu tư, tiết kiệm dự kiến và câu hỏi có nên dùng Hybrid/pin lưu trữ hay không.</p>
                  <div className="mt-4 rounded-2xl border border-orange-100 bg-white p-3 text-left text-xs leading-relaxed text-slate-600">
                    <strong className="text-slate-900">Gợi ý:</strong> gia đình dùng nhiều ban đêm nên ưu tiên Hybrid để sẵn sàng lắp pin sau.
                  </div>
                </div>
              </div>
            ) : results?.combo ? (
              <>
                {/* Main result card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-[22px] p-4 sm:rounded-2xl sm:p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-emerald-600" weight="fill" />
                    <h3 className="text-lg font-bold text-emerald-900">Hệ Đề Xuất Cho Bạn</h3>
                  </div>

                  <h4 className="text-[18px] sm:text-xl font-bold text-slate-900 mb-4 leading-tight">{results.combo.title}</h4>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    {[
                      { icon: Lightning, label: 'Công suất', value: `${results.combo.power_kw} kWp`, color: 'text-orange-500' },
                      { icon: TrendDown, label: 'Tiết kiệm/tháng', value: `${(results.monthlySavings / 1000000).toFixed(1)} tr`, color: 'text-emerald-500' },
                      { icon: CurrencyCircleDollar, label: 'Đầu tư', value: `${results.combo.investment_million_vnd} tr`, color: 'text-orange-500' },
                      { icon: Shield, label: 'Hoàn vốn', value: results.combo.payback_label, color: 'text-slate-600' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/70 rounded-xl p-3 sm:p-3.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} weight="duotone" />
                          <span className="text-xs text-slate-500">{stat.label}</span>
                        </div>
                        <p className="text-[16px] sm:text-lg font-bold text-slate-900 leading-tight">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* 25-Year projection */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                    <p className="font-bold text-orange-900 text-sm mb-2">Dự kiến tiết kiệm dài hạn</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                      {[
                        { years: '5 năm', val: results.monthlySavings * 12 * 5 / 1000000 },
                        { years: '10 năm', val: results.monthlySavings * 12 * 10 / 1000000 },
                        { years: '25 năm', val: results.monthlySavings * 12 * 25 / 1000000 },
                      ].map((item, i) => (
                        <div key={i}>
                          <p className="text-xs text-orange-700">{item.years}</p>
                          <p className="text-[14px] sm:text-base font-bold text-orange-950">{item.val.toFixed(0)} tr</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mb-4 rounded-xl bg-white/75 px-3 py-2 text-[11.5px] leading-relaxed text-emerald-900/75">
                    Số tiền tiết kiệm và thời gian hoàn vốn là ước tính theo hóa đơn, sản lượng trung bình và mức tự dùng điện. Kết quả cuối cùng cần đối chiếu mái, hướng nắng, biểu giá điện và phụ tải thực tế.
                  </p>

                  {/* Method and assumptions */}
                  <button
                    type="button"
                    onClick={() => setShowMethod(!showMethod)}
                    className="w-full mb-3 sm:mb-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-900 font-semibold py-2.5 rounded-xl transition-colors text-sm focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    aria-expanded={showMethod}
                  >
                    {showMethod ? 'Ẩn' : 'Xem'} phương pháp tính & điều kiện ước tính
                  </button>

                  {showMethod && (
                    <div className="mb-4 grid gap-2 sm:mb-5 sm:grid-cols-2 sm:gap-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5">
                        <p className="font-bold text-orange-900 text-sm mb-2">Cách tính sơ bộ</p>
                        <ul className="text-xs space-y-1 text-slate-700">
                          <li>Dựa trên hóa đơn trung bình / tháng</li>
                          <li>Đối chiếu diện tích mái có thể lắp</li>
                          <li>Ước sản lượng theo combo EPCVINA</li>
                          <li>Tính tiết kiệm theo mức tự dùng điện</li>
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                        <p className="font-bold text-slate-900 text-sm mb-2">Điều kiện cần khảo sát</p>
                        <ul className="text-xs space-y-1 text-slate-700">
                          <li>Hướng mái, bóng che và kết cấu mái</li>
                          <li>Biểu giá điện, phụ tải ngày / đêm</li>
                          <li>On-Grid hay Hybrid theo nhu cầu thật</li>
                          <li>Pin lưu trữ chỉ chốt sau khi kiểm tải</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {results.combo.battery_kwh && (
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3.5 mb-5">
                      <Lightning className="w-5 h-5 text-orange-600 flex-shrink-0" weight="duotone" />
                      <div>
                        <p className="font-semibold text-orange-900 text-sm">Pin lưu trữ cần xác định theo tải ban đêm</p>
                        <p className="text-xs text-orange-700">Kỹ sư sẽ kiểm tra thiết bị cần dự phòng trước khi chốt dung lượng pin</p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="#contact"
                      onClick={() => {
                        trackEvent('landing_result_survey_click', {
                          source: 'family_landing_calculator_result',
                          system_size: results.combo.power_kw,
                        });
                      }}
                      className="flex min-h-[48px] items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-center font-bold text-white transition-colors hover:bg-orange-600 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    >
                      Nhận khảo sát miễn phí
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMethod(true);
                        trackEvent('landing_method_opened', { source: 'family_landing_result' });
                      }}
                      className="flex min-h-[48px] items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center font-bold text-emerald-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                      Xem cách EPCVINA tính
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[11.5px] leading-relaxed text-emerald-800/75">
                    Toàn bộ giải thích nằm ngay trên landing page, không chuyển anh/chị sang trang khác.
                  </p>
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-3.5 sm:p-4">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" weight="fill" />
                      <div>
                        <p className="text-sm font-black text-slate-900">Nhận kỹ sư EPCVINA gọi lại</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          Gửi nhanh tên và số điện thoại để kỹ sư kiểm tra hóa đơn, mái và tư vấn phương án phù hợp.
                        </p>
                      </div>
                    </div>
                    {quickLeadSubmitted ? (
                      <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                        Đã ghi nhận. EPCVINA sẽ liên hệ lại để hẹn khảo sát miễn phí.
                      </div>
                    ) : (
                      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <input
                          id="quick-lead-name"
                          name="quick_lead_name"
                          type="text"
                          autoComplete="name"
                          aria-label="Tên anh/chị"
                          value={quickLead.name}
                          onChange={(e) => setQuickLead(prev => ({ ...prev, name: e.target.value }))}
                          className="min-h-[44px] rounded-xl border border-slate-300 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                          placeholder="Tên anh/chị..."
                        />
                        <input
                          id="quick-lead-phone"
                          name="quick_lead_phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          aria-label="Số điện thoại"
                          value={quickLead.phone}
                          onChange={(e) => setQuickLead(prev => ({ ...prev, phone: e.target.value }))}
                          className="min-h-[44px] rounded-xl border border-slate-300 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                          placeholder="Số điện thoại..."
                        />
                        <button
                          type="button"
                          onClick={submitQuickLead}
                          disabled={!quickLeadValid || quickLeadSending}
	                          className={`min-h-[44px] rounded-xl px-4 text-sm font-black transition-colors ${
                            quickLeadValid
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]'
                              : 'cursor-not-allowed bg-slate-100 text-slate-400'
                          }`}
                        >
                          {quickLeadSending ? 'Đang gửi...' : 'Gửi nhanh'}
                        </button>
                      </div>
                    )}
                    {quickLeadError && <p className="mt-2 text-xs font-medium text-red-600">{quickLeadError}</p>}
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                      Thông tin chỉ dùng để EPCVINA tư vấn phương án điện mặt trời phù hợp cho gia đình anh/chị.
                    </p>
                  </div>
                </div>

                {/* Other combos */}
                {POPULAR_COMBOS.slice(0, 3).map((combo, i) => (
                  <div key={i} className="hidden sm:block bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
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
