import { useState } from 'react';
import { Calculator, CurrencyDollar, Clock, Sun, BatteryHigh, Car } from '@phosphor-icons/react';

const tools = [
  { id: 'chi-phi-dau-tu', name: 'Chi Phí Đầu Tư', icon: CurrencyDollar, desc: 'Tính chi phí lắp đặt hệ thống', href: '/calculator/chi-phi-dau-tu' },
  { id: 'thoi-gian-hoan-von', name: 'Thời Gian Hoàn Vốn', icon: Clock, desc: 'Tính thời gian thu hồi vốn', href: '/calculator/thoi-gian-hoan-von' },
  { id: 'san-luong-dien', name: 'Sản Lượng Điện', icon: Sun, desc: 'Ước tính sản lượng điện', href: '/calculator/san-luong-dien' },
  { id: 'pin-luu-tru', name: 'Pin Lưu Trữ', icon: BatteryHigh, desc: 'Tính dung lượng pin phù hợp', href: '/calculator/pin-luu-tru' },
  { id: 'sac-xe-dien', name: 'Sạc Xe Điện', icon: Car, desc: 'Tính chi phí sạc xe', href: '/calculator/sac-xe-dien' },
];

export default function CalculatorMainPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-4xl font-bold mb-4">Công Cụ Tính Toán Điện Mặt Trời</h1>
          <p className="text-xl text-slate-300">Tính toán chi phí, sản lượng, thời gian hoàn vốn miễn phí</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <a key={tool.id} href={tool.href} className="block p-8 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all group">
                <tool.icon className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                <p className="text-slate-600">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Cần Tư Vấn Chi Tiết?</h2>
          <p className="text-lg text-slate-600 mb-8">EPCVINA khảo sát miễn phí, thiết kế giải pháp tối ưu cho bạn</p>
          <a href="/tu-van-giai-phap" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
            Tư Vấn Miễn Phí
          </a>
        </div>
      </section>
    </div>
  );
}
