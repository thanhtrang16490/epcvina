import { TrendDown, ArrowRight, Wallet } from '@phosphor-icons/react';

export default function BeforeAfterBillsSection() {
  const bills = [
    {
      customer: 'Chị Hà - Hà Đông',
      capacity: '15 kWp Hybrid',
      before: {
        amount: 3000000,
        label: '3.000.000đ/tháng',
        color: 'from-red-500 to-red-600',
      },
      after: {
        amount: 400000,
        label: '400.000đ/tháng',
        color: 'from-green-500 to-green-600',
      },
      savings: 2600000,
      savingsPercent: 87,
      image: '/du-an/nha-may-thep-ha-noi.jpg',
    },
    {
      customer: 'Chú Thanh - Hải Dương',
      capacity: '22 kWp Hybrid',
      before: {
        amount: 5000000,
        label: '5.000.000đ/tháng',
        color: 'from-red-500 to-red-600',
      },
      after: {
        amount: 500000,
        label: '500.000đ/tháng',
        color: 'from-green-500 to-green-600',
      },
      savings: 4500000,
      savingsPercent: 90,
      image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg',
    },
    {
      customer: 'Anh Linh - Dương Nội',
      capacity: '7.5 kWp Hybrid',
      before: {
        amount: 2000000,
        label: '2.000.000đ/tháng',
        color: 'from-red-500 to-red-600',
      },
      after: {
        amount: 250000,
        label: '250.000đ/tháng',
        color: 'from-green-500 to-green-600',
      },
      savings: 1750000,
      savingsPercent: 88,
      image: '/du-an/DU-AN-VINHOMES-GOLDEN-RIVER-BA-SON-1.jpg',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Hóa Đơn Điện Trước & Sau Khi Lắp
          </h2>
          <p className="text-xl text-slate-600">Bằng chứng thực tế, không phải con số ước tính</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {bills.map((bill, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-slate-200">
              {/* Customer Info */}
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">{bill.customer}</h3>
                <p className="text-sm text-slate-600">{bill.capacity}</p>
              </div>

              {/* Bills Comparison */}
              <div className="p-6 space-y-4">
                {/* Before */}
                <div className={`bg-gradient-to-r ${bill.before.color} rounded-xl p-4 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold opacity-90">TRƯỚC</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Hóa đơn cũ</span>
                  </div>
                  <p className="text-3xl font-black">{bill.before.label}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-orange-500 rotate-90" />
                </div>

                {/* After */}
                <div className={`bg-gradient-to-r ${bill.after.color} rounded-xl p-4 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold opacity-90">SAU</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Có điện mặt trời</span>
                  </div>
                  <p className="text-3xl font-black">{bill.after.label}</p>
                </div>

                {/* Savings Badge */}
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4 text-white text-center">
                  <TrendDown className="w-6 h-6 mx-auto mb-2" weight="duotone" />
                  <p className="text-sm font-semibold opacity-90 mb-1">Tiết kiệm hàng tháng</p>
                  <p className="text-4xl font-black">{(bill.savings / 1000000).toFixed(1)} triệu</p>
                  <p className="text-lg font-bold mt-1">Giảm {bill.savingsPercent}%</p>
                </div>
              </div>

              {/* Annual Savings */}
              <div className="bg-green-50 p-4 border-t border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5 text-green-600" weight="duotone" />
                  <p className="text-sm text-green-700">Tiết kiệm hàng năm</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {(bill.savings * 12 / 1000000).toFixed(0)}.000.000đ
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-xl text-slate-600 mb-4">Bạn muốn tiết kiệm tương tự?</p>
          <a 
            href="#calculator" 
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Tính Toán Tiết Kiệm Cho Nhà Bạn →
          </a>
        </div>
      </div>
    </section>
  );
}
