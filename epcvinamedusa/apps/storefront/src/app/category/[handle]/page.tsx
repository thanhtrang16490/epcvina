import Link from 'next/link';
import { notFound } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import { getCategories, getProductsByCategory, normalizeMediaUrl } from '@/lib/medusa';

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories
    .filter((category) => Boolean(category.handle))
    .map((category) => ({
      handle: category.handle as string,
    }));
}

export default async function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => (item.handle || item.id) === handle);
  const products = await getProductsByCategory(handle);
  if (products.length === 0) return notFound();

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
                {category?.metadata?.image ? (
                  <img
                    src={category.metadata.image}
                    alt={category.name}
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
                <span className="badge">Category</span>
                <h1 style={{ margin: 0 }}>{category?.name || handle}</h1>
                {category?.description ? (
                  <p className="muted" style={{ margin: 0 }}>
                    {category.description}
                  </p>
                ) : null}
                <div className="toolbar">
                  <span className="badge">{products.length} sản phẩm</span>
                  <Link href="/category" className="button secondary">
                    Xem tất cả danh mục
                  </Link>
                </div>
              </div>
            </div>

            <div className="toolbar">
              <span className="badge">{products.length} sản phẩm</span>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.handle || product.id}`}
                  className="product-link"
                >
                  {product.thumbnail ? (
                    <img
                      src={normalizeMediaUrl(product.thumbnail)!}
                      alt={product.title}
                      className="product-image"
                    />
                  ) : null}
                  <h3>{product.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
