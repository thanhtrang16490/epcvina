import { Sun, BatteryHigh, Lightning, Calendar, ArrowLeft, Phone, Shield, TrendUp, House as HomeIcon, CheckCircle, Lightbulb, Building, CurrencyDollar } from '@phosphor-icons/react';

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
  const area = data.roof_area_m2 || Math.ceil(data.power_kw * 4.32);
  const avgProduction = Math.round((data.production_min_kwh + data.production_max_kwh) / 2);
  const monthlySaving = Math.round(avgProduction * 3100); // ~3,100 VND/kWh
  const yearlySaving = monthlySaving * 12;
  const isHybrid = data.system_type === 'hybrid';
  const isOnGrid = data.system_type === 'on-grid';
  const phaseLabel = data.phase === '1-phase' ? '1 pha' : '3 pha';
  const systemLabel = isHybrid ? 'Hybrid' : 'On-Grid';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <a
                href={isHybrid ? '/solar-home/hybrid' : '/solar-home/on-grid'}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Quay lại</span>
              </a>
              <div className="h-6 w-px bg-gray-300 flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{data.title}</h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                    isHybrid ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isHybrid ? <BatteryHigh className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                    {systemLabel}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Hệ thống điện mặt trời {systemLabel} – {phaseLabel}</p>
              </div>
            </div>
            <a
              href="/lien-he"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors flex-shrink-0"
            >
              <Phone className="h-4 w-4" />
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-video">
                <img
                  src="/sample-combo.jpg"
                  alt={data.title}
                  className="w-full h-full object-cover"
                loading="lazy" />
              </div>
              <div className="p-4 flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                  isHybrid ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {isHybrid ? <BatteryHigh className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {systemLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                  <Lightning className="h-4 w-4" />
                  {data.power_kw} kWp
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                  {data.phase === '1-phase' ? '1 pha' : '3 pha'}
                  {data.voltage && ` – ${data.voltage === 'high' ? 'áp cao' : 'áp thấp'}`}
                </span>
                {data.battery_kwh && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <BatteryHigh className="h-4 w-4" />
                    {data.battery_kwh} kWh
                  </span>
                )}
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-amber-500" />
                Tổng quan hệ thống
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                <strong className="text-gray-900">{data.title}</strong> là giải pháp điện mặt trời {systemLabel.toLowerCase()} {phaseLabel} với công suất <strong className="text-gray-900">{data.power_kw} kWp</strong>
                {data.battery_kwh && <>, dung lượng lưu trữ <strong className="text-gray-900">{data.battery_kwh} kWh</strong></>}.
                Hệ thống được thiết kế tối ưu cho {isHybrid ? 'gia đình cần nguồn điện dự phòng và muốn tự chủ năng lượng 24/7' : 'gia đình và doanh nghiệp muốn giảm chi phí điện và tối ưu hiệu quả đầu tư'}.
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightning className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700 uppercase">Công suất</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{data.power_kw} <span className="text-sm font-normal text-gray-500">kWp</span></p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendUp className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 uppercase">Sản lượng/tháng</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{avgProduction} <span className="text-sm font-normal text-gray-500">kWh</span></p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700 uppercase">Diện tích mái</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">~{area} <span className="text-sm font-normal text-gray-500">m²</span></p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700 uppercase">Hoàn vốn</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{data.payback_years.toFixed(1)} <span className="text-sm font-normal text-gray-500">năm</span></p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-emerald-600" />
                Ưu điểm nổi bật
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {isHybrid ? (
                  <>
                    <BenefitCard
                      icon={<BatteryHigh className="h-5 w-5 text-blue-600" />}
                      title="Lưu trữ & Dự phòng"
                      description={`Pin lưu trữ ${data.battery_kwh} kWh, hoạt động ngay cả khi mất điện lưới. Tự chủ năng lượng 24/7.`}
                      color="blue"
                    />
                    <BenefitCard
                      icon={<TrendUp className="h-5 w-5 text-emerald-600" />}
                      title="Hiệu suất cao"
                      description={`Sản lượng ${data.production_min_kwh}–${data.production_max_kwh} kWh/tháng, đáp ứng nhu cầu điện gia đình.`}
                      color="emerald"
                    />
                    <BenefitCard
                      icon={<CurrencyDollar className="h-5 w-5 text-amber-600" />}
                      title="Tiết kiệm chi phí"
                      description={`Đầu tư ${data.investment_million_vnd} triệu VNĐ, hoàn vốn ${data.payback_label}, tiết kiệm ~${monthlySaving.toLocaleString('vi-VN')} VNĐ/tháng.`}
                      color="amber"
                    />
                    <BenefitCard
                      icon={<HomeIcon className="h-5 w-5 text-purple-600" />}
                      title="Lắp đặt linh hoạt"
                      description={`Yêu cầu ~${area} m² mái, phù hợp nhà phố, biệt thự, văn phòng.`}
                      color="purple"
                    />
                  </>
                ) : (
                  <>
                    <BenefitCard
                      icon={<CurrencyDollar className="h-5 w-5 text-emerald-600" />}
                      title="Tối ưu chi phí"
                      description={`Không cần pin lưu trữ, giảm chi phí đầu tư ban đầu. Đầu tư chỉ ${data.investment_million_vnd} triệu VNĐ.`}
                      color="emerald"
                    />
                    <BenefitCard
                      icon={<Calendar className="h-5 w-5 text-blue-600" />}
                      title="Hoàn vốn nhanh"
                      description={`Thời gian hoàn vốn ${data.payback_label}, tiết kiệm ~${monthlySaving.toLocaleString('vi-VN')} VNĐ/tháng.`}
                      color="blue"
                    />
                    <BenefitCard
                      icon={<TrendUp className="h-5 w-5 text-amber-600" />}
                      title="Hiệu suất cao"
                      description={`Sản lượng ${data.production_min_kwh}–${data.production_max_kwh} kWh/tháng, phù hợp hộ gia đình và doanh nghiệp.`}
                      color="amber"
                    />
                    <BenefitCard
                      icon={<HomeIcon className="h-5 w-5 text-purple-600" />}
                      title="Lắp đặt linh hoạt"
                      description={`Yêu cầu ~${area} m² mái, thiết kế tối ưu không gian lắp đặt.`}
                      color="purple"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Suitable Applications */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HomeIcon className="h-6 w-6 text-blue-600" />
                Ứng dụng phù hợp
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <ApplicationCard
                  title="Hộ gia đình"
                  items={['Nhà phố, biệt thự', 'Gia đình dùng điện nhiều', isHybrid ? 'Cần dự phòng khi mất điện' : 'Muốn giảm hóa đơn điện']}
                />
                <ApplicationCard
                  title="Doanh nghiệp"
                  items={['Văn phòng nhỏ', 'Cơ sở kinh doanh', 'Giảm chi phí vận hành']}
                />
                <ApplicationCard
                  title="Công trình"
                  items={['Trường học, phòng khám', 'Nhà xưởng nhỏ', 'Công trình công cộng']}
                />
              </div>
            </div>

            {/* Technical Specs Table */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lightning className="h-6 w-6 text-gray-600" />
                Thông số kỹ thuật
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <tbody>
                    <SpecRow label="Hệ thống" value={systemLabel} />
                    <SpecRow label="Pha" value={phaseLabel} />
                    {data.voltage && <SpecRow label="Điện áp" value={data.voltage === 'high' ? 'Áp cao (HV)' : 'Áp thấp (LV)'} />}
                    <SpecRow label="Công suất" value={`${data.power_kw} kWp`} highlight />
                    {data.battery_kwh && <SpecRow label="Pin lưu trữ" value={`${data.battery_kwh} kWh`} highlight />}
                    <SpecRow label="Sản lượng/tháng" value={`${data.production_min_kwh} – ${data.production_max_kwh} kWh`} />
                    <SpecRow label="Diện tích mái yêu cầu" value={`~${area} m²`} />
                    <SpecRow label="Số lượng tấm pin" value={`${panelCount} tấm (Aiko ~580Wp)`} />
                    <SpecRow label="Biến tần" value={`SAJ ${data.power_kw} kW`} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Financial & CTA */}
          <div className="space-y-6">
            {/* Financial Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CurrencyDollar className="h-5 w-5 text-emerald-600" />
                Hiệu quả tài chính
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs font-medium text-emerald-700 uppercase mb-1">Chi phí đầu tư</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {data.investment_million_vnd.toFixed(1)} <span className="text-base font-normal">triệu VNĐ</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 uppercase mb-1">Thời gian hoàn vốn</p>
                  <p className="text-2xl font-bold text-blue-700">{data.payback_label}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase mb-1">Tiết kiệm hàng tháng</p>
                  <p className="text-2xl font-bold text-amber-700">~{monthlySaving.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs font-medium text-purple-700 uppercase mb-1">Tiết kiệm hàng năm</p>
                  <p className="text-2xl font-bold text-purple-700">~{yearlySaving.toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            </div>

            {/* Equipment Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Thiết bị chính
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sun className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Tấm pin quang điện</p>
                    <p className="font-semibold text-gray-900 text-sm">Aiko × {panelCount} tấm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightning className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Biến tần (Inverter)</p>
                    <p className="font-semibold text-gray-900 text-sm">SAJ {data.power_kw} kW – {systemLabel}</p>
                  </div>
                </div>
                {data.battery_kwh && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BatteryHigh className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Pin lưu trữ (BatteryHigh)</p>
                      <p className="font-semibold text-blue-700 text-sm">{data.battery_kwh} kWh – LiFePO4</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* System Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin hệ thống</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Loại hệ thống</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isOnGrid ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isOnGrid ? <Sun className="h-3 w-3" /> : <BatteryHigh className="h-3 w-3" />}
                    {systemLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pha</span>
                  <span className="font-medium text-gray-900">{phaseLabel}</span>
                </div>
                {data.voltage && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Điện áp</span>
                    <span className="font-medium text-gray-900">{data.voltage === 'high' ? 'Áp cao' : 'Áp thấp'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã hệ thống</span>
                  <span className="font-medium text-gray-900 font-mono text-xs">{data.slug}</span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Cần tư vấn?</h3>
              <p className="text-sm text-emerald-100 mb-4">
                Liên hệ với chúng tôi để được khảo sát miễn phí và nhận báo giá chi tiết trong 24 giờ.
              </p>
              <a
                href="/lien-he"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Liên hệ ngay
              </a>
              <p className="text-xs text-emerald-200 text-center mt-3">
                Hotline: <a href="tel:0988446113" className="underline hover:text-white">0988 446 113</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <a
          href="/lien-he"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full"
        >
          <Phone className="h-5 w-5" />
          Liên hệ tư vấn miễn phí
        </a>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function BenefitCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const bgMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    purple: 'bg-purple-50 border-purple-100',
  };
  return (
    <div className={`rounded-xl p-4 border ${bgMap[color] || 'bg-gray-50 border-gray-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ApplicationCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-emerald-50/50' : 'bg-white'}>
      <td className="px-4 py-3 text-gray-500 font-medium border-t border-gray-100">{label}</td>
      <td className={`px-4 py-3 text-right font-semibold border-t border-gray-100 ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</td>
    </tr>
  );
}
