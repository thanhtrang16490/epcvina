import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProductBrandName,
  getProductByHandle,
  getProductImage,
  getProducts,
} from '@/lib/medusa';

export async function generateStaticParams() {
  const products = await getProducts();

  return products
    .filter((product) => Boolean(product.handle))
    .map((product) => ({
      handle: product.handle as string,
    }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return notFound();

  const price = product.variants?.[0]?.prices?.[0];
  const priceText =
    typeof price?.amount === 'number'
      ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: price.currency_code?.toUpperCase?.() || 'VND',
          maximumFractionDigits: 0,
        }).format(price.amount / 100)
      : 'Liên hệ';

  return (
    <main className="hero">
      <div className="container stack">
        <Link className="badge" href="/">
          ← Quay lại
        </Link>
        <section className="panel panel-pad">
          <div
            className="grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <div>
              {getProductImage(product) ? (
                <img
                  src={getProductImage(product)!}
                  alt={product.title}
                  style={{ borderRadius: 24 }}
                />
              ) : null}
            </div>
            <div className="stack">
              <span className="badge">Chi tiết sản phẩm</span>
              <h1 style={{ margin: 0 }}>{product.title}</h1>
              <p className="muted">{getProductBrandName(product) || product.handle}</p>
              <div className="panel panel-pad">
                <div className="muted">Giá tham khảo</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fdba74' }}>{priceText}</div>
              </div>
              {product.description ? (
                <p className="muted" style={{ lineHeight: 1.7 }}>
                  {product.description}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
