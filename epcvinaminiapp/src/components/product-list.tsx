import { useMemo, useState } from "react";
import { ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { Product } from "@/types";
import TransitionLink from "@/components/transition-link";

interface ProductListProps {
  products: Product[];
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  categoryColor: string;
  categoryBg: string;
}

// Format currency helper
function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + " tỷ";
  if (value >= 1000000) return (value / 1000000).toFixed(1) + " triệu";
  if (value >= 1000) return (value / 1000).toFixed(0) + "K";
  return value.toString();
}

export default function ProductList({
  products,
  categoryLabel,
  categoryIcon,
  categoryColor,
  categoryBg,
}: ProductListProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    for (const product of products) {
      if (product.brand) brandSet.add(product.brand);
    }
    return Array.from(brandSet).sort();
  }, [products]);

  // Auto-select first brand
  useMemo(() => {
    if (!selectedBrand && brands.length > 0) {
      setSelectedBrand(brands[0]);
    }
  }, [brands, selectedBrand]);

  // Group products by brand
  const productsByBrand = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach((product) => {
      if (!grouped[product.brand || "Unknown"]) {
        grouped[product.brand || "Unknown"] = [];
      }
      grouped[product.brand || "Unknown"].push(product);
    });
    const sortedBrands = Object.keys(grouped).sort();
    const result: Record<string, Product[]> = {};
    sortedBrands.forEach((brand) => {
      result[brand] = grouped[brand];
    });
    return result;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <div
          className={`w-16 h-16 mx-auto mb-3 rounded-xl ${categoryBg} flex items-center justify-center ${categoryColor}`}
        >
          {categoryIcon}
        </div>
        <p className="text-gray-500">Không có sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Brand Tabs */}
      <div className="sticky top-[104px] z-20 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide min-w-max">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedBrand === brand
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors flex-shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">Lọc</span>
          </button>
        </div>
      </div>

      {/* Products by Brand */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div
            className={`w-16 h-16 mx-auto mb-3 rounded-xl ${categoryBg} flex items-center justify-center ${categoryColor}`}
          >
            {categoryIcon}
          </div>
          <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
        </div>
      ) : (
        Object.entries(productsByBrand)
          .filter(([brand]) => !searchQuery || brand === selectedBrand)
          .map(([brand, brandProducts]) => (
            <div key={brand}>
              {/* Brand Header */}
              <div className="sticky top-[160px] z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">{brand}</h2>
                <p className="text-xs text-gray-500">
                  {brandProducts.length} sản phẩm
                </p>
              </div>

              {/* Product List */}
              <div className="divide-y divide-gray-100 bg-white">
                {brandProducts.map((product) => {
                  return (
                    <TransitionLink
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    >
                      {/* Thumbnail */}
                      <div
                        className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${categoryBg}`}
                      >
                        {product.main_image || product.image ? (
                          <img
                            src={product.main_image || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center ${categoryColor}`}
                          >
                            {categoryIcon}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-0.5">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {product.brand}
                        </p>
                      </div>

                      {/* Right: Price */}
                      {product.price && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-0.5">
                            Đơn giá
                          </p>
                          <p className="text-sm font-semibold text-red-600">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      )}

                      {/* Chevron */}
                      <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    </TransitionLink>
                  );
                })}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
