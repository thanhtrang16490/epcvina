import { useEffect, useMemo, useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Badge, Container, Heading, Text } from "@medusajs/ui";

type Brand = {
  id: string;
  handle: string;
  name: string;
  description?: string | null;
  image?: string | null;
  rank?: number;
};

const routeConfig = defineRouteConfig({
  label: "Thương hiệu",
});

const BrandsAdminPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadBrands() {
      try {
        setLoading(true);
        const response = await fetch("/admin/brands", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (mounted) {
          setBrands(Array.isArray(data.brands) ? data.brands : []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load brands",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadBrands();

    return () => {
      mounted = false;
    };
  }, []);

  const total = useMemo(() => brands.length, [brands]);

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">Thương hiệu</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Quản lý thương hiệu đồng bộ từ EPCVINA và hiển thị ở storefront.
        </Text>
      </div>

      <div className="px-6 py-4 flex items-center gap-2">
        <Badge>{total} thương hiệu</Badge>
        {loading ? <Text size="small">Đang tải...</Text> : null}
        {error ? (
          <Text size="small" className="text-red-600">
            {error}
          </Text>
        ) : null}
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={`/brand/${brand.handle}`}
              className="block rounded-lg border border-ui-border-base bg-ui-bg-base p-4 hover:border-ui-border-strong"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-subtle">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Heading level="h3">{brand.name}</Heading>
                  <Text size="small" className="text-ui-fg-subtle">
                    {brand.description || brand.handle}
                  </Text>
                  <Text size="small" className="text-ui-fg-muted">
                    Handle: {brand.handle}
                  </Text>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default BrandsAdminPage;

export { routeConfig };
