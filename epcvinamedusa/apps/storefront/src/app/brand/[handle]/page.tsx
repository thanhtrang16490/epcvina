import Link from 'next/link';
import { notFound } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import {
  getBrandByHandle,
  getProductBrandHandle,
  getProductImage,
  getProducts,
} from '@/lib/medusa';

export async function generateStaticParams() {
  return [];
}

export default async function BrandDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const brand = await getBrandByHandle(handle);
  if (!brand) return notFound();

  const products = await getProducts();
  const brandProducts = products.filter((product) => getProductBrandHandle(product) === handle);

  return (
    <main className="hero">
      <div className="container stack">
        <div className="products-shell">
          <Sidebar />
          <section className="panel panel-pad stack">
            <div
              className="panel"
              style={{
                padding: 20,
                display: 'grid',
                gap: 18,
                gridTemplateColumns: 'minmax(180px, 240px) minmax(0, 1fr)',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  background: 'rgba(148, 163, 184, 0.08)',
                }}
              >
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--muted)',
                      fontSize: 40,
                    }}
                  >
                    ◼
                  </div>
                )}
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <span className="badge">Brand</span>
                <h1 style={{ margin: 0 }}>{brand.name}</h1>
                {brand.description ? (
                  <p className="muted" style={{ margin: 0 }}>
                    {brand.description}
                  </p>
                ) : null}
                <div className="toolbar">
                  <span className="badge">{brandProducts.length} sản phẩm</span>
                  <Link href="/brands" className="button secondary">
                    Xem tất cả brand
                  </Link>
                </div>
              </div>
            </div>
            <div className="toolbar">
              <span className="badge">{brandProducts.length} sản phẩm</span>
            </div>

            <div className="product-grid">
              {brandProducts.map((product) => (
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
                  <p className="muted">{brand.name || product.handle}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
