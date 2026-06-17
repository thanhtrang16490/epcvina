import { Sun, Battery, Zap, Calendar, ArrowLeft, Home, Phone } from 'lucide-react';
import { useState } from 'react';

interface ComboData {
  data: {
    title: string;
    slug: string;
    system_type: 'on-grid' | 'hybrid';
    phase: '1-phase' | '3-phase';
    voltage: 'low' | 'high' | null;
    power_kw: number;
    battery_kwh?: number;
    investment_million_vnd: number;
    production_min_kwh: number;
    production_max_kwh: number;
    payback_years: number;
    payback_label: string;
    roof_area_m2?: number;
  };
  body: string;
}

export default function ComboDetailPage({ combo }: { combo: ComboData }) {
  const { data } = combo;
  const panelCount = Math.ceil(data.power_kw * 1000 / 580);
  const area = Math.ceil(data.power_kw * 4.32);

  const isHybrid = data.system_type === 'hybrid';
  const isOnGrid = data.system_type === 'on-grid';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/solar-home"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Quay lại</span>
              </a>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
                <p className="text-sm text-gray-500 mt-0.5">Mã: {data.slug}</p>
              </div>
            </div>
            <a
              href="/lien-he"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors"
            >
              <Phone className="h-5 w-5" />
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <img
                  src="/sample-combo.jpg"
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* System Specs */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-emerald-600" />
                Thông số hệ thống
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Công suất</p>
                  <p className="text-2xl font-bold text-gray-900">{data.power_kw} kWp</p>
                </div>
                {data.battery_kwh && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-2">Pin lưu trữ</p>
                    <p className="text-2xl font-bold text-blue-600">{data.battery_kwh} kWh</p>
                  </div>
                )}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Sản lượng/tháng</p>
                  <p className="text-2xl font-bold text-emerald-600">{data.production_min_kwh}–{data.production_max_kwh} kWh</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Diện tích</p>
                  <p className="text-2xl font-bold text-amber-600">~{area} m²</p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="bg-white rounded-2xl shadow-sm p-6 prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: combo.body }} />
            </div>
          </div>

          {/* Right Column - Financial & Equipment */}
          <div className="space-y-6">
            {/* Financial Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                Hiệu quả tài chính
              </h3>
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Chi phí đầu tư</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {data.investment_million_vnd.toFixed(1)} triệu
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Thời gian hoàn vốn</p>
                  <p className="text-3xl font-bold text-blue-600">{data.payback_label}</p>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-gray-600" />
                Thiết bị chính
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Tấm pin</span>
                  <span className="font-semibold text-gray-900">Aiko × {panelCount} tấm</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Biến tần</span>
                  <span className="font-semibold text-gray-900">SAJ {data.power_kw} kW</span>
                </div>
                {data.battery_kwh && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pin lưu trữ</span>
                    <span className="font-semibold text-blue-600">{data.battery_kwh} kWh</span>
                  </div>
                )}
              </div>
            </div>

            {/* System Type Badge */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Loại hệ thống</h3>
              <div className="space-y-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  isOnGrid ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isOnGrid ? <Sun className="h-4 w-4" /> : <Battery className="h-4 w-4" />}
                  {isOnGrid ? 'On-Grid' : 'Hybrid'}
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Pha:</span> {data.phase === '1-phase' ? '1 pha' : '3 pha'}</p>
                  {data.voltage && (
                    <p><span className="font-medium">Điện áp:</span> {data.voltage === 'high' ? 'Áp cao' : 'Áp thấp'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Cần tư vấn?</h3>
              <p className="text-sm text-emerald-100 mb-4">
                Liên hệ với chúng tôi để được tư vấn miễn phí
              </p>
              <a
                href="/lien-he"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
