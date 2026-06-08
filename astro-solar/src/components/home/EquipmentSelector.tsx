

import { useEffect, useState } from 'react';
import { Sun, Zap, Battery, Check } from 'lucide-react';

interface EquipmentSelectorProps {
  systemType: 'on-grid' | 'hybrid';
  phase: '1-phase' | '3-phase';
  power: number;
  voltageType?: 'low' | 'high' | null;
  selectedPanel: string | null;
  selectedInverter: string | null;
  selectedBattery: string | null;
  onSelectPanel: (id: string) => void;
  onSelectInverter: (id: string) => void;
  onSelectBattery: (id: string) => void;
}

interface Product {
  id: string;
  name: string;
  unit_price: number;
  main_image: string | null;
  specifications: Record<string, string> | null;
  brands: { name: string; slug: string } | null;
  categories: { name: string; slug: string } | null;
  product_type: string | null;
  phase: string | null;
  voltage: string | null;
}

const vnd = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

function getKeySpec(product: Product): string | null {
  const specs = product.specifications;
  if (!specs) return null;
  // Try common spec keys
  const keys = ['power', 'capacity', 'wattage', 'output_power', 'rated_power', 'power_output'];
  for (const key of keys) {
    if (specs[key]) return specs[key];
  }
  // Return first spec entry as fallback
  const firstEntry = Object.entries(specs)[0];
  return firstEntry ? `${firstEntry[0]}: ${firstEntry[1]}` : null;
}

// ---- Skeleton card ----
function SkeletonCard() {
  return (
    <div className="min-w-[200px] p-4 rounded-xl border-2 border-gray-100 bg-white animate-pulse flex-shrink-0">
      <div className="w-full h-24 bg-gray-100 rounded-lg mb-3" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-4/5 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-3/5 mb-3" />
      <div className="h-5 bg-gray-100 rounded w-2/3" />
    </div>
  );
}

// ---- Single product card ----
function ProductCard({
  product,
  isSelected,
  onSelect,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const brandName = product.brands?.name ?? '';
  const keySpec = getKeySpec(product);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-w-[200px] p-4 rounded-xl border-2 cursor-pointer transition-all text-left flex-shrink-0 ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      {/* Image / Placeholder */}
      <div className="w-full h-24 rounded-lg mb-3 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        {product.main_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.main_image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-300 text-3xl font-bold select-none">☀</div>
        )}
      </div>

      {/* Brand */}
      {brandName && (
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
          {brandName}
        </p>
      )}

      {/* Product name */}
      <p className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
        {product.name}
      </p>

      {/* Key spec */}
      {keySpec && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{keySpec}</p>
      )}

      {/* Price */}
      <p className="text-sm font-bold text-gray-900">
        {product.unit_price > 0 ? vnd(product.unit_price) : 'Liên hệ'}
      </p>

      {/* Selected indicator */}
      {isSelected && (
        <div className="mt-2 flex items-center gap-1 text-blue-600">
          <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </div>
          <span className="text-xs font-semibold">Đã chọn</span>
        </div>
      )}
    </button>
  );
}

// ---- Section row ----
function ProductSection({
  label,
  Icon,
  iconColor,
  iconBg,
  products,
  loading,
  selectedId,
  onSelect,
}: {
  label: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  products: Product[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        {!loading && products.length > 0 && (
          <span className="text-xs text-gray-400">({products.length} sản phẩm)</span>
        )}
      </div>

      {/* Scrollable product row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 px-2 italic">Không tìm thấy sản phẩm phù hợp.</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isSelected={selectedId === p.id}
              onSelect={() => onSelect(p.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ---- Main component ----
export default function EquipmentSelector({
  systemType,
  phase,
  power,
  voltageType,
  selectedPanel,
  selectedInverter,
  selectedBattery,
  onSelectPanel,
  onSelectInverter,
  onSelectBattery,
}: EquipmentSelectorProps) {
  const [panels, setPanels] = useState<Product[]>([]);
  const [inverters, setInverters] = useState<Product[]>([]);
  const [batteries, setBatteries] = useState<Product[]>([]);
  const [loadingPanels, setLoadingPanels] = useState(false);
  const [loadingInverters, setLoadingInverters] = useState(false);
  const [loadingBatteries, setLoadingBatteries] = useState(false);

  // Fetch panels
  useEffect(() => {
    setLoadingPanels(true);
    fetch('/api/products?productType=panel')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPanels(d.data as Product[]);
      })
      .catch(() => {})
      .finally(() => setLoadingPanels(false));
  }, []);

  // Fetch inverters (re-fetch when phase changes)
  useEffect(() => {
    setLoadingInverters(true);
    const params = new URLSearchParams({ productType: 'inverter' });
    if (phase) params.set('phase', phase);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setInverters(d.data as Product[]);
      })
      .catch(() => {})
      .finally(() => setLoadingInverters(false));
  }, [phase]);

  // Fetch batteries (only for hybrid)
  useEffect(() => {
    if (systemType !== 'hybrid') {
      setBatteries([]);
      return;
    }
    setLoadingBatteries(true);
    const params = new URLSearchParams({ productType: 'battery' });
    if (voltageType) params.set('voltage', voltageType);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBatteries(d.data as Product[]);
      })
      .catch(() => {})
      .finally(() => setLoadingBatteries(false));
  }, [systemType, voltageType]);

  return (
    <div>
      {/* Solar Panels */}
      <ProductSection
        label="Tấm pin mặt trời"
        Icon={Sun}
        iconColor="text-orange-500"
        iconBg="bg-orange-50"
        products={panels}
        loading={loadingPanels}
        selectedId={selectedPanel}
        onSelect={onSelectPanel}
      />

      {/* Inverters */}
      <ProductSection
        label="Biến tần"
        Icon={Zap}
        iconColor="text-yellow-600"
        iconBg="bg-yellow-50"
        products={inverters}
        loading={loadingInverters}
        selectedId={selectedInverter}
        onSelect={onSelectInverter}
      />

      {/* Batteries — only for hybrid */}
      {systemType === 'hybrid' && (
        <ProductSection
          label="Pin lưu trữ"
          Icon={Battery}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          products={batteries}
          loading={loadingBatteries}
          selectedId={selectedBattery}
          onSelect={onSelectBattery}
        />
      )}
    </div>
  );
}
