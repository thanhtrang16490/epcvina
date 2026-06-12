

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Zap, TrendingUp, X, Battery, Layers, Plug, Cable, Shield, Wrench, ChevronRight, Sun, SlidersHorizontal, Settings, Plus, Minus, Check, Sparkles, ArrowLeft } from 'lucide-react';
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
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
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
interface HybridPageProps {
  comboSlug?: string;
}

export default function HybridPage({ comboSlug }: HybridPageProps) {
  const [selectedComboId, setSelectedComboId] = useState<string>(comboSlug || '');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState<EquipmentCategory | null>(null);
  const [modifiedEquipment, setModifiedEquipment] = useState<Device[]>([]); // Track device changes
  const [calculatedPower, setCalculatedPower] = useState<number>(0); // Calculated kWp
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]); // Devices for selector
  const [loadingDevices, setLoadingDevices] = useState(false); // Loading state for devices
  const [modalDevice, setModalDevice] = useState<Device | null>(null);
  const [isFirstCardVisible, setIsFirstCardVisible] = useState(true);
  const { isHeaderVisible } = useScrollContext();
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const firstCardRef = useRef<HTMLDivElement>(null);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Template mode state
  const [mode, setMode] = useState<'combos' | 'template'>('combos');
  const [templates, setTemplates] = useState<ComboTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ComboTemplate | null>(null);
  const [itemOverrides, setItemOverrides] = useState<Record<string, {
    productId?: string;
    product?: any;
    quantity?: number;
  }>>({});
  const [slotProducts, setSlotProducts] = useState<Record<string, any[]>>({});
  const [loadingSlotProducts, setLoadingSlotProducts] = useState(false);
  const [showTemplateConfig, setShowTemplateConfig] = useState(false);
  const [showTemplateSlotPicker, setShowTemplateSlotPicker] = useState(false);
  const [selectedSlotForPicker, setSelectedSlotForPicker] = useState<TemplateItem | null>(null);
  const [generatingCombo, setGeneratingCombo] = useState(false);

  // Additional devices state
  const [additionalDevices, setAdditionalDevices] = useState<Array<{
    id: string;
    product: any;
    productType: EquipmentCategory;
    quantity: number;
    unitPrice: number;
  }>>([]);
  const [showAddDevicePicker, setShowAddDevicePicker] = useState(false);
  const [selectedAddCategory, setSelectedAddCategory] = useState<EquipmentCategory | null>(null);
  const [addDeviceProducts, setAddDeviceProducts] = useState<Device[]>([]);
  const [loadingAddDeviceProducts, setLoadingAddDeviceProducts] = useState(false);
  
  // Check login session
  useEffect(() => {
    const session = localStorage.getItem('user_session') || sessionStorage.getItem('user_session');
    setIsLoggedIn(!!session);
  }, []);

  // Dynamic sticky top based on header visibility
  const stickyTop = isHeaderVisible 
    ? 'top-[56px] lg:top-16'  // Below visible header
    : 'top-0';                 // At top when header hidden

  // Fetch hybrid combos from API
  const { data: rawCombos, loading } = useFetch<any[]>('/api/combos?systemType=hybrid');
  
  // Fetch hybrid templates from API
  const { data: rawTemplates, loading: loadingTemplates } = useFetch<any[]>('/api/templates?systemType=hybrid');
  
  // Normalize and filter hybrid combos
  const hybridCombos = useMemo(() => {
    const allCombos = normalizeCombos(rawCombos);
    return allCombos.filter(combo => combo.systemType === 'hybrid');
  }, [rawCombos]);

  // Normalize templates
  const hybridTemplates = useMemo(() => {
    if (!rawTemplates) return [];
    return rawTemplates.map(normalizeTemplate).filter((t: ComboTemplate) => t.systemType === 'hybrid' && t.isActive);
  }, [rawTemplates]);
  
  // Set templates when loaded
  useEffect(() => {
    if (hybridTemplates.length > 0 && templates.length === 0) {
      setTemplates(hybridTemplates);
    }
  }, [hybridTemplates, templates.length]);
  
  // Group templates by phase+voltage
  const templateGroups = useMemo(() => {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];
    for (const t of hybridTemplates) {
      const key = `${t.phase}|${t.voltage ?? ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        const phaseLabel = t.phase === '1-phase' ? '1 pha' : '3 pha';
        const voltageLabel = t.voltage === 'low' ? ' áp thấp' : t.voltage === 'high' ? ' áp cao' : '';
        result.push({ value: key, label: `${phaseLabel}${voltageLabel}` });
      }
    }
    return result;
  }, [hybridTemplates]);
  
  // Group templates by phase+voltage for display
  const templatesByGroup = useMemo(() => {
    const grouped: Record<string, ComboTemplate[]> = {};
    hybridTemplates.forEach(template => {
      const key = `${template.phase}|${template.voltage ?? ''}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(template);
    });
    return grouped;
  }, [hybridTemplates]);
  
  // Calculate accessory totals from template selection
  const calculatedAccessories = useMemo(() => {
    if (!selectedTemplate?.items) return [];

    // Get panel items and count
    const panelItems = selectedTemplate.items.filter(i => i.productType === 'panel');
    const panelCount = panelItems.reduce((sum, i) => sum + (itemOverrides[i.id]?.quantity ?? i.baseQuantity), 0);

    // Get inverter items and count
    const inverterItems = selectedTemplate.items.filter(i => i.productType === 'inverter');
    const inverterCount = inverterItems.reduce((sum, i) => sum + (itemOverrides[i.id]?.quantity ?? i.baseQuantity), 0);

    // Get capacity from panel wattage
    let capacityKw = 0;
    if (panelItems.length > 0) {
      const firstPanelItem = panelItems[0];
      const product = itemOverrides[firstPanelItem.id]?.product ?? firstPanelItem.product;
      if (product?.specifications) {
        const specs = product.specifications;
        const wattageStr = specs['Công suất'] || specs['Wattage'] || specs['Power'] || '0';
        const wattage = parseFloat(String(wattageStr).replace(/[^\d.]/g, '')) || 0;
        capacityKw = (panelCount * wattage) / 1000;
      }
    }
    if (capacityKw === 0 && selectedTemplate.capacityKwMin) {
      capacityKw = selectedTemplate.capacityKwMin;
    }

    // Calculate scaled items (items with scaleSource)
    const scaledItems = selectedTemplate.items.filter(i => i.scaleSource);
    return calculateItemQuantities(scaledItems, { panelCount, inverterCount, capacityKw });
  }, [selectedTemplate, itemOverrides]);
  
  // Calculate main products total
  const mainProductsTotal = useMemo(() => {
    if (!selectedTemplate?.items) return 0;
    return selectedTemplate.items
      .filter(i => i.isUserSelectable)
      .reduce((sum, i) => {
        const override = itemOverrides[i.id];
        const price = override?.product?.unit_price ?? override?.product?.price ?? i.unitPrice ?? 0;
        const quantity = override?.quantity ?? i.baseQuantity;
        return sum + (price * quantity);
      }, 0);
  }, [selectedTemplate, itemOverrides]);
  
  // Calculate accessories total
  const accessoriesTotal = useMemo(() => {
    return calculatedAccessories.reduce((sum, acc) => sum + acc.lineTotal, 0);
  }, [calculatedAccessories]);

  // Calculate additional devices total
  const additionalDevicesTotal = useMemo(() => {
    return additionalDevices.reduce((sum, d) => sum + d.unitPrice * d.quantity, 0);
  }, [additionalDevices]);

  // Fetch products when add-device category is selected
  useEffect(() => {
    if (!showAddDevicePicker || !selectedAddCategory) return;
    const fetchProducts = async () => {
      setLoadingAddDeviceProducts(true);
      try {
        const devices = await getAvailableDevicesByCategory(selectedAddCategory, hybridCombos);
        setAddDeviceProducts(devices);
      } catch {
        setAddDeviceProducts([]);
      } finally {
        setLoadingAddDeviceProducts(false);
      }
    };
    fetchProducts();
  }, [showAddDevicePicker, selectedAddCategory, hybridCombos]);
  
  // Fetch products for a specific slot
  const fetchSlotProducts = useCallback(async (templateSlug: string, slotType: string) => {
    setLoadingSlotProducts(true);
    try {
      const response = await fetch(`/api/templates/${templateSlug}/products?slot=${slotType}`);
      const data = await response.json();
      if (data.success && data.data) {
        setSlotProducts(prev => ({
          ...prev,
          [slotType]: data.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching slot products:', error);
    } finally {
      setLoadingSlotProducts(false);
    }
  }, []);
  
  // Initialize item overrides when a template is selected
  useEffect(() => {
    if (selectedTemplate?.items) {
      const initialOverrides: Record<string, { productId?: string; product?: any; quantity?: number }> = {};
      selectedTemplate.items.filter(i => i.isUserSelectable).forEach((item) => {
        if (item.product) {
          initialOverrides[item.id] = {
            productId: item.productId,
            product: item.product,
            quantity: item.baseQuantity,
          };
        }
      });
      setItemOverrides(initialOverrides);
    }
  }, [selectedTemplate]);
  
  // Handle template selection
  const handleSelectTemplate = useCallback((template: ComboTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateConfig(true);
    setItemOverrides({});
    setSlotProducts({});
    setAdditionalDevices([]);
  }, []);
  
  // Handle slot product selection
  const handleSelectSlotProduct = useCallback((product: any) => {
    if (!selectedSlotForPicker) return;

    setItemOverrides(prev => ({
      ...prev,
      [selectedSlotForPicker.id]: {
        productId: product.id,
        product,
        quantity: prev[selectedSlotForPicker.id]?.quantity ?? selectedSlotForPicker.baseQuantity ?? 1,
      },
    }));

    setShowTemplateSlotPicker(false);
    setSelectedSlotForPicker(null);
  }, [selectedSlotForPicker]);
  
  // Handle quantity change for a slot
  const handleSlotQuantityChange = useCallback((itemId: string, delta: number) => {
    setItemOverrides(prev => {
      const current = prev[itemId];
      if (!current) return prev;
      const newQuantity = Math.max(1, (current.quantity ?? 1) + delta);
      return {
        ...prev,
        [itemId]: { ...current, quantity: newQuantity },
      };
    });
  }, []);
  
  // Generate combo from template
  const handleGenerateCombo = useCallback(async () => {
    if (!selectedTemplate) return;

    setGeneratingCombo(true);
    try {
      // Build selections array from item overrides
      const selections = Object.entries(itemOverrides)
        .filter(([, override]) => override.productId)
        .map(([itemId, override]) => ({
          itemId,
          productId: override.productId!,
          quantity: override.quantity ?? 1,
        }));

      const response = await fetch(`/api/templates/${selectedTemplate.slug}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selections,
          additionalItems: additionalDevices.map(d => ({
            productId: d.id,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Show success or navigate to generated combo
        alert('Combo đã được tạo thành công!');
        setShowTemplateConfig(false);
        setSelectedTemplate(null);
        setItemOverrides({});
        setAdditionalDevices([]);
      } else {
        alert('Có lỗi xảy ra: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating combo:', error);
      alert('Có lỗi xảy ra khi tạo combo');
    } finally {
      setGeneratingCombo(false);
    }
  }, [selectedTemplate, itemOverrides, additionalDevices]);

  // Unique phase+voltage groups in display order
  const groups = useMemo(() => {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];
    for (const c of hybridCombos) {
      const key = `${c.phase}|${c.voltage ?? ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        const phaseLabel = c.phase === '1-phase' ? '1 pha' : '3 pha';
        const voltageLabel = c.voltage === 'low' ? ' áp thấp' : c.voltage === 'high' ? ' áp cao' : '';
        result.push({ value: key, label: `${phaseLabel}${voltageLabel}` });
      }
    }
    return result;
  }, [hybridCombos]);

  // Init selectedGroup to first available
  useMemo(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].value);
    }
  }, [groups, selectedGroup]);

  // Group ALL combos by phase+voltage (no filtering)
  const combosByGroup = useMemo(() => {
    let filtered = hybridCombos;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(combo => 
        combo.name.toLowerCase().includes(query) ||
        combo.inverterBrand.toLowerCase().includes(query) ||
        combo.panelBrand.toLowerCase().includes(query)
      );
    }
    
    const grouped: Record<string, typeof hybridCombos> = {};
    filtered.forEach(combo => {
      const key = `${combo.phase}|${combo.voltage ?? ''}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(combo);
    });
    return grouped;
  }, [hybridCombos, searchQuery]);

  // Scroll to group section
  const scrollToGroup = (group: string) => {
    setSelectedGroup(group);
    const element = groupRefs.current[group];
    if (element) {
      const yOffset = -60; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Init / reset selectedComboId when all combos change
  useMemo(() => {
    if (hybridCombos.length > 0) {
      const stillValid = hybridCombos.some(c => c.id === selectedComboId);
      if (!stillValid) setSelectedComboId('');
    }
  }, [hybridCombos, selectedComboId]);

  const selectedCombo = useMemo(
    () => hybridCombos.find(c => c.id === selectedComboId) || hybridCombos[0],
    [hybridCombos, selectedComboId]
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
    // 2. Model name: Extract from "Tấm quang năng Aiko 640Wp" or "550W"
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
          hybridCombos,
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
  }, [showDeviceSelector, selectedDeviceCategory, selectedCombo?.phase, selectedCombo?.systemType, hybridCombos]);

  return (
    <div className="flex-1 flex flex-col min-h-screen lg:ml-[64px] lg:pl-0">
      {/* Sticky Header */}
      <header className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-all duration-200 ${
        isFirstCardVisible ? 'shadow-sm' : ''
      }`}>
        {/* Title Row */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Combo Hybrid</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Hệ thống điện mặt trời lưu trữ với pin dự phòng
              </p>
            </div>
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setMode('combos')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  mode === 'combos'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Combo có sẵn
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLoginPrompt(true);
                  } else {
                    setMode('template');
                  }
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  mode === 'template'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Tự thiết kế
              </button>
            </div>
          </div>
        </div>

        {/* Group Tabs - Pill style */}
        <div className={`px-4 py-2 overflow-x-auto scrollbar-hide ${stickyTop} z-20 bg-white border-b border-gray-200`}>
          <div className="flex gap-2 min-w-max">
            {groups.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => scrollToGroup(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedGroup === value
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

      {/* Mode: Combos - Existing combo browsing */}
      {mode === 'combos' && (
        <>
          {/* All Combo Sections - Grouped by Phase+Voltage */}
          <div className="space-y-6 pb-4">
            {Object.entries(combosByGroup).map(([groupKey, combos], groupIndex) => {
              const groupInfo = groups.find(g => g.value === groupKey);
              return (
                <div key={groupKey} ref={(el) => { 
                  groupRefs.current[groupKey] = el;
                  // Track first combo for scroll observer
                  if (groupIndex === 0 && combos[0]) {
                    firstCardRef.current = el;
                  }
                }}>
                  {/* Group Header */}
                  <div className="sticky top-14 lg:top-16 z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">{groupInfo?.label}</h2>
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
                            {combo.images?.[0] ? (
                              <Image
                                src={combo.images[0]}
                                alt={combo.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-orange-600">
                                <Battery className="h-6 w-6" />
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
                            <p className="text-sm text-gray-500">
                              {combo.capacity} kWp - {combo.phase === '1-phase' ? '1 pha' : '3 pha'}
                              {combo.voltage === 'low' ? ' áp thấp' : combo.voltage === 'high' ? ' áp cao' : ''}
                            </p>
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
              );
            })}  
          </div>

          {/* Empty state */}
          {hybridCombos.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
                <Battery className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-500">Không tìm thấy combo hybrid phù hợp</p>
            </div>
          )}
        </>
      )}

      {/* Mode: Template - Build from template */}
      {mode === 'template' && (
        <div className="space-y-6 pb-4">
          {loadingTemplates ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Đang tải mẫu...</p>
              </div>
            </div>
          ) : (
            Object.entries(templatesByGroup).map(([groupKey, groupTemplates]) => {
              const groupInfo = templateGroups.find(g => g.value === groupKey);
              return (
                <div key={groupKey}>
                  {/* Group Header */}
                  <div className="sticky top-14 lg:top-16 z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">{groupInfo?.label || groupKey}</h2>
                    <p className="text-xs text-gray-500">{groupTemplates.length} mẫu</p>
                  </div>
                  
                  {/* Template Cards */}
                  <div className="p-4 space-y-4 bg-white">
                    {groupTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#F97316] hover:shadow-lg transition-all"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                template.phase === '1-phase' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                              }`}>
                                {template.phase === '1-phase' ? '1 pha' : '3 pha'}
                                {template.voltage === 'low' ? ' AT' : template.voltage === 'high' ? ' AC' : ''}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                            <Sparkles className="h-6 w-6" />
                          </div>
                        </div>
                        
                        {/* Capacity Range */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Công suất</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {template.capacityKwMin} - {template.capacityKwMax} kWp
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Thiết bị chính</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {template.items?.filter(i => i.isUserSelectable).length ?? 0} loại
                            </p>
                          </div>
                        </div>
                        
                        {/* Main Items Preview */}
                        <div className="flex flex-wrap gap-2">
                          {template.items?.filter(i => i.isUserSelectable).slice(0, 4).map((item) => {
                            const meta = CATEGORY_META[item.productType];
                            return (
                              <span
                                key={item.id}
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${meta?.bg || 'bg-gray-100'} ${meta?.color || 'text-gray-600'}`}
                              >
                                {meta?.icon}
                                {item.slotName ?? meta?.label ?? item.productType}
                              </span>
                            );
                          })}
                          {(template.items?.filter(i => i.isUserSelectable).length ?? 0) > 4 && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-600">
                              +{(template.items?.filter(i => i.isUserSelectable).length ?? 0) - 4} hơn
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
          
          {/* Empty state for templates */}
          {!loadingTemplates && hybridTemplates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-500">Không có mẫu hybrid nào</p>
            </div>
          )}
        </div>
      )}

      {/* Login Prompt Overlay */}
      {showLoginPrompt && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          />
          <div className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-4 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[360px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#C2410C] flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Yêu cầu đăng nhập</h3>
              <p className="text-sm text-gray-500">Vui lòng đăng nhập để sử dụng tính năng này</p>
            </div>
            <a
              href="/login"
              className="w-full py-3 px-4 bg-[#F97316] text-white rounded-xl font-semibold text-center hover:bg-[#C2410C] transition-colors"
            >
              Đăng nhập
            </a>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Để sau
            </button>
          </div>
        </>
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
                <div className={`w-10 h-10 rounded-xl ${selectedCombo.systemType === 'hybrid' ? 'bg-orange-50 text-orange-600' : 'bg-orange-50 text-orange-600'} flex items-center justify-center`}>
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
                          selectedCombo.systemType === 'hybrid' ? 'bg-orange-50 text-orange-700' : 'bg-orange-50 text-orange-700'
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
                      <p className={`text-lg font-bold ${green ? 'text-orange-600' : blue ? 'text-[#F97316]' : 'text-gray-900'}`}>
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

      {/* Device Detail Modal */}
      {modalDevice && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setModalDevice(null)}
          />
          <div className="fixed inset-x-4 top-12 bottom-8 z-50 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px]">
            {(() => {
              const meta = CATEGORY_META[modalDevice.category];
              return (
                <>
                  {/* Sticky Header */}
                  <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{meta.label}</p>
                        <p className="text-xs text-gray-500">{modalDevice.brand}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalDevice(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Device image gallery */}
                    {modalDevice.images?.length > 0 ? (
                      <ImageGallery images={modalDevice.images} alt={modalDevice.model} />
                    ) : (
                      <div className={`aspect-square w-full flex items-center justify-center bg-gradient-to-br ${meta.gradient}`}>
                        <div className="text-center text-white">
                          <div className="h-20 w-20 mx-auto mb-3 opacity-90 flex items-center justify-center">
                            {meta.icon}
                          </div>
                          <p className="text-2xl font-bold">{modalDevice.brand}</p>
                        </div>
                      </div>
                    )}

                    <div className="p-5 space-y-5">
                      {/* Title + Badges */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{modalDevice.brand}</h3>
                        <p className="text-sm text-gray-500 mb-3">{modalDevice.model}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${meta.bg} ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                            Chính hãng
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Bảo hành {modalDevice.warranty} năm
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                            ×{modalDevice.quantity} {modalDevice.unit}
                          </span>
                          {modalDevice.price && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#F97316]/10 text-[#F97316]">
                              {formatCurrency(modalDevice.price)}/{modalDevice.unit}
                            </span>
                          )}
                        </div>
                        {modalDevice.price && (
                          <div className="mt-3 p-3 bg-green-50 rounded-xl">
                            <p className="text-xs text-gray-500">Thành tiền</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(modalDevice.price * modalDevice.quantity)} VNĐ</p>
                          </div>
                        )}
                      </div>

                      {/* Technical Specs */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Thông số kỹ thuật</h4>
                        <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                          {Object.entries(modalDevice.specs).map(([key, val]) => (
                            <SpecRow key={key} label={key} value={val}
                              highlight={key === 'Bảo hành' || key.includes('Công suất') || key.includes('Tổng') || key.includes('Dung lượng')}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tính năng nổi bật</h4>
                        <ul className="space-y-2">
                          {modalDevice.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${meta.accent || 'bg-gray-500'}`} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </>
      )}

      {/* Device Selector Drawer - Bottom Sheet */}
      {showDeviceSelector && selectedDeviceCategory && modifiedEquipment.length > 0 && (
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

      {/* Empty state - only for combo mode */}
      {mode === 'combos' && hybridCombos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
            <Battery className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-500">Không tìm thấy combo hybrid phù hợp</p>
        </div>
      )}

      {/* Template Configuration Modal */}
      {showTemplateConfig && selectedTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowTemplateConfig(false)}
          />
          <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white">
              <button
                onClick={() => {
                  setShowTemplateConfig(false);
                  setSelectedTemplate(null);
                  setItemOverrides({});
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{selectedTemplate.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedTemplate.capacityKwMin} - {selectedTemplate.capacityKwMax} kWp
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Tổng cộng</p>
                <p className="text-lg font-bold text-[#F97316]">
                  {formatCurrency(mainProductsTotal + accessoriesTotal + additionalDevicesTotal)}
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Group items by category */}
              {(() => {
                const CATEGORY_DISPLAY_ORDER: EquipmentCategory[] = ['panel', 'inverter', 'battery', 'meter', 'mounting', 'wiring', 'cabinet', 'grounding', 'installation'];
                const groupedItems = CATEGORY_DISPLAY_ORDER
                  .map(cat => ({
                    category: cat,
                    items: (selectedTemplate.items ?? []).filter(i => i.productType === cat),
                  }))
                  .filter(g => g.items.length > 0);

                const selectableItems = (selectedTemplate.items ?? []).filter(i => i.isUserSelectable);

                return (
                  <>
                    {/* Main Selectable Items */}
                    {selectableItems.length > 0 && (
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Thiết bị chính
                        </h3>
                        <div className="space-y-3">
                          {selectableItems.map((item) => {
                            const override = itemOverrides[item.id];
                            const meta = CATEGORY_META[item.productType];
                            const product = override?.product ?? item.product;
                            const quantity = override?.quantity ?? item.baseQuantity;

                            return (
                              <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`w-10 h-10 rounded-xl ${meta?.bg || 'bg-gray-100'} flex items-center justify-center ${meta?.color || 'text-gray-600'}`}>
                                    {meta?.icon || <Settings className="h-5 w-5" />}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {item.slotName ?? meta?.label ?? item.productType}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.baseQuantity} {item.isUserSelectable ? '• Có thể thay đổi' : '• Mặc định'}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Product Selection */}
                                <button
                                  onClick={() => {
                                    setSelectedSlotForPicker(item);
                                    fetchSlotProducts(selectedTemplate.slug, item.productType);
                                    setShowTemplateSlotPicker(true);
                                  }}
                                  className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#F97316] transition-colors text-left"
                                >
                                  <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ${meta?.bg || 'bg-gray-100'} flex items-center justify-center ${meta?.color || 'text-gray-600'}`}>
                                    {product?.main_image || product?.image_url ? (
                                      <Image
                                        src={product.main_image || product.image_url}
                                        alt={product.name || item.slotName || ''}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      meta?.icon || <Settings className="h-6 w-6" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {product?.brands?.name || product?.brand_name || product?.brand || 'Chọn sản phẩm'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {product?.name || 'Nhấn để chọn'}
                                    </p>
                                    {(product?.unit_price ?? item.unitPrice) > 0 && (
                                      <p className="text-xs text-green-600 font-medium mt-0.5">
                                        {formatCurrency(product?.unit_price ?? item.unitPrice ?? 0)}
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                </button>
                                
                                {/* Quantity Adjuster */}
                                {override && (
                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Số lượng</span>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => handleSlotQuantityChange(item.id, -1)}
                                        className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                      >
                                        <Minus className="h-4 w-4 text-gray-600" />
                                      </button>
                                      <span className="text-base font-bold text-gray-900 w-8 text-center">
                                        {quantity}
                                      </span>
                                      <button
                                        onClick={() => handleSlotQuantityChange(item.id, 1)}
                                        className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center hover:bg-[#C2410C] transition-colors"
                                      >
                                        <Plus className="h-4 w-4 text-white" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Auto-calculated Accessories */}
              {calculatedAccessories.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Phụ kiện tự động
                  </h3>
                  <div className="space-y-3">
                    {/* Group accessories by type */}
                    {ACCESSORY_ORDER.map((cat) => {
                      const accessories = calculatedAccessories.filter(acc => acc.item.productType === cat);
                      if (accessories.length === 0) return null;
                      const meta = CATEGORY_META[cat];
                      
                      return (
                        <div key={cat} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={meta.color}>{meta.icon}</span>
                            <p className="text-sm font-semibold text-gray-700">{meta.label}</p>
                          </div>
                          <div className="space-y-2">
                            {accessories.map(({ item, calculatedQuantity, lineTotal }) => (
                              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">
                                    {item.product?.name || `Phụ kiện ${item.productType}`}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ×{calculatedQuantity} × {formatCurrency(item.unitPrice)}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-orange-600">
                                  {formatCurrency(lineTotal)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 rounded-xl flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tổng phụ kiện</span>
                    <span className="text-base font-bold text-gray-900">{formatCurrency(accessoriesTotal)}</span>
                  </div>
                </div>
              )}

              {/* Additional Devices Section */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Thiết bị bổ sung
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedAddCategory(null);
                      setAddDeviceProducts([]);
                      setShowAddDevicePicker(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] text-white text-sm font-medium rounded-lg hover:bg-[#C2410C] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm thiết bị
                  </button>
                </div>

                {additionalDevices.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Chưa có thiết bị bổ sung</p>
                ) : (
                  <div className="space-y-3">
                    {additionalDevices.map((d) => {
                      const meta = CATEGORY_META[d.productType];
                      return (
                        <div key={d.id} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${meta?.bg || 'bg-gray-100'} flex items-center justify-center ${meta?.color || 'text-gray-600'}`}>
                            {d.product?.main_image || d.product?.image_url ? (
                              <Image
                                src={d.product.main_image || d.product.image_url}
                                alt={d.product.name || ''}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              meta?.icon || <Settings className="h-5 w-5" />
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {d.product?.brands?.name || d.product?.brand || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{d.product?.name}</p>
                            {d.unitPrice > 0 && (
                              <p className="text-xs text-green-600 font-medium">
                                {formatCurrency(d.unitPrice * d.quantity)}
                              </p>
                            )}
                          </div>
                          {/* Quantity stepper */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => setAdditionalDevices(prev =>
                                prev.map(item => item.id === d.id
                                  ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                                  : item
                                )
                              )}
                              className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="h-3 w-3 text-gray-600" />
                            </button>
                            <span className="text-sm font-bold text-gray-900 w-6 text-center">{d.quantity}</span>
                            <button
                              onClick={() => setAdditionalDevices(prev =>
                                prev.map(item => item.id === d.id
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item
                                )
                              )}
                              className="w-7 h-7 rounded-lg bg-[#F97316] flex items-center justify-center hover:bg-[#C2410C] transition-colors"
                            >
                              <Plus className="h-3 w-3 text-white" />
                            </button>
                          </div>
                          {/* Remove */}
                          <button
                            onClick={() => setAdditionalDevices(prev => prev.filter(item => item.id !== d.id))}
                            className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 hover:bg-red-200 transition-colors"
                          >
                            <X className="h-3.5 w-3.5 text-red-600" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Tóm tắt
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Thiết bị chính</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(mainProductsTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Phụ kiện</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(accessoriesTotal)}</span>
                  </div>
                  {additionalDevicesTotal > 0 && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Thiết bị bổ sung</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(additionalDevicesTotal)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                    <span className="text-xl font-bold text-[#F97316]">
                      {formatCurrency(mainProductsTotal + accessoriesTotal + additionalDevicesTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleGenerateCombo}
                disabled={generatingCombo || Object.keys(itemOverrides).length === 0}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  generatingCombo || Object.keys(itemOverrides).length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#F97316] text-white hover:bg-[#C2410C]'
                }`}
              >
                {generatingCombo ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Xác nhận tạo combo
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Template Slot Product Picker Modal */}
      {showTemplateSlotPicker && selectedSlotForPicker && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => {
              setShowTemplateSlotPicker(false);
              setSelectedSlotForPicker(null);
            }}
          />
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
                    Chọn {CATEGORY_META[selectedSlotForPicker.productType]?.label || 'sản phẩm'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedSlotForPicker.slotName ?? selectedSlotForPicker.productType}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTemplateSlotPicker(false);
                    setSelectedSlotForPicker(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingSlotProducts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Đang tải sản phẩm...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {(slotProducts[selectedSlotForPicker.productType] || []).map((product: any) => {
                    const meta = CATEGORY_META[selectedSlotForPicker.productType];
                    const isSelected = itemOverrides[selectedSlotForPicker.id]?.productId === product.id;
                    
                    return (
                      <button
                        key={product.id}
                        onClick={() => handleSelectSlotProduct(product)}
                        className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-colors text-left ${
                          isSelected
                            ? 'border-[#F97316] bg-orange-50'
                            : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${meta?.bg || 'bg-gray-100'}`}>
                          {product.main_image || product.image_url ? (
                            <Image
                              src={product.main_image || product.image_url}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${meta?.color || 'text-gray-600'}`}>
                              {meta?.icon || <Settings className="h-6 w-6" />}
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">{product.brand_name || product.brand || 'Unknown'}</p>
                          <p className="text-sm text-gray-500 truncate">{product.name}</p>
                          {product.unit_price && (
                            <span className="text-xs font-medium text-green-600 mt-1 block">
                              {formatCurrency(product.unit_price)}
                            </span>
                          )}
                        </div>
                        
                        {/* Check icon */}
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                  
                  {/* No products available */}
                  {(slotProducts[selectedSlotForPicker.productType] || []).length === 0 && !loadingSlotProducts && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Không có sản phẩm nào cho vị trí này</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 text-center">
                Chọn sản phẩm cho {(selectedSlotForPicker.slotName ?? selectedSlotForPicker.productType).toLowerCase()}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Add Device Picker - Category Grid or Product Drawer */}
      {showAddDevicePicker && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={() => {
              setShowAddDevicePicker(false);
              setSelectedAddCategory(null);
            }}
          />
          <div className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedAddCategory && (
                    <button
                      onClick={() => {
                        setSelectedAddCategory(null);
                        setAddDeviceProducts([]);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedAddCategory
                        ? `Chọn ${CATEGORY_META[selectedAddCategory].label}`
                        : 'Thêm thiết bị'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedAddCategory ? 'Chọn sản phẩm để thêm vào combo' : 'Chọn danh mục thiết bị'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddDevicePicker(false);
                    setSelectedAddCategory(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!selectedAddCategory ? (
                /* Category Grid */
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(CATEGORY_META) as EquipmentCategory[]).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedAddCategory(cat)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-transparent ${meta.bg} hover:border-current transition-all`}
                      >
                        <span className={`${meta.color} flex items-center justify-center`}>
                          {meta.icon}
                        </span>
                        <span className={`text-xs font-medium text-center leading-tight ${meta.color}`}>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Product List */
                loadingAddDeviceProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Đang tải sản phẩm...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addDeviceProducts.map((device) => {
                      const meta = CATEGORY_META[device.category];
                      const alreadyAdded = additionalDevices.some(d => d.id === device.id);
                      return (
                        <button
                          key={device.id}
                          onClick={() => {
                            if (!alreadyAdded) {
                              setAdditionalDevices(prev => [...prev, {
                                id: device.id,
                                product: device,
                                productType: device.category,
                                quantity: 1,
                                unitPrice: device.price || 0,
                              }]);
                            }
                            setShowAddDevicePicker(false);
                            setSelectedAddCategory(null);
                          }}
                          className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-colors text-left ${
                            alreadyAdded
                              ? 'border-[#F97316] bg-orange-50'
                              : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${meta?.bg || 'bg-gray-100'}`}>
                            {device.images?.[0] ? (
                              <Image
                                src={device.images[0]}
                                alt={device.model}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${meta?.color || 'text-gray-600'}`}>
                                {meta?.icon || <Settings className="h-6 w-6" />}
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-gray-900">{device.brand}</p>
                            <p className="text-sm text-gray-500 truncate">{device.model}</p>
                            {(device.price ?? 0) > 0 && (
                              <span className="text-xs font-medium text-green-600 mt-0.5 block">
                                {formatCurrency(device.price ?? 0)}
                              </span>
                            )}
                          </div>
                          {/* Check icon */}
                          {alreadyAdded ? (
                            <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                    {addDeviceProducts.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Không có sản phẩm nào</p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </>
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
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-start gap-3">
                    <Battery className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Combo Hybrid</p>
                      <p className="text-xs text-green-700 mt-1">Hệ thống lưu trữ với pin dự phòng, cung cấp điện liên tục cả khi mất lưới</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grouping Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Phân loại theo</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">• 1 pha - Công suất nhỏ (5-10 kWp)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">• 3 pha - Công suất lớn (10-50 kWp)</p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Giá đã bao gồm tất cả thiết bị và lắp đặt</p>
                <p className="text-sm text-gray-600">Áp dụng cho mọi công suất và cấu hình</p>
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
