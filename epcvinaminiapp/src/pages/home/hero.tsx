import { Sun, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-b-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">EPCVINA Solar</h1>
          <p className="text-red-100 text-sm">
            Giải Pháp Năng Lượng Mặt Trời Trọn Gói
          </p>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Sun className="w-8 h-8" />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mt-4">
        <p className="text-sm mb-3">
          ✓ Tư vấn miễn phí ✓ Bảo hành 25 năm ✓ Tiết kiệm 70-90% tiền điện
        </p>
        <button className="w-full bg-white text-red-600 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <Phone className="w-4 h-4" />
          <span>Gọi tư vấn ngay</span>
        </button>
      </div>
    </div>
  );
}
