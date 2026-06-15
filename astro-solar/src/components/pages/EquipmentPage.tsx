import EquipmentPageMobile from './EquipmentPageMobile';
import EquipmentPageDesktop from './EquipmentPageDesktop';
import EquipmentSidebar from './EquipmentSidebar';
import { useMemo, useState, useEffect } from 'react';
import type { Device, EquipmentCategory } from '../../lib/types';
import type { CollectionEntry } from 'astro:content';

interface PageProps {
  category: string;
}

// Convert Content Collections product to Device format
function productToDevice(product: CollectionEntry<'products'>, categoryOverride?: string): Device {
  return {
    id: product.id,
    category: (categoryOverride || product.data.category) as EquipmentCategory,
    brand: product.data.brand,
    model: product.data.model,
    quantity: 1,
    unit: 'sản phẩm',
    price: product.data.price || 0,
    specs: {
      'Danh mục': product.data.category,
      'Thương hiệu': product.data.brand,
      ...(product.data.specifications || {}),
    },
    features: product.data.features || [],
    warranty: parseInt(product.data.warranty || '0') || 0,
    images: product.data.main_image ? [product.data.main_image] : [],
    image_url: product.data.main_image,
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
            productToDevice(product as any)
          );
          setAllDevices(allDevicesList);
        }
        
        // Fetch category-specific products for display
        const catResponse = await fetch(`/api/products?category=${category}`);
        const catData = await catResponse.json();
        
        if (catData.success && catData.data) {
          const catDevicesList: Device[] = catData.data.map((product: any) => 
            productToDevice(product as any, category)
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

  return (
    <div className="flex-1 flex flex-col">
      {/* Mobile: Render full mobile component */}
      <EquipmentPageMobile category={category} />

      {/* Desktop: Hero (section 1) + Sidebar + Content (section 2) */}
      <div className="hidden lg:flex lg:flex-col lg:flex-1">
        {/* Section 1: Hero full-width */}
        <EquipmentPageDesktop 
          category={category} 
          devices={categoryDevices}
          loading={loading}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          showHero={true}
          showContent={true}
        />

        {/* Section 2: Sidebar + Content */}
        <div className="flex flex-1">
          <EquipmentSidebar
            category={category}
            devices={allDevices}
            categoryDevices={categoryDevices}
            selectedBrand={selectedBrand}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSelectBrand={setSelectedBrand}
            onSelectDevice={setSelectedDeviceId}
            onShowDevice={(id) => {
              setSelectedDeviceId(id);
            }}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
          />
          <div className="flex-1 flex flex-col">
            <EquipmentPageDesktop 
              category={category} 
              devices={categoryDevices}
              loading={loading}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              showHero={false}
              showContent={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
