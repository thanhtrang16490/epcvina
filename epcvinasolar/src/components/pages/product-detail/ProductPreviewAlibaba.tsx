import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CaretDown,
  CaretRight,
  CheckCircle,
  ChatsCircle,
  Heart,
  MagnifyingGlassPlus,
  Star,
} from '@phosphor-icons/react';

const gallery = [
  '/images/solar-home/epcvinasolar-solar-home-hero.webp',
  '/du-an/DU-AN-SAMSUNG---SEVT-THAI-NGUYEN.jpg',
  '/du-an/DU-AN-LOTTE-MART-DONG-DA.jpg',
  '/du-an/DU-AN-KEANG-NAM-LAND-MARK-TOWER.jpg',
  '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg',
  '/du-an/DU-AN-VINHOMES-GOLDEN-RIVER-BA-SON-1.jpg',
  '/du-an/DU-AN-SIEU-THI-LOtTE-DEPARTMENT-STORE.jpg',
  '/du-an/nha-may-thep-ha-noi.jpg',
];

const priceTiers = [
  { price: 'Liên hệ', qty: '1-4 bộ' },
  { price: 'Báo giá tốt', qty: '5-9 bộ' },
  { price: 'Chiết khấu', qty: '≥10 bộ' },
];

const specs = [
  ['Danh mục', 'Tấm pin mặt trời'],
  ['Thương hiệu', 'EPCVINA lựa chọn'],
  ['Công suất', '550-720W'],
  ['Hiệu suất', '20.5-23.0%'],
  ['Cell type', 'Mono half-cut'],
  ['Bảo hành', '12 năm / 25 năm'],
  ['Ứng dụng', 'Nhà ở / nhà xưởng'],
  ['Điện áp hệ', '1000V - 1500V'],
  ['MOQ', '1 bộ'],
  ['Khả năng cấp', 'Có hàng nhanh'],
  ['Chứng từ', 'CO, CQ, datasheet'],
  ['Mức ưu tiên', 'Hàng bán chạy'],
];

const sellerHighlights = [
  'Nhà cung cấp EPC',
  'Tư vấn kỹ thuật',
  'Phản hồi trong 3h',
  'Giao hàng đúng hẹn',
];

const highlights = [
  'Thiết kế tối ưu cho nhà ở và dự án EPC',
  'Tài liệu kỹ thuật rõ ràng, dễ đối chiếu',
  'Có thể cấu hình theo nhu cầu công trình',
  'Tối ưu chi phí cho đơn hàng số lượng lớn',
];

const faqItems = [
  {
    q: 'Sản phẩm này phù hợp với kiểu dự án nào?',
    a: 'Phù hợp với hệ mái nhà ở, nhà xưởng, văn phòng và các dự án EPC cần cấu hình ổn định, dễ triển khai và dễ bảo trì.',
  },
  {
    q: 'Có thể lấy hồ sơ kỹ thuật và catalogue không?',
    a: 'Có. Bạn có thể nhận datasheet, CO, CQ và tài liệu cấu hình ngay trong quá trình tư vấn báo giá.',
  },
  {
    q: 'Có hỗ trợ cấu hình theo yêu cầu không?',
    a: 'Có. EPCVINA có thể điều chỉnh công suất, số lượng, phương án đóng gói và phụ kiện theo mục tiêu dự án.',
  },
];

const buyerModes = [
  {
    key: 'le',
    label: 'Mua lẻ',
    title: 'Khách mua lẻ / tham khảo giá',
    description: 'Hiển thị ưu tiên báo giá nhanh, sản phẩm sẵn hàng và tư vấn cấu hình cơ bản.',
    cta: 'Xem giá lẻ',
  },
  {
    key: 'buon',
    label: 'Mua buôn',
    title: 'Đại lý / mua số lượng',
    description: 'Hiển thị MOQ, chiết khấu theo bậc số lượng và chính sách giao hàng nhanh.',
    cta: 'Nhận báo giá buôn',
  },
  {
    key: 'epc',
    label: 'Dự án EPC',
    title: 'Nhà thầu / EPC / dự án',
    description: 'Ưu tiên hồ sơ kỹ thuật, cấu hình đồng bộ và phương án cung ứng theo dự án.',
    cta: 'Tư vấn dự án',
  },
];

