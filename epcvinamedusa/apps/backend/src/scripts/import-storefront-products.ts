import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils";
import { createProductCategoriesWorkflow, createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { createRequire } from "module";

type ImportedCategory = { id: string; name: string };

function toHandle(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function importStorefrontProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const require = createRequire(import.meta.url);
  const jiti = require("jiti")(import.meta.url);
  const { localProducts } = jiti("../../../storefront/src/data/products.ts");

  logger.info("Loading existing product categories...");
  const existingCategories = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });

  const categoryMap = new Map<string, string>();
  const categoryNames = Array.from(new Set(localProducts.map((product) => product.category)));

  const missingCategoryNames = categoryNames.filter(
    (name) => !existingCategories.data.some((category: any) => category.name === name)
  );

  if (missingCategoryNames.length > 0) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategoryNames.map((name, index) => ({
          name,
          is_active: true,
          description: name,
          handle: toHandle(name) || `category-${index + 1}`,
        })),
      },
    });

    result.forEach((category: any) => {
      categoryMap.set(category.name, category.id);
    });
  }

  existingCategories.data.forEach((category: any) => {
    categoryMap.set(category.name, category.id);
  });

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  });
  const shippingProfile = shippingProfiles[0];

  if (!shippingProfile) {
    throw new Error("No shipping profile found. Run db:setup first.");
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultSalesChannel = salesChannels[0];

  if (!defaultSalesChannel) {
    throw new Error("No sales channel found. Run db:setup first.");
  }

  const existingProducts = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });
  const existingHandles = new Set(existingProducts.data.map((product: any) => product.handle));

  const productsToCreate = localProducts
    .filter((product) => !existingHandles.has(product.slug))
    .map((product) => ({
      title: product.name,
      description: product.description,
      handle: product.slug,
      status: ProductStatus.PUBLISHED,
      discountable: true,
      shipping_profile_id: shippingProfile.id,
      categories: categoryMap.has(product.category)
        ? [{ id: categoryMap.get(product.category)! }]
        : [],
      thumbnail: product.main_image || undefined,
      images: product.main_image
        ? [{ url: product.main_image }]
        : [],
      options: [
        {
          title: "Default option",
          values: ["Default option value"],
        },
      ],
      variants: [
        {
          title: "Default variant",
          sku: product.id.toUpperCase(),
          options: {
            "Default option": "Default option value",
          },
          prices: [
            {
              amount: product.unit_price || 0,
              currency_code: "usd",
            },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        brand_name: product.brand,
        category: product.category,
        model: product.model,
        specifications: product.specifications,
        features: product.features,
        warranty_years: product.warranty_years,
        product_type: product.product_type,
        phase: product.phase,
        voltage: product.voltage,
        source: "epcvina-local-import",
      },
    }));

  if (productsToCreate.length === 0) {
    logger.info("No new products to import.");
    return;
  }

  logger.info(`Importing ${productsToCreate.length} products into Medusa...`);
  await createProductsWorkflow(container).run({
    input: {
      products: productsToCreate,
    },
  });

  logger.info("Product import completed successfully.");
}
