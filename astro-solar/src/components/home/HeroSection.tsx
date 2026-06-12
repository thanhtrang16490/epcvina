import {
  Zap,
  Shield,
  Battery,
  Building2,
  Clock,
  Sun,
  Scale,
  Play,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Factory,
} from 'lucide-react';

const NAVY = '#1a365d';
const ORANGE = '#ea580c';

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100dvh', minHeight: '100dvh' }}
    >
      {/* ─── Background Image + Overlay ─── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-background Large.jpeg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />

      {/* ─── Content Wrapper: flex column filling full height ─── */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">

        {/* ── 1. Main Headline Area ── */}
        <div className="pt-20 md:pt-24 pb-3 md:pb-4 px-4 sm:px-6 text-center flex-shrink-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 md:mb-3">
            <span style={{ color: '#3b82f6' }}>HYBRID</span>{' '}
            <span className="text-white">HAY</span>{' '}
            <span style={{ color: ORANGE }}>ON-GRID</span>
            <span className="text-white">?</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-200 leading-snug mb-3 md:mb-4">
            Thiết kế hệ thống điện mặt trời tối ưu theo nhu cầu sử dụng thực tế,
            <br className="hidden sm:block" />
            giúp giảm chi phí điện và tối đa hiệu quả đầu tư.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-3">
            <a
              href="/solutions"
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-white font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: ORANGE }}
            >
              <Scale className="w-4 h-4" />
              SO SÁNH GIẢI PHÁP
            </a>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full border-2 border-white text-white font-semibold text-xs md:text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-4 h-4" />
              XEM DỰ ÁN ĐÃ TRIỂN KHAI
            </a>
          </div>
        </div>

        {/* ── 2. Comparison Cards ── */}
        <div className="px-3 sm:px-6 pb-2 md:pb-3 flex-shrink-0">
          <div className="max-w-5xl mx-auto flex flex-row items-stretch relative">
            {/* HYBRID Card */}
            <div
              className="w-[38%] rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-md border border-white/10 text-white flex flex-col"
              style={{ backgroundColor: 'rgba(26, 54, 93, 0.88)' }}
            >
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold mb-2 md:mb-3 text-center tracking-wide">
                HYBRID
              </h2>
              <ul className="space-y-1.5 md:space-y-2">
                <li className="flex items-start gap-2">
                  <Battery className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                  <span className="text-xs sm:text-sm">Có lưu trữ (Battery)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                  <span className="text-xs sm:text-sm">Hoạt động khi mất điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                  <span className="text-xs sm:text-sm">Tiết kiệm tối đa</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                  <span className="text-xs sm:text-sm">Chi phí đầu tư cao hơn</span>
                </li>
              </ul>
              {/* Hybrid device illustration: inverter + battery */}
              <div className="mt-auto pt-3 flex items-end justify-center gap-2">
                {/* Inverter box */}
                <svg width="52" height="72" viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <rect x="2" y="2" width="48" height="68" rx="5" fill="white" fillOpacity="0.95" stroke="#cbd5e1" strokeWidth="1"/>
                  <rect x="8" y="8" width="36" height="20" rx="3" fill="#dbeafe"/>
                  <text x="26" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">HYBRID</text>
                  <rect x="8" y="32" width="36" height="4" rx="2" fill="#bfdbfe"/>
                  <rect x="8" y="40" width="36" height="4" rx="2" fill="#bfdbfe"/>
                  <rect x="8" y="48" width="36" height="4" rx="2" fill="#bfdbfe"/>
                  <circle cx="26" cy="62" r="4" fill="#3b82f6"/>
                </svg>
                {/* Battery pack */}
                <svg width="38" height="60" viewBox="0 0 38 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <rect x="2" y="8" width="34" height="50" rx="4" fill="white" fillOpacity="0.95" stroke="#cbd5e1" strokeWidth="1"/>
                  <rect x="13" y="2" width="12" height="8" rx="2" fill="white" stroke="#cbd5e1" strokeWidth="1"/>
                  <rect x="6" y="14" width="26" height="6" rx="2" fill="#bbf7d0"/>
                  <rect x="6" y="24" width="26" height="6" rx="2" fill="#bbf7d0"/>
                  <rect x="6" y="34" width="26" height="6" rx="2" fill="#86efac"/>
                  <rect x="6" y="44" width="26" height="6" rx="2" fill="#4ade80"/>
                  <text x="19" y="57" textAnchor="middle" fontSize="7" fill="#15803d" fontWeight="bold">BAT</text>
                </svg>
              </div>
            </div>

            {/* VS center — transparent gap shows background */}
            <div className="flex-1 flex items-center justify-center z-10">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-black shadow-2xl border-4 border-white/30"
                style={{
                  background: 'linear-gradient(135deg, #1a365d 50%, #ea580c 50%)',
                  color: '#fff',
                }}
              >
                VS
              </div>
            </div>

            {/* ON-GRID Card */}
            <div
              className="w-[38%] rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-md border border-white/10 text-white flex flex-col"
              style={{ backgroundColor: 'rgba(180, 60, 8, 0.88)' }}
            >
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold mb-2 md:mb-3 text-center tracking-wide">
                ON-GRID
              </h2>
              <ul className="space-y-1.5 md:space-y-2">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" />
                  <span className="text-xs sm:text-sm">Không lưu trữ điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" />
                  <span className="text-xs sm:text-sm">Phụ thuộc vào lưới điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" />
                  <span className="text-xs sm:text-sm">Chi phí đầu tư thấp hơn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" />
                  <span className="text-xs sm:text-sm">Hoàn vốn nhanh hơn</span>
                </li>
              </ul>
              {/* On-Grid device illustration: single inverter */}
              <div className="mt-auto pt-3 flex items-end justify-center">
                <svg width="56" height="76" viewBox="0 0 56 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <rect x="2" y="2" width="52" height="72" rx="5" fill="white" fillOpacity="0.95" stroke="#fed7aa" strokeWidth="1"/>
                  <rect x="8" y="8" width="40" height="22" rx="3" fill="#ffedd5"/>
                  <text x="28" y="20" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#c2410c">ON-GRID</text>
                  <text x="28" y="28" textAnchor="middle" fontSize="6" fill="#ea580c">INVERTER</text>
                  <rect x="8" y="34" width="40" height="4" rx="2" fill="#fed7aa"/>
                  <rect x="8" y="42" width="40" height="4" rx="2" fill="#fed7aa"/>
                  <rect x="8" y="50" width="40" height="4" rx="2" fill="#fed7aa"/>
                  <circle cx="20" cy="66" r="4" fill="#f97316"/>
                  <circle cx="36" cy="66" r="4" fill="#fb923c"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Comparison Table (pushed to bottom, just above stats) ── */}
        <div className="flex-1" />
        <div className="px-3 sm:px-6 pb-2 flex-shrink-0">
          <div
            className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: 'rgba(10, 25, 55, 0.82)', backdropFilter: 'blur(12px)' }}
          >
            <table className="w-full text-xs sm:text-sm">
              <tbody>
                {[
                  {
                    label: 'Chi phí đầu tư',
                    hybrid: 'Cao hơn',
                    hybridColor: '#60a5fa',
                    ongrid: 'Thấp hơn',
                    ongridColor: '#fb923c',
                    icon: <Building2 className="w-4 h-4 text-white/60" />,
                  },
                  {
                    label: 'Thời gian hoàn vốn',
                    hybrid: '6 - 8 năm',
                    hybridColor: '#60a5fa',
                    ongrid: '4 - 6 năm',
                    ongridColor: '#fb923c',
                    icon: <Clock className="w-4 h-4 text-white/60" />,
                  },
                  {
                    label: 'Lưu trữ điện',
                    hybrid: 'Có Battery',
                    hybridColor: '#60a5fa',
                    ongrid: 'Không',
                    ongridColor: '#fb923c',
                    icon: <Battery className="w-4 h-4 text-white/60" />,
                  },
                  {
                    label: 'Hoạt động khi mất điện',
                    hybrid: 'Có',
                    hybridColor: '#60a5fa',
                    ongrid: 'Không',
                    ongridColor: '#fb923c',
                    icon: <Zap className="w-4 h-4 text-white/60" />,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <td className="py-2.5 px-4 md:px-6 font-medium text-white/90 text-xs sm:text-sm w-[35%]">
                      {row.label}
                    </td>
                    <td
                      className="py-2.5 px-3 md:px-4 text-center font-bold text-xs sm:text-sm w-[25%]"
                      style={{ color: row.hybridColor }}
                    >
                      {row.hybrid}
                    </td>
                    <td className="py-2.5 px-2 text-center w-[15%]">{row.icon}</td>
                    <td
                      className="py-2.5 px-3 md:px-4 text-center font-bold text-xs sm:text-sm w-[25%]"
                      style={{ color: row.ongridColor }}
                    >
                      {row.ongrid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 4. Stats Bar — floats at bottom with white bg ── */}
        <div className="px-3 sm:px-6 pb-4 md:pb-5 flex-shrink-0">
          <div
            className="max-w-5xl mx-auto rounded-2xl shadow-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)' }}
          >
            <div className="grid grid-cols-4 divide-x divide-gray-200">
              {[
                {
                  icon: <Sun className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" />,
                  value: '500+',
                  label: 'Dự án hoàn thành',
                },
                {
                  icon: <Zap className="w-7 h-7 md:w-9 md:h-9 text-[#ea580c]" />,
                  value: '50MWp+',
                  label: 'Công suất đã triển khai',
                },
                {
                  icon: <Factory className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" />,
                  value: 'EPC',
                  label: 'Tổng thầu trọn gói',
                },
                {
                  icon: <Shield className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" />,
                  value: 'Bảo hành',
                  label: 'Dài hạn, chuyên nghiệp',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-2 md:px-4"
                >
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div>
                    <p className="text-sm md:text-xl font-extrabold text-gray-900 leading-none mb-0.5">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-gray-500 leading-tight">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
