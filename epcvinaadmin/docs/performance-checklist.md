# Performance Checklist

## Query
- Avoid `select("*")` on list, detail, and API routes.
- List pages must use `count: "exact"` + `range(start, end)`.
- Detail pages must fetch only fields rendered on screen.
- Prefer `maybeSingle()` or `single()` by id for details.
- Keep joins small and explicit.
- Avoid loading child collections on list screens.

## Pagination
- Use server-side pagination for large tables.
- Keep page size small for admin lists.
- Do not filter large result sets in client code.

## Cache
- Cache reference tables with `unstable_cache`.
- Invalidate tags immediately after CRUD with `revalidateTag`.
- Do not long-cache frequently changing records like orders.

## Index
- Index sort keys used for list ordering.
- Index foreign keys used in filters and joins.
- Add trigram indexes for `ILIKE` search columns.
- Prefer composite indexes that match real query shape.

## Forms
- Do not preload huge dropdowns when async lookup is possible.
- Keep initial form payload small.
- Load large relation options by search endpoint or async lookup.

## Exports
- Keep PDF / Excel routes separate from list views.
- Fetch only fields required to build the export.
- Avoid generating exports during normal page load.

## Review
- Scan for `select("*")`.
- Scan for client-side filtering on large arrays.
- Confirm route data size is proportional to visible UI.
- Verify cache tags and invalidation on CRUD paths.
