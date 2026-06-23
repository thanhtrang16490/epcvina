import { useState } from "react";
import { Page } from "zmp-ui";
import { combos, MiniCombo } from "@/data/combos";
import ComboCard from "@/components/combo-card";
import TransitionLink from "@/components/transition-link";
import { ArrowLeft } from "lucide-react";

const ComboListPage: React.FunctionComponent = () => {
  const [filter, setFilter] = useState<"all" | "on-grid" | "hybrid">("all");

  const filteredCombos = combos.filter((combo) => {
    if (filter === "all") return true;
    return combo.system_type === filter;
  });

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <TransitionLink to="/" className="p-2 bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </TransitionLink>
          <div>
            <h1 className="text-lg font-bold">Combo Điện Mặt Trời</h1>
            <p className="text-xs text-red-100">
              Giải pháp trọn gói từ EPCVINA
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-red-600"
                : "bg-white/20 text-white"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("on-grid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "on-grid"
                ? "bg-white text-red-600"
                : "bg-white/20 text-white"
            }`}
          >
            On-Grid
          </button>
          <button
            onClick={() => setFilter("hybrid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "hybrid"
                ? "bg-white text-red-600"
                : "bg-white/20 text-white"
            }`}
          >
            Hybrid
          </button>
        </div>
      </div>

      {/* Combo List */}
      <div className="p-4 space-y-4">
        {filteredCombos.map((combo: MiniCombo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-white p-4 mx-4 mb-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Tại sao chọn EPCVINA?</h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">200+</div>
            <div className="text-xs text-gray-600">Dự án</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">25 năm</div>
            <div className="text-xs text-gray-600">Bảo hành</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">70-90%</div>
            <div className="text-xs text-gray-600">Tiết kiệm điện</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">3-5 năm</div>
            <div className="text-xs text-gray-600">Hoàn vốn</div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ComboListPage;
