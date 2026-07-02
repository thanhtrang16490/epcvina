import { motion } from 'motion/react';
import { Users, Trophy, TrendDown, Leaf, Star, Medal, Certificate } from '@phosphor-icons/react';

const stats = [
  { icon: Users, number: '500+', label: 'Gia đình đã tư vấn', desc: 'Tin tưởng lựa chọn EPCVINA' },
  { icon: Medal, number: '13+', label: 'Dự án triển khai', desc: '100% hoàn thành đúng hạn' },
  { icon: TrendDown, number: '98%', label: 'Khách hàng hài lòng', desc: 'Đánh giá 4.8 đến 5 sao' },
  { icon: Leaf, number: '45+', label: 'Tấn CO₂ giảm/năm', desc: 'Góp phần bảo vệ môi trường' },
];

const trustIndicators = [
  { icon: Star, value: '4.9/5.0', label: 'Đánh giá trung bình', fill: true },
  { icon: Trophy, value: 'TOP 10', label: 'Nhà thầu uy tín miền Bắc', fill: false },
  { icon: Certificate, value: 'Chứng chỉ', label: 'Năng lực xây dựng & điện mặt trời', fill: false },
];

export default function SocialProofSection() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            EPCVINA Trong Những Con Số
          </h2>
          <p className="text-lg text-white/80">Kết quả thực tế, không phải lời hứa</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-7 h-7" weight="duotone" />
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">{stat.number}</p>
              <h3 className="text-lg font-bold">{stat.label}</h3>
              <p className="text-sm text-white/75">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-14 pt-8 border-t border-white/20">
          <div className="grid md:grid-cols-3 gap-4">
            {trustIndicators.map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10"
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <item.icon className="w-6 h-6 text-amber-200" weight={item.fill ? 'fill' : 'bold'} />
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
                <p className="text-sm text-white/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
