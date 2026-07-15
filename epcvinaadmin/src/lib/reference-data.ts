import { unstable_cache } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type MinimalRow = Record<string, any>;

function createCachedListFetcher<T extends MinimalRow>(cacheKey: string, select: string, orderBy = "sort_order") {
  return unstable_cache(
    async () => {
      const supabase = createSupabaseAdminClient();
      if (!supabase) return [] as T[];
      const { data } = await supabase.from(cacheKey).select(select).order(orderBy, { ascending: true });
      return (data ?? []) as T[];
    },
    [cacheKey, select, orderBy],
    { revalidate: 300, tags: [cacheKey] },
  );
}

export const getCachedBrands = createCachedListFetcher("brands", "id, name, slug, sort_order");
export const getCachedProductCategories = createCachedListFetcher("product_categories", "id, name, slug, parent_id, sort_order");
export const getCachedComboCategories = createCachedListFetcher("combo_categories", "id, name, slug, sort_order");
export const getCachedDiscounts = createCachedListFetcher("discounts", "id, name, slug, discount_type, value, description, is_active, sort_order");
export const getCachedPaymentPolicies = createCachedListFetcher("payment_policies", "id, name, slug, policy_code, deposit_percent, delivery_percent, acceptance_percent, description, is_active, sort_order");

export const referenceDataTags = {
  brands: "brands",
  productCategories: "product_categories",
  comboCategories: "combo_categories",
  discounts: "discounts",
  paymentPolicies: "payment_policies",
  products: "products",
  combos: "combos",
} as const;
