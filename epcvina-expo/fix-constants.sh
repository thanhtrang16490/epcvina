#!/bin/bash

# Fix constants in dashboard components

files=(
  "src/components/dashboard/DashboardStats.tsx"
  "src/components/dashboard/QuickActions.tsx"
  "src/components/dashboard/RecentOrders.tsx"
  "src/components/dashboard/TimeRangeFilter.tsx"
)

for file in "${files[@]}"; do
  echo "Fixing $file..."
  
  # Fix SPACING
  sed -i '' 's/SPACING\.xs/SPACING.TINY/g' "$file"
  sed -i '' 's/SPACING\.sm/SPACING.SMALL/g' "$file"
  sed -i '' 's/SPACING\.md/SPACING.MEDIUM/g' "$file"
  sed -i '' 's/SPACING\.lg/SPACING.LARGE/g' "$file"
  sed -i '' 's/SPACING\.xl/SPACING.XLARGE/g' "$file"
  
  # Fix RADIUS
  sed -i '' 's/RADIUS\.sm/RADIUS.SMALL/g' "$file"
  sed -i '' 's/RADIUS\.md/RADIUS.MEDIUM/g' "$file"
  sed -i '' 's/RADIUS\.lg/RADIUS.LARGE/g' "$file"
  sed -i '' 's/RADIUS\.xl/RADIUS.XLARGE/g' "$file"
  sed -i '' 's/RADIUS\.full/RADIUS.ROUND/g' "$file"
done

echo "Done!"
