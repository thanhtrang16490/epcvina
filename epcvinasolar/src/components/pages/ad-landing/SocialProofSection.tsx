import { motion } from 'motion/react';
import { Users, TrendDown, Star, Medal, Certificate, HouseLine, ShieldCheck } from '@phosphor-icons/react';

const stats = [
  { icon: Users, number: '500+', label: 'Gia đình đã tư vấn', desc: 'Sàng lọc nhu cầu theo hóa đơn và mái nhà' },
  { icon: HouseLine, number: '13+', label: 'Công trình nhà dân', desc: 'Có ảnh thực tế và thông tin lắp đặt' },
  { icon: TrendDown, number: '87-90%', label: 'Mức giảm hóa đơn mẫu', desc: 'Từ các case đã đối chiếu sau lắp' },
  { icon: ShieldCheck, number: '10 năm', label: 'Bảo hành thiết bị', desc: 'Điều kiện bảo hành thể hiện trong hồ sơ' },
];

const trustIndicators = [
  { icon: Star, value: '4.9/5.0', label: 'Đánh giá trung bình', fill: true },
  { icon: Medal, value: '15 năm', label: 'Kinh nghiệm cơ điện', fill: false },
  { icon: Certificate, value: 'Hồ sơ', label: 'Thiết kế, nghiệm thu, bảo hành rõ ràng', fill: false },
];

export default function SocialProofSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_78%)] py-10 text-slate-950 sm:py-16">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.32]" style={{ backgroundImage: 'radial-gradient(circle, rgba(245,130,32,.22) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-7 max-w-3xl text-center sm:mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-orange-600">Bằng chứng trước khi tư vấn</p>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 leading-tight">
            Không chỉ tính thử, EPCVINA có dữ liệu thực tế để đối chiếu
          </h2>
          <p className="text-[14px] sm:text-lg text-slate-600">Các con số bên dưới giúp anh/chị hiểu vì sao kết quả chỉ là bước đầu, còn phương án cuối cùng cần khảo sát mái và hóa đơn.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,.45)] sm:p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 sm:h-12 sm:w-12">
                <stat.icon className="w-6 h-6" weight="duotone" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{stat.number}</p>
              <h3 className="mt-1 text-[13px] sm:text-base font-black leading-tight text-slate-900">{stat.label}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500 sm:text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-5 sm:mt-8">
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-950 p-3 text-white sm:grid-cols-3 sm:p-4">
            {trustIndicators.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <item.icon className="w-6 h-6 text-amber-200" weight={item.fill ? 'fill' : 'bold'} />
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
                <p className="text-sm text-white/78">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
