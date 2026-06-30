import { useState } from 'react';
import { Phone, CheckCircle, MapPin, Home } from 'lucide-react';

export default function TuVanGiaiPhapPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', roofArea: '', monthlyBill: '', systemType: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã nhận thông tin! EPCVINA sẽ gọi lại trong 24h.');
  };

  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="bg-gradient-to-br from-slate-900 to-orange-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Tư Vấn Giải Pháp Miễn Phí</h1>
          <p className="text-xl text-slate-300">Khảo sát tại nhà. Thiết kế 3D. Báo giá chi tiết 24h.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Quy Trình Tư Vấn</h2>
              {[
                'Bước 1: Tiếp nhận thông tin',
                'Bước 2: Khảo sát miễn phí tại nhà',
                'Bước 3: Thiết kế giải pháp 3D',
                'Bước 4: Báo giá chi tiết',
                'Bước 5: Ký hợp đồng & thi công',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="mt-8 p-6 bg-orange-50 rounded-xl">
                <h3 className="font-bold mb-2">Gọi ngay để được tư vấn nhanh</h3>
                <a href="tel:0988446113" className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                  <Phone className="w-6 h-6" /> 0988 446 113
                </a>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Gửi Thông Tin Tư Vấn</h2>
              {[
                { label: 'Họ tên', name: 'name', type: 'text' },
                { label: 'Số điện thoại', name: 'phone', type: 'tel' },
                { label: 'Địa chỉ', name: 'address', type: 'text' },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <input type={type} required value={formData[name as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Diện tích mái (m²)</label>
                  <input type="text" value={formData.roofArea} onChange={(e) => setFormData({ ...formData, roofArea: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="VD: 40m²" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hóa đơn điện/tháng</label>
                  <input type="text" value={formData.monthlyBill} onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="VD: 3 triệu" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hệ thống quan tâm</label>
                <select value={formData.systemType} onChange={(e) => setFormData({ ...formData, systemType: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                  <option value="">Chọn loại hệ thống</option>
                  <option value="on-grid">On-Grid</option>
                  <option value="hybrid">Hybrid + Pin lưu trữ</option>
                  <option value="ev">Kết hợp sạc xe điện</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg text-lg">Gửi Yêu Cầu Tư Vấn</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
