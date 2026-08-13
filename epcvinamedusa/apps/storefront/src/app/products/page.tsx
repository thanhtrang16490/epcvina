import Link from 'next/link';
import Sidebar from '../components/sidebar';
import { getProductBrandName, getProductImage, getProducts } from '@/lib/medusa';

const PAGE_SIZE = 24;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = (await searchParams) || {};
  const requestedPage = Number.parseInt(params.page || '1', 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const products = await getProducts();
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageProducts = products.slice(start, start + PAGE_SIZE);
  const pageLinks = Array.from({ length: totalPages }, (_, index) => index + 1);

  function getPageHref(nextPage: number) {
    return nextPage <= 1 ? '/products' : `/products?page=${nextPage}`;
  }

  return (
    <main className="hero">
      <div className="container stack">
        <section className="panel panel-pad stack">
          <span className="badge">Danh sách sản phẩm</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px, 5vw, 54px)', lineHeight: 1 }}>
            Tất cả sản phẩm EPCVINA
          </h1>
          <p className="muted" style={{ maxWidth: 760, fontSize: 18 }}>
            Danh sách này lấy trực tiếp từ Medusa backend, có phân trang 24 sản phẩm mỗi trang.
          </p>
        </section>

        <div className="products-shell">
          <Sidebar />
          <section className="panel panel-pad stack">
            <div className="toolbar" style={{ justifyContent: 'space-between' }}>
              <div>
                <span className="badge">
                  Trang {safePage}/{totalPages}
                </span>
                <h2 style={{ marginBottom: 0 }}>Sản phẩm</h2>
              </div>
              <div className="muted">Tổng: {products.length} sản phẩm</div>
            </div>

            <div className="product-grid">
              {pageProducts.map((product) => (
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

            {totalPages > 1 ? (
              <nav className="pagination" aria-label="Phân trang sản phẩm">
                <Link className="page-pill" href={getPageHref(Math.max(1, safePage - 1))}>
                  Trang trước
                </Link>
                {pageLinks.map((page) => (
                  <Link
                    key={page}
                    className={`page-pill ${page === safePage ? 'active' : ''}`}
                    href={getPageHref(page)}
                    aria-current={page === safePage ? 'page' : undefined}
                  >
                    {page}
                  </Link>
                ))}
                <Link className="page-pill" href={getPageHref(Math.min(totalPages, safePage + 1))}>
                  Trang sau
                </Link>
              </nav>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
