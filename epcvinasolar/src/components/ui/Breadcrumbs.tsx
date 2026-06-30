import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component
 * 
 * Features:
 * - SEO-friendly with Schema.org markup
 * - Accessible navigation
 * - Responsive design
 * - Home icon support
 * - Clickable links for all items except current
 * 
 * Usage:
 * <Breadcrumbs items={[
 *   { name: 'Trang chủ', url: '/' },
 *   { name: 'Thiết bị', url: '/thiet-bi' },
 *   { name: 'Tấm pin năng lượng mặt trời' }
 * ]} />
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Add home if not present
  const breadcrumbs = items[0]?.url === '/' ? items : [{ name: 'Trang chủ', url: '/' }, ...items];

  return (
    <nav 
      className={`bg-white border-b border-gray-200 ${className}`}
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol 
          className="flex items-center space-x-2 text-sm"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li 
                key={index}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" aria-hidden="true" />
                )}
                
                {isLast ? (
                  // Current page (not clickable)
                  <span 
                    className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none"
                    aria-current="page"
                    itemProp="name"
                  >
                    {index === 0 ? (
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {item.name}
                      </span>
                    ) : (
                      item.name
                    )}
                  </span>
                ) : (
                  // Link to page
                  <a
                    href={item.url || '#'}
                    className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
                    itemProp="item"
                  >
                    <span itemProp="name">
                      {index === 0 ? (
                        <span className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          {item.name}
                        </span>
                      ) : (
                        item.name
                      )}
                    </span>
                    <meta itemProp="position" content={String(index + 1)} />
                  </a>
                )}
                
                {/* Position metadata for current page */}
                {isLast && (
                  <meta itemProp="position" content={String(index + 1)} />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
