import Link from 'next/link';
import {
  deriveCategoryHandle,
  getBrands,
  getCategories,
  getProducts,
  getProductBrandHandle,
} from '@/lib/medusa';

export default async function Sidebar() {
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ]);

  return (
    <aside className="sidebar panel">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3>Danh mục</h3>
        </div>
        <div className="sidebar-list">
          <Link href="/" className="sidebar-link">
            <span className="sidebar-icon-wrap">◎</span>
            <span>Tất cả</span>
            <span className="sidebar-count">{products.length}</span>
          </Link>
          {categories.map((category) =>
            (() => {
              const handle = category.handle || category.id;
              const count = products.filter((product) => {
                const derivedHandle = deriveCategoryHandle({
                  category: product.metadata?.category || product.metadata?.category_name || handle,
                  slug: product.handle || product.id || '',
                });
                return derivedHandle === handle;
              }).length;

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.handle || category.id}`}
                  className="sidebar-link"
                >
                  <span className="sidebar-thumb">
                    {category.metadata?.image ? (
                      <img src={category.metadata.image} alt={category.name} />
                    ) : (
                      <span>◼</span>
                    )}
                  </span>
                  <span>{category.name}</span>
                  <span className="sidebar-count">{count}</span>
                </Link>
              );
            })()
          )}
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3>Thương hiệu</h3>
        </div>
        <div className="sidebar-list">
          <Link href="/brands" className="sidebar-link">
            <span className="sidebar-icon-wrap">◎</span>
            <span>Tất cả thương hiệu</span>
            <span className="sidebar-count">{brands.length}</span>
          </Link>
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brand/${brand.handle}`} className="sidebar-link">
              <span className="sidebar-thumb">
                {brand.image ? <img src={brand.image} alt={brand.name} /> : <span>◼</span>}
              </span>
              <span>{brand.name}</span>
              <span className="sidebar-count">
                {
                  products.filter((product) => {
                    return getProductBrandHandle(product) === brand.handle;
                  }).length
                }
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
