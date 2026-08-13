import Link from 'next/link';
import Sidebar from '@/app/components/sidebar';
import { getProductBrandName, getProductImage, getProducts } from '@/lib/medusa';

export default async function BrandsPage() {
  const products = await getProducts();

  return (
    <main className="hero">
      <div className="container stack">
        <section className="panel panel-pad stack">
          <span className="badge">Thương hiệu</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px, 5vw, 54px)', lineHeight: 1 }}>
            Sản phẩm theo brand
          </h1>
          <p className="muted" style={{ maxWidth: 760, fontSize: 18 }}>
            Trang này hiển thị toàn bộ sản phẩm đã gắn brand từ Medusa backend.
          </p>
        </section>

        <div className="products-shell">
          <Sidebar />
          <section className="panel panel-pad stack">
            <div className="toolbar" style={{ justifyContent: 'space-between' }}>
              <div>
                <span className="badge">Brands</span>
                <h2 style={{ marginBottom: 0 }}>Tất cả sản phẩm theo brand</h2>
              </div>
              <div className="muted">Tổng: {products.length} sản phẩm</div>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.handle || product.id}`}
                  className="product-link"
                >
                  {getProductImage(product) ? (
                    <img
                      src={getProductImage(product)!}
                      alt={product.title}
                      className="product-image"
                    />
                  ) : null}
                  <h3>{product.title}</h3>
                  <p className="muted">{getProductBrandName(product) || product.handle}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
