import EquipmentPageMobile from './EquipmentPageMobile';
import EquipmentPageDesktop from './EquipmentPageDesktop';
import EquipmentAlibabaHeader from './EquipmentAlibabaHeader';
import { useMemo, useState, useEffect } from 'react';
import { ArrowRight, Lightning, TrendUp, BatteryHigh, Shield, Plug, Stack, CableCar, BookOpen, CaretRight } from '@phosphor-icons/react';
import Image from '../../ui/Image';
import type { Device, EquipmentCategory } from '../../../lib/types';
import { CATEGORY_META } from './shared-equipment';
import { localBrands } from '../../../data/brands';

interface PageProps {
  category: string;
}

// Convert API product (flat format) to Device format
function apiProductToDevice(product: any, categoryOverride?: string): Device {
  return {
    id: product.id,
    category: (categoryOverride || product.category) as EquipmentCategory,
    brand: product.brand || 'Unknown',
    name: product.name || product.model || 'Unknown',
    model: product.model || product.name || 'Unknown',
    quantity: 1,
    unit: 'sản phẩm',
    price: product.price || 0,
    specs: {
      'Thương hiệu': product.brand || '',
      ...(product.specifications || {}),
    },
    features: product.features || [],
    warranty: parseInt(product.warranty || '0') || 0,
    images: product.main_image ? [product.main_image] : [],
    image_url: product.main_image,
  };
}

