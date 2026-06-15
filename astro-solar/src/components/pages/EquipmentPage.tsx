import EquipmentPageMobile from './EquipmentPageMobile';
import EquipmentPageDesktop from './EquipmentPageDesktop';
import EquipmentSidebar from './EquipmentSidebar';
import { useMemo, useState, useEffect } from 'react';
import type { Device, EquipmentCategory } from '../../lib/types';

interface PageProps {
  category: string;
}

export default function EquipmentPage({ category }: PageProps) {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');

  // Fetch devices once, share between mobile and desktop
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?category=${category}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const devices: Device[] = data.data.map((product: any) => ({
            id: product.id,
            category: category as EquipmentCategory,
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
          }));
          
          setAllDevices(devices);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        setAllDevices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [category]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Mobile: Render full mobile component */}
      <div className="lg:hidden flex-1">
        <EquipmentPageMobile category={category} />
      </div>

      {/* Desktop: Render sidebar + desktop layout */}
      <div className="hidden lg:flex flex-1">
        <EquipmentSidebar
          category={category}
          devices={allDevices}
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
            devices={allDevices}
            loading={loading}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
          />
        </div>
      </div>
    </div>
  );
}
