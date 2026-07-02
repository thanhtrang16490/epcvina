import { useCart } from '../../../hooks/useCart';
import { X, Minus, Plus, ShoppingBag, Trash, Phone, ChatCircle } from '@phosphor-icons/react';

// Format currency helper
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export default function CartSidebar() {
  const { items, isOpen, totalItems, totalPrice, removeItem, updateQuantity, clearCart, closeCart } = useCart();

  if (!isOpen) return null;

  // Build Zalo message with cart items
  const zaloMessage = items.map(i =>
    `- ${i.name} (${i.brand}) x${i.quantity}${i.price ? ` = ${formatCurrency(i.price * i.quantity)}` : ''}`
  ).join('\n');
  const zaloText = encodeURIComponent(`Xin chào, tôi muốn đặt hàng:\n\n${zaloMessage}\n\nTổng: ${formatCurrency(totalPrice)}\n\nVui lòng tư vấn thêm.`);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-lg font-bold text-gray-900">Giỏ hàng</h2>
            <span className="bg-[#F97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium text-gray-500">Giỏ hàng trống</p>
              <p className="text-sm text-gray-400 mt-1 text-center">Thêm thiết bị từ trang thiết bị để bắt đầu</p>
              <button
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 bg-[#F97316] text-white rounded-lg text-sm font-medium hover:bg-[#C2410C] transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
                    {item.price > 0 && (
                      <p className="text-sm font-bold text-[#F97316] mt-1">{formatCurrency(item.price)}</p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
              <span className="text-xl font-bold text-[#F97316]">{formatCurrency(totalPrice)}</span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <a
                href={`https://zalo.me/0988446113?text=${zaloText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm"
              >
                <ChatCircle className="w-4 h-4" />
                Đặt hàng qua Zalo
              </a>
              <a
                href="tel:0988446113"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#C2410C] transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Gọi đặt hàng: 0988 446 113
              </a>
            </div>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full py-2 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
