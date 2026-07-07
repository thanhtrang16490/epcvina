import { motion } from 'motion/react';
import { HardHat, Lightning, Broom, Camera } from '@phosphor-icons/react';

const processSteps = [
  { step: '01', title: 'Khảo sát miễn phí', desc: 'Đo mái nhà, đánh giá hướng nắng, phân tích hóa đơn điện', time: '30 phút' },
  { step: '02', title: 'Thiết kế hệ thống', desc: 'Tối ưu vị trí tấm pin, tính toán sản lượng, báo giá chi tiết', time: '1-2 ngày' },
  { step: '03', title: 'Ký hợp đồng', desc: 'Minh bạch từng hạng mục, thanh toán theo tiến độ', time: '15 phút' },
  { step: '04', title: 'Thi công lắp đặt', desc: 'Đội ngũ 3-5 người, an toàn tuyệt đối, vệ sinh sạch sẽ', time: '1-2 ngày' },
  { step: '05', title: 'Kích hoạt & nghiệm thu', desc: 'Test hệ thống, hướng dẫn sử dụng app giám sát', time: '2 giờ' },
  { step: '06', title: 'Bảo hành trọn đời', desc: 'Hỗ trợ kỹ thuật 24/7, bảo trì định kỳ miễn phí', time: '10+ năm' },
];

const trustBadges = [
  { icon: HardHat, label: 'An toàn tuyệt đối', desc: 'Bảo hộ lao động đầy đủ' },
  { icon: Lightning, label: 'Thi công nhanh', desc: '1-2 ngày hoàn thành' },
  { icon: Broom, label: 'Vệ sinh sạch sẽ', desc: 'Không để lại rác thải' },
  { icon: Camera, label: 'Báo cáo tiến độ', desc: 'Ảnh thực tế từng bước' },
];

export default function VideoShowcaseSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Quy Trình Thi Công Thực Tế
          </h2>
          <p className="text-lg text-slate-400">Biến mái nhà bạn thành nhà máy điện mini</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Video Player */}
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-slate-800"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-video bg-slate-900">
              <video
                src="/home_image.mp4"
                poster="/thumb-video.png"
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover"
              >
                <track kind="captions" />
              </video>
              {/* Project badge */}
              <div className="absolute top-3 left-3 bg-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide pointer-events-none">
                Dự án 15 kWp
              </div>
            </div>
          </motion.div>

          {/* Process Steps */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-slate-200">6 Bước Triển Khai</h3>
            <div className="space-y-4">
              {processSteps.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4 items-start group"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500/90 rounded-lg flex items-center justify-center font-bold text-sm group-hover:bg-orange-400 transition-colors">
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="font-bold text-base">{item.title}</h4>
                      <span className="text-xs text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-slate-800">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={i}
              className="text-center space-y-1.5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <badge.icon className="w-7 h-7 mx-auto text-orange-400" weight="duotone" />
              <h4 className="font-bold text-sm">{badge.label}</h4>
              <p className="text-xs text-slate-500">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