const quickLinks = ['Overview', 'Description', 'Specification', 'FAQ'];

const relatedProducts = [
  { name: 'Tấm pin 610W Mono', meta: 'Dành cho mái diện tích lớn' },
  { name: 'Biến tần hybrid 5kW', meta: 'Tối ưu cho hệ lưu trữ' },
  { name: 'Pin lưu trữ 10kWh', meta: 'Backup cho hộ gia đình' },
  { name: 'Khung nhôm mái tôn', meta: 'Thi công nhanh, đồng bộ' },
];

const topPicks = [
  { name: 'Tấm quang năng 650W', price: 'Liên hệ', moq: 'MOQ: 1 bộ' },
  { name: 'Tấm quang năng 700W', price: 'Báo giá nhanh', moq: 'MOQ: 1 bộ' },
  { name: 'Combo EPC mái nhà', price: 'Theo dự án', moq: 'MOQ: theo dự án' },
  { name: 'Inverter hybrid 5kW', price: 'Tư vấn', moq: 'MOQ: 1 bộ' },
  { name: 'Pin lưu trữ 10kWh', price: 'Giá tốt', moq: 'MOQ: 1 bộ' },
];

const galleryTiles = [
  { title: 'Albanian car launch event', date: '2025.12' },
  { title: 'Jordan Automotive Launch Event', date: '2025.12' },
  { title: 'Azerbaijan Automotive Launch Event', date: '2025.12' },
  { title: 'Overseas training', date: '2025.12' },
  { title: 'Panama distributor', date: '2025.12' },
  { title: 'Panama Supermarket Exhibition', date: '2025.12' },
  { title: 'Panama team building', date: '2025.12' },
  { title: 'Paris Auto Show', date: '2025.12' },
];

