import { CheckCircle, Phone } from 'lucide-react';
import FAQSection from '../ad-landing/FAQSection';

export default function BaoGiaPinLuuTruPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Báo Giá Pin Lưu Trữ BESS 2026</h1>
          <p className="text-xl text-slate-300">Pin chính hãng BYD, Pylontech. Bảo hành 5 năm.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { capacity: '5 kWh', price: '35-50 triệu', brands: 'BYD, Pylontech' },
              { capacity: '10 kWh', price: '70-100 triệu', brands: 'BYD, Hubble', popular: true },
              { capacity: '15 kWh', price: '100-150 triệu', brands: 'BYD, Pylontech' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200'}`}>
                <h3 className="text-2xl font-bold text-center mb-2">Pin {item.capacity}</h3>
                <p className={`text-center text-3xl font-bold mb-4 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <p className="text-center text-sm">Thương hiệu: {item.brands}</p>
                <a href="/lien-he" className={`block text-center mt-6 py-3 rounded-lg font-semibold ${item.popular ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>Nhận báo giá</a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQSection />
    </div>
  );
}
