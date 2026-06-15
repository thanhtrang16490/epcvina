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
  const [categoryDevices, setCategoryDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');

  // Fetch all devices for sidebar counts + category devices for display
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products for sidebar counts
        const allResponse = await fetch('/api/products');
        const allData = await allResponse.json();
        
        if (allData.success && allData.data) {
          const allDevicesList: Device[] = allData.data.map((product: any) => ({
            id: product.id,
            category: product.categories?.slug || product.category || 'panel',
            brand: product.brands?.name || product.brand || 'Unknown',
            model: product.name,
            quantity: 1,
            unit: 'sản phẩm',
            price: product.unit_price || product.price || 0,
            specs: {
              'Danh mục': product.categories?.name || product.category || '',
              'Thương hiệu': product.brands?.name || product.brand || '',
              ...(product.specifications || {}),
            },
            features: product.features || [],
            warranty: product.warranty_years || product.warranty || 0,
            images: product.main_image || product.image_url ? [product.main_image || product.image_url] : [],
            image_url: product.image_url || product.main_image,
          }));
          
          setAllDevices(allDevicesList);
        }
        
        // Fetch category-specific products for display
        const catResponse = await fetch(`/api/products?category=${category}`);
        const catData = await catResponse.json();
        
        if (catData.success && catData.data) {
          const catDevicesList: Device[] = catData.data.map((product: any) => ({
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
          showContent={false}
        />

        {/* Section 2: Sidebar + Content */}
        <div className="flex flex-1">
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
