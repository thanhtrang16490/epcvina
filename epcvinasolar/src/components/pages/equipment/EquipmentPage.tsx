import EquipmentPageMobile from './EquipmentPageMobile';
import EquipmentPageDesktop from './EquipmentPageDesktop';
import HeaderBar from '../../home/layout/HeaderBar';
import EquipmentSidebar from './EquipmentSidebar';
import CartSidebar from './CartSidebar';
import { CartProvider, useCart } from '../../../hooks/useCart';
import { useMemo, useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
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

// Cart floating button with badge
function CartButton() {
  const { totalItems, toggleCart } = useCart();
  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#F97316] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#C2410C] transition-all hover:scale-110 active:scale-95"
      aria-label={`Giỏ hàng ${totalItems > 0 ? `(${totalItems})` : ''}`}
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}

export default function EquipmentPage({ category }: PageProps) {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [categoryDevices, setCategoryDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');
  const [gridColumns, setGridColumns] = useState<number>(4);
  const [productLimit, setProductLimit] = useState<number>(24);

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

  return (
    <CartProvider>
      <div className="flex-1 flex flex-col">
        <HeaderBar />
        {/* Phone: Render full mobile component (< md) */}
        <div className="md:hidden">
          <EquipmentPageMobile category={category} />
        </div>

        {/* Tablet + Desktop: Hero + Sidebar + Content (≥ md) */}
        <div className="hidden md:flex md:flex-col md:flex-1">
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
          <div className="flex flex-1 px-4 sm:px-6 lg:px-8 py-4 gap-4">
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
      <CartButton />
      <CartSidebar />
    </CartProvider>
  );
}
