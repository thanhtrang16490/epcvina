import { CaretRight, CheckCircle, Heart } from '@phosphor-icons/react';

interface ProductDetailSidebarPanelProps {
  onSelectBuyerMode: () => void;
}

export default function ProductDetailSidebarPanel({ onSelectBuyerMode }: ProductDetailSidebarPanelProps) {
  return (
    <aside className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] lg:sticky lg:top-6 lg:self-start lg:max-w-none">
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

        <div className="mt-4 rounded-[12px] border border-rose-100 bg-rose-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[13px] leading-6 text-gray-700">
            <span className="text-[16px]">🔊</span>
            <span className="font-medium">Bắt đầu đơn hàng qua chat hoặc gửi yêu cầu</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-[11px] font-semibold text-gray-500">
              i
            </span>
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
          onClick={onSelectBuyerMode}
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
  );
}
