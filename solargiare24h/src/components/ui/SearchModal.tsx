import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Sun, Package, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';

interface SearchItem {
  type: 'product' | 'project' | 'combo' | 'page';
  title: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
}

interface SearchModalProps {
  products: SearchItem[];
  projects: SearchItem[];
  combos: SearchItem[];
  pages: SearchItem[];
}

/**
 * SearchModal Component
 * 
 * Features:
 * - Full-text search with Fuse.js
 * - Search across products, projects, combos, pages
 * - Keyboard shortcuts (Cmd+K, Ctrl+K)
 * - Real-time results
 * - Category filtering
 * - Mobile-responsive
 * - Accessible
 * 
 * Usage:
 * <SearchModal 
 *   products={products}
 *   projects={projects}
 *   combos={combos}
 *   pages={pages}
 * />
 */
export default function SearchModal({ products, projects, combos, pages }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'product' | 'project' | 'combo' | 'page'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize Fuse.js with all items
  const allItems = [...products, ...projects, ...combos, ...pages];
  const fuse = new Fuse(allItems, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.3 },
      { name: 'category', weight: 0.2 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  });

  // Search results
  const results = query.length >= 2
    ? fuse.search(query)
        .map(result => result.item)
        .filter(item => activeTab === 'all' || item.type === activeTab)
        .slice(0, 20)
    : [];

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const tabs = [
    { id: 'all' as const, label: 'Tất cả', count: allItems.length },
    { id: 'product' as const, label: 'Thiết bị', count: products.length },
    { id: 'project' as const, label: 'Dự án', count: projects.length },
    { id: 'combo' as const, label: 'Combo', count: combos.length },
    { id: 'page' as const, label: 'Trang', count: pages.length },
  ];

  const typeIcons = {
    product: <Sun className="w-4 h-4" />,
    project: <FileText className="w-4 h-4" />,
    combo: <Package className="w-4 h-4" />,
    page: <ArrowRight className="w-4 h-4" />,
  };

  const typeColors = {
    product: 'bg-orange-100 text-orange-700',
    project: 'bg-emerald-100 text-emerald-700',
    combo: 'bg-blue-100 text-blue-700',
    page: 'bg-purple-100 text-purple-700',
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
        aria-label="Tìm kiếm"
      >
        <Search className="w-5 h-5" />
        <span className="hidden lg:inline text-sm">Tìm kiếm...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/20 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32 px-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Tìm kiếm"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm thiết bị, dự án, combo, trang..."
                className="flex-1 text-lg outline-none placeholder:text-gray-400"
                autoComplete="off"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6 py-3 border-b border-gray-100 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs opacity-75">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.length < 2 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nhập ít nhất 2 ký tự để tìm kiếm</p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-medium mb-1">Không tìm thấy kết quả</p>
                  <p className="text-sm">Thử từ khóa khác hoặc liên hệ 0947 776 662</p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      {/* Type Badge */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${typeColors[item.type]}`}>
                        {typeIcons[item.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                        {item.category && (
                          <span className="inline-block mt-1 text-xs text-gray-500">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
              <span>Nhấn <kbd className="px-1.5 py-0.5 bg-white rounded border">Esc</kbd> để đóng</span>
              <span>{results.length} kết quả</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
