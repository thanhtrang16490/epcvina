

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Zap, TrendingUp, X, Battery, Layers, Plug, Cable, Shield, Wrench, ChevronRight, Sun, SlidersHorizontal, Settings, LayoutTemplate, Plus, Minus, Check, Sparkles } from 'lucide-react';
import Image from '../ui/Image';
import DevicePlaceholder from '../ui/DevicePlaceholder';
import ComboPlaceholder from '../ui/ComboPlaceholder';
import type { Device, EquipmentCategory, ComboTemplate, TemplateItem } from '../../lib/types';
import { useScrollContext } from '../layout/DashboardShell';
import { useFetch } from '../../hooks/useFetch';
import { normalizeCombos, normalizeTemplate, calculateItemQuantities } from '../../lib/api-helpers';

function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + ' tỷ';
  if (value >= 1000000) return (value / 1000000).toFixed(1) + ' triệu';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
  return value.toString();
}

// ── Category metadata ──────────────────────────────────────────
const CATEGORY_META: Record<EquipmentCategory, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent: string;
  gradient: string;
}> = {
  panel: {
    label: 'Tấm quang năng',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  inverter: {
    label: 'Biến tần (Inverter)',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    accent: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Layers className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <Cable className="h-5 w-5" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    accent: 'bg-gray-500',
    gradient: 'from-gray-400 to-gray-600',
  },
  cabinet: {
    label: 'Tủ điện',
    icon: <Plug className="h-5 w-5" />,
    color: 'text-red-600',
    bg: 'bg-red-50',
    accent: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    accent: 'bg-teal-500',
    gradient: 'from-teal-400 to-teal-600',
  },
  meter: {
    label: 'Đồng hồ đo',
    icon: <Plug className="h-5 w-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  installation: {
    label: 'Nhân công lắp đặt',
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    accent: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
  },
};

const CATEGORY_ORDER: EquipmentCategory[] = ['panel', 'inverter', 'battery', 'mounting', 'wiring', 'cabinet', 'grounding'];
const ACCESSORY_ORDER: EquipmentCategory[] = ['mounting', 'wiring', 'cabinet', 'grounding', 'installation'];

// Full category display order for template configurator (all 9 categories)
const CATEGORY_DISPLAY_ORDER: EquipmentCategory[] = [
  'panel', 'inverter', 'battery', 'meter',
  'mounting', 'wiring', 'cabinet', 'grounding', 'installation'
];

// Get all available devices for a category from API
async function getAvailableDevicesByCategory(
  category: EquipmentCategory, 
  allCombos: any[],
  targetPhase?: string,      // '1-phase' | '3-phase'
  targetSystemType?: string  // 'on-grid' | 'hybrid'
): Promise<Device[]> {
  const allDevices: Device[] = [];
  
  // Fetch ALL products from API for this category
  try {
    // Map category to correct database slug(s)
    // Inverters have multiple categories: on-grid-1phase, on-grid-3phase-lv
    // Batteries have multiple categories: hv-battery, lv-battery
    let categorySlugs: string[] = [];
    
    if (category === 'inverter') {
      // For inverters, fetch from BOTH phase categories
      categorySlugs = ['on-grid-1phase', 'on-grid-3phase-lv'];
    } else if (category === 'battery') {
      // For batteries, fetch from BOTH voltage categories
      categorySlugs = ['hv-battery', 'lv-battery'];
    } else if (category === 'panel') {
      categorySlugs = ['panel'];
    } else {
      categorySlugs = [category];
    }
    
    // Fetch from all relevant categories
    for (const categorySlug of categorySlugs) {
      const response = await fetch(`/api/products?category=${categorySlug}&show_on_homepage=true`);
      const data = await response.json();
      
      if (data.success && data.data) {
        data.data.forEach((product: any) => {
          // Skip if already added (by ID)
          if (allDevices.some(d => d.id === product.id)) return;
          
          // Map API product to Device format
          const device: Device = {
            id: product.id,
            category: category,
            brand: product.brands?.name || product.brand || 'Unknown',
            model: product.name,
            quantity: 1,
            unit: 'sản phẩm',
            price: product.unit_price || product.price || 0,
            specs: {
              'Danh mục': product.categories?.name || category,
              'Thương hiệu': product.brands?.name || product.brand || '',
              ...(product.specifications || {}),
            },
            features: product.features || [],
            warranty: product.warranty_years || product.warranty || 0,
            images: product.main_image || product.image_url ? [product.main_image || product.image_url] : [],
            image_url: product.image_url || product.main_image,
          };
          
          allDevices.push(device);
        });
      }
    }
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
  }
  
  return allDevices;
}

// ── Swipeable Image Gallery (square aspect ratio) ──────────────
function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && activeIdx < images.length - 1) setActiveIdx(i => i + 1);
      if (diff < 0 && activeIdx > 0) setActiveIdx(i => i - 1);
    }
    startX.current = null;
  };

  return (
    <div className="relative w-full aspect-square overflow-hidden bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${activeIdx * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative flex-shrink-0" style={{ width: `${100 / images.length}%` }}>
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIdx ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter badge */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
          {activeIdx + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
interface OnGridPageProps {
  comboSlug?: string;
}

export default function OnGridPage({ comboSlug }: OnGridPageProps) {
  const [selectedComboId, setSelectedComboId] = useState<string>(comboSlug || '');
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState<EquipmentCategory | null>(null);
  const [modifiedEquipment, setModifiedEquipment] = useState<Device[]>([]); // Track device changes
  const [calculatedPower, setCalculatedPower] = useState<number>(0); // Calculated kWp
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]); // Devices for selector
  const [loadingDevices, setLoadingDevices] = useState(false); // Loading state for devices
  const { isHeaderVisible } = useScrollContext();
  const [isFirstCardVisible, setIsFirstCardVisible] = useState(true);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Template mode states
  const [mode, setMode] = useState<'combos' | 'template'>('combos');
  const [templates, setTemplates] = useState<ComboTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ComboTemplate | null>(null);
  const [showTemplateConfig, setShowTemplateConfig] = useState(false);
  // itemOverrides: keyed by item.id, stores user changes (swapped products and/or changed quantities)
  const [itemOverrides, setItemOverrides] = useState<Record<string, { productId?: string; product?: any; quantity?: number }>>({});
  const [itemProducts, setItemProducts] = useState<Record<string, any[]>>({});
  const [loadingItemProducts, setLoadingItemProducts] = useState<string | null>(null); // item id being loaded
  const [showTemplateItemSelector, setShowTemplateItemSelector] = useState(false);
  const [selectedItemForPicker, setSelectedItemForPicker] = useState<TemplateItem | null>(null);

  // Additional devices state
  const [additionalDevices, setAdditionalDevices] = useState<Array<{
    id: string;
    product: any;
    productType: EquipmentCategory;
    quantity: number;
    unitPrice: number;
  }>>([]);
  const [showAddDeviceCategory, setShowAddDeviceCategory] = useState(false);
  const [showAddDevicePicker, setShowAddDevicePicker] = useState(false);
  const [addDeviceCategory, setAddDeviceCategory] = useState<EquipmentCategory | null>(null);
  const [addDeviceProducts, setAddDeviceProducts] = useState<Device[]>([]);
  const [loadingAddDeviceProducts, setLoadingAddDeviceProducts] = useState(false);
  
  // Dynamic sticky top based on header visibility
  const stickyTop = isHeaderVisible 
    ? 'top-[56px] lg:top-16'  // Below visible header
    : 'top-0';                 // At top when header hidden

  // Check login state on mount
  useEffect(() => {
    const session = localStorage.getItem('user_session') || sessionStorage.getItem('user_session');
    setIsLoggedIn(!!session);
  }, []);

  // Fetch on-grid combos from API
  const { data: rawCombos, loading } = useFetch<any[]>('/api/combos?systemType=on-grid');
  
  // Normalize and filter on-grid combos
  const onGridCombos = useMemo(() => {
    const allCombos = normalizeCombos(rawCombos);
    return allCombos.filter(combo => combo.systemType === 'on-grid');
  }, [rawCombos]);

  // Unique phases in display order
  const phases = useMemo(() => {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];
    for (const c of onGridCombos) {
      if (!seen.has(c.phase)) {
        seen.add(c.phase);
        result.push({ value: c.phase, label: c.phase === '1-phase' ? '1 pha' : '3 pha' });
      }
    }
    return result;
  }, [onGridCombos]);

  // Init selectedPhase to first available
  useMemo(() => {
    if (phases.length > 0 && !selectedPhase) {
      setSelectedPhase(phases[0].value);
    }
  }, [phases, selectedPhase]);

  // Group ALL combos by phase (no filtering)
  const combosByPhase = useMemo(() => {
    let filtered = onGridCombos;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(combo => 
        combo.name.toLowerCase().includes(query) ||
        combo.inverterBrand.toLowerCase().includes(query) ||
        combo.panelBrand.toLowerCase().includes(query)
      );
    }
    
    const grouped: Record<string, any[]> = {};
    filtered.forEach(combo => {
      if (!grouped[combo.phase]) {
        grouped[combo.phase] = [];
      }
      grouped[combo.phase].push(combo);
    });
    return grouped;
  }, [onGridCombos, searchQuery]);

  // Fetch templates when mode switches to 'template'
  useEffect(() => {
    if (mode !== 'template' || templates.length > 0) return;
    
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const response = await fetch('/api/templates?systemType=on-grid');
        const data = await response.json();
        if (data.success && data.data) {
          const normalized = data.data.map(normalizeTemplate);
          setTemplates(normalized);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    
    fetchTemplates();
  }, [mode, templates.length]);

  // Group templates by phase
  const templatesByPhase = useMemo(() => {
    let filtered = templates;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }
    
    const grouped: Record<string, ComboTemplate[]> = {};
    filtered.forEach(template => {
      if (!grouped[template.phase]) {
        grouped[template.phase] = [];
      }
      grouped[template.phase].push(template);
    });
    return grouped;
  }, [templates, searchQuery]);

  // Initialize item overrides when a template is selected
  useEffect(() => {
    if (!selectedTemplate) return;
    
    // Reset overrides when template changes
    setItemOverrides({});
    setItemProducts({});
  }, [selectedTemplate]);

  // Fetch products for a specific item (when user wants to swap)
  const fetchItemProducts = useCallback(async (item: TemplateItem) => {
    if (!selectedTemplate) return;
    
    setLoadingItemProducts(item.id);
    try {
      const response = await fetch(`/api/templates/${selectedTemplate.slug}/products?slot=${item.productType}`);
      const data = await response.json();
      if (data.success && data.data) {
        setItemProducts(prev => ({
          ...prev,
          [item.id]: data.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching item products:', error);
    } finally {
      setLoadingItemProducts(null);
    }
  }, [selectedTemplate]);

  // Calculate context from template items and overrides
  const calculationContext = useMemo(() => {
    if (!selectedTemplate) return { panelCount: 0, inverterCount: 1, capacityKw: 0 };
    
    // Get panel items
    const panelItems = selectedTemplate.items.filter(i => i.productType === 'panel');
    let panelCount = 0;
    let capacityKw = 0;
    
    panelItems.forEach(item => {
      const override = itemOverrides[item.id];
      const quantity = override?.quantity ?? item.baseQuantity;
      panelCount += quantity;
      
      // Calculate capacity from panel wattage
      const product = override?.product ?? item.product;
      if (product) {
        const wattage = product.specifications?.['Công suất'] || 
                        product.specifications?.['Wattage'] ||
                        product.specifications?.['Power'] || 0;
        const wattageNum = parseFloat(String(wattage).replace(/[^\d.]/g, '')) || 0;
        if (wattageNum > 0) {
          capacityKw += (quantity * wattageNum) / 1000;
        }
      }
    });
    
    // Get inverter items
    const inverterItems = selectedTemplate.items.filter(i => i.productType === 'inverter');
    let inverterCount = 0;
    inverterItems.forEach(item => {
      const override = itemOverrides[item.id];
      inverterCount += override?.quantity ?? item.baseQuantity;
    });
    if (inverterCount === 0) inverterCount = 1;
    
    return { panelCount, inverterCount, capacityKw };
  }, [selectedTemplate, itemOverrides]);

  // Calculate all item quantities using calculateItemQuantities
  const calculatedItems = useMemo(() => {
    if (!selectedTemplate) return [];
    
    // Use calculateItemQuantities for items with scaleSource
    const scaledItems = calculateItemQuantities(selectedTemplate.items, calculationContext);
    
    // Apply overrides
    return scaledItems.map(({ item, calculatedQuantity, lineTotal }) => {
      const override = itemOverrides[item.id];
      const effectiveQuantity = override?.quantity ?? calculatedQuantity;
      const effectiveProduct = override?.product ?? item.product;
      const effectiveUnitPrice = effectiveProduct?.unit_price ?? effectiveProduct?.price ?? item.unitPrice;
      const effectiveLineTotal = effectiveQuantity * effectiveUnitPrice;
      
      return {
        item,
        effectiveQuantity,
        effectiveUnitPrice,
        effectiveLineTotal,
        effectiveProduct,
        calculatedQuantity, // original calculated quantity before override
      };
    });
  }, [selectedTemplate, calculationContext, itemOverrides]);

  // Calculate total price
  const templateTotalPrice = useMemo(() => {
    // Sum all calculated items with overrides
    const itemsTotal = calculatedItems.reduce((sum, { effectiveLineTotal }) => sum + effectiveLineTotal, 0);
    
    // Add additional device prices
    const additionalTotal = additionalDevices.reduce((sum, d) => sum + d.unitPrice * d.quantity, 0);
    
    return itemsTotal + additionalTotal;
  }, [calculatedItems, additionalDevices]);

  // Scroll to phase section
  const scrollToPhase = (phase: string) => {
    setSelectedPhase(phase);
    const element = phaseRefs.current[phase];
    if (element) {
      const yOffset = -60; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Init / reset selectedComboId when all combos change
  useMemo(() => {
    if (onGridCombos.length > 0) {
      const stillValid = onGridCombos.some(c => c.id === selectedComboId);
      if (!stillValid) setSelectedComboId('');
    }
  }, [onGridCombos, selectedComboId]);

  const selectedCombo = useMemo(
    () => onGridCombos.find(c => c.id === selectedComboId) || onGridCombos[0],
    [onGridCombos, selectedComboId]
  );

  const equipmentGroups = useMemo(() => {
    if (!selectedCombo?.equipment) return [];
    return CATEGORY_ORDER
      .map(cat => ({
        category: cat,
        devices: selectedCombo.equipment.filter((d: Device) => d.category === cat),
      }))
      .filter(g => g.devices.length > 0);
  }, [selectedCombo]);

  // Track first card visibility with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFirstCardVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
    );
    
    if (firstCardRef.current) {
      observer.observe(firstCardRef.current);
    }
    
    return () => observer.disconnect();
  }, [selectedCombo?.id]);

  // Recalculate power when equipment changes
  useEffect(() => {
    if (modifiedEquipment.length === 0) return;
    
    // Find panel device
    const panelDevice = modifiedEquipment.find((d: Device) => d.category === 'panel');
    if (!panelDevice) return;
    
    // Get panel wattage from multiple sources:
    // 1. Specs: 'Công suất', 'Power', 'Wattage', 'Công suất tấm pin'
    // 2. Model name: Extract from "Tấm quang năng JA Solar 640Wp" or "550W"
    let panelWattage = 0;
    
    // Try specs first
    const wattageSpecs = [
      panelDevice.specs['Công suất'],
      panelDevice.specs['Power'],
      panelDevice.specs['Wattage'],
      panelDevice.specs['Công suất tấm pin'],
      panelDevice.specs['Panel Power'],
    ].filter(Boolean);
    
    for (const spec of wattageSpecs) {
      const extracted = parseFloat(spec.replace(/[^\d.]/g, ''));
      if (!isNaN(extracted) && extracted > 0) {
        panelWattage = extracted;
        break;
      }
    }
    
    // If not found in specs, try to extract from model name
    if (panelWattage === 0) {
      const modelMatch = panelDevice.model.match(/(\d+)\s*W/i);
      if (modelMatch) {
        panelWattage = parseFloat(modelMatch[1]);
      }
    }
    
    // Calculate power if we found wattage
    if (panelWattage > 0) {
      // Calculate: totalPower = (panelQuantity × panelWattage) / 1000 (convert to kWp)
      const totalPower = (panelDevice.quantity * panelWattage) / 1000;
      setCalculatedPower(totalPower);
    } else {
      // Fallback: If we can't determine wattage, don't reset to 0
      // Keep the previous calculatedPower or use combo's default
      console.warn('Could not determine panel wattage, keeping current value:', panelDevice);
    }
  }, [modifiedEquipment]);

  // Fetch available devices when selector opens
  useEffect(() => {
    if (!showDeviceSelector || !selectedDeviceCategory) return;
    
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const devices = await getAvailableDevicesByCategory(
          selectedDeviceCategory,
          onGridCombos,
          selectedCombo?.phase,
          selectedCombo?.systemType
        );
        setAvailableDevices(devices);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setAvailableDevices([]);
      } finally {
        setLoadingDevices(false);
      }
    };
    
    fetchDevices();
  }, [showDeviceSelector, selectedDeviceCategory, selectedCombo?.phase, selectedCombo?.systemType, onGridCombos]);

  return (
    <div className="flex-1 flex flex-col min-h-screen lg:ml-[64px] lg:pl-0">
      {/* Sticky Header */}
      <header className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-all duration-200 ${
        isFirstCardVisible ? 'shadow-sm' : ''
      }`}>
        {/* Title Row */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Combo On-Grid</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Hệ thống điện mặt trời hòa lưới không dùng pin lưu trữ
          </p>
        </div>

        {/* Phase Tabs - Pill style */}
        <div className={`px-4 py-2 overflow-x-auto scrollbar-hide ${stickyTop} z-20 bg-white border-b border-gray-200`}>
          <div className="flex gap-2 min-w-max">
            {phases.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => scrollToPhase(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedPhase === value
                    ? 'bg-[#F97316] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm combo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="px-4 py-2 bg-[#F97316] text-white rounded-lg flex items-center gap-2 hover:bg-[#C2410C] transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mode Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode('combos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'combos'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sun className="h-4 w-4" />
            Combo có sẵn
          </button>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                setShowLoginPrompt(true);
                return;
              }
              setMode('template');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'template'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutTemplate className="h-4 w-4" />
            Tự thiết kế
          </button>
        </div>
      </div>

      {/* All Combo Sections - Grouped by Phase */}
      {mode === 'combos' && (
        <div className="space-y-6 pb-4">
          {Object.entries(combosByPhase).map(([phase, combos], phaseIndex) => (
            <div key={phase} ref={(el) => { 
              phaseRefs.current[phase] = el;
              // Track first phase for scroll observer
              if (phaseIndex === 0 && combos[0]) {
                firstCardRef.current = el;
              }
            }}>
              {/* Phase Header */}
              <div className="sticky top-14 lg:top-16 z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">{phases.find(p => p.value === phase)?.label}</h2>
                <p className="text-xs text-gray-500">{combos.length} combo</p>
              </div>
              
              {/* Combo List */}
              <div className="divide-y divide-gray-100 bg-white">
                {combos.map((combo) => {
                  const isSelected = selectedComboId === combo.id;
                  return (
                    <button
                      key={combo.id}
                      onClick={() => {
                        setSelectedComboId(combo.id);
                        setModifiedEquipment([...combo.equipment]); // Initialize with current equipment
                        setCalculatedPower(combo.capacity); // Initialize with combo's capacity
                        setShowModal(true);
                      }}
                      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                        isSelected ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-orange-50 relative">
                        {combo.images[0] ? (
                          <Image
                            src={combo.images[0]}
                            alt={combo.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-orange-600">
                            <Zap className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-gray-900 truncate">{combo.name}</h3>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{combo.capacity} kWp - {combo.phase === '1-phase' ? '1 pha' : '3 pha'}</p>
                      </div>

                      {/* Right: Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-0.5">Tổng chi phí</p>
                        <p className="text-base font-semibold text-[#F97316]">{formatCurrency(combo.price)}</p>
                      </div>

                      {/* Chevron */}
                      <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}  
        </div>
      )}

      {/* Template Sections - Grouped by Phase */}
      {mode === 'template' && (
        <div className="space-y-6 pb-4">
          {loadingTemplates ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Đang tải mẫu thiết kế...</p>
              </div>
            </div>
          ) : Object.entries(templatesByPhase).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mx-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-purple-50 flex items-center justify-center">
                <LayoutTemplate className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-gray-500">Chưa có mẫu thiết kế nào</p>
            </div>
          ) : (
            Object.entries(templatesByPhase).map(([phase, phaseTemplates], phaseIndex) => (
              <div key={phase} ref={(el) => { 
                phaseRefs.current[phase] = el;
                if (phaseIndex === 0 && phaseTemplates[0]) {
                  firstCardRef.current = el;
                }
              }}>
                {/* Phase Header */}
                <div className="sticky top-14 lg:top-16 z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">{phase === '1-phase' ? '1 pha' : '3 pha'}</h2>
                  <p className="text-xs text-gray-500">{phaseTemplates.length} mẫu</p>
                </div>
                
                {/* Template List */}
                <div className="divide-y divide-gray-100 bg-white">
                  {phaseTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplateConfig(true);
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                        <LayoutTemplate className="h-6 w-6 text-purple-600" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                            <Sparkles className="h-3 w-3" />
                            Tự thiết kế
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {template.capacityKwMin}–{template.capacityKwMax} kWp • {template.phase === '1-phase' ? '1 pha' : '3 pha'}
                        </p>
                        {template.description && (
                          <p className="text-xs text-gray-400 mt-1 truncate">{template.description}</p>
                        )}
                      </div>

                      {/* Right: Config count */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-0.5">Thiết bị chính</p>
                        <p className="text-base font-semibold text-purple-600">{template.items?.length ?? 0} loại</p>
                      </div>

                      {/* Chevron */}
                      <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Combo Detail Modal */}
      {showModal && selectedCombo && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-x-4 top-12 bottom-8 z-50 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px]">
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selectedCombo.systemType === 'hybrid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'} flex items-center justify-center`}>
                  {selectedCombo.systemType === 'hybrid' ? <Battery className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedCombo.name}</p>
                  <p className="text-xs text-gray-500">{selectedCombo.capacity} kWp • {selectedCombo.category === 'residential' ? 'Gia đình' : 'Công nghiệp'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Hero Card */}
              <div className="bg-white rounded-2xl border-b border-gray-100">
                {/* Combo Placeholder Image */}
                <div className="w-full aspect-square max-h-[300px] p-4">
                  <ComboPlaceholder
                    systemName={selectedCombo.name}
                    phase={selectedCombo.phase}
                    panelCount={selectedCombo.panelCount}
                    panelBrand={modifiedEquipment.find((d: Device) => d.category === 'panel')?.brand}
                    inverterCount={modifiedEquipment.filter((d: Device) => d.category === 'inverter').length}
                    inverterBrand={modifiedEquipment.find((d: Device) => d.category === 'inverter')?.brand}
                    hasBattery={modifiedEquipment.some((d: Device) => d.category === 'battery')}
                  />
                </div>
                {/* Overlay info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          selectedCombo.systemType === 'hybrid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          Combo {selectedCombo.systemType === 'hybrid' ? 'Hy-Brid' : 'On-Grid'}
                        </span>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {selectedCombo.phase === '1-phase' ? '1 pha' : '3 pha'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{selectedCombo.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">Tổng chi phí</p>
                      <p className="text-lg font-bold text-[#F97316]">{(selectedCombo.price / 1000000).toLocaleString('vi-VN')} triệu</p>
                    </div>
                  </div>
                  {/* Quick stats */}
                  <div className="flex gap-3 pt-3 border-t border-gray-50 overflow-x-auto scrollbar-hide">
                    <div className="text-center flex-shrink-0">
                      <p className="text-base font-bold text-gray-900">
                        {calculatedPower > 0 ? calculatedPower.toFixed(2) : selectedCombo.capacity} 
                        <span className="text-xs font-normal text-gray-500">kWp</span>
                      </p>
                      <p className="text-xs text-gray-400">Công suất</p>
                    </div>
                    <div className="w-px bg-gray-100 flex-shrink-0" />
                    <div className="text-center flex-shrink-0">
                      <p className="text-base font-bold text-gray-700">{selectedCombo.estimatedOutput.monthly.min}–{selectedCombo.estimatedOutput.monthly.max} <span className="text-xs font-normal text-gray-500">kWh</span></p>
                      <p className="text-xs text-gray-400">Sản lượng/tháng</p>
                    </div>
                    <div className="w-px bg-gray-100 flex-shrink-0" />
                    <div className="text-center flex-shrink-0">
                      <p className="text-base font-bold text-[#F97316]">{selectedCombo.paybackPeriod} <span className="text-xs font-normal text-gray-500">năm</span></p>
                      <p className="text-xs text-gray-400">Hoàn vốn</p>
                    </div>
                    <div className="w-px bg-gray-100 flex-shrink-0" />
                    <div className="text-center flex-shrink-0">
                      <p className="text-base font-bold text-green-600">{selectedCombo.roi}%</p>
                      <p className="text-xs text-gray-400">ROI</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Specifications */}
              <div className="bg-white rounded-2xl border-b border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Thông số hệ thống</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(() => {
                    // Get actual panel device from modified equipment
                    const panelDevice = modifiedEquipment.find((d: Device) => d.category === 'panel');
                    const actualPanelCount = panelDevice?.quantity || selectedCombo.panelCount;
                    
                    // Use calculated power if available, otherwise use combo's default capacity
                    const displayPower = calculatedPower > 0 
                      ? calculatedPower.toFixed(2) 
                      : String(selectedCombo.capacity || '0.00');
                    
                    return [
                      { label: 'Công suất', value: displayPower, unit: 'kWp' },
                      { label: 'Số tấm pin', value: `${actualPanelCount}`, unit: 'tấm' },
                      { label: 'Sản lượng/tháng', value: `${selectedCombo.estimatedOutput.monthly.min}–${selectedCombo.estimatedOutput.monthly.max}`, unit: 'kWh' },
                      { label: 'Hoàn vốn', value: `${selectedCombo.paybackPeriod}`, unit: 'năm', blue: true },
                      { label: 'ROI', value: `${selectedCombo.roi}%`, unit: '', green: true },
                      { label: 'Tiết kiệm/năm', value: formatCurrency(selectedCombo.estimatedSavings.yearly), unit: '', green: true },
                    ];
                  })().map(({ label, value, unit, green, blue }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className={`text-lg font-bold ${green ? 'text-green-600' : blue ? 'text-[#F97316]' : 'text-gray-900'}`}>
                        {value} {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment List */}
              <div className="bg-white rounded-2xl border-b border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Thiết bị chính</h3>
                <div className="space-y-5">
                  {CATEGORY_ORDER.map(cat => {
                    const devices = modifiedEquipment.filter((d: Device) => d.category === cat);
                    if (devices.length === 0) return null;
                    const meta = CATEGORY_META[cat];
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={meta.color}>{meta.icon}</span>
                          <p className="text-sm font-semibold text-gray-700">{meta.label}</p>
                          <span className="ml-auto text-xs text-gray-400">{devices.length} thiết bị</span>
                        </div>
                        <div className="space-y-2 pl-1">
                          {devices.map((device: Device) => (
                            <div
                              key={device.id}
                              className="w-full flex items-center gap-3 p-3 border border-gray-100 rounded-xl transition-colors"
                            >
                              {/* Left: Product info - Click to open device selector */}
                              <button
                                onClick={() => {
                                  setSelectedDeviceCategory(cat);
                                  setShowDeviceSelector(true);
                                }}
                                className="flex-1 flex items-center gap-3 text-left hover:bg-gray-50 active:bg-gray-100 rounded-lg -m-1 p-1 transition-colors"
                              >
                                {/* Thumbnail */}
                                <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ${meta.bg}`}>
                                  {device.images?.[0] ? (
                                    <Image
                                      src={device.images[0]}
                                      alt={device.model}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                                      {meta.icon}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900">{device.brand}</p>
                                  <p className="text-xs text-gray-500 truncate">{device.model}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              </button>

                              {/* Right: Quantity display (fixed) */}
                              <div className="flex-shrink-0 text-right">
                                <div className="px-2 py-1">
                                  <p className="text-sm font-bold text-gray-900">×{device.quantity} <span className="text-xs font-normal text-gray-500">{device.unit}</span></p>
                                  {device.price ? (
                                    <p className="text-xs text-green-600 font-medium">{formatCurrency(device.price * device.quantity)}</p>
                                  ) : (
                                    <p className="text-xs text-[#F97316]">Chi tiết</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Accessories */}
                {ACCESSORY_ORDER.some(cat => modifiedEquipment.some((d: Device) => d.category === cat)) && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Phụ kiện</h4>
                    <div className="space-y-3">
                      {ACCESSORY_ORDER.map(cat => {
                        const devices = modifiedEquipment.filter((d: Device) => d.category === cat);
                        if (devices.length === 0) return null;
                        const meta = CATEGORY_META[cat];
                        return (
                          <div key={cat}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={meta.color}>{meta.icon}</span>
                              <p className="text-sm font-semibold text-gray-700">{meta.label}</p>
                              <span className="ml-auto text-xs text-gray-400">{devices.length} thiết bị</span>
                            </div>
                            <div className="space-y-2 pl-1">
                              {devices.map((device: Device) => (
                                <button
                                  key={device.id}
                                  onClick={() => {
                                    setSelectedDeviceCategory(cat);
                                    setShowDeviceSelector(true);
                                  }}
                                  className="w-full flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                                >
                                  {/* Thumbnail */}
                                  <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ${meta.bg}`}>
                                    {device.images?.[0] ? (
                                      <Image
                                        src={device.images[0]}
                                        alt={device.model}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                                        {meta.icon}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{device.brand}</p>
                                    <p className="text-xs text-gray-500 truncate">{device.model}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-gray-900">×{device.quantity} <span className="text-xs font-normal text-gray-500">{device.unit}</span></p>
                                      {device.price ? (
                                        <p className="text-xs text-green-600 font-medium">{formatCurrency(device.price * device.quantity)}</p>
                                      ) : (
                                        <p className="text-xs text-[#F97316]">Chi tiết</p>
                                      )}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Warranty */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bảo hành</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Pin</p>
                      <p className="text-sm font-bold text-gray-900">{selectedCombo.warranty.panel} năm</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Inverter</p>
                      <p className="text-sm font-bold text-gray-900">{selectedCombo.warranty.inverter} năm</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Lắp đặt</p>
                      <p className="text-sm font-bold text-gray-900">{selectedCombo.warranty.installation} năm</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tính năng nổi bật</h4>
                  <ul className="space-y-2">
                    {selectedCombo.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Template Configuration Modal */}
      {showTemplateConfig && selectedTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowTemplateConfig(false)}
          />
          <div className="fixed inset-x-0 top-0 bottom-0 z-50 bg-white shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[560px] lg:rounded-2xl lg:top-8 lg:bottom-8 lg:max-h-[calc(100vh-64px)]">
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center text-purple-600">
                  <LayoutTemplate className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedTemplate.name}</p>
                  <p className="text-xs text-gray-500">{selectedTemplate.capacityKwMin}–{selectedTemplate.capacityKwMax} kWp • {selectedTemplate.phase === '1-phase' ? '1 pha' : '3 pha'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateConfig(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Unified Equipment List by Category */}
              <div className="bg-white rounded-2xl border-b border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-400" />
                  Thiết bị theo danh mục
                </h3>
                
                {/* Group items by category */}
                {(() => {
                  const groupedItems = CATEGORY_DISPLAY_ORDER.map(cat => ({
                    category: cat,
                    items: calculatedItems.filter(({ item }) => item.productType === cat),
                  })).filter(g => g.items.length > 0);
                  
                  if (groupedItems.length === 0) {
                    return (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Không có thiết bị nào trong mẫu này</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-5">
                      {groupedItems.map(({ category, items }) => {
                        const meta = CATEGORY_META[category];
                        return (
                          <div key={category}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={meta.color}>{meta.icon}</span>
                              <p className="text-sm font-semibold text-gray-700">{meta.label}</p>
                              <span className="ml-auto text-xs text-gray-400">{items.length} thiết bị</span>
                            </div>
                            <div className="space-y-2">
                              {items.map(({ item, effectiveQuantity, effectiveUnitPrice, effectiveLineTotal, effectiveProduct, calculatedQuantity }) => (
                                <div
                                  key={item.id}
                                  className="border border-gray-100 rounded-xl p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Product info - click to swap if selectable */}
                                    <button
                                      onClick={async () => {
                                        if (!item.isUserSelectable) return;
                                        setSelectedItemForPicker(item);
                                        if (!itemProducts[item.id]) {
                                          await fetchItemProducts(item);
                                        }
                                        setShowTemplateItemSelector(true);
                                      }}
                                      className={`flex-1 flex items-center gap-3 text-left ${
                                        item.isUserSelectable ? 'hover:bg-gray-50 active:bg-gray-100 rounded-lg -m-1 p-1 transition-colors' : 'cursor-default'
                                      }`}
                                    >
                                      {/* Thumbnail */}
                                      <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${meta.bg}`}>
                                        {effectiveProduct?.main_image || effectiveProduct?.image_url ? (
                                          <Image
                                            src={effectiveProduct.main_image || effectiveProduct.image_url}
                                            alt={effectiveProduct.name || 'Product'}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                                            {meta.icon}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">
                                          {effectiveProduct?.brands?.name || effectiveProduct?.brand_name || effectiveProduct?.brand || 'Thiết bị'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                          {effectiveProduct?.name || item.slotName || meta.label}
                                        </p>
                                      </div>
                                      {item.isUserSelectable && (
                                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                                          Đổi
                                        </span>
                                      )}
                                    </button>
                                    
                                    {/* Quantity stepper */}
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        onClick={() => {
                                          const newQty = Math.max(1, effectiveQuantity - 1);
                                          setItemOverrides(prev => ({
                                            ...prev,
                                            [item.id]: { ...prev[item.id], quantity: newQty },
                                          }));
                                        }}
                                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                      >
                                        <Minus className="h-3 w-3 text-gray-600" />
                                      </button>
                                      <span className="w-8 text-center text-sm font-semibold text-gray-900">{effectiveQuantity}</span>
                                      <button
                                        onClick={() => {
                                          const newQty = effectiveQuantity + 1;
                                          setItemOverrides(prev => ({
                                            ...prev,
                                            [item.id]: { ...prev[item.id], quantity: newQty },
                                          }));
                                        }}
                                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                      >
                                        <Plus className="h-3 w-3 text-gray-600" />
                                      </button>
                                    </div>
                                    
                                    {/* Line total */}
                                    <div className="text-right flex-shrink-0 w-24">
                                      <p className="text-xs text-gray-500">
                                        {effectiveQuantity} × {formatCurrency(effectiveUnitPrice)}
                                      </p>
                                      <p className="text-sm font-semibold text-green-600">
                                        {formatCurrency(effectiveLineTotal)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Show scaling info if applicable */}
                                  {item.scaleSource && (
                                    <div className="mt-2 pt-2 border-t border-gray-50">
                                      <p className="text-xs text-gray-400">
                                        {item.scaleSource === 'panel_count' && `Tính theo số tấm pin (${calculationContext.panelCount} × ${item.scaleFactor})`}
                                        {item.scaleSource === 'inverter_count' && `Tính theo số inverter (${calculationContext.inverterCount} × ${item.scaleFactor})`}
                                        {item.scaleSource === 'capacity_kw' && `Tính theo công suất (${calculationContext.capacityKw.toFixed(2)} kW × ${item.scaleFactor})`}
                                        {' '}(cơ sở: {item.baseQuantity})
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Additional Devices Section */}
              <div className="bg-white rounded-2xl border-b border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Plus className="h-4 w-4 text-gray-400" />
                    Thiết bị bổ sung
                  </h3>
                  <button
                    onClick={() => setShowAddDeviceCategory(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors border border-purple-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm thiết bị
                  </button>
                </div>

                {additionalDevices.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-400">Chưa có thiết bị bổ sung</p>
                    <p className="text-xs text-gray-400 mt-1">Nhấn "+ Thêm thiết bị" để thêm</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {additionalDevices.map((item, idx) => {
                      const meta = CATEGORY_META[item.productType];
                      return (
                        <div key={`${item.id}-${idx}`} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                            {meta.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {item.product.brand || item.product.brand_name || 'Thiết bị'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{item.product.model || item.product.name}</p>
                            {item.unitPrice > 0 && (
                              <p className="text-xs text-green-600 font-medium">
                                {formatCurrency(item.unitPrice)} × {item.quantity} = {formatCurrency(item.unitPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                          {/* Quantity stepper */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => setAdditionalDevices(prev =>
                                prev.map((d, i) => i === idx ? { ...d, quantity: Math.max(1, d.quantity - 1) } : d)
                              )}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="h-3 w-3 text-gray-600" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => setAdditionalDevices(prev =>
                                prev.map((d, i) => i === idx ? { ...d, quantity: d.quantity + 1 } : d)
                              )}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="h-3 w-3 text-gray-600" />
                            </button>
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={() => setAdditionalDevices(prev => prev.filter((_, i) => i !== idx))}
                            className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                          >
                            <X className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  Tổng kết
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Công suất</p>
                      <p className="text-lg font-bold text-blue-600">
                        {calculationContext.capacityKw > 0 ? calculationContext.capacityKw.toFixed(2) : '—'} <span className="text-xs font-normal text-gray-500">kWp</span>
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Tổng chi phí</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(templateTotalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
              <button
                onClick={async () => {
                  // Generate combo via API
                  try {
                    const response = await fetch(`/api/templates/${selectedTemplate.slug}/generate`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        itemSelections: calculatedItems.map(({ item, effectiveQuantity, effectiveProduct }) => ({
                          itemId: item.id,
                          productId: effectiveProduct?.id || item.productId,
                          quantity: effectiveQuantity,
                        })),
                        additionalItems: additionalDevices.map(d => ({
                          productId: d.id,
                          quantity: d.quantity,
                          unitPrice: d.unitPrice,
                        })),
                      }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      // Close modal and show success
                      setShowTemplateConfig(false);
                      // Optionally navigate to the generated combo
                      // router.push(`/combos/${data.data.id}`);
                    }
                  } catch (error) {
                    console.error('Error generating combo:', error);
                  }
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Xác nhận thiết kế
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Combo sẽ được tạo với các thiết bị đã chọn
              </p>
            </div>
          </div>
        </>
      )}

      {/* Template Item Product Selector Drawer */}
      {showTemplateItemSelector && selectedItemForPicker && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={() => setShowTemplateItemSelector(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Chọn {CATEGORY_META[selectedItemForPicker.productType].label}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Chọn sản phẩm cho {selectedItemForPicker.slotName || CATEGORY_META[selectedItemForPicker.productType].label}</p>
                </div>
                <button
                  onClick={() => setShowTemplateItemSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingItemProducts === selectedItemForPicker.id ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Đang tải sản phẩm...</p>
                  </div>
                </div>
              ) : (itemProducts[selectedItemForPicker.id]?.length || 0) === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Không có sản phẩm nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(itemProducts[selectedItemForPicker.id] || []).map((product: any) => {
                    const meta = CATEGORY_META[selectedItemForPicker.productType];
                    const currentOverride = itemOverrides[selectedItemForPicker.id];
                    const isSelected = currentOverride?.productId === product.id;
                    const currentItem = calculatedItems.find(({ item }) => item.id === selectedItemForPicker.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => {
                          setItemOverrides(prev => ({
                            ...prev,
                            [selectedItemForPicker.id]: {
                              productId: product.id,
                              product,
                              quantity: currentOverride?.quantity ?? currentItem?.effectiveQuantity ?? 1,
                            },
                          }));
                          setShowTemplateItemSelector(false);
                        }}
                        className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-colors text-left ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${meta.bg}`}>
                          {product.main_image || product.image_url ? (
                            <Image
                              src={product.main_image || product.image_url}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                              {meta.icon}
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">{product.brand_name || product.brand || 'Thương hiệu'}</p>
                          <p className="text-sm text-gray-500 truncate">{product.name}</p>
                          {(product.unit_price || product.price) && (
                            <span className="text-xs font-medium text-green-600 mt-1 block">
                              {formatCurrency(product.unit_price || product.price)}
                            </span>
                          )}
                        </div>
                        
                        {/* Check icon or select indicator */}
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 text-center">
                Chọn sản phẩm cho {(selectedItemForPicker.slotName ?? selectedItemForPicker.productType).toLowerCase()}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Device Selector Drawer - Bottom Sheet */}
      {showDeviceSelector && selectedDeviceCategory && selectedCombo?.equipment && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowDeviceSelector(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Chọn {CATEGORY_META[selectedDeviceCategory].label}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Thay đổi thương hiệu, giữ nguyên số lượng</p>
                </div>
                <button
                  onClick={() => setShowDeviceSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingDevices ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Đang tải thiết bị...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableDevices.map((device: Device) => {
                    const meta = CATEGORY_META[device.category];
                    // Get quantity from current combo device for this category
                    const currentComboDevice = modifiedEquipment.find(
                      (d: Device) => d.category === selectedDeviceCategory
                    );
                    const fixedQuantity = currentComboDevice?.quantity || 1;
                    const isCurrentDevice = modifiedEquipment.some(
                      (d: Device) => d.id === device.id && d.category === selectedDeviceCategory
                    );
                  return (
                    <button
                      key={device.id}
                      onClick={() => {
                        // Replace device in modified equipment
                        const updatedEquipment = modifiedEquipment.map((d: Device) => {
                          if (d.category === selectedDeviceCategory) {
                            // Replace with new device, keep quantity from current device
                            return { ...device, quantity: fixedQuantity };
                          }
                          return d;
                        });
                        
                        setModifiedEquipment(updatedEquipment);
                        setShowDeviceSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-colors text-left ${
                        isCurrentDevice
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${meta.bg}`}>
                        {device.images?.[0] ? (
                          <Image
                            src={device.images[0]}
                            alt={device.model}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                            {meta.icon}
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900">{device.brand}</p>
                        <p className="text-sm text-gray-500 truncate">{device.model}</p>
                        {device.price && (
                          <span className="text-xs font-medium text-green-600 mt-1 block">{formatCurrency(device.price)}</span>
                        )}
                      </div>
                      
                      {/* Check icon or select indicator */}
                      {isCurrentDevice ? (
                        <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 text-center">
                Chọn thiết bị để thay thế cho {CATEGORY_META[selectedDeviceCategory].label.toLowerCase()} hiện tại
              </p>
            </div>
          </div>
        </>
      )}

      {/* Login Prompt Overlay */}
      {showLoginPrompt && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-50 flex items-center justify-center">
                <LayoutTemplate className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Yêu cầu đăng nhập</h3>
              <p className="text-sm text-gray-500 mb-6">
                Vui lòng đăng nhập để sử dụng tính năng này
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <a
                  href="/login"
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Đăng nhập
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Device – Category Picker */}
      {showAddDeviceCategory && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
            onClick={() => setShowAddDeviceCategory(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chọn danh mục thiết bị</h2>
              <button onClick={() => setShowAddDeviceCategory(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(CATEGORY_META) as EquipmentCategory[]).map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={async () => {
                        setAddDeviceCategory(cat);
                        setShowAddDeviceCategory(false);
                        setLoadingAddDeviceProducts(true);
                        setShowAddDevicePicker(true);
                        try {
                          const devices = await getAvailableDevicesByCategory(cat, []);
                          setAddDeviceProducts(devices);
                        } catch {
                          setAddDeviceProducts([]);
                        } finally {
                          setLoadingAddDeviceProducts(false);
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:${meta.bg} transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Device – Product Picker */}
      {showAddDevicePicker && addDeviceCategory && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
            onClick={() => setShowAddDevicePicker(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Thêm {CATEGORY_META[addDeviceCategory].label}</h2>
                <p className="text-xs text-gray-500 mt-1">Chọn sản phẩm để thêm vào thiết kế</p>
              </div>
              <button onClick={() => setShowAddDevicePicker(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingAddDeviceProducts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Đang tải sản phẩm...</p>
                  </div>
                </div>
              ) : addDeviceProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">Không có sản phẩm nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addDeviceProducts.map((device) => {
                    const meta = CATEGORY_META[device.category];
                    return (
                      <button
                        key={device.id}
                        onClick={() => {
                          const unitPrice = device.price || 0;
                          setAdditionalDevices(prev => [...prev, {
                            id: device.id,
                            product: device,
                            productType: device.category,
                            quantity: 1,
                            unitPrice,
                          }]);
                          setShowAddDevicePicker(false);
                        }}
                        className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                      >
                        <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${meta.bg}`}>
                          {device.images?.[0] ? (
                            <Image
                              src={device.images[0]}
                              alt={device.model}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                              {meta.icon}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">{device.brand}</p>
                          <p className="text-sm text-gray-500 truncate">{device.model}</p>
                          {(device.price ?? 0) > 0 && (
                            <span className="text-xs font-medium text-green-600 mt-1 block">{formatCurrency(device.price ?? 0)}</span>
                          )}
                        </div>
                        <Plus className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {onGridCombos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-gray-500">Không tìm thấy combo on-grid phù hợp</p>
        </div>
      )}

      {/* Filter Drawer - Bottom Sheet */}
      {showFilterDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowFilterDrawer(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Bộ lọc combo</h2>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* System Type Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Loại hệ thống</h3>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Combo On-Grid</p>
                      <p className="text-xs text-blue-700 mt-1">Hệ thống hòa lưới không dùng pin lưu trữ, tiết kiệm chi phí và hoàn vốn nhanh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Phân loại theo pha</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">• 1 pha - Phù hợp cho hộ gia đình</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">• 3 pha - Dùng cho doanh nghiệp, nhà xưởng</p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Giá đã bao gồm tất cả thiết bị và lắp đặt</p>
                <p className="text-sm text-gray-600">Áp dụng cho mọi công suất và pha</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowFilterDrawer(false);
                }}
                className="w-full py-3 px-4 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#C2410C] transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-[#F97316]' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}