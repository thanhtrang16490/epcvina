import { Play, CheckCircle } from 'lucide-react';

export default function VideoShowcaseSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Quy Trình Thi Công Thực Tế
          </h2>
          <p className="text-xl text-slate-300">Xem cách chúng tôi biến mái nhà bạn thành nhà máy điện mini</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700">
            <div className="relative aspect-video bg-slate-800">
              {/* Placeholder - Thay bằng video thật sau */}
              <img 
                src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80" 
                alt="Thi công điện mặt trời" 
                className="w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group cursor-pointer">
                <div className="bg-white/90 rounded-full p-6 group:hover:bg-white transition-all group:hover:scale-110">
                  <Play className="w-12 h-12 text-orange-600 ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Video Duration Badge */}
              <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded-md text-sm font-semibold">
                1:45
              </div>
            </div>

            {/* Video Caption */}
            <div className="absolute top-4 left-4 bg-orange-600 px-4 py-2 rounded-lg text-sm font-bold">
              DỰ ÁN 15 KWP - CHỊ HÀ
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">6 Bước Triển Khai</h3>
            
            {[
              { step: '01', title: 'Khảo sát miễn phí', desc: 'Đo mái nhà, đánh giá hướng nắng, phân tích hóa đơn điện', time: '30 phút' },
              { step: '02', title: 'Thiết kế hệ thống', desc: 'Tối ưu vị trí tấm pin, tính toán sản lượng, báo giá chi tiết', time: '1-2 ngày' },
              { step: '03', title: 'Ký hợp đồng', desc: 'Minh bạch từng hạng mục, thanh toán theo tiến độ', time: '15 phút' },
              { step: '04', title: 'Thi công lắp đặt', desc: 'Đội ngũ 3-5 người, an toàn tuyệt đối, vệ sinh sạch sẽ', time: '1-2 ngày' },
              { step: '05', title: 'Kích hoạt & nghiệm thu', desc: 'Test hệ thống, hướng dẫn sử dụng app giám sát', time: '2 giờ' },
              { step: '06', title: 'Bảo hành trọn đời', desc: 'Hỗ trợ kỹ thuật 24/7, bảo trì định kỳ miễn phí', time: '10+ năm' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <span className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-slate-700">
          {[
            { icon: '🏗️', label: 'An toàn tuyệt đối', desc: 'Bảo hộ lao động, dây an toàn' },
            { icon: '⚡', label: 'Thi công nhanh', desc: '1-2 ngày hoàn thành' },
            { icon: '🧹', label: 'Vệ sinh sạch sẽ', desc: 'Không để lại rác thải' },
            { icon: '📸', label: 'Báo cáo tiến độ', desc: 'Ảnh thực tế từng bước' },
          ].map((badge, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h4 className="font-bold text-lg">{badge.label}</h4>
              <p className="text-sm text-slate-400">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
