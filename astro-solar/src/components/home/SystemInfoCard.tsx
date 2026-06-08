

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
  Sun, Zap, Battery, Wrench, Cable, Shield, Pencil,
  X, Check, Minus, Plus, Gauge, Layers, Plug, TrendingUp,
} from 'lucide-react';
import type { Device, EquipmentCategory, TemplateItem } from '../../lib/types';
import { calculateItemQuantities } from '../../lib/api-helpers';

interface SystemInfoCardProps {
  combo: {
    name: string;
    power: number;
    battery: number;
    dailyProduction: number;
    monthlySavings: number;
    paybackPeriod: number;
  };
  mounted: boolean;
  devices?: Device[];
  onDeviceChange?: (category: EquipmentCategory, newDevice: Device) => void;
  templateItems?: TemplateItem[];
  calculationContext?: { panelCount: number; inverterCount: number; capacityKw: number };
  onGrandTotalChange?: (total: number) => void;
}

const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}> = {
  panel:        { label: 'Tấm pin PV',           icon: <Zap       className="h-4 w-4" />, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  inverter:     { label: 'Inverter DC-AC',        icon: <TrendingUp className="h-4 w-4" />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  battery:      { label: 'Pin lưu trữ',           icon: <Battery   className="h-4 w-4" />, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
  meter:        { label: 'Đồng hồ đo điện',       icon: <Gauge     className="h-4 w-4" />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  mounting:     { label: 'Hệ khung nhôm',         icon: <Layers    className="h-4 w-4" />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  wiring:       { label: 'Dây điện DC-AC',        icon: <Cable     className="h-4 w-4" />, color: 'text-gray-600',   bg: 'bg-gray-100',  border: 'border-gray-200'   },
  cabinet:      { label: 'Tủ điện NLMT',          icon: <Plug      className="h-4 w-4" />, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'    },
  grounding:    { label: 'Hệ tiếp địa',           icon: <Shield    className="h-4 w-4" />, color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200'   },
  installation: { label: 'Nhân công lắp đặt',     icon: <Wrench    className="h-4 w-4" />, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
};

const MAIN_ORDER: EquipmentCategory[]      = ['panel', 'inverter', 'battery', 'meter'];
const ACCESSORY_ORDER: EquipmentCategory[] = ['mounting', 'wiring', 'cabinet', 'grounding', 'installation'];
const ALL_ORDER: EquipmentCategory[]       = [...MAIN_ORDER, ...ACCESSORY_ORDER];

function formatVND(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

function extractKeySpec(product: Record<string, unknown>): string {
  const specs = (product.specifications as Record<string, string>) || {};
  return (
    specs.power       ||
    specs.wattage     ||
    specs.rated_power ||
    specs.capacity    ||
    specs.cong_suat   ||
    specs.dung_luong  ||
    ''
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-50/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Quantity Stepper ─────────────────────────────────────────────────────────

function QuantityStepper({
  deviceId,
  quantity,
  originalQuantity,
  unit,
  onDecrement,
  onIncrement,
}: {
  deviceId: string;
  quantity: number;
  originalQuantity: number;
  unit: string;
  onDecrement: (id: string) => void;
  onIncrement: (id: string) => void;
}) {
  const isModified = quantity !== originalQuantity;
  return (
    <div className={`flex items-center gap-0.5 ${isModified ? 'ring-1 ring-blue-400 rounded-lg px-0.5' : ''}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onDecrement(deviceId); }}
        className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex-shrink-0 transition-colors"
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <span className={`text-xs font-semibold min-w-[1.25rem] text-center ${isModified ? 'text-blue-600' : 'text-gray-700'}`}>
        {quantity}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onIncrement(deviceId); }}
        className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex-shrink-0 transition-colors"
        aria-label="Tăng số lượng"
      >
        +
      </button>
      <span className="text-[10px] text-gray-500 ml-0.5 flex-shrink-0">{unit}</span>
    </div>
  );
}

// ─── Category Section (Device-based) ──────────────────────────────────────────

interface CategorySectionProps {
  category: EquipmentCategory;
  devices: Device[];
  isMain?: boolean;
  quantityOverrides: Record<string, number>;
  onQuantityChange: (deviceId: string, delta: number) => void;
  onDeviceClick?: (cat: EquipmentCategory) => void;
}

function CategorySection({
  category,
  devices,
  isMain,
  quantityOverrides,
  onQuantityChange,
  onDeviceClick,
}: CategorySectionProps) {
  const meta = CATEGORY_META[category];
  const subtotal = devices.reduce((sum, d) => {
    const qty = quantityOverrides[d.id] ?? d.quantity;
    return sum + (d.price || 0) * qty;
  }, 0);
  const hasPrice = devices.some(d => d.price && d.price > 0);

  return (
    <div className={`rounded-xl border ${meta.border} overflow-hidden`}>
      {/* Category Header */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 ${meta.bg} gap-2 min-w-0`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
          <span className={`flex-shrink-0 ${meta.color}`}>{meta.icon}</span>
          <span className={`text-xs font-semibold ${meta.color} truncate`}>{meta.label}</span>
          <span className="text-[10px] text-gray-500 flex-shrink-0">({devices.length})</span>
        </div>
        {hasPrice && subtotal > 0 && (
          <span className={`text-[10px] font-bold ${meta.color} flex-shrink-0 whitespace-nowrap`}>{formatVND(subtotal)}</span>
        )}
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100 bg-white">
        {devices.map((device) => {
          const qty = quantityOverrides[device.id] ?? device.quantity;
          const lineTotal = (device.price || 0) * qty;
          const isClickable = isMain && !!onDeviceClick;
          return (
            <div
              key={device.id}
              className={`px-2.5 py-2 ${isClickable ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors' : ''}`}
              onClick={isClickable ? () => onDeviceClick!(category) : undefined}
            >
              <div className="flex items-start gap-1.5 min-w-0">
                {/* Thumbnail (main items only) */}
                {isMain && (
                  <div className={`w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 ${meta.bg} flex items-center justify-center ${meta.color}`}>
                    {device.images?.[0] ? (
                      <img
                        src={device.images[0]}
                        alt={device.model}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="scale-75">{meta.icon}</span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2 break-words">{device.model}</p>
                  {device.brand && (
                    <p className="text-[10px] text-gray-500 truncate">{device.brand}</p>
                  )}
                </div>
                {isClickable && (
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">
                    <Pencil className="h-3 w-3" />
                  </span>
                )}
              </div>

              {/* Price row */}
              <div
                className="flex items-center justify-between mt-1 gap-1 min-w-0"
                style={{ paddingLeft: isMain ? '2rem' : '0' }}
              >
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <QuantityStepper
                    deviceId={device.id}
                    quantity={qty}
                    originalQuantity={device.quantity}
                    unit={device.unit}
                    onDecrement={(id) => onQuantityChange(id, -1)}
                    onIncrement={(id) => onQuantityChange(id, 1)}
                  />
                  {device.price && device.price > 0 ? (
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">× {formatVND(device.price)}</span>
                  ) : null}
                </div>
                {lineTotal > 0 && (
                  <span className="text-[10px] font-bold text-gray-800 flex-shrink-0 whitespace-nowrap">{formatVND(lineTotal)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Template Category Section ────────────────────────────────────────────────

interface TemplateCategorySectionProps {
  category: EquipmentCategory;
  items: { item: TemplateItem; calculatedQuantity: number; lineTotal: number }[];
  isMain?: boolean;
  quantityOverrides: Record<string, number>;
  onQuantityChange: (itemId: string, delta: number) => void;
  onItemClick?: (item: TemplateItem) => void;
}

function TemplateCategorySection({
  category,
  items,
  isMain,
  quantityOverrides,
  onQuantityChange,
  onItemClick,
}: TemplateCategorySectionProps) {
  const meta = CATEGORY_META[category];

  const subtotal = items.reduce((sum, { item, calculatedQuantity, lineTotal }) => {
    const qty = quantityOverrides[item.id] ?? calculatedQuantity;
    const price = item.unitPrice;
    return sum + price * qty;
  }, 0);
  const hasPrice = items.some(({ item }) => item.unitPrice > 0);

  return (
    <div className={`rounded-xl border ${meta.border} overflow-hidden`}>
      {/* Category Header */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 ${meta.bg} gap-2 min-w-0`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
          <span className={`flex-shrink-0 ${meta.color}`}>{meta.icon}</span>
          <span className={`text-xs font-semibold ${meta.color} truncate`}>{meta.label}</span>
          <span className="text-[10px] text-gray-500 flex-shrink-0">({items.length})</span>
        </div>
        {hasPrice && subtotal > 0 && (
          <span className={`text-[10px] font-bold ${meta.color} flex-shrink-0 whitespace-nowrap`}>{formatVND(subtotal)}</span>
        )}
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100 bg-white">
        {items.map(({ item, calculatedQuantity, lineTotal }) => {
          const qty = quantityOverrides[item.id] ?? calculatedQuantity;
          const effectiveLineTotal = item.unitPrice * qty;
          const isClickable = item.isUserSelectable && !!onItemClick;
          const product = item.product;
          const productName = product?.name || item.slotName || meta.label;
          const brand = product?.brands?.name || product?.brand_name || product?.brand || '';
          const imgUrl = product?.main_image || product?.image_url || null;

          return (
            <div
              key={item.id}
              className={`px-2.5 py-2 ${isClickable ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors' : ''}`}
              onClick={isClickable ? () => onItemClick!(item) : undefined}
            >
              <div className="flex items-start gap-1.5 min-w-0">
                {/* Thumbnail (main items only) */}
                {isMain && (
                  <div className={`w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 ${meta.bg} flex items-center justify-center ${meta.color}`}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="scale-75">{meta.icon}</span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2 break-words">{productName}</p>
                  {brand && (
                    <p className="text-[10px] text-gray-500 truncate">{brand}</p>
                  )}
                  {/* Scaling info badge */}
                  {item.scaleSource && (
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      {item.scaleSource === 'panel_count' && 'Theo số tấm pin'}
                      {item.scaleSource === 'inverter_count' && 'Theo số inverter'}
                      {item.scaleSource === 'capacity_kw' && 'Theo công suất'}
                    </p>
                  )}
                </div>
                {isClickable && (
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">
                    <Pencil className="h-3 w-3" />
                  </span>
                )}
              </div>

              {/* Quantity / price row */}
              <div
                className="flex items-center justify-between mt-1 gap-1 min-w-0"
                style={{ paddingLeft: isMain ? '2rem' : '0' }}
              >
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <QuantityStepper
                    deviceId={item.id}
                    quantity={qty}
                    originalQuantity={calculatedQuantity}
                    unit={product?.unit || 'bộ'}
                    onDecrement={(id) => onQuantityChange(id, -1)}
                    onIncrement={(id) => onQuantityChange(id, 1)}
                  />
                  {item.unitPrice > 0 ? (
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">× {formatVND(item.unitPrice)}</span>
                  ) : null}
                </div>
                {effectiveLineTotal > 0 && (
                  <span className="text-[10px] font-bold text-gray-800 flex-shrink-0 whitespace-nowrap">{formatVND(effectiveLineTotal)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Device Selector Modal ────────────────────────────────────────────────────

interface ApiProduct {
  id: string;
  name: string;
  unit_price?: number;
  main_image?: string;
  specifications?: Record<string, string>;
  features?: string[];
  warranty_years?: number;
  brands?: { name: string };
}

interface DeviceSelectorModalProps {
  category: EquipmentCategory;
  currentDevice: Device | null;
  onClose: () => void;
  onConfirm: (device: Device) => void;
}

function DeviceSelectorModal({ category, currentDevice, onClose, onConfirm }: DeviceSelectorModalProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(currentDevice?.quantity ?? 1);

  const meta = CATEGORY_META[category];
  const categoryLabel = meta?.label ?? category;

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const productType = category;
        const res = await fetch(`/api/products?productType=${productType}`, { signal: controller.signal });
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        const list: ApiProduct[] = json.data ?? json.products ?? json ?? [];
        setProducts(list);
        if (currentDevice) {
          const matched = list.find((p: ApiProduct) => p.id === currentDevice.id);
          setSelectedProduct(matched ?? list[0] ?? null);
        } else {
          setSelectedProduct(list[0] ?? null);
        }
      } catch {
        // ignore abort
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [category, currentDevice]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity(prev => Math.min(100, Math.max(1, prev + delta)));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedProduct) return;
    const unitMap: Record<string, string> = {
      panel: 'tấm',
      inverter: 'bộ',
      battery: 'bộ',
      meter: 'cái',
      mounting: 'bộ',
      wiring: 'bộ',
      cabinet: 'bộ',
      grounding: 'bộ',
      installation: 'bộ',
    };
    const newDevice: Device = {
      id: selectedProduct.id,
      category: category as EquipmentCategory,
      brand: selectedProduct.brands?.name ?? '',
      model: selectedProduct.name,
      quantity,
      unit: unitMap[category] ?? 'bộ',
      price: selectedProduct.unit_price ?? 0,
      specs: selectedProduct.specifications ?? {},
      features: selectedProduct.features ?? [],
      warranty: selectedProduct.warranty_years ?? 0,
      images: selectedProduct.main_image ? [selectedProduct.main_image] : [],
      image_url: selectedProduct.main_image,
    };
    onConfirm(newDevice);
  }, [selectedProduct, quantity, category, onConfirm]);

  const totalPrice = (selectedProduct?.unit_price ?? 0) * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-gray-900 text-base">Chọn {categoryLabel}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quantity row */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <span className="text-sm font-medium text-gray-700">Số lượng</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-base font-bold text-gray-900 w-8 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 100}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border-2 border-gray-100 p-3 animate-pulse">
                  <div className="w-full h-20 bg-gray-100 rounded-lg mb-2" />
                  <div className="h-3 bg-gray-100 rounded mb-1.5 w-1/2" />
                  <div className="h-4 bg-gray-100 rounded mb-1 w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              Không tìm thấy sản phẩm
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map(product => {
                const isSelected = selectedProduct?.id === product.id;
                const spec = extractKeySpec(product as unknown as Record<string, unknown>);
                const brand = product.brands?.name ?? '';
                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`relative text-left rounded-xl border-2 p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                    <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-gray-50 flex items-center justify-center">
                      {product.main_image ? (
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className={`${meta?.color ?? 'text-gray-400'}`}>{meta?.icon}</span>
                      )}
                    </div>
                    {brand && (
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 mb-0.5">
                        {brand}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">
                      {product.name}
                    </p>
                    {spec && (
                      <p className="text-[10px] text-gray-500 truncate">{spec}</p>
                    )}
                    {product.unit_price != null && (
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        {formatCurrency(product.unit_price)} ₫
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 space-y-2">
          {totalPrice > 0 && (
            <p className="text-xs text-gray-500 text-center">
              Tổng: <span className="font-bold text-gray-900">{formatCurrency(totalPrice)} ₫</span>
              {quantity > 1 && <span className="text-gray-400"> ({quantity} × {formatCurrency(selectedProduct?.unit_price ?? 0)} ₫)</span>}
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!selectedProduct}
            className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Xác nhận thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

function SystemInfoCard({
  combo,
  mounted,
  devices = [],
  onDeviceChange,
  templateItems,
  calculationContext,
  onGrandTotalChange,
}: SystemInfoCardProps) {
  const [modalCategory, setModalCategory] = useState<EquipmentCategory | null>(null);
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>({});

  const useTemplate = !!(templateItems && templateItems.length > 0);

  // Build panel count from context or derive from template/devices
  const panelDevices = devices.filter(d => d.category === 'panel');
  const effectivePanelCountFromDevices = panelDevices.reduce((sum, d) => {
    return sum + (quantityOverrides[d.id] ?? d.quantity);
  }, 0);

  // For template mode: derive panel count from template items
  const templatePanelItem = templateItems?.find(item => item.productType === 'panel');
  const templatePanelBaseQty = templatePanelItem?.baseQuantity ?? 0;

  // Effective panel count (used for recalculation context in template mode)
  const effectivePanelCount = useTemplate
    ? (quantityOverrides[templatePanelItem?.id ?? ''] ?? templatePanelBaseQty)
    : effectivePanelCountFromDevices;

  // Build calculation context for template mode
  const templateInverterItem = templateItems?.find(item => item.productType === 'inverter');
  const effectiveInverterCount = useTemplate
    ? (quantityOverrides[templateInverterItem?.id ?? ''] ?? (templateInverterItem?.baseQuantity ?? 1))
    : 1;

  const activeContext = calculationContext ?? {
    panelCount: effectivePanelCount,
    inverterCount: effectiveInverterCount,
    capacityKw: combo.power,
  };

  // Recalculate when panel/inverter overrides change in template mode
  const resolvedContext = useTemplate
    ? {
        panelCount: quantityOverrides[templatePanelItem?.id ?? ''] ?? activeContext.panelCount,
        inverterCount: quantityOverrides[templateInverterItem?.id ?? ''] ?? activeContext.inverterCount,
        capacityKw: activeContext.capacityKw,
      }
    : activeContext;

  // Calculated template items
  const calculatedItems = useTemplate && templateItems
    ? calculateItemQuantities(templateItems, resolvedContext)
    : [];

  const openModal = useCallback((cat: EquipmentCategory) => {
    if (onDeviceChange) setModalCategory(cat);
  }, [onDeviceChange]);

  // For template mode: open modal when user clicks a selectable item
  const openTemplateItemModal = useCallback((item: TemplateItem) => {
    if (item.isUserSelectable) {
      setModalCategory(item.productType as EquipmentCategory);
    }
  }, []);

  const handleConfirm = useCallback((newDevice: Device) => {
    if (modalCategory && onDeviceChange) {
      onDeviceChange(modalCategory, newDevice);
    }
    setModalCategory(null);
  }, [modalCategory, onDeviceChange]);

  const handleQuantityChange = useCallback((deviceId: string, delta: number) => {
    if (useTemplate) {
      setQuantityOverrides(prev => {
        const item = templateItems?.find(i => i.id === deviceId);
        const baseQty = item
          ? calculateItemQuantities([item], resolvedContext)[0]?.calculatedQuantity ?? 1
          : 1;
        const current = prev[deviceId] ?? baseQty;
        const next = Math.max(1, current + delta);
        return { ...prev, [deviceId]: next };
      });
    } else {
      setQuantityOverrides(prev => {
        const device = devices.find(d => d.id === deviceId);
        const current = prev[deviceId] ?? (device?.quantity || 1);
        const next = Math.max(1, current + delta);
        return { ...prev, [deviceId]: next };
      });
    }
  }, [useTemplate, templateItems, devices, resolvedContext]);

  // ── Template mode: grouped display ──
  const groupedTemplate = useTemplate
    ? ALL_ORDER.map(cat => ({
        cat,
        items: calculatedItems.filter(({ item }) => item.productType === cat),
      })).filter(({ items }) => items.length > 0)
    : [];

  // ── Device mode: grouped display ──
  const grouped = !useTemplate
    ? ALL_ORDER.map(cat => {
        const catDevices = devices.filter(d => d.category === cat);
        return { cat, catDevices };
      }).filter(({ catDevices }) => catDevices.length > 0)
    : [];

  // Grand total
  const grandTotal = useTemplate
    ? calculatedItems.reduce((sum, { item, calculatedQuantity }) => {
        const qty = quantityOverrides[item.id] ?? calculatedQuantity;
        return sum + item.unitPrice * qty;
      }, 0)
    : devices.reduce((sum, d) => {
        const qty = quantityOverrides[d.id] ?? d.quantity;
        return sum + (d.price || 0) * qty;
      }, 0);

  const hasDetailedPrices = useTemplate
    ? calculatedItems.some(({ item }) => item.unitPrice > 0)
    : devices.some(d => d.price && d.price > 0);

  // Notify parent when grandTotal changes
  const stableGrandTotal = useMemo(() => grandTotal, [grandTotal]);
  useEffect(() => {
    if (onGrandTotalChange && stableGrandTotal > 0) {
      onGrandTotalChange(stableGrandTotal);
    }
  }, [stableGrandTotal, onGrandTotalChange]);

  // Effective power display
  const panelWattage = (() => {
    if (useTemplate && templatePanelItem) {
      const specs = templatePanelItem.product?.specifications as Record<string, string> | undefined;
      if (specs) {
        const spec = Object.values(specs)[0] || '';
        const match = spec.match(/(\d+)\s*[Ww]/);
        if (match) return parseInt(match[1]);
      }
      return 580;
    }
    const panelSpecs = panelDevices[0]?.specs;
    if (!panelSpecs) return 580;
    const spec = Object.values(panelSpecs)[0] as string || '';
    const match = spec.match(/(\d+)\s*[Ww]/);
    return match ? parseInt(match[1]) : 580;
  })();

  const effectivePower = effectivePanelCount > 0
    ? Math.round((effectivePanelCount * panelWattage) / 100) / 10
    : combo.power;

  // Current device in modal (for device-mode modal)
  const currentModalDevice = modalCategory
    ? devices.find(d => d.category === modalCategory) ?? null
    : null;

  return (
    <>
      <GlassCard className="flex-1 flex flex-col lg:overflow-hidden">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sun className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Thông tin hệ</h3>
              <p className="text-[10px] lg:text-xs text-gray-500">
                {mounted ? `${effectivePower} kWp • ${combo.battery > 0 ? 'Hybrid' : 'On-Grid'}` : 'Đang tải...'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 lg:overflow-y-auto p-3 lg:p-4 space-y-4">
          {/* System Specifications */}
          <div>
            <h4 className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Thông số hệ thống</h4>
            <div className="grid grid-cols-2 gap-2">
              {mounted ? [
                { label: 'Công suất',       value: effectivePower,                                unit: 'kWp'  },
                { label: 'Sản lượng/ngày',  value: combo.dailyProduction,                         unit: 'kWh'  },
                { label: 'Sản lượng/tháng', value: Math.round(combo.dailyProduction * 30),        unit: 'kWh'  },
                { label: 'Tiết kiệm/tháng', value: formatCurrency(combo.monthlySavings),          unit: '₫', green: true },
              ].map(({ label, value, unit, green }) => (
                <div key={label} className="p-2 bg-white border border-gray-100 rounded-xl">
                  <p className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
                  <p className={`text-sm font-bold ${green ? 'text-green-600' : 'text-gray-900'}`}>
                    {value} <span className="text-[10px] font-normal text-gray-400">{unit}</span>
                  </p>
                </div>
              )) : (
                <div className="col-span-2 p-2 text-xs text-gray-500">Đang tải...</div>
              )}
            </div>
          </div>

          {/* Equipment grouped by category */}
          {(useTemplate ? groupedTemplate.length > 0 : grouped.length > 0) && (
            <div>
              <h4 className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Thiết bị & phụ kiện</h4>
              <div className="space-y-2">
                {useTemplate
                  ? groupedTemplate.map(({ cat, items }) => (
                      <TemplateCategorySection
                        key={cat}
                        category={cat}
                        items={items}
                        isMain={MAIN_ORDER.includes(cat)}
                        quantityOverrides={quantityOverrides}
                        onQuantityChange={handleQuantityChange}
                        onItemClick={openTemplateItemModal}
                      />
                    ))
                  : grouped.map(({ cat, catDevices }) => (
                      <CategorySection
                        key={cat}
                        category={cat}
                        devices={catDevices}
                        isMain={MAIN_ORDER.includes(cat)}
                        quantityOverrides={quantityOverrides}
                        onQuantityChange={handleQuantityChange}
                        onDeviceClick={onDeviceChange ? openModal : undefined}
                      />
                    ))
                }
              </div>

              {/* Grand Total */}
              {hasDetailedPrices && grandTotal > 0 && (
                <div className="mt-3 flex items-center justify-between px-3 py-2.5 bg-gray-900 rounded-xl">
                  <span className="text-xs font-semibold text-gray-300">Tổng giá trị</span>
                  <span className="text-sm font-bold text-white">{formatVND(grandTotal)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Device Selector Modal */}
      {modalCategory && (
        <DeviceSelectorModal
          category={modalCategory}
          currentDevice={currentModalDevice}
          onClose={() => setModalCategory(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

export default memo(SystemInfoCard);