export default function ProductPreviewAlibaba() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [buyerMode, setBuyerMode] = useState<'le' | 'buon' | 'epc' | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const thumbListRef = useRef<HTMLDivElement | null>(null);
  const thumbScrollTimerRef = useRef<number | null>(null);

  const selectedBuyer = useMemo(
    () => buyerModes.find((item) => item.key === buyerMode) || buyerModes[0],
    [buyerMode],
  );

  useEffect(() => {
    if (buyerMode) return;
    const timer = window.setTimeout(() => setBuyerMode('le'), 1200);
    return () => window.clearTimeout(timer);
  }, [buyerMode]);

  useEffect(() => {
    return () => {
      if (thumbScrollTimerRef.current) {
        window.clearInterval(thumbScrollTimerRef.current);
      }
    };
  }, []);

  const visibleThumbCount = 4;

  const syncThumbStartIndex = (nextSelectedImage: number) => {
    const maxStartIndex = Math.max(0, gallery.length - visibleThumbCount);
    const preferredStartIndex = Math.max(0, nextSelectedImage - Math.floor((visibleThumbCount - 1) / 2));
    setThumbStartIndex(Math.min(preferredStartIndex, maxStartIndex));
  };

  const scrollThumbs = (direction: 'up' | 'down') => {
    const maxStartIndex = Math.max(0, gallery.length - visibleThumbCount);
    setThumbStartIndex((current) => {
      if (direction === 'up') return Math.max(0, current - 1);
      return Math.min(maxStartIndex, current + 1);
    });
  };

  const startThumbScroll = (direction: 'up' | 'down') => {
    if (thumbScrollTimerRef.current) return;
    scrollThumbs(direction);
    thumbScrollTimerRef.current = window.setInterval(() => scrollThumbs(direction), 220);
  };

  const stopThumbScroll = () => {
    if (thumbScrollTimerRef.current) {
      window.clearInterval(thumbScrollTimerRef.current);
      thumbScrollTimerRef.current = null;
    }
  };

  const thumbOffset = useMemo(() => {
    const itemSize = 95;
    const maxOffset = Math.max(0, gallery.length * itemSize - visibleThumbCount * itemSize);
    return Math.min(Math.max(0, thumbStartIndex * itemSize), maxOffset);
  }, [thumbStartIndex, gallery.length]);

  const maxThumbStartIndex = Math.max(0, gallery.length - visibleThumbCount);
  const canScrollThumbUp = thumbStartIndex > 0;
  const canScrollThumbDown = thumbStartIndex < maxThumbStartIndex;

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1824px] items-center justify-between gap-4 px-4 py-2 text-[13px] text-gray-800 sm:px-6 lg:px-12">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 font-medium">
              <span className="text-[18px] leading-none text-gray-500">☰</span>
              All categories
            </span>
            <span className="hidden font-medium lg:inline">Verified manufacturers</span>
            <span className="hidden font-medium lg:inline">Dropshipping</span>
          </div>
          <div className="hidden items-center gap-8 lg:flex">
            <span>About Alibaba.com</span>
            <span>Help Center</span>
            <span>Accio Work</span>
            <span>Sell on Alibaba.com</span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="mx-auto flex max-w-[1824px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-12">
            <a href="/thiet-bi" className="flex items-center gap-3 shrink-0">
              <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#f60] text-xl font-bold text-white">
                e
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-gray-900">EPCVINA</p>
                <p className="text-[12px] text-gray-500">Trang mẫu chi tiết sản phẩm</p>
              </div>
            </a>

            <div className="hidden min-w-0 flex-1 lg:flex">
              <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-[999px] border border-[#f60] bg-white shadow-[0_10px_24px_-18px_rgba(0,0,0,.35)]">
                <button className="flex items-center gap-2 border-r border-gray-200 bg-[#fff7f2] px-4 text-[13px] font-semibold text-gray-900">
                  Categories
                  <CaretDown className="h-4 w-4 text-gray-500" />
                </button>
                <input
                  aria-label="Search"
                  value="tấm pin mặt trời 550w"
                  readOnly
                  className="min-w-0 flex-1 px-4 py-3 text-[14px] text-gray-900 outline-none"
                />
                <button className="bg-[#f60] px-6 text-[14px] font-semibold text-white">
                  Search
                </button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="inline-flex h-11 items-center rounded-full border border-gray-300 bg-white px-4 text-[13px] font-semibold text-gray-800">
                Sign in
              </button>
              <button className="inline-flex h-11 items-center rounded-full bg-[#f60] px-4 text-[13px] font-semibold text-white">
                Join free
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1824px] px-4 py-4 sm:px-6 lg:px-12">
        <nav className="flex flex-wrap items-center gap-2 px-1 pb-4 text-[13px] text-gray-500">
          <a href="/thiet-bi" className="font-medium text-gray-700 hover:text-[#f60]">
            Vehicles & Transportation
          </a>
          <span>/</span>
          <span className="font-medium text-gray-700">Automotives</span>
          <span>/</span>
          <span className="font-medium text-gray-700">New Cars</span>
        </nav>

        <section className="grid grid-cols-1 gap-6 bg-white px-0 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_388px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_404px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_416px] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="relative pl-[82px]">
              <div
                ref={thumbListRef}
                className="absolute left-0 top-0 h-full w-[70px] overflow-hidden pr-1 pt-10 pb-10"
                onMouseLeave={stopThumbScroll}
              >
                <button
                  type="button"
                  aria-label="Cuộn thumbnail lên"
                  onClick={() => setThumbStartIndex((current) => Math.max(0, current - 1))}
                  className={`absolute left-1/2 top-3 z-30 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border bg-white text-gray-700 shadow-sm transition ${
                    canScrollThumbUp ? 'border-gray-300 hover:border-gray-500' : 'pointer-events-none opacity-30'
                  }`}
                >
                  <span className="text-lg leading-none">⌃</span>
                </button>

                <div
                  className="absolute left-0 top-0 z-10 hidden h-1/2 w-full lg:block"
                  onMouseEnter={() => startThumbScroll('up')}
                  onMouseLeave={stopThumbScroll}
                />
                <div
                  className="absolute bottom-0 left-0 z-10 hidden h-1/2 w-full lg:block"
                  onMouseEnter={() => startThumbScroll('down')}
                  onMouseLeave={stopThumbScroll}
                />

                <div
                  className="relative z-20 flex flex-col gap-3 transition-transform duration-300 ease-out"
                  style={{ transform: `translate3d(0, -${thumbOffset}px, 0)` }}
                >
                  {gallery.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onPointerEnter={() => {
                        setSelectedImage(index);
                        syncThumbStartIndex(index);
                      }}
                      onFocus={() => {
                        setSelectedImage(index);
                        syncThumbStartIndex(index);
                      }}
                      className={`main-image-tc-thumbnail relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[14px] border bg-white transition ${
                        selectedImage === index ? 'main-image-tc-thumbnail-active border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <div className="pointer-events-none absolute inset-0 bg-black/5" />
                      <span className="sr-only">Thumbnail {index + 1}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Cuộn thumbnail xuống"
                  onClick={() => setThumbStartIndex((current) => Math.min(maxThumbStartIndex, current + 1))}
                  className={`absolute bottom-3 left-1/2 z-30 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border bg-white text-gray-700 shadow-sm transition ${
                    canScrollThumbDown ? 'border-gray-300 hover:border-gray-500' : 'pointer-events-none opacity-30'
                  }`}
                >
                  <span className="text-lg leading-none">⌄</span>
                </button>

              </div>

              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-[16px] bg-white">
                  <div className="absolute inset-0">
                    <img
                      key={gallery[selectedImage]}
                      src={gallery[selectedImage]}
                      alt={`Ảnh sản phẩm ${selectedImage + 1}`}
                      className="h-full w-full object-cover transition duration-300 ease-out"
                    />
                  </div>

                  <div className="absolute left-0 top-0 h-full w-full rounded-[16px] border border-gray-200 pointer-events-none" />

                  <button className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="absolute right-4 top-14 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm">
                    <MagnifyingGlassPlus className="h-5 w-5" />
                  </button>
                  <button className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md">
                    <span className="text-2xl leading-none">‹</span>
                  </button>
                  <button className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md">
                    <span className="text-2xl leading-none">›</span>
                  </button>
                </div>

                <div className="mt-3 flex w-fit items-center gap-2 rounded-[14px] bg-[#f5f6f8] p-1 text-[13px] font-semibold text-gray-700">
                  <button className="rounded-[10px] bg-white px-4 py-2 text-[20px] font-semibold text-gray-900 shadow-sm">Photos</button>
                  <button className="rounded-[10px] px-4 py-2 text-[20px] font-normal text-gray-700">Video</button>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] bg-[#eaf4ff] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
              <div className="flex items-start gap-3">
                <img
                  src="/images/placeholder.png"
                  alt="company logo"
                  className="h-12 w-12 rounded bg-white object-cover ring-1 ring-black/5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[16px] font-semibold text-gray-900">Dongfeng Liuzhou Motor Co., Ltd.</p>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-700">Verified</span>
                  </div>
                  <p className="mt-1 text-[13px] text-gray-600">Liuzhou, CN · 8 yrs · Custom Manufacturer</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sellerHighlights.map((item) => (
                      <span key={item} className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-[16px] bg-white p-4">
                <div>
                  <p className="text-[17px] font-bold leading-none text-gray-900">5/5</p>
                  <p className="mt-2 text-[13px] text-gray-600">Store rating</p>
                </div>
                <div>
                  <p className="text-[17px] font-bold leading-none text-gray-900">≤3h</p>
                  <p className="mt-2 text-[13px] text-gray-600">Response Time</p>
                </div>
                <div>
                  <p className="text-[17px] font-bold leading-none text-gray-900">≥100%</p>
                  <p className="mt-2 text-[13px] text-gray-600">On-time dispatch rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:min-w-0 lg:max-w-none">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500">
                <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-gray-700">EPCVINA selected</span>
                <span className="rounded bg-orange-50 px-2 py-1 font-semibold text-[#c24f00]">Mẫu bán chạy</span>
              </div>
              <h1 className="mt-3 max-w-[920px] text-[28px] font-semibold leading-[1.18] text-gray-900 xl:text-[32px]">
                Tấm quang năng chất lượng cao cho nhà ở, nhà xưởng và dự án EPC
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#f60] text-[#f60]" weight="fill" />
                  Chưa có đánh giá
                </span>
                <span>Đã xem nhiều</span>
                <span className="text-[#c24f00]">Thiết bị được quan tâm trong nhóm tấm quang năng</span>
              </div>
              <div className="mt-3 inline-flex rounded bg-slate-100 px-2 py-1 text-[12px] text-gray-700">
                Trang mẫu chi tiết sản phẩm EPCVINA
              </div>
            </div>
            <div className="border-b border-gray-200 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-gray-500">Hình thức quan tâm</p>
                  <h2 className="mt-1 text-[18px] font-semibold text-gray-900">Bạn đang mua cho mục đích nào?</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBuyerMode('epc')}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-800"
                >
                  <ChatsCircle className="h-4 w-4" />
                  Chọn chế độ tư vấn
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {buyerModes.map((mode) => {
                  const isActive = (buyerMode || 'le') === mode.key;
                  return (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setBuyerMode(mode.key as 'le' | 'buon' | 'epc')}
                      className={`rounded-[16px] border p-4 text-left transition ${
                        isActive
                          ? 'border-[#f60] bg-[#fff7f2] shadow-[0_8px_22px_-18px_rgba(255,102,0,.7)]'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <p className="text-[13px] font-semibold text-gray-900">{mode.label}</p>
                      <p className="mt-2 text-[14px] font-semibold leading-6 text-gray-900">{mode.title}</p>
                      <p className="mt-2 text-[12px] leading-6 text-gray-600">{mode.description}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-[#f8fafc] px-4 py-3">
                <div>
                  <p className="text-[12px] text-gray-500">Đang ưu tiên hiển thị</p>
                  <p className="text-[14px] font-semibold text-gray-900">{selectedBuyer.title}</p>
                </div>
                <button className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#f60] px-4 py-2 text-[13px] font-semibold text-white">
                  {selectedBuyer.cta}
                </button>
              </div>
            </div>

            <div className="grid gap-4 border-b border-gray-200 pb-5 sm:grid-cols-3">
              {priceTiers.map((tier) => (
                <div key={tier.qty}>
                  <p className="text-[30px] font-semibold leading-none tracking-tight text-gray-900">{tier.price}</p>
                  <p className="mt-2 text-[13px] text-gray-600">{tier.qty}</p>
                </div>
              ))}
            </div>

            <div className="border-b border-gray-200 pb-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[18px] font-semibold text-gray-900">Phiên bản / cấu hình</h2>
                <button className="rounded-full border border-gray-300 px-4 py-1.5 text-[13px] font-semibold text-gray-700">
                  Chọn cấu hình
                </button>
              </div>
              <div className="mt-4 inline-flex rounded-[14px] border-2 border-gray-800 bg-gray-100 px-4 py-3 text-[13px] font-medium text-gray-800">
                550W Mono Half-cut - cấu hình tiêu chuẩn
              </div>
            </div>

            <div className="grid gap-4 border-b border-gray-200 pb-5 md:grid-cols-2">
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900">Khả năng tuỳ biến của nhà cung cấp</h2>
                <ul className="mt-4 space-y-3 text-[13px] text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-900" />
                    In logo, label, bao bì
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-900" />
                    Cấu hình theo bản vẽ
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-900" />
                    Cung cấp mẫu test
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-900" />
                    Hỗ trợ trọn gói
                  </li>
                </ul>
              </div>
              <div className="rounded-[18px] border border-gray-200 bg-[#f8fafc] p-4">
                <h3 className="text-[15px] font-semibold text-gray-900">Mức độ quan tâm</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] bg-white p-4">
                    <p className="text-[12px] text-gray-500">Yêu cầu báo giá</p>
                    <p className="mt-1 text-[20px] font-semibold text-gray-900">248</p>
                  </div>
                  <div className="rounded-[14px] bg-white p-4">
                    <p className="text-[12px] text-gray-500">Mẫu đã gửi</p>
                    <p className="mt-1 text-[20px] font-semibold text-gray-900">36</p>
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-6 text-gray-600">
                  Bố cục giữ đúng nhịp thị giác của một trang marketplace chi tiết sản phẩm, nhưng toàn bộ nội dung đã được viết lại cho EPCVINA Solar.
                </p>
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[18px] font-semibold text-gray-900">Thuộc tính chính</h2>
                <span className="rounded-full bg-[#fff7f2] px-3 py-1 text-[12px] font-semibold text-[#c24f00]">Key attributes</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-0 overflow-hidden rounded-[14px] border border-gray-200 md:grid-cols-3">
                {specs.map(([label, value], index) => (
                  <div
                    key={label}
                    className={`min-h-[92px] border-r border-b border-gray-200 p-4 last:border-r-0 ${
                      index >= 9 ? 'border-b-0' : ''
                    }`}
                  >
                    <p className="text-[13px] leading-5 text-gray-500">{label}</p>
                    <p className="mt-2 text-[16px] font-semibold leading-6 text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-[18px] border border-gray-200 bg-white p-5 lg:sticky lg:top-6 lg:self-start lg:max-w-none shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="space-y-0">
              <div className="pb-4">
                <h3 className="text-[18px] font-semibold text-gray-900">Vận chuyển</h3>
                <p className="mt-4 text-[13px] leading-6 text-gray-700">
                  Phí vận chuyển và thời gian giao hàng sẽ được xác nhận theo địa điểm và quy mô đơn hàng. Liên hệ để nhận báo giá cụ thể.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-[17px] font-semibold text-gray-900">Cam kết giao dịch</h4>
                  <span className="text-2xl leading-none text-gray-400">›</span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" weight="fill" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-semibold text-gray-900">Thanh toán an toàn</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold">VISA</span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold">MC</span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold">PP</span>
                        </div>
                      </div>
                      <p className="mt-1 text-[13px] leading-6 text-gray-600">
                        Mọi trao đổi báo giá và đặt hàng đều được quản lý minh bạch, có xác nhận kỹ thuật trước khi chốt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" weight="fill" />
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">Hỗ trợ đổi trả theo điều kiện</p>
                      <p className="mt-1 text-[13px] leading-6 text-gray-600">
                        Có chính sách xử lý rõ ràng nếu hàng giao sai quy cách, thiếu số lượng hoặc lỗi kỹ thuật.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] bg-[#f60] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-16px_rgba(255,102,0,.65)] transition active:scale-[0.98]">
                Gửi yêu cầu
              </button>
              <button className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-gray-400 bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 transition active:scale-[0.98]">
                Chat ngay
              </button>
              <button className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-[#f60] bg-[#fff7f2] px-5 py-3 text-[14px] font-semibold text-[#c24f00] transition active:scale-[0.98]">
                Nhận giá mới nhất
              </button>
              <button
                type="button"
                onClick={() => setBuyerMode('epc')}
                className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-gray-200 bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 transition active:scale-[0.98]"
              >
                <CaretRight className="mr-1 h-4 w-4" />
                Tư vấn theo mục đích mua
              </button>

              <div className="mt-5 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                  <Heart className="h-4 w-4 text-gray-500" />
                  Lưu lại sản phẩm
                </div>
                <div className="mt-3 flex items-center gap-2 text-[13px] text-gray-600">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-700">
                    i
                  </span>
                  Hỗ trợ hồ sơ kỹ thuật, CO, CQ
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-[18px] border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                    activeTab === tab ? 'bg-[#fff7f2] text-[#c24f00]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)]">
            <div>
              <h2 className="text-[20px] font-semibold text-gray-900">Service</h2>
              <p className="mt-4 text-[14px] leading-7 text-gray-600">
                Free replacement parts &amp; online technical support cho dự án EPC, đại lý và khách mua lẻ.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="rounded-[14px] bg-[#f8fafc] px-4 py-3 text-[13px] leading-6 text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[18px] bg-[#f8fafc] p-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Product video / media</h3>
              <div className="mt-4 aspect-[16/10] overflow-hidden rounded-[16px] border border-gray-200 bg-gradient-to-br from-slate-100 via-white to-orange-50">
                <div className="flex h-full items-center justify-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                    <span className="ml-1 text-2xl text-[#f60]">▶</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-gray-600">
                Khối media đặt ở phần giữa để giống nhịp trình bày của trang thương mại B2B.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_372px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_384px]">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[18px] border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4">
                <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-gray-700">
                  <span className="rounded-full bg-[#fff7f2] px-3 py-1 text-[#c24f00]">Overview</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">Description</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">Specification</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">FAQ</span>
                </div>
              </div>
              <div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <div>
                  <h2 className="text-[20px] font-semibold text-gray-900">Mô tả sản phẩm</h2>
                  <p className="mt-3 text-[14px] leading-7 text-gray-600">
                    Đây là bản mẫu giao diện chi tiết sản phẩm theo kiểu marketplace B2B. Mục tiêu là tái tạo cảm giác nhiều thông tin, 
                    nhiều lớp tin cậy và nhiều điểm chốt chuyển đổi giống các trang thương mại công nghiệp lớn.
                  </p>
                  <p className="mt-3 text-[14px] leading-7 text-gray-600">
                    Phần nội dung được viết lại cho EPCVINA Solar, tập trung vào sự rõ ràng về công suất, hiệu suất, cấu hình và tài liệu kỹ thuật.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {highlights.map((item) => (
                      <div key={item} className="rounded-[14px] bg-[#f8fafc] px-4 py-3 text-[13px] leading-6 text-gray-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <h3 className="text-[15px] font-semibold text-gray-900">Product video / media</h3>
                  <div className="mt-4 aspect-[16/10] overflow-hidden rounded-[16px] border border-gray-200 bg-gradient-to-br from-slate-100 via-white to-orange-50">
                    <div className="flex h-full items-center justify-center">
                      <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                        <span className="ml-1 text-2xl text-[#f60]">▶</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-gray-600">
                    Khu vực này thường dùng để trình bày clip giới thiệu sản phẩm, xưởng hoặc quy trình đóng gói.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-5">
              <h2 className="text-[18px] font-semibold text-gray-900">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-gray-200">
                {faqItems.map((item) => (
                  <div key={item.q} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-[14px] font-semibold text-gray-900">{item.q}</p>
                    <p className="mt-2 text-[13px] leading-6 text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[18px] font-semibold text-gray-900">Buyer reviews</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-700">4.8/5 average</span>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  'Giao diện giúp đọc nhanh thông số và quyết định rất nhanh.',
                  'Khối thông tin rõ, phù hợp để dùng làm trang mẫu nội bộ.',
                  'Nếu thay ảnh thật thì cảm giác như một PDP thương mại đầy đủ.',
                ].map((quote, index) => (
                  <div key={quote} className="rounded-[16px] bg-[#f8fafc] p-4">
                    <div className="flex items-center gap-2 text-[#f60]">
                      <Star className="h-4 w-4 fill-current" weight="fill" />
                      <Star className="h-4 w-4 fill-current" weight="fill" />
                      <Star className="h-4 w-4 fill-current" weight="fill" />
                      <Star className="h-4 w-4 fill-current" weight="fill" />
                      <Star className="h-4 w-4 fill-current" weight="fill" />
                    </div>
                    <p className="mt-3 text-[14px] leading-7 text-gray-700">"{quote}"</p>
                    <p className="mt-2 text-[12px] text-gray-500">Buyer {index + 1} · verified order</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-start-3">
            <div className="rounded-[18px] border border-gray-200 bg-white p-5">
              <h2 className="text-[18px] font-semibold text-gray-900">Related products</h2>
              <div className="mt-4 space-y-3">
                {relatedProducts.map((item) => (
                  <a
                    key={item.name}
                    href="/thiet-bi"
                    className="flex items-center gap-3 rounded-[14px] border border-gray-200 p-3 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-[12px] bg-gradient-to-br from-slate-100 to-orange-50" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-1 text-[12px] text-gray-500">{item.meta}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-5">
              <h2 className="text-[18px] font-semibold text-gray-900">Supplier capabilities</h2>
              <div className="mt-4 space-y-3 text-[13px] text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" weight="fill" />
                  <span>Hỗ trợ thiết kế phương án cho hệ EPC quy mô nhỏ đến lớn</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" weight="fill" />
                  <span>Đồng bộ thiết bị và phụ kiện theo từng dòng công trình</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" weight="fill" />
                  <span>Có thể gửi mẫu, catalogue và hồ sơ kỹ thuật trước khi chốt</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
