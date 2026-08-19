interface ProductDetailBrandCardProps {
  brandInfo: {
    name?: string;
    logo_url?: string;
    country?: string;
    years_active?: number;
  } | null;
  productBrand: string;
  productModel: string;
  productDescription: string;
  sellerHighlights: string[];
}

export default function ProductDetailBrandCard({
  brandInfo,
  productBrand,
  productModel,
  productDescription,
  sellerHighlights,
}: ProductDetailBrandCardProps) {
  return (
    <div className="rounded-[18px] bg-[#eaf4ff] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded bg-white ring-1 ring-black/5">
          {brandInfo?.logo_url ? (
            <img src={brandInfo.logo_url} alt={brandInfo.name} className="h-full w-full object-contain p-1" />
          ) : (
            <span className="text-[11px] font-bold uppercase text-gray-700">{productBrand.slice(0, 3)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[16px] font-semibold text-gray-900">{productBrand}</p>
            {brandInfo ? (
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-700">Đã xác minh</span>
            ) : (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[12px] font-semibold text-gray-700">Thương hiệu</span>
            )}
          </div>
          <p className="mt-1 text-[13px] text-gray-600">
            {brandInfo?.country ? `${brandInfo.country} · ` : ''}
            {brandInfo?.years_active ? `${brandInfo.years_active} năm hoạt động · ` : ''}
            {productModel} · {productDescription.slice(0, 80)}
          </p>
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
          <p className="mt-2 text-[13px] text-gray-600">Đánh giá thương hiệu</p>
        </div>
        <div>
          <p className="text-[17px] font-bold leading-none text-gray-900">≤3h</p>
          <p className="mt-2 text-[13px] text-gray-600">Thời gian phản hồi</p>
        </div>
        <div>
          <p className="text-[17px] font-bold leading-none text-gray-900">≥100%</p>
          <p className="mt-2 text-[13px] text-gray-600">Tỷ lệ giao đúng hẹn</p>
        </div>
      </div>
    </div>
  );
}
