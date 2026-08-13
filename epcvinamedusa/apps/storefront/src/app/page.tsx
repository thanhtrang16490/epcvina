import Link from 'next/link';
import Sidebar from './components/sidebar';
import { getProducts, getProductImage, getProductBrandName } from '@/lib/medusa';

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 12);

  return (
    <main className="hero">
      <div className="container stack">
        <section className="panel panel-pad stack">
          <span className="badge">Next.js + Medusa</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 0.95 }}>
            EPCVINA Solar
          </h1>
          <p className="muted" style={{ maxWidth: 760, fontSize: 18 }}>
            Storefront mới dùng Next.js, tối ưu để chạy local và sau này triển khai VPS. Dữ liệu ưu
            tiên từ Medusa, có fallback nguồn EPCVINA để không bị trống.
          </p>
          <div className="toolbar">
            <Link className="button" href="/products">
              Xem sản phẩm
            </Link>
            <Link className="button secondary" href="/category/panel">
              Xem tấm pin
            </Link>
          </div>
        </section>

        <div className="products-shell">
          <Sidebar />
          <section className="panel panel-pad stack">
            <div>
              <span className="badge">Sản phẩm</span>
              <h2 style={{ marginBottom: 0 }}>Danh sách nổi bật</h2>
            </div>
            <div id="products" className="product-grid">
              {featured.map((product) => (
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
