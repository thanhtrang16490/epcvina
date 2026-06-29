import { Shield, CheckCircle, DollarSign } from 'lucide-react';

export default function PaymentOptionsSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Phương Án Thanh Toán Linh Hoạt
          </h2>
          <p className="text-xl text-slate-600">Không phải vay ngân hàng, vẫn an toàn tài chính 100%</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Shield,
              title: 'Thanh toán theo tiến độ',
              subtitle: 'Không lo rủi ro',
              items: [
                '30% đặt cọc khi ký hợp đồng',
                '40% khi giao thiết bị đến công trình',
                '30% sau nghiệm thu & bàn giao',
                'Giữ lại tiền đến khi hài lòng 100%',
              ],
              highlight: 'Bạn kiểm soát dòng tiền, không phải trả trước toàn bộ',
              color: 'from-blue-500 to-blue-600',
            },
            {
              icon: DollarSign,
              title: 'Không phát sinh chi phí',
              subtitle: 'Cam kết trong hợp đồng',
              items: [
                'Báo giá chi tiết từng hạng mục',
                'Không thêm phí khảo sát, thiết kế',
                'Bảo hành miễn phí 25 năm',
                'Bảo trì định kỳ không tốn phí',
              ],
              highlight: 'Giá cuối cùng = Giá trong hợp đồng, không ẩn phí',
              color: 'from-green-500 to-green-600',
            },
            {
              icon: CheckCircle,
              title: 'Đầu tư sinh lời ngay',
              subtitle: 'Hoàn vốn 3-5 năm',
              items: [
                'Tiết kiệm 2-4 triệu/tháng ngay',
                'ROI 20-25%/năm (cao hơn gửi bank)',
                'Tăng giá trị BĐS 5-10%',
                'Thu nhập từ bán điện dư (On-Grid)',
              ],
              highlight: 'Điện mặt trời là khoản đầu tư, không phải chi phí',
              color: 'from-orange-500 to-orange-600',
            },
          ].map((option, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className={`bg-gradient-to-r ${option.color} p-6 text-white`}>
                <option.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                <p className="text-sm opacity-90">{option.subtitle}</p>
              </div>
              
              <div className="p-6 space-y-3">
                {option.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6">
                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="text-sm font-semibold text-slate-900">{option.highlight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-slate-900 text-white p-6 text-center">
            <h3 className="text-2xl font-bold">So Sánh Với Vay Ngân Hàng</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-900">Tiêu chí</th>
                  <th className="p-4 font-semibold text-orange-600 bg-orange-50">EPCVINA</th>
                  <th className="p-4 font-semibold text-slate-600">Vay ngân hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  ['Lãi suất', '0% - Không vay', '8-12%/năm'],
                  ['Rủi ro tài chính', 'Thấp - Trả theo tiến độ', 'Cao - Phải trả dù không hài lòng'],
                  ['Thủ tục', 'Không cần', 'Phức tạp, 2-4 tuần'],
                  ['Bảo hành', '25 năm miễn phí', 'Tùy gói, có thể mất phí'],
                  ['Áp lực tâm lý', 'Không', 'Có - Nợ hàng tháng'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="p-4 font-medium text-slate-900">{row[0]}</td>
                    <td className="p-4 text-green-600 font-semibold bg-orange-50/50">{row[1]}</td>
                    <td className="p-4 text-slate-600">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
