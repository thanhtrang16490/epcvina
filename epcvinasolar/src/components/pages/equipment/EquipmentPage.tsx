import EquipmentPageMobile from './EquipmentPageMobile';
import EquipmentPageDesktop from './EquipmentPageDesktop';
import HeaderBar from '../../home/layout/HeaderBar';
import EquipmentSidebar from './EquipmentSidebar';
import { useMemo, useState, useEffect } from 'react';
import type { Device, EquipmentCategory } from '../../../lib/types';

interface PageProps {
  category: string;
}

// Convert API product (flat format) to Device format
function apiProductToDevice(product: any, categoryOverride?: string): Device {
  return {
    id: product.id,
    category: (categoryOverride || product.category) as EquipmentCategory,
    brand: product.brand || 'Unknown',
    name: product.name || product.model || 'Unknown',
    model: product.model || product.name || 'Unknown',
    quantity: 1,
    unit: 'sản phẩm',
    price: product.price || 0,
    specs: {
      'Danh mục': product.category || '',
      'Thương hiệu': product.brand || '',
      ...(product.specifications || {}),
    },
    features: product.features || [],
    warranty: parseInt(product.warranty || '0') || 0,
    images: product.main_image ? [product.main_image] : [],
    image_url: product.main_image,
  };
}

export default function EquipmentPage({ category }: PageProps) {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [categoryDevices, setCategoryDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');
  const [selectedGrid, setSelectedGrid] = useState<string>('');

  // Fetch products from Content Collections API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products for sidebar counts
        const allResponse = await fetch('/api/products');
        const allData = await allResponse.json();
        
        if (allData.success && allData.data) {
          const allDevicesList: Device[] = allData.data.map((product: any) => 
            apiProductToDevice(product)
          );
          setAllDevices(allDevicesList);
        }
        
        // Fetch category-specific products for display
        const catResponse = await fetch(`/api/products?category=${category}`);
        const catData = await catResponse.json();
        
        if (catData.success && catData.data) {
          const catDevicesList: Device[] = catData.data.map((product: any) => 
            apiProductToDevice(product, category)
          );
          setCategoryDevices(catDevicesList);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        setAllDevices([]);
        setCategoryDevices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [category]);

  // Extract grid options from category devices (for panels)
  const gridOptions = useMemo(() => {
    const gridSet = new Set<string>();
    for (const device of categoryDevices) {
      const cellCount = device.specs['Số lượng cell'];
      if (cellCount) {
        // Extract grid pattern like "6×22" from "132 (6×22)"
        const match = cellCount.match(/\((\d+×\d+)\)/);
        if (match) {
          gridSet.add(match[1]);
        }
      }
    }
    return Array.from(gridSet).sort();
  }, [categoryDevices]);

  return (
    <div className="flex-1 flex flex-col">
      <HeaderBar />
      {/* Mobile: Render full mobile component */}
      <EquipmentPageMobile category={category} />

      {/* Desktop: Hero (section 1) + Sidebar + Content (section 2) */}
      <div className="hidden lg:flex lg:flex-col lg:flex-1">
        {/* Section 1: Hero full-width only */}
        <EquipmentPageDesktop 
          category={category} 
          devices={categoryDevices}
          loading={loading}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          showHero={true}
          showContent={false}
        />

        {/* Section 2: Sidebar + Content only */}
        <div className="flex flex-1 gap-6">
          <EquipmentSidebar
            category={category}
            devices={allDevices}
            categoryDevices={categoryDevices}
            selectedBrand={selectedBrand}
            searchQuery={searchQuery}
            sortBy={sortBy}
            selectedGrid={selectedGrid}
            onSelectBrand={setSelectedBrand}
            onSelectDevice={setSelectedDeviceId}
            onShowDevice={(id) => {
              setSelectedDeviceId(id);
            }}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onGridChange={setSelectedGrid}
          />
          <div className="flex-1 flex flex-col pl-6 pr-6">
            <EquipmentPageDesktop 
              category={category} 
              devices={categoryDevices}
              loading={loading}
              searchQuery={searchQuery}
              sortBy={sortBy}
              selectedGrid={selectedGrid}
              gridOptions={gridOptions}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onGridChange={setSelectedGrid}
              showHero={false}
              showContent={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
