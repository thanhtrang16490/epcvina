import { MiniCombo } from "@/data/combos";
import { Battery, Zap, Clock, DollarSign, Sun } from "lucide-react";
import TransitionLink from "@/components/transition-link";

interface ComboCardProps {
  combo: MiniCombo;
}

export default function ComboCard({ combo }: ComboCardProps) {
  const isHybrid = combo.system_type === "hybrid";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative">
        <img
          src={combo.image}
          alt={combo.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
              isHybrid ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {isHybrid ? "HYBRID" : "ON-GRID"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600">
            {combo.phase === "3-phase" ? "3 PHA" : "1 PHA"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-800 mb-3">
          {combo.title}
        </h3>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Sun className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Công suất</div>
              <div className="text-sm font-bold text-gray-800">
                {combo.power_kw} kWp
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Sản lượng</div>
              <div className="text-sm font-bold text-gray-800">
                {combo.production_min_kwh}-{combo.production_max_kwh} kWh
              </div>
            </div>
          </div>

          {isHybrid && combo.battery_kwh && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Battery className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Pin lưu trữ</div>
                <div className="text-sm font-bold text-gray-800">
                  {combo.battery_kwh} kWh
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Hoàn vốn</div>
              <div className="text-sm font-bold text-gray-800">
                {combo.payback_label}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {combo.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">Chi phí đầu tư</div>
            <div className="text-lg font-bold text-red-600">
              {combo.investment_million_vnd} triệu
            </div>
          </div>
          <TransitionLink
            to={`/combos/${combo.slug}`}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Xem chi tiết
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
