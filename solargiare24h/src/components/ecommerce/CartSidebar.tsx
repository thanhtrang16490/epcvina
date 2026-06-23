import { X, Minus, Plus, Trash2, ShoppingCart, Phone, MessageCircle } from 'lucide-react';
import { useCart, type CartItem } from '../../context/CartContext';

export default function CartSidebar() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const formatPrice = (millionVND: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(millionVND * 1_000_000);
  };

  const handleZaloContact = () => {
    const message = encodeURIComponent(
      `Tôi muốn đặt hàng ${totalItems} sản phẩm từ Solar Giá Rẻ 24h:\n${items
        .map((i: CartItem) => `- ${i.name} (x${i.quantity})`)
        .join('\n')}\nTổng: ${formatPrice(totalPrice)}`
    );
    window.open(`https://zalo.me/0988446113?text=${message}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:0988446113';
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Giỏ hàng ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-base mb-2">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm">
                Hãy thêm sản phẩm vào giỏ hàng
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  {/* Product Info */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">☀️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {item.systemType === 'hybrid' ? '🔋 Hybrid' : '⚡ On-Grid'}
                        </span>
                        <span>{item.capacity}</span>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-md transition-colors border border-gray-300"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-md transition-colors border border-gray-300"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full text-center text-sm text-gray-500 hover:text-red-600 transition-colors py-2"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          )}
        </div>

        {/* Footer - Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
            {/* Total */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Tổng số lượng:</span>
                <span className="font-semibold text-gray-900">{totalItems} sản phẩm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-bold text-base">Tổng cộng:</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleZaloContact}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Đặt hàng qua Zalo
              </button>
              <button
                onClick={handlePhoneCall}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="h-5 w-5" />
                Gọi tư vấn: 0988 446 113
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              Miễn phí vận chuyển · Bảo hành 25 năm · Hỗ trợ lắp đặt
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
