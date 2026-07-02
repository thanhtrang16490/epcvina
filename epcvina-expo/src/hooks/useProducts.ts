import { useSupabaseQuery } from './useSupabaseQuery'

export function useProducts(categoryId?: string | null) {
  const filters: Record<string, any> = {}
  
  if (categoryId) {
    filters.category_id = parseInt(categoryId)
  }

  return useSupabaseQuery({
    table: 'products',
    select: '*',
    filters,
    orderBy: { column: 'name', ascending: true },
    cacheKey: categoryId ? `products_${categoryId}` : 'products_all',
  })
}

export function useCategories() {
  return useSupabaseQuery({
    table: 'categories',
    select: '*',
    orderBy: { column: 'name', ascending: true },
    cacheKey: 'categories',
  })
}
