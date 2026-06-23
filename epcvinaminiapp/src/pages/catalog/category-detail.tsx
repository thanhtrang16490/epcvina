import { useAtomValue } from "jotai";
import { productsByCategoryState } from "@/state";
import { Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Zap, TrendingUp, Battery, Wrench } from "lucide-react";
import ProductList from "@/components/product-list";

// Category metadata mapping
const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = {
  panel: {
    label: "Tấm mô-đun quang điện",
    icon: <Zap className="h-5 w-5"/>,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  inverter: {
    label: "Biến tần / Inverter",
    icon: <TrendingUp className="h-5 w-5"/>,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  battery: {
    label: "Pin lưu trữ",
    icon: <Battery className="h-5 w-5"/>,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  accessories: {
    label: "Phụ kiện lắp đặt",
    icon: <Wrench className="h-5 w-5"/>,
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};

function ProductListContainer() {
  const { id } = useParams();
  const products = useAtomValue(productsByCategoryState(id || ""));
  const meta = useMemo(() => {
    // Map category IDs to metadata
    const categoryMap: Record<string, string> = {
      "panel": "panel",
      "on-grid-inverter": "inverter",
      "hybrid-inverter": "inverter",
      "battery": "battery",
      "accessories": "accessories",
    };
    const mappedId = categoryMap[id || ""] || id;
    return CATEGORY_META[mappedId || "panel"] || CATEGORY_META["panel"];
  }, [id]);

  if (!products.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <div
          className={`w-16 h-16 mx-auto mb-3 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}
        >
          {meta.icon}
        </div>
        <p className="text-gray-500">Không có sản phẩm</p>
      </div>
    );
  }

  return (
    <ProductList
      products={products as any}
      categoryLabel={meta.label}
      categoryIcon={meta.icon}
      categoryColor={meta.color}
      categoryBg={meta.bg}
    />
  );
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const meta = useMemo(() => {
    const categoryMap: Record<string, string> = {
      "panel": "panel",
      "on-grid-inverter": "inverter",
      "hybrid-inverter": "inverter",
      "battery": "battery",
      "accessories": "accessories",
    };
    const mappedId = categoryMap[id || ""] || id;
    return CATEGORY_META[mappedId || "panel"] || CATEGORY_META["panel"];
  }, [id]);

  return (
    <div className="h-full flex flex-col bg-section">
      {/* Category Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">{meta.label}</h1>
      </div>
      
      {/* Product List */}
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="text-center py-12">Đang tải...</div>}>
          <ProductListContainer />
        </Suspense>
      </div>
    </div>
  );
}
