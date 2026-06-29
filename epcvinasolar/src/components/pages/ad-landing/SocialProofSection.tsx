import { Users, Award, TrendingDown, Leaf, Star, Trophy, Scroll } from 'lucide-react';

export default function SocialProofSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            EPCVINA Trong Những Con Số
          </h2>
          <p className="text-xl opacity-90">Kết quả thực tế đã chứng minh, không phải lời hứa</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Users,
              number: '500+',
              label: 'Gia đình đã tư vấn',
              desc: 'Tin tưởng lựa chọn EPCVINA',
              color: 'bg-white/20',
            },
            {
              icon: Award,
              number: '13+',
              label: 'Dự án đã triển khai',
              desc: '100% hoàn thành đúng hạn',
              color: 'bg-white/20',
            },
            {
              icon: TrendingDown,
              number: '98%',
              label: 'Khách hàng hài lòng',
              desc: 'Đánh giá 4.8-5 sao',
              color: 'bg-white/20',
            },
            {
              icon: Leaf,
              number: '45+',
              label: 'Tấn CO2 giảm/năm',
              desc: 'Bảo vệ môi trường',
              color: 'bg-white/20',
            },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-3">
              <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-5xl sm:text-6xl font-black mb-2">{stat.number}</div>
              <h3 className="text-xl font-bold mb-1">{stat.label}</h3>
              <p className="text-sm opacity-90">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-white/30">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-8 h-8 text-yellow-400" fill="currentColor" />
                <p className="text-3xl font-bold">4.9/5.0</p>
              </div>
              <p className="text-sm opacity-90">Đánh giá trung bình từ khách hàng</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <p className="text-3xl font-bold">TOP 10</p>
              </div>
              <p className="text-sm opacity-90">Nhà thầu điện mặt trời uy tín tại miền Bắc</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Scroll className="w-8 h-8 text-yellow-400" />
                <p className="text-3xl font-bold">Chứng chỉ</p>
              </div>
              <p className="text-sm opacity-90">Năng lực xây dựng & điện mặt trời</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
