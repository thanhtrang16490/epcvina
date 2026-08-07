import { motion } from 'motion/react';
import { Shield, CheckCircle, CurrencyCircleDollar } from '@phosphor-icons/react';

const paymentOptions = [
  {
    icon: Shield,
    title: 'Thanh toán theo tiến độ',
    subtitle: 'Không lo rủi ro',
    items: [
      '30% đặt cọc khi ký hợp đồng',
      '60% khi giao thiết bị đến công trình',
      '10% sau nghiệm thu & bàn giao',
      'Giữ lại 10% đến khi hài lòng 100%',
    ],
    highlight: 'Bạn kiểm soát dòng tiền, không phải trả trước toàn bộ',
  },
  {
    icon: CurrencyCircleDollar,
    title: 'Không phát sinh chi phí',
    subtitle: 'Cam kết trong hợp đồng',
    items: [
      'Báo giá chi tiết từng hạng mục',
      'Không thêm phí khảo sát, thiết kế',
      'Bảo hành miễn phí 10 năm',
      'Bảo trì định kỳ không tốn phí',
    ],
    highlight: 'Giá cuối cùng = Giá trong hợp đồng, không ẩn phí',
  },
  {
    icon: CheckCircle,
    title: 'Đầu tư sinh lời ngay',
    subtitle: 'Hoàn vốn 3-5 năm',
    items: [
      'Tiết kiệm 2-4 triệu/tháng ngay',
      'ROI 20-25%/năm',
      'Tăng giá trị BĐS 5-10%',
      'Thu nhập từ bán điện dư (On-Grid)',
    ],
    highlight: 'Điện mặt trời là khoản đầu tư, không phải chi phí',
  },
];

const comparisonRows = [
  ['Lãi suất', '0% - Không vay', '8-12%/năm'],
  ['Rủi ro tài chính', 'Thấp - Trả theo tiến độ', 'Cao - Phải trả dù không hài lòng'],
  ['Thủ tục', 'Không cần', 'Phức tạp, 2-4 tuần'],
  ['Bảo hành', '10 năm miễn phí', 'Tùy gói, có thể mất phí'],
  ['Áp lực tâm lý', 'Không', 'Có - Nợ hàng tháng'],
];

export default function PaymentOptionsSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 font-display">
            Phương Án Thanh Toán Linh Hoạt
          </h2>
          <p className="text-lg text-slate-600">An toàn tài chính 100%, không cần vay ngân hàng</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {paymentOptions.map((option, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 transition-colors"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <div className="p-6 pb-4">
                <option.icon className="w-10 h-10 text-orange-500 mb-3" weight="duotone" />
                <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">{option.title}</h3>
                <p className="text-sm text-slate-500">{option.subtitle}</p>
              </div>

              <div className="px-6 pb-4 space-y-2.5">
                {option.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" weight="fill" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6">
                <div className="bg-orange-50 rounded-lg p-3.5 border-l-[3px] border-orange-500">
                  <p className="text-sm font-semibold text-slate-800">{option.highlight}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-slate-900 text-white p-5 text-center">
            <h3 className="text-xl font-bold font-display">So Sánh Với Vay Ngân Hàng</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-900 text-sm">Tiêu chí</th>
                  <th className="p-4 font-semibold text-orange-600 bg-orange-50/50 text-sm">EPCVINA</th>
                  <th className="p-4 font-semibold text-slate-500 text-sm">Vay ngân hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td className="p-4 font-medium text-slate-900 text-sm">{row[0]}</td>
                    <td className="p-4 text-emerald-600 font-semibold bg-orange-50/30 text-sm">{row[1]}</td>
                    <td className="p-4 text-slate-500 text-sm">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
