/**
 * DienMatTroiGiaDinh - High-Conversion Landing Page for Google Ads
 * 
 * Strategy: Transform "báo giá điện mặt trời" searchers into qualified leads
 * Target: 5-12% conversion rate from Google Search traffic
 * 
 * Key USP: Personalized solar design based on actual home characteristics
 */

import { useState, useEffect } from 'react';
import {
  Phone,
  CheckCircle,
  Home,
  Zap,
  Battery,
  ArrowRight,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
  Calculator,
  TrendingDown,
  Car,
} from 'lucide-react';

interface CalculatorInputs {
  billAmount: number;
  roofArea: string;
  budget: string;
  needs: string[];
}

interface CalculatorResult {
  systemSize: string;
  monthlyProduction: number;
  monthlySavings: number;
  paybackYears: number;
  systemType: string;
}

export default function DienMatTroiGiaDinh() {
  const [calculator, setCalculator] = useState<CalculatorInputs>({
    billAmount: 3,
    roofArea: '50',
    budget: '100-200',
    needs: ['reduce_bill'],
  });

  const [showResult, setShowResult] = useState(false);
  const [finalForm, setFinalForm] = useState({
    name: '',
    phone: '',
    bill: '',
    location: '',
    needs: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= 0.5 && window.gtag) {
        gtag('event', 'scroll_50', { event_category: 'engagement' });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateSolar = (): CalculatorResult => {
    const bill = calculator.billAmount;
    const kwpPerMillion = 1.7;
    const systemSize = (bill * kwpPerMillion).toFixed(1);
    const monthlyProduction = Math.round(bill * 350);
    const savingsPercent = 0.85;
    const monthlySavings = Math.round(bill * 1000000 * savingsPercent) / 1000000;
    const costPerKwp = 15;
    const totalCost = parseFloat(systemSize) * costPerKwp;
    const annualSavings = monthlySavings * 12;
    const paybackYears = (totalCost / (annualSavings)).toFixed(1);
    
    let systemType = 'On-Grid';
    if (calculator.needs.includes('backup') || calculator.needs.includes('independent')) {
      systemType = 'Hybrid + Battery';
    } else if (calculator.needs.includes('ev_charger')) {
      systemType = 'Hybrid + EV Charger';
    }
    
    return {
      systemSize: `${systemSize} kWp`,
      monthlyProduction,
      monthlySavings,
      paybackYears: parseFloat(paybackYears),
      systemType,
    };
  };

  const handleCalculate = () => {
    setShowResult(true);
    if (window.gtag) {
      gtag('event', 'calculator_completed', { event_category: 'conversion' });
    }
  };

  const handleSubmitFinalForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.gtag) {
      gtag('event', 'form_submit', {
        event_category: 'conversion',
        event_label: 'final_cta_form',
        value: 1,
      });
    }
    alert('Cảm ơn! Chúng tôi sẽ liên hệ tư vấn trong 24h.');
  };

  const result = calculateSolar();

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 — HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
            alt="Solar panels on residential roof"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Điện Mặt Trời Được Thiết Kế
                <span className="block text-yellow-400 mt-2">Theo Chính Ngôi Nhà Của Bạn</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                Thiết kế dựa trên:
              </p>

              <div className="space-y-3">
                {[
                  'Hóa đơn điện hàng tháng',
                  'Diện tích mái thực tế',
                  'Ngân sách đầu tư',
                  'Nhu cầu dùng điện khi mất điện',
                  'Kế hoạch sử dụng xe điện trong tương lai',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Calculator className="w-5 h-5" />
                  Nhận Thiết Kế Sơ Bộ
                </a>
                <a
                  href="tel:0988446113"
                  onClick={() => window.gtag && gtag('event', 'hotline_click', { event_category: 'conversion' })}
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Gọi Ngay: 0988 446 113
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-6 text-center">Kết Quả Mẫu Cho Gia Đình Bạn</h3>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-slate-300 mb-1">Tiền điện hiện tại</p>
                  <p className="text-3xl font-bold text-yellow-400">3 triệu/tháng</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-slate-300 mb-1">Đề xuất</p>
                    <p className="text-xl font-bold">Hybrid 8.8 kWp</p>
                    <p className="text-sm text-green-400">Pin lưu trữ 10 kWh</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-slate-300 mb-1">Tiết kiệm</p>
                    <p className="text-xl font-bold text-green-400">2.5 triệu/tháng</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-slate-300 mb-1">Hoàn vốn</p>
                  <p className="text-3xl font-bold">5.1 năm</p>
                  <p className="text-sm text-slate-300">Sử dụng miễn phí 20+ năm sau đó</p>
                </div>
                <a
                  href="#calculator"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-center transition-all"
                >
                  Tính Cho Nhà Bạn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CALCULATOR */}
      <section id="calculator" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tính Toán Hệ Thống Phù Hợp Cho Bạn
            </h2>
            <p className="text-lg text-gray-600">Chỉ 1 phút để nhận đề xuất cá nhân hóa</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Tiền điện hàng tháng: <span className="text-orange-600">{calculator.billAmount} triệu</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={calculator.billAmount}
                    onChange={(e) => setCalculator({...calculator, billAmount: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>1 triệu</span>
                    <span>100 triệu</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Diện tích mái</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['20', '50', '100', '200'].map((area) => (
                      <button
                        key={area}
                        onClick={() => setCalculator({...calculator, roofArea: area})}
                        className={`py-3 rounded-lg font-semibold transition-all ${
                          calculator.roofArea === area ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {area}m²
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Ngân sách</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '<100', label: '<100 triệu' },
                      { value: '100-200', label: '100-200 triệu' },
                      { value: '200-500', label: '200-500 triệu' },
                      { value: '500+', label: '>500 triệu' },
                    ].map((budget) => (
                      <button
                        key={budget.value}
                        onClick={() => setCalculator({...calculator, budget: budget.value})}
                        className={`py-3 rounded-lg font-semibold transition-all ${
                          calculator.budget === budget.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Nhu cầu</label>
                  <div className="space-y-3">
                    {[
                      { value: 'reduce_bill', label: 'Chỉ giảm tiền điện', icon: TrendingDown },
                      { value: 'backup', label: 'Có điện khi mất điện', icon: Battery },
                      { value: 'ev_charger', label: 'Sạc xe điện', icon: Car },
                      { value: 'independent', label: 'Độc lập năng lượng', icon: Zap },
                    ].map((need) => (
                      <label
                        key={need.value}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          calculator.needs.includes(need.value) ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={calculator.needs.includes(need.value)}
                          onChange={(e) => {
                            const needs = e.target.checked ? [...calculator.needs, need.value] : calculator.needs.filter((n) => n !== need.value);
                            setCalculator({...calculator, needs});
                          }}
                          className="w-5 h-5 text-orange-500 rounded"
                        />
                        <need.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{need.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg"
                >
                  Tính Toán Ngay
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8">
                {!showResult ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Calculator className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                      <p className="text-xl font-semibold">Điền thông tin để xem kết quả</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-slate-300 mb-1">Công suất đề xuất</p>
                      <p className="text-3xl font-bold text-orange-400">{result.systemSize}</p>
                      <p className="text-sm text-green-400">{result.systemType}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm text-slate-300 mb-1">Sản lượng</p>
                        <p className="text-2xl font-bold">{result.monthlyProduction} kWh/tháng</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm text-slate-300 mb-1">Tiết kiệm</p>
                        <p className="text-2xl font-bold text-green-400">{result.monthlySavings} triệu/tháng</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-sm text-slate-300 mb-1">Hoàn vốn</p>
                      <p className="text-3xl font-bold">{result.paybackYears} năm</p>
                    </div>
                    <a
                      href="https://zalo.me/0988446113"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => window.gtag && gtag('event', 'zalo_click', { event_category: 'conversion' })}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-center transition-all"
                    >
                      📞 Nhận phương án chi tiết qua Zalo
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY EPCVINA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tại Sao Chọn EPCVINA Solar?</h2>
            <p className="text-lg text-gray-600">Không phải chỉ bán tấm pin — Chúng tôi xây dựng hệ thống điện cho ngôi nhà</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gốc Thầu MEP 15 Năm</h3>
              <p className="text-gray-700 leading-relaxed">Solar không chỉ là tấm pin. Đó là:</p>
              <ul className="mt-4 space-y-2">
                {['Điện AC & DC', 'Chống sét & Tiếp địa', 'Phòng cháy chữa cháy', 'Kết cấu mái', 'Bảo trì lâu dài'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bộ Tính Toán Thông Minh</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Không báo giá theo cảm tính. Thiết kế dựa trên:</p>
              <ul className="space-y-2">
                {['Tiền điện thực tế', 'Diện tích mái nhà', 'Ngân sách đầu tư', 'Mục tiêu sử dụng'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thi Công Như Hệ Thống Điện</h3>
              <p className="text-gray-700 leading-relaxed">An toàn — Gọn đẹp — Đồng bộ — Dễ bảo trì</p>
              <ul className="mt-4 space-y-2">
                {['An toàn tuyệt đối', 'Đi dây gọn đẹp', 'Đồng bộ thiết bị', 'Dễ dàng bảo trì'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SOLUTIONS BY HOUSEHOLD */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Giải Pháp Phù Hợp Cho Từng Gia Đình</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Nhà Phố', bill: '2-5 triệu', solution: '5-8 kWp', icon: Home, color: 'from-blue-500 to-blue-600' },
              { title: 'Biệt Thự', bill: '5-15 triệu', solution: '8-15 kWp', icon: Home, color: 'from-purple-500 to-purple-600' },
              { title: 'Nhà Có Xe Điện', bill: '5-20 triệu', solution: 'Hybrid + EV Charger', icon: Car, color: 'from-green-500 to-green-600' },
              { title: 'Cần Điện Khi Mất Lưới', bill: 'Tùy nhu cầu', solution: 'Hybrid + Battery', icon: Battery, color: 'from-orange-500 to-orange-600' },
            ].map((type, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${type.color} p-6 text-white`}>
                  <type.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Tiền điện</p>
                    <p className="text-lg font-bold text-gray-900">{type.bill}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giải pháp</p>
                    <p className="text-lg font-bold text-orange-600">{type.solution}</p>
                  </div>
                  <a href="#calculator" className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg text-center transition-all">
                    Tính Cho Nhà Tôi
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — PROCESS */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Quy Trình Triển Khai Minh Bạch</h2>
            <p className="text-lg text-gray-600">Không bán hàng ép buộc. Không báo giá mập mờ. Không thi công cẩu thả.</p>
          </div>

          <div className="space-y-8">
            {[
              { step: 1, title: 'Nhận thông tin', desc: 'Qua form, Zalo hoặc điện thoại' },
              { step: 2, title: 'Khảo sát mái', desc: 'Đo đạc thực tế, đánh giá kết cấu' },
              { step: 3, title: 'Thiết kế sơ bộ', desc: 'Bố trí tấm pin, tính toán sản lượng' },
              { step: 4, title: 'Báo giá chi tiết', desc: 'Minh bạch từng hạng mục' },
              { step: 5, title: 'Ký hợp đồng', desc: 'Ghi rõ bảo hành, tiến độ' },
              { step: 6, title: 'Thi công', desc: '1-2 ngày, an toàn, gọn đẹp' },
              { step: 7, title: 'Bảo hành & Vận hành', desc: '25 năm hiệu suất, hỗ trợ 24/7' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CAPABILITY PROOF */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Năng Lực Thực Tế</h2>
            <p className="text-lg text-slate-300">15 năm kinh nghiệm MEP, không phải mới vào nghề</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Năm kinh nghiệm' },
              { number: '200+', label: 'Dự án đã triển khai' },
              { number: '500+', label: 'Nhân sự kỹ thuật' },
              { number: '100MWp+', label: 'Kinh nghiệm tích lũy' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-orange-400 mb-2">{stat.number}</div>
                <div className="text-lg text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CASE STUDY */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Case Study Thực Tế</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nhà Phố Hà Nội</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trước</p>
                    <p className="text-3xl font-bold text-red-600">3.2 triệu/tháng</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sau</p>
                    <p className="text-3xl font-bold text-green-600">320 nghìn/tháng</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Giải pháp</p>
                      <p className="text-lg font-bold">Hybrid 8.8 kWp</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tiết kiệm</p>
                      <p className="text-lg font-bold text-orange-600">34 triệu/năm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hoàn vốn</p>
                      <p className="text-lg font-bold">5 năm</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"
                  alt="Dự án điện mặt trời nhà phố Hà Nội"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="space-y-3">
                  {[
                    'Thi công trong 2 ngày',
                    'Không ảnh hưởng sinh hoạt',
                    'Có điện khi mất lưới',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#final-cta" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-center transition-all">
                  Tôi Cũng Muốn Vậy →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FAQ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Điện mặt trời có hiệu quả không?', a: 'Có. Trung bình giảm 70-85% hóa đơn điện. Hệ thống hoạt động 25-30 năm, hoàn vốn trong 3-5 năm.' },
              { q: 'Nhà tôi có phù hợp không?', a: 'Hầu hết các mái nhà đều lắp được. Chúng tôi khảo sát miễn phí để đánh giá chính xác.' },
              { q: 'Bao lâu hoàn vốn?', a: 'Trung bình 3-5 năm cho On-Grid, 5-7 năm cho Hybrid. Sau đó sử dụng điện miễn phí 20+ năm.' },
              { q: 'Mất điện có dùng được không?', a: 'Hệ On-Grid sẽ ngắt khi mất điện (an toàn). Hệ Hybrid có pin lưu trữ nên vẫn dùng được.' },
              { q: 'Có thể sạc xe điện không?', a: 'Có. Chúng tôi tích hợp EV Charger vào hệ Hybrid, sạc miễn phí từ năng lượng mặt trời.' },
              { q: 'Mưa nhiều có đủ điện không?', a: 'Tấm pin vẫn sản xuất điện khi mưa (giảm 10-20%). Hệ thống được thiết kế dựa trên dữ liệu thời tiết địa phương.' },
              { q: 'Có phải bảo trì thường xuyên không?', a: 'Không. Chỉ cần vệ sinh tấm pin 2-4 lần/năm. Chúng tôi bảo hành 25 năm hiệu suất.' },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section id="final-cta" className="py-16 sm:py-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nhận Phương Án Điện Mặt Trời Riêng Cho Ngôi Nhà Của Bạn</h2>
            <p className="text-xl text-orange-100 mb-8">Chỉ cần cung cấp thông tin cơ bản. Nhận giải pháp cá nhân hóa trong 24h.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Chỉ cần:</h3>
                <ul className="space-y-3">
                  {['Tiền điện hàng tháng', 'Diện tích mái', 'Nhu cầu sử dụng'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Bạn nhận:</h3>
                <ul className="space-y-3">
                  {['Công suất đề xuất', 'Dự toán đầu tư', 'Thời gian hoàn vốn', 'Giải pháp Hybrid phù hợp'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmitFinalForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={finalForm.name}
                    onChange={(e) => setFinalForm({...finalForm, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={finalForm.phone}
                    onChange={(e) => setFinalForm({...finalForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="0988 446 113"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tiền điện hàng tháng</label>
                  <input
                    type="text"
                    value={finalForm.bill}
                    onChange={(e) => setFinalForm({...finalForm, bill: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="3 triệu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Khu vực lắp đặt</label>
                  <input
                    type="text"
                    value={finalForm.location}
                    onChange={(e) => setFinalForm({...finalForm, location: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="Quận/Huyện, Hà Nội"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nhu cầu</label>
                  <div className="space-y-2">
                    {[
                      { value: 'save_money', label: 'Tiết kiệm điện' },
                      { value: 'backup', label: 'Có điện khi mất điện' },
                      { value: 'ev', label: 'Sạc xe điện' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="needs"
                          value={option.value}
                          checked={finalForm.needs === option.value}
                          onChange={(e) => setFinalForm({...finalForm, needs: e.target.value})}
                          className="w-4 h-4 text-orange-500"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg"
                >
                  Nhận Phương Án Của Tôi
                </button>

                <p className="text-xs text-gray-500 text-center">🔒 Thông tin được bảo mật. Không spam.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-8 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-lg mb-4">Hoặc liên hệ trực tiếp:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0988446113"
              onClick={() => window.gtag && gtag('event', 'hotline_click', { event_category: 'conversion' })}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition-all"
            >
              <Phone className="w-5 h-5" />
              0988 446 113
            </a>
            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.gtag && gtag('event', 'zalo_click', { event_category: 'conversion' })}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all"
            >
              Chat Zalo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">{question}</span>
        {isOpen ? <ChevronUp className="w-6 h-6 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-6 h-6 text-gray-500 flex-shrink-0" />}
      </button>
      {isOpen && <div className="px-6 pb-6 text-gray-700 leading-relaxed">{answer}</div>}
    </div>
  );
}
