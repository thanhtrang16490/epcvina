import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminProduct } from "@medusajs/framework/types";
import { Button, Container, Heading, Text, toast } from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
import { DetailWidgetProps } from "@medusajs/framework/types";

type Brand = {
  id: string;
  handle: string;
  name: string;
};

type ProductWithBrandMetadata = AdminProduct & {
  metadata?: {
    brand_handle?: string;
    brand_name?: string;
  };
};

const ProductBrandWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const currentProduct = product as ProductWithBrandMetadata;
  const initialHandle = currentProduct.metadata?.brand_handle || "";
  const initialName = currentProduct.metadata?.brand_name || "";
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandHandle, setBrandHandle] = useState(initialHandle);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBrands() {
      try {
        const response = await fetch("/admin/brands", {
          credentials: "include",
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (mounted && Array.isArray(data.brands)) {
          setBrands(data.brands);
        }
      } catch {
        // ignore brand lookup failures in admin widget
      }
    }

    void loadBrands();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.handle === brandHandle),
    [brands, brandHandle],
  );

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch(`/admin/products/${currentProduct.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...(currentProduct.metadata || {}),
            brand_handle: selectedBrand?.handle || "",
            brand_name: selectedBrand?.name || "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await response.json();
      toast.success("Đã lưu thương hiệu");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không lưu được thương hiệu",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Brand</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Chọn thương hiệu cho sản phẩm này.
        </Text>
      </div>
      <div className="space-y-3 px-6 py-4">
        <label className="block space-y-2">
          <Text size="small">Thương hiệu</Text>
          <select
            className="w-full rounded-md border border-ui-border-base bg-ui-bg-base px-3 py-2"
            value={brandHandle}
            onChange={(event) => setBrandHandle(event.target.value)}
          >
            <option value="">Chưa chọn brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.handle}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1">
          <Text size="small">
            Tên brand: {selectedBrand?.name || initialName || "—"}
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            Handle: {selectedBrand?.handle || initialHandle || "—"}
          </Text>
        </div>

        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu brand"}
        </Button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side",
});

export default ProductBrandWidget;