export default function EquipmentPage({ category }: PageProps) {
  const [audienceMode, setAudienceMode] = useState<'b2b' | 'b2c'>('b2b');
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [categoryDevices, setCategoryDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');
  const [gridColumns, setGridColumns] = useState<number>(5);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const categoryTiles = useMemo(() => ([
    { key: 'panel', label: CATEGORY_META.panel.label, icon: <Lightning className="h-5 w-5" />, href: '/thiet-bi/panel' },
    { key: 'on-grid-inverter', label: CATEGORY_META['on-grid-inverter'].label, icon: <TrendUp className="h-5 w-5" />, href: '/thiet-bi/on-grid-inverter' },
    { key: 'hybrid-inverter', label: CATEGORY_META['hybrid-inverter'].label, icon: <TrendUp className="h-5 w-5" />, href: '/thiet-bi/hybrid-inverter' },
    { key: 'lv-battery', label: CATEGORY_META['lv-battery'].label, icon: <BatteryHigh className="h-5 w-5" />, href: '/thiet-bi/lv-battery' },
    { key: 'hv-battery', label: CATEGORY_META['hv-battery'].label, icon: <BatteryHigh className="h-5 w-5" />, href: '/thiet-bi/hv-battery' },
    { key: 'mounting', label: CATEGORY_META.mounting.label, icon: <Stack className="h-5 w-5" />, href: '/thiet-bi/mounting' },
    { key: 'wiring', label: CATEGORY_META.wiring.label, icon: <CableCar className="h-5 w-5" />, href: '/thiet-bi/wiring' },
    { key: 'cabinet', label: CATEGORY_META.cabinet.label, icon: <Shield className="h-5 w-5" />, href: '/thiet-bi/cabinet' },
    { key: 'grounding', label: CATEGORY_META.grounding.label, icon: <Plug className="h-5 w-5" />, href: '/thiet-bi/grounding' },
  ]), []);

  const brandSlugMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const brand of localBrands) {
      map[brand.name.toLowerCase()] = brand.slug;
    }
    return map;
  }, []);

  const brandTiles = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const device of categoryDevices) {
      if (!device.brand) continue;
      grouped.set(device.brand, (grouped.get(device.brand) || 0) + 1);
    }
    return Array.from(grouped.entries())
      .map(([name, count]) => ({
        name,
        count,
        slug: brandSlugMap[name.toLowerCase()],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brandSlugMap, categoryDevices]);

  const relatedArticles = useMemo(() => {
    const byCategory: Record<string, { title: string; href: string; desc: string }[]> = {
      mounting: [
        {
          title: 'Quy trình lắp đặt hệ khung nhôm chuẩn kỹ thuật',
          href: '/tin-tuc/quy-trinh-lap-dat-solar',
          desc: 'Các bước khảo sát, cố định và nghiệm thu hệ khung trước khi lắp tấm pin.',
        },
        {
          title: 'Chọn hệ khung nhôm cho mái tôn, mái ngói, mái bằng',
          href: '/tin-tuc/huong-mai-nha-tot-nhat',
          desc: 'Tối ưu vật tư và phương án lắp theo từng loại mái thực tế.',
        },
        {
          title: 'Kinh nghiệm chống ăn mòn và chống sét cho khung giàn',
          href: '/tin-tuc/chong-set-cho-solar',
          desc: 'Những điểm cần chú ý để tăng độ bền và an toàn vận hành.',
        },
      ],
      panel: [
        {
          title: 'Tấm pin Mono vs N-Type: nên chọn gì?',
          href: '/tin-tuc/tam-pin-monocrystal-vs-polycrystal',
          desc: 'So sánh hiệu suất, độ bền và chi phí đầu tư trước khi chọn mua.',
        },
        {
          title: 'Cách đọc thông số tấm pin mặt trời đúng chuẩn',
          href: '/tin-tuc/dien-mat-troi-la-gi',
          desc: 'Hiểu nhanh công suất, hiệu suất, VOC, ISC và các chỉ số quan trọng.',
        },
        {
          title: 'Lắp tấm pin đúng hướng để tối ưu sản lượng',
          href: '/tin-tuc/huong-mai-nha-tot-nhat',
          desc: 'Góc nghiêng, hướng lắp và các yếu tố ảnh hưởng đến sản lượng.',
        },
      ],
      'on-grid-inverter': [
        {
          title: 'Chọn biến tần On-Grid theo công suất hệ thống',
          href: '/tin-tuc/cac-loai-he-thong-solar',
          desc: 'Cách ghép inverter theo kWp, số pha và nhu cầu sử dụng thực tế.',
        },
        {
          title: 'So sánh On-Grid và Hybrid trước khi đầu tư',
          href: '/tin-tuc/so-sanh-on-grid-vs-hybrid',
          desc: 'Phù hợp cho ai, tiết kiệm ra sao và khi nào nên nâng cấp.',
        },
        {
          title: 'Những lỗi thường gặp khi lắp biến tần',
          href: '/tin-tuc/bao-tri-he-thong-solar',
          desc: 'Các lỗi đấu nối, cài đặt và cách kiểm tra nhanh sau vận hành.',
        },
      ],
      'hybrid-inverter': [
        {
          title: 'Hybrid inverter là gì và khi nào nên dùng?',
          href: '/tin-tuc/cac-loai-he-thong-solar',
          desc: 'Tư duy chọn hệ có lưu trữ cho gia đình và công trình cần dự phòng.',
        },
        {
          title: 'So sánh Hybrid với hệ lưu trữ BESS',
          href: '/tin-tuc/bess-la-gi',
          desc: 'Nhận diện đúng mục tiêu sử dụng để chọn giải pháp phù hợp.',
        },
        {
          title: 'Lưu ý khi ghép pin lưu trữ với biến tần Hybrid',
          href: '/tin-tuc/cach-chon-pin-luu-tru',
          desc: 'Chọn đúng điện áp, dung lượng và cấu hình để hệ hoạt động ổn định.',
        },
      ],
    };

    return byCategory[category] || [
      {
        title: 'Kiến thức chọn thiết bị điện mặt trời',
        href: '/kien-thuc',
        desc: 'Tổng hợp bài viết nền tảng giúp bạn đọc hiểu nhanh trước khi chọn mua.',
      },
      {
        title: 'Quy trình thi công và nghiệm thu',
        href: '/tin-tuc/quy-trinh-lap-dat-solar',
        desc: 'Từ khảo sát đến bàn giao, đầy đủ các bước cần biết.',
      },
      {
        title: 'So sánh các giải pháp phổ biến',
        href: '/hybrid-bess',
        desc: 'On-Grid, Hybrid, BESS và các cấu hình triển khai thực tế.',
      },
    ];
  }, [category]);

  const brandMetaMap = useMemo(() => {
    const map: Record<string, { logo_url?: string; slug: string }> = {};
    for (const brand of localBrands) {
      map[brand.name.toLowerCase()] = { logo_url: brand.logo_url, slug: brand.slug };
    }
    return map;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get('audience');
    if (explicit === 'b2c' || explicit === 'b2b') {
      setAudienceMode(explicit);
      return;
    }
    const referrer = document.referrer || '';
    const pathname = window.location.pathname;
    if (/dien-mat-troi-gia-dinh|nha-pho|biet-thu|ho-kinh-doanh|solar-home|calculator/.test(referrer) || /dien-mat-troi-gia-dinh|nha-pho|biet-thu|ho-kinh-doanh|solar-home|calculator/.test(pathname)) {
      setAudienceMode('b2c');
      return;
    }
    setAudienceMode('b2b');
  }, []);

  // Fetch products from Content Collections API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products for sidebar counts
        const allResponse = await fetch('/api/products');
        const allData = await allResponse.json();
        
        if (allData.success && allData.data) {
          const allDevicesList: Device[] = allData.data.map((product: any) => 
            apiProductToDevice(product)
          );
          setAllDevices(allDevicesList);
        }
        
        // Fetch category-specific products for display
        const catResponse = await fetch(`/api/products?category=${category}`);
        const catData = await catResponse.json();
        
        if (catData.success && catData.data) {
          const catDevicesList: Device[] = catData.data.map((product: any) => 
            apiProductToDevice(product, category)
          );
          setCategoryDevices(catDevicesList);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        setAllDevices([]);
        setCategoryDevices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [category]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="hidden md:block">
        <EquipmentAlibabaHeader
          title={CATEGORY_META[category as EquipmentCategory]?.label || 'Thiết bị'}
          subtitle={`Thiết bị năng lượng mặt trời • ${CATEGORY_META[category as EquipmentCategory]?.label || 'Danh mục'}`}
        />
      </div>
      {/* Phone: Render full mobile component (< md) */}
      <div className="md:hidden">
        <EquipmentPageMobile category={category} audienceMode={audienceMode} />
      </div>

      {/* Tablet + Desktop: Hero + Sidebar + Content (≥ md) */}
      <div className="hidden md:flex md:flex-col md:flex-1">
        {/* Section 1: Hero full-width only */}
          <EquipmentPageDesktop 
            category={category} 
            devices={categoryDevices}
            loading={loading}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            itemsPerPage={itemsPerPage}
            showHero={true}
            showContent={false}
            audienceMode={audienceMode}
          />

        {/* Section 2: Chọn loại sản phẩm + Thương hiệu */}
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <section className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Danh mục</p>
                <h3 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">Chọn loại sản phẩm</h3>
              </div>
              <a href="/thiet-bi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B63CE] hover:text-[#084a9c]">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
              {categoryTiles.map((tile) => {
                const active = tile.key === category;
                const meta = CATEGORY_META[tile.key as EquipmentCategory];
                return (
                  <a
                    key={tile.key}
                    href={tile.href}
                    className={`group flex aspect-square flex-col justify-between rounded-2xl border p-3 transition-all ${
                      active
                        ? 'border-[#0B63CE] bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#0B63CE] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.bg} ${meta.color}`}>
                        {tile.icon}
                      </div>
                      <div className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${active ? 'bg-[#0B63CE] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {allDevices.filter((d) => d.category === tile.key).length}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-1 text-sm font-semibold leading-none text-gray-900 group-hover:text-[#0B63CE]">
                      {tile.label}
                    </p>
                  </a>
                );
              })}
            </div>

            <div className="my-5 h-px bg-gray-100" />

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <a
                href={`/thiet-bi/${category}`}
                className="inline-flex min-w-max items-center gap-1.5 rounded-full border border-[#0B63CE] bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-[#0B63CE] transition-colors"
              >
                Tất cả
                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                  {categoryDevices.length}
                </span>
              </a>
              {brandTiles.map((brand) => {
                const meta = brandMetaMap[brand.name.toLowerCase()];
                const href = meta?.slug ? `/nhan-hang/${meta.slug}` : `/thiet-bi/${category}`;
                return (
                  <a
                    key={brand.name}
                    href={href}
                    className={`inline-flex min-w-[124px] flex-shrink-0 items-center gap-2 rounded-2xl border px-2.5 py-1.75 transition-colors hover:border-[#0B63CE] hover:text-[#0B63CE] hover:bg-blue-50 ${
                      brand.count > 0 ? 'border-gray-200 bg-white text-gray-700' : 'border-dashed border-gray-200 bg-gray-50 text-gray-400'
                    }`}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                      {meta?.logo_url ? (
                        <Image
                          src={meta.logo_url}
                          alt={brand.name}
                          className="h-full w-full object-contain p-1"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">{brand.name.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[12px] font-semibold text-gray-900">{brand.name}</p>
                      <p className="text-[10px] font-medium text-gray-500">{brand.count} sản phẩm</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <div className="mt-4 flex-1 flex flex-col">
            <EquipmentPageDesktop 
              category={category} 
              devices={categoryDevices}
              loading={loading}
              searchQuery={searchQuery}
              sortBy={sortBy}
              gridColumns={gridColumns}
              itemsPerPage={itemsPerPage}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onGridColumnsChange={setGridColumns}
              onItemsPerPageChange={setItemsPerPage}
              showHero={false}
              showContent={true}
              audienceMode={audienceMode}
            />

            <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    <BookOpen className="h-4 w-4" />
                    Bài viết liên quan
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">Đọc thêm trước khi chọn mua</h3>
                </div>
                <a href="/kien-thuc" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B63CE] hover:text-[#084a9c]">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {relatedArticles.map((article) => (
                  <a
                    key={article.href}
                    href={article.href}
                    className="group rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-[#0B63CE] hover:bg-blue-50 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">Kiến thức</p>
                        <h4 className="mt-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-[#0B63CE]">
                          {article.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {article.desc}
                        </p>
                      </div>
                      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-400 transition-colors group-hover:text-[#0B63CE]">
                        <CaretRight className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
