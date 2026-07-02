import { motion } from 'motion/react';
import {
  Lightning,
  Building,
  Clock,
  Sun,
  TrendUp,
  XCircle,
  CheckCircle,
} from '@phosphor-icons/react';

const ORANGE = '#ea580c';

export default function ComparisonSection() {
  return (
    <section className="bg-white">
      {/* Visual hero cards — inherits hero background */}
      <div className="relative py-12 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-background Large.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section label + headline */}
          <motion.div
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
              CHỌN HỆ THỐNG PHÙ HỢP
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              <span style={{ color: '#60a5fa' }}>Hybrid</span>{' '}
              <span className="text-white/60">hay</span>{' '}
              <span style={{ color: ORANGE }}>On-Grid</span>
              <span className="text-white">?</span>
            </h2>
            <p className="mt-3 text-white text-sm sm:text-base max-w-xl mx-auto">
              Thiết kế hệ thống điện mặt trời tối ưu theo nhu cầu sử dụng thực tế —
              giúp giảm chi phí điện và tối đa hiệu quả đầu tư.
            </p>
          </motion.div>

          {/* Side-by-side hero cards + VS badge */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* HYBRID Card */}
            <div
              className="flex-1 rounded-2xl sm:rounded-r-none p-4 sm:p-6 border border-white/10 text-white flex flex-col"
              style={{ backgroundColor: 'rgba(26, 54, 93, 0.90)', backdropFilter: 'blur(12px)' }}
            >
              <h3 className="text-lg sm:text-xl font-extrabold mb-4 text-center tracking-wide text-blue-300">
                HYBRID
              </h3>
              <ul className="space-y-2 flex-1">
                <li className="flex items-start gap-2">
                  <Lightning className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                  <span className="text-xs sm:text-sm">Có lưu trữ (Battery)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightning className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                  <span className="text-xs sm:text-sm">Hoạt động khi mất điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendUp className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                  <span className="text-xs sm:text-sm">Tiết kiệm tối đa</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                  <span className="text-xs sm:text-sm">Chi phí đầu tư cao hơn</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                  <span className="text-xs sm:text-sm">Hoàn vốn 5–7 năm</span>
                </li>
              </ul>
              {/* Device SVGs */}
              <div className="mt-5 flex items-end justify-center gap-2">
                <svg width="52" height="72" viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                  <rect x="2" y="2" width="48" height="68" rx="5" fill="white" fillOpacity="0.95" stroke="#cbd5e1" strokeWidth="1"/>
                  <rect x="8" y="8" width="36" height="20" rx="3" fill="#dbeafe"/>
                  <text x="26" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">HYBRID</text>
                  <rect x="8" y="32" width="36" height="4" rx="2" fill="#bfdbfe"/>
                  <rect x="8" y="40" width="36" height="4" rx="2" fill="#bfdbfe"/>
                  <rect x="8" y="48" width="36" height="4" rx="2" fill="#bfdbfe"/>
                  <circle cx="26" cy="62" r="4" fill="#3b82f6"/>
                </svg>
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

            {/* VS divider */}
            <div className="flex items-center justify-center z-10 sm:-mx-5 relative my-[-0.75rem] sm:my-0">
              <div
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-black shadow-2xl border-4 border-white/20 z-20 relative"
                style={{ background: 'linear-gradient(135deg, #1a365d 50%, #ea580c 50%)', color: '#fff' }}
              >
                VS
              </div>
            </div>

            {/* ON-GRID Card */}
            <div
              className="flex-1 rounded-2xl sm:rounded-l-none p-4 sm:p-6 border border-white/10 text-white flex flex-col"
              style={{ backgroundColor: 'rgba(154, 52, 18, 0.90)', backdropFilter: 'blur(12px)' }}
            >
              <h3 className="text-lg sm:text-xl font-extrabold mb-4 text-center tracking-wide text-orange-300">
                ON-GRID
              </h3>
              <ul className="space-y-2 flex-1">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                  <span className="text-xs sm:text-sm">Không lưu trữ điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightning className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                  <span className="text-xs sm:text-sm">Phụ thuộc vào lưới điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                  <span className="text-xs sm:text-sm">Chi phí đầu tư thấp hơn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                  <span className="text-xs sm:text-sm">Hoàn vốn nhanh hơn</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                  <span className="text-xs sm:text-sm">Hoàn vốn 3–4 năm</span>
                </li>
              </ul>
              {/* Device SVG */}
              <div className="mt-5 flex items-end justify-center">
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
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="mt-8 pb-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <a
              href="/solar-home/hybrid"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A4F56] hover:bg-[#3A3F45] text-white font-semibold rounded-full active:scale-[0.98] transition-colors shadow-lg"
            >
              <Lightning className="h-4 w-4" weight="bold" />
              Xem combo Hybrid
            </a>
            <a
              href="/solar-home/on-grid"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full active:scale-[0.98] transition-colors shadow-lg"
            >
              <Sun className="h-4 w-4" weight="bold" />
              Xem combo On-Grid
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
