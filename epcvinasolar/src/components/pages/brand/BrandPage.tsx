import EquipmentPageMobile from '../equipment/EquipmentPageMobile';
import EquipmentPageDesktop from '../equipment/EquipmentPageDesktop';
import HeaderBar from '../../home/layout/HeaderBar';
import EquipmentSidebar from '../equipment/EquipmentSidebar';
import { useMemo, useState, useEffect } from 'react';
import type { Device, EquipmentCategory } from '../../../lib/types';
import { localBrands } from '../../../data/brands';

interface PageProps {
  brand: string;
  brandName?: string;
}

// Convert API product (flat format) to Device format
function apiProductToDevice(product: any, brandOverride?: string): Device {
  return {
    id: product.id,
    category: (product.category) as EquipmentCategory,
    brand: brandOverride || product.brand || 'Unknown',
    name: product.name || product.model || 'Unknown',
    model: product.model || product.name || 'Unknown',
    quantity: 1,
    unit: 'sản phẩm',
    price: product.price || 0,
    specs: {
      'Danh mục': product.category || '',
      'Thương hiệu': brandOverride || product.brand || '',
      ...(product.specifications || {}),
    },
    features: product.features || [],
    warranty: parseInt(product.warranty || '0') || 0,
    images: product.main_image ? [product.main_image] : [],
    image_url: product.main_image,
  };
}

export default function BrandPage({ brand, brandName }: PageProps) {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [brandDevices, setBrandDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>(brand);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');
  const [gridColumns, setGridColumns] = useState<number>(4);
  const [productLimit, setProductLimit] = useState<number>(24);

  // Resolve actual brand name from slug for API filtering
  const actualBrandName = useMemo(() => {
    const brandEntry = localBrands.find(b => b.slug === brand);
    return brandEntry?.name || brandName || brand;
  }, [brand, brandName]);

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
        
        // Fetch brand-specific products using actual brand NAME (not slug)
        const brandResponse = await fetch(`/api/products?brand=${encodeURIComponent(actualBrandName)}`);
        const brandData = await brandResponse.json();
        
        if (brandData.success && brandData.data) {
          const brandDevicesList: Device[] = brandData.data.map((product: any) => 
            apiProductToDevice(product, actualBrandName)
          );
          setBrandDevices(brandDevicesList);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        setAllDevices([]);
        setBrandDevices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [brand, actualBrandName]);

  return (
    <div className="flex-1 flex flex-col">
      <HeaderBar />
      {/* Mobile: Render full mobile component */}
      <EquipmentPageMobile category="brand" brand={brand} />

      {/* Desktop: Hero (section 1) + Sidebar + Content (section 2) */}
      <div className="hidden md:flex md:flex-col md:flex-1">
        {/* Section 1: Hero full-width only */}
        <EquipmentPageDesktop 
          category="brand"
          brand={brand}
          brandName={brandName}
          devices={brandDevices}
          loading={loading}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          showHero={true}
          showContent={false}
        />

        {/* Section 2: Sidebar + Content only */}
        <div className="flex flex-1 px-4 sm:px-6 lg:px-8 py-4 gap-4">
          <EquipmentSidebar
            category="brand"
            brand={brand}
            devices={allDevices}
            categoryDevices={brandDevices}
            selectedBrand={selectedBrand}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSelectBrand={setSelectedBrand}
            onSelectDevice={setSelectedDeviceId}
            onShowDevice={(id: string) => {
              setSelectedDeviceId(id);
            }}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
          />
          <div className="flex-1 flex flex-col">
            <EquipmentPageDesktop 
              category="brand"
              brand={brand}
              brandName={brandName}
              devices={brandDevices}
              loading={loading}
              searchQuery={searchQuery}
              sortBy={sortBy}
              gridColumns={gridColumns}
              productLimit={productLimit}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onGridColumnsChange={setGridColumns}
              onProductLimitChange={setProductLimit}
              showHero={false}
              showContent={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
