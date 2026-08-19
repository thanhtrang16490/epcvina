import { useEffect, useMemo, useRef, useState } from 'react';
import EquipmentMarketplaceHeader from '../equipment/EquipmentMarketplaceHeader';
import { localBrands } from '../../../data/brands';
import { localProducts } from '../../../data/products';
import ProductDetailMediaGallery, { type ProductMediaItem } from './ProductDetailMediaGallery';
import ProductDetailBrandCard from './ProductDetailBrandCard';
import ProductDetailSidebarPanel from './ProductDetailSidebarPanel';

interface ProductDetailPreviewProps {
  product?: {
    name?: string;
    brand?: string;
    main_image?: string;
    gallery_images?: string[];
    video_url?: string;
    model?: string;
    description?: string;
    warranty?: string;
    specifications?: Record<string, string>;
  };
  images?: string[];
}

const priceTiers = [
  { price: 'Liên hệ', qty: '1-4 bộ' },
  { price: 'Báo giá tốt', qty: '5-9 bộ' },
  { price: 'Chiết khấu', qty: '≥10 bộ' },
];

const sellerHighlights = ['Nhà cung cấp EPC', 'Tư vấn kỹ thuật', 'Phản hồi trong 3h', 'Giao hàng đúng hẹn'];

const highlights = [
  'Thiết kế tối ưu cho nhà ở và dự án EPC',
  'Tài liệu kỹ thuật rõ ràng, dễ đối chiếu',
  'Có thể cấu hình theo nhu cầu công trình',
  'Tối ưu chi phí cho đơn hàng số lượng lớn',
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
    description: 'Hiển thị số lượng tối thiểu, chiết khấu theo bậc và chính sách giao hàng nhanh.',
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

export default function ProductDetailPreview({ product, images }: ProductDetailPreviewProps = {}) {
  const descriptionRef = useRef<HTMLElement | null>(null);
  const specsRef = useRef<HTMLElement | null>(null);
  const reviewsRef = useRef<HTMLElement | null>(null);

  const gallery = useMemo<ProductMediaItem[]>(() => {
    const sourceImages = images?.length ? images : product?.gallery_images?.length ? product.gallery_images : [];
    const normalized = sourceImages.filter(Boolean);
    const media: Array<{ type: 'video' | 'image'; src: string }> = [];
    const isVideoSrc = (src: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src);

    if (product?.video_url) {
      media.push({ type: 'video', src: product.video_url });
    }

    const baseImages = product?.main_image ? [product.main_image, ...normalized] : normalized;
    Array.from(new Set(baseImages)).forEach((src) => {
      if (!src) return;
      media.push({ type: isVideoSrc(src) ? 'video' : 'image', src });
    });

    return media.length ? media : [{ type: 'image', src: '/images/placeholder.png' }];
  }, [images, product?.gallery_images, product?.main_image, product?.video_url]);

  const [buyerMode, setBuyerMode] = useState<'le' | 'buon' | 'epc' | null>(null);

  const selectedBuyer = useMemo(
    () => buyerModes.find((item) => item.key === buyerMode) || buyerModes[0],
    [buyerMode],
  );

  const productName = product?.name || 'Tấm quang năng chất lượng cao cho nhà ở, nhà xưởng và dự án EPC';
  const productBrand = product?.brand || 'EPCVINA Solar';
  const productModel = product?.model || 'Cấu hình tiêu chuẩn';
  const productDescription =
    product?.description ||
    'Thiết bị điện mặt trời chính hãng, tối ưu cho hệ nhà ở và dự án EPC với hiệu suất ổn định, hồ sơ kỹ thuật rõ ràng và khả năng cung ứng nhanh.';
  const productSpecs = product?.specifications || {};

  const brandInfo = useMemo(() => {
    const normalizedBrand = (product?.brand || '').toLowerCase();
    return (
      localBrands.find((item) => item.name.toLowerCase() === normalizedBrand) ||
      localBrands.find((item) => item.slug.toLowerCase() === normalizedBrand) ||
      localBrands.find((item) => normalizedBrand.includes(item.name.toLowerCase())) ||
      localBrands.find((item) => normalizedBrand.includes(item.slug.toLowerCase())) ||
      null
    );
  }, [product?.brand]);

  const keySpecs = [
    ['Danh mục', productSpecs['Danh mục'] || productSpecs['Category'] || 'Tấm pin mặt trời'],
    ['Thương hiệu', productBrand],
    ['Công suất', productSpecs['Công suất'] || productSpecs['Công suất tấm pin Pmax'] || productSpecs['Power'] || '550-720W'],
    ['Hiệu suất', productSpecs['Hiệu suất'] || '20.5-23.0%'],
    ['Loại cell', productSpecs['Loại cell'] || productSpecs['Cell type'] || 'Mono half-cut'],
    ['Bảo hành', productSpecs['Bảo hành'] || product?.warranty || '12 năm / 25 năm'],
    ['Ứng dụng', productSpecs['Ứng dụng'] || 'Nhà ở / nhà xưởng'],
    ['Điện áp hệ', productSpecs['Điện áp hệ'] || '1000V - 1500V'],
    ['Số lượng tối thiểu', productSpecs['MOQ'] || '1 bộ'],
    ['Khả năng cấp', productSpecs['Khả năng cấp'] || 'Có hàng nhanh'],
    ['Chứng từ', productSpecs['Chứng từ'] || 'CO, CQ, datasheet'],
    ['Mức ưu tiên', 'Hàng bán chạy'],
  ];

  const technicalSpecs = [
    ['Công suất', productSpecs['power'] || productSpecs['Power'] || productSpecs['Công suất'] || '550-720W'],
    ['Hiệu suất', productSpecs['efficiency'] || productSpecs['Hiệu suất'] || '20.5-23.0%'],
    ['Loại cell', productSpecs['cell_type'] || productSpecs['Cell type'] || productSpecs['Loại cell'] || 'Mono half-cut'],
    ['Loại mặt pin', productSpecs['panel_type'] || productSpecs['panel type'] || productSpecs['Loại mặt pin'] || 'Mặt kính / Mono'],
    ['Kích thước', productSpecs['dimensions'] || productSpecs['Dimensions'] || 'Tiêu chuẩn dự án'],
    ['Khối lượng', productSpecs['weight'] || productSpecs['Weight'] || 'Theo cấu hình'],
  ];

  const technicalSpecRows = useMemo(() => {
    const rows: Array<Array<[string, string]>> = [];
    for (let i = 0; i < technicalSpecs.length; i += 2) {
      rows.push(technicalSpecs.slice(i, i + 2) as Array<[string, string]>);
    }
    return rows;
  }, [productSpecs]);

  const priceTiersDynamic = product?.price
    ? [
        { price: `${new Intl.NumberFormat('vi-VN').format(product.price)}đ`, qty: '1-4 bộ' },
        { price: 'Báo giá tốt', qty: '5-9 bộ' },
        { price: 'Chiết khấu', qty: '≥10 bộ' },
      ]
    : priceTiers;

  const relatedProducts = useMemo(() => {
    const currentSlug = product?.main_image || '';
    return localProducts
      .filter((item) => item.main_image !== currentSlug)
      .slice(0, 5)
      .map((item, index) => ({
        name: item.name,
        meta: item.brand,
        image: item.main_image,
        price: index < 2 ? 'Liên hệ' : index < 4 ? 'Báo giá tốt' : 'Chiết khấu',
        moq: index % 3 === 0 ? '1 bộ' : '3 bộ',
      }));
  }, [product?.main_image]);

  useEffect(() => {
    if (buyerMode) return;
    const timer = window.setTimeout(() => setBuyerMode('le'), 1200);
    return () => window.clearTimeout(timer);
  }, [buyerMode]);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <EquipmentMarketplaceHeader title="Tấm pin mặt trời chính hãng" subtitle="Thiết bị EPCVINA cho dự án, tồn kho sẵn, báo giá nhanh" />

      <div className="mx-auto w-full max-w-[1824px] px-4 py-4 sm:px-6 lg:px-12">
        <nav className="flex flex-wrap items-center gap-2 px-1 pb-4 text-[13px] text-gray-500">
          <a href="/thiet-bi" className="font-medium text-gray-700 hover:text-[#f60]">
            Thiết bị năng lượng mặt trời
          </a>
          <span>/</span>
          <span className="font-medium text-gray-700">Tấm quang năng</span>
          <span>/</span>
          <span className="font-medium text-gray-700">{productBrand}</span>
        </nav>

        <section className="grid grid-cols-1 gap-6 bg-white px-0 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_388px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_404px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_416px] lg:items-start">
          <div className="space-y-6">
            <ProductDetailMediaGallery gallery={gallery} />
            <ProductDetailBrandCard
              brandInfo={brandInfo}
              productBrand={productBrand}
              productModel={productModel}
              productDescription={productDescription}
              sellerHighlights={sellerHighlights}
            />
          </div>
          <div className="space-y-6">
            <div className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
              <p className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-gray-900 lg:text-[34px]">
                {productName}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-gray-500">
                <span>Thương hiệu: {productBrand}</span>
                <span>•</span>
                <span>Model: {productModel}</span>
                {brandInfo?.country ? (
                  <>
                    <span>•</span>
                    <span>{brandInfo.country}</span>
                  </>
                ) : null}
                {brandInfo?.years_active ? (
                  <>
                    <span>•</span>
                    <span>{brandInfo.years_active} năm hoạt động</span>
                  </>
                ) : null}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 rounded-[16px] bg-[#f8fafc] p-4">
                {priceTiersDynamic.map((tier) => (
                  <div key={tier.qty} className="min-w-0">
                    <p className="text-[22px] font-semibold leading-none text-gray-900">{tier.price}</p>
                    <p className="mt-2 text-[13px] text-gray-500">{tier.qty}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[16px] border border-orange-100 bg-[#fff7f2] p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c24f00]">Chọn nhu cầu mua</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {buyerModes.map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setBuyerMode(mode.key as 'le' | 'buon' | 'epc')}
                      className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                        selectedBuyer.key === mode.key
                          ? 'border-[#f60] bg-[#f60] text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-[14px] bg-white p-4">
                  <p className="text-[15px] font-semibold text-gray-900">{selectedBuyer.title}</p>
                  <p className="mt-2 text-[13px] leading-6 text-gray-600">{selectedBuyer.description}</p>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailSidebarPanel onSelectBuyerMode={() => setBuyerMode('epc')} />
        </section>

        <div className="mt-10">
          <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Gợi ý cho bạn</p>
                  <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Sản phẩm liên quan</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm">‹</button>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm">›</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                {relatedProducts.map((item, index) => (
                  <a key={item.name} href="/thiet-bi" className="group block">
                    <div className="aspect-square overflow-hidden rounded-[18px] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition group-hover:shadow-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-3 inline-flex rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-gray-600">
                      {index % 2 === 0 ? 'Mới' : 'Bán chạy'}
                    </div>
                    <p className="mt-3 line-clamp-2 text-[16px] leading-6 text-gray-800">{item.name}</p>
                    <p className="mt-2 text-[20px] font-semibold tracking-tight text-gray-900">{item.price}</p>
                    <p className="mt-1 text-[14px] text-gray-600">MOQ: {item.moq}</p>
                  </a>
                ))}
              </div>
            </section>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToSection(descriptionRef)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-[#f60] hover:text-[#c24f00]"
              >
                Mô tả sản phẩm
              </button>
              <button
                type="button"
                onClick={() => scrollToSection(specsRef)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-[#f60] hover:text-[#c24f00]"
              >
                Thông số kỹ thuật
              </button>
            </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_416px] xl:grid-cols-[minmax(0,1fr)_404px] 2xl:grid-cols-[minmax(0,1fr)_416px] lg:items-start">
            <div className="min-w-0">
              <section ref={descriptionRef} className="mt-0">
                <div className="rounded-[18px] border border-gray-200 bg-white p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Mô tả sản phẩm</p>
                  <h2 className="mt-2 text-[28px] font-semibold text-gray-900">{productName}</h2>
                  <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                    <div className="space-y-4 text-[15px] leading-7 text-gray-700">
                      <p>{productDescription}</p>
                      <p>
                        Sản phẩm phù hợp cho nhà ở, nhà xưởng và các dự án EPC cần tài liệu kỹ thuật rõ ràng, khả năng
                        cung ứng nhanh và phương án cấu hình linh hoạt theo yêu cầu thực tế.
                      </p>
                      <p>
                        EPCVINA hỗ trợ tư vấn theo nhu cầu mua lẻ, mua buôn hoặc triển khai dự án, giúp khách hàng chọn
                        đúng cấu hình ngay từ đầu và rút ngắn thời gian báo giá.
                      </p>
                    </div>
                    <div className="rounded-[16px] bg-[#f8fafc] p-4">
                      <p className="text-[14px] font-semibold text-gray-900">Điểm nổi bật</p>
                      <div className="mt-3 grid gap-3">
                        {highlights.map((item) => (
                          <div key={item} className="rounded-[14px] bg-white px-4 py-3 text-[13px] leading-6 text-gray-700">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section ref={specsRef} className="mt-8">
                <div className="rounded-[18px] border border-gray-200 bg-white p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Thông số kỹ thuật</p>
                  <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Chi tiết cấu hình sản phẩm</h2>
                  <div className="mt-5 overflow-hidden rounded-[12px] border border-gray-200">
                    {technicalSpecRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-2 border-b border-gray-200 last:border-b-0 md:grid-cols-4">
                        {row.map(([label, value]) => (
                          <div key={label} className="contents md:contents">
                            <div className="border-r border-gray-200 bg-[#fafafa] px-5 py-5 text-[16px] text-gray-700">
                              {label}
                            </div>
                            <div className="border-r border-gray-200 px-5 py-5 text-[16px] font-semibold text-gray-900">
                              {value}
                            </div>
                          </div>
                        ))}
                        {row.length === 1 ? (
                          <>
                            <div className="border-r border-gray-200 bg-[#fafafa] px-5 py-5 text-[16px] text-gray-700 md:block hidden" />
                            <div className="px-5 py-5 text-[16px] font-semibold text-gray-900 md:block hidden" />
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section ref={reviewsRef} className="mt-8">
                <div className="rounded-[18px] border border-gray-200 bg-white p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Đánh giá khách hàng</p>
                  <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Khách hàng nói gì về sản phẩm</h2>
                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    {[
                      {
                        name: 'Anh Minh',
                        role: 'Chủ nhà tại Hà Nội',
                        rating: '5/5',
                        text: 'Tư vấn rõ ràng, báo giá nhanh và đúng nhu cầu. Quy trình đặt hàng rất dễ theo dõi.',
                      },
                      {
                        name: 'Chị Hạnh',
                        role: 'Nhà thầu EPC',
                        rating: '5/5',
                        text: 'Tài liệu kỹ thuật đầy đủ, hỗ trợ cấu hình rất tốt cho dự án và phản hồi cực nhanh.',
                      },
                      {
                        name: 'Anh Tuấn',
                        role: 'Đại lý phân phối',
                        rating: '4.9/5',
                        text: 'Hàng có sẵn, thông tin minh bạch, phù hợp cả mua lẻ và mua số lượng lớn.',
                      },
                    ].map((review) => (
                      <article key={review.name} className="rounded-[16px] bg-[#f8fafc] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[16px] font-semibold text-gray-900">{review.name}</p>
                            <p className="mt-1 text-[13px] text-gray-500">{review.role}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-[#c24f00]">
                            {review.rating}
                          </span>
                        </div>
                        <p className="mt-4 text-[14px] leading-6 text-gray-700">{review.text}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <aside className="hidden lg:block lg:self-start">
              <div className="sticky top-6 rounded-[18px] border border-gray-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Tư vấn nhanh</p>
                <h3 className="mt-2 text-[22px] font-semibold text-gray-900">Cần báo giá cho dự án?</h3>
                <p className="mt-3 text-[14px] leading-6 text-gray-600">
                  Gửi yêu cầu để EPCVINA đề xuất cấu hình, báo giá và phương án giao hàng phù hợp theo quy mô đơn hàng.
                </p>
                <div className="mt-4 rounded-[12px] border border-rose-100 bg-rose-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-[13px] leading-6 text-gray-700">
                    <span className="text-[16px]">🔊</span>
                    <span className="font-medium">Bắt đầu đơn hàng qua chat hoặc gửi yêu cầu</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-[11px] font-semibold text-gray-500">
                      i
                    </span>
                  </div>
                </div>
                <button className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] bg-[#f60] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-16px_rgba(255,102,0,.65)] transition active:scale-[0.98]">
                  Gửi yêu cầu
                </button>
                <button className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-gray-400 bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 transition active:scale-[0.98]">
                  Chat ngay
                </button>
                <button className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-[#f60] bg-[#fff7f2] px-5 py-3 text-[14px] font-semibold text-[#c24f00] transition active:scale-[0.98]">
                  Nhận giá mới nhất
                </button>
              </div>
            </aside>
          </div>
        </div>

      </div>
    </div>
  );
}
