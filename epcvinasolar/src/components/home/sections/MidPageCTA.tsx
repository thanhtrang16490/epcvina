import { motion } from 'motion/react';
import { Phone, ArrowRight } from '@phosphor-icons/react';

interface MidPageCTAProps {
  variant: 'benefits' | 'reviews';
}

export default function MidPageCTA({ variant }: MidPageCTAProps) {
  if (variant === 'benefits') {
    return (
      <section className="bg-gradient-to-r from-[#1a365d] to-[#0f2444] py-8 sm:py-10" data-header-theme="dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center sm:text-left">
              <p className="text-white font-extrabold text-lg sm:text-xl leading-snug">
                Bạn cần tư vấn giải pháp phù hợp?
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Kỹ sư EPCVINA khảo sát miễn phí, báo giá minh bạch trong 24h.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="#tu-van"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-[#B01A22] text-white font-bold rounded-full text-sm transition-colors active:scale-[0.98] shadow-lg"
              >
                <Phone className="h-4 w-4" weight="bold" />
                Đăng ký ngay
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Reviews variant — pricing teaser + social proof CTA
  return (
    <section className="bg-gradient-to-r from-orange-600 to-red-600 py-8 sm:py-10" data-header-theme="dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Chỉ từ 65 triệu
              </span>
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Hoàn vốn 3–5 năm
              </span>
            </div>
            <p className="text-white font-extrabold text-lg sm:text-xl leading-snug">
              Bắt đầu tiết kiệm điện ngay hôm nay
            </p>
            <p className="text-orange-100 text-sm mt-1">
              Đăng ký khảo sát miễn phí — không ràng buộc, không chi phí ẩn.
            </p>
          </div>
          <a
            href="#tu-van"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 hover:bg-orange-50 font-bold rounded-full text-sm transition-colors active:scale-[0.98] shadow-lg flex-shrink-0"
          >
            Đăng ký tư vấn miễn phí
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
