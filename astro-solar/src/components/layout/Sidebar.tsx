import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Sun,
  Lightbulb,
  Building,
  Factory,
  Wrench,
  MessageSquare,
  BookOpen,
  Phone,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
  children?: { name: string; href: string; soon?: boolean }[];
}

const menuItems: MenuItem[] = [
  { name: 'Trang chủ', href: '/', icon: LayoutDashboard },
  {
    name: 'Gói combo',
    icon: Package,
    children: [
      { name: 'Combo On-Grid', href: '/on-grid' },
      { name: 'Combo Hybrid', href: '/hybrid' },
    ],
  },
  {
    name: 'Thiết bị',
    icon: Sun,
    children: [
      { name: 'Tấm quang năng', href: '/equipment/panel' },
      { name: 'Biến tần On-Grid', href: '/equipment/on-grid-inverter' },
      { name: 'Biến tần Hybrid', href: '/equipment/hybrid-inverter' },
      { name: 'Pin lưu trữ áp cao', href: '/equipment/hv-battery' },
      { name: 'Pin lưu trữ áp thấp', href: '/equipment/lv-battery' },
    ],
  },
  {
    name: 'Phụ kiện',
    icon: Wrench,
    children: [
      { name: 'Hệ khung nhôm', href: '/equipment/mounting' },
      { name: 'Hệ dây điện', href: '/equipment/wiring' },
      { name: 'Tủ điện', href: '/equipment/cabinet' },
      { name: 'Hệ tiếp địa', href: '/equipment/grounding' },
    ],
  },
  {
    name: 'Giải pháp mái',
    icon: Lightbulb,
    children: [
      { name: 'Mái tôn', href: '/solutions/mai-ton', soon: true },
      { name: 'Mái ngói', href: '/solutions/mai-ngoi', soon: true },
      { name: 'Mái bằng', href: '/solutions/mai-bang', soon: true },
    ],
  },
  {
    name: 'Dự án',
    icon: Building,
    children: [
      { name: 'Văn phòng', href: '/applications/van-phong' },
      { name: 'Nhà xưởng', href: '/applications/nha-xuong' },
      { name: 'Trang trại', href: '/applications/trang-trai' },
      { name: 'Khách sạn', href: '/applications/khach-san' },
      { name: 'Nhà hàng', href: '/applications/nha-hang' },
    ],
  },
  {
    name: 'Hỏi đáp',
    icon: MessageSquare,
    children: [
      { name: 'Câu hỏi thường gặp', href: '/faq', soon: true },
      { name: 'Chính sách bảo hành', href: '/warranty', soon: true },
      { name: 'Đánh giá khách hàng', href: '/reviews', soon: true },
    ],
  },
  {
    name: 'Hướng dẫn',
    icon: BookOpen,
    children: [
      { name: 'Hướng dẫn sử dụng', href: '/guides/user-manual', soon: true },
      { name: 'Bảo trì & Xử lý sự cố', href: '/guides/maintenance', soon: true },
      { name: 'Video hướng dẫn', href: '/guides/videos', soon: true },
    ],
  },
];

function MenuGroup({ 
  item, 
  isExpanded, 
  onToggle, 
  isActive,
  onClose 
}: { 
  item: MenuItem; 
  isExpanded: boolean; 
  onToggle: () => void;
  isActive: (href: string) => boolean;
  onClose: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (!hasChildren && item.href) {
    // Simple link item
    const active = isActive(item.href);
    return (
      <a
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
          active
            ? 'bg-[#FFF4E8] text-[#F5831F]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`h-5 w-5 ${active ? 'text-[#F5831F]' : 'text-gray-400'}`} />
        {item.name}
      </a>
    );
  }

  // Expandable group
  const hasActiveChild = item.children?.some(child => isActive(child.href));
  
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
          hasActiveChild
            ? 'text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-400" />
          {item.name}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isExpanded && item.children && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-4">
          {item.children.map((child) => {
            const active = isActive(child.href);
            if (child.soon) {
              return (
                <div
                  key={child.href}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                  title="Sắp ra mắt"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-400">{child.name}</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Sắp ra mắt
                  </span>
                </div>
              );
            }
            return (
              <a
                key={child.href}
                href={child.href}
                onClick={onClose}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                  active
                    ? 'bg-[#FFF4E8] text-[#F5831F] font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#F5831F]' : 'bg-gray-300'}`} />
                {child.name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Only expand the group that contains the current active item
    const activeItem = menuItems.find(item => 
      item.children?.some(child => isActive(child.href))
    );
    return activeItem ? new Set([activeItem.name]) : new Set();
  });

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => {
      // If clicking on already expanded group, collapse it
      if (prev.has(name)) {
        return new Set();
      }
      // Otherwise, collapse all others and expand this one
      return new Set([name]);
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[280px]
          bg-white/70 backdrop-blur-2xl
          border-r border-white/40
          shadow-[4px_0_32px_rgba(0,0,0,0.10)]
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mirror reflection gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20 pointer-events-none z-0" />

        {/* Header with logo */}
        <div className="relative z-10 flex items-center justify-between px-4 h-14 border-b border-white/30">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo-epcvina-solar.png" alt="EPC Solar" className="h-8 w-auto" />
          </a>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-600 hover:text-gray-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative z-10 p-3 space-y-1 overflow-y-auto h-[calc(100vh-60px)] flex flex-col">
          <div className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <MenuGroup
              key={item.name}
              item={item}
              isExpanded={expandedGroups.has(item.name) || (item.children?.some(c => isActive(c.href)) ?? false)}
              onToggle={() => toggleGroup(item.name)}
              isActive={isActive}
              onClose={onClose}
            />
          ))}
          </div>
          {/* Phone CTA */}
          <div className="pt-3 border-t border-white/30 mt-2">
            <a
              href="tel:0988446113"
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-[#F5831F] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#E0721A] transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>0988 446 113</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Desktop Sidebar - Expandable on Hover */}
      <aside 
        className="hidden lg:block fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          width: isExpanded ? '280px' : '64px',
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.40)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Mirror reflection gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20 pointer-events-none z-0" />
        {/* Logo */}
        <div className={`relative z-10 h-16 flex items-center border-b border-white/30 transition-all duration-300 ${
          isExpanded ? 'px-6 justify-start' : 'px-0 justify-center'
        }`}>
          <a href="/" className="flex items-center">
            <img src="/logo-epcvina-solar.png" alt="EPC Solar" className="h-8 w-auto flex-shrink-0" />
            {isExpanded && (
              <span className="text-xl font-semibold text-gray-900 ml-3 whitespace-nowrap opacity-100 transition-opacity duration-300">
                EPC Solar
              </span>
            )}
          </a>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 p-2 space-y-1 overflow-y-auto h-[calc(100vh-64px)] scrollbar-hide flex flex-col">
          <div className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const hasActiveChild = item.children?.some(child => isActive(child.href));
            
            if (!hasChildren && item.href) {
              // Simple link item
              const active = isActive(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isExpanded
                      ? active
                        ? 'bg-[#FFF4E8] text-[#F5831F]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      : 'justify-center'
                  } ${!isExpanded && active ? 'bg-[#FFF4E8] text-[#F5831F]' : ''}`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    active ? 'text-[#F5831F]' : isExpanded ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  {isExpanded && <span>{item.name}</span>}
                </a>
              );
            }
            
            // Expandable group
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isExpanded
                      ? hasActiveChild
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      : 'justify-center'
                  }`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className={hasActiveChild ? 'text-gray-900' : ''}>{item.name}</span>
                      <span className="ml-auto">
                        {expandedGroups.has(item.name) ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </span>
                    </>
                  )}
                </button>
                {isExpanded && expandedGroups.has(item.name) && item.children && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-4">
                    {item.children.map((child) => {
                      const active = isActive(child.href);
                      if (child.soon) {
                        return (
                          <div
                            key={child.href}
                            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                            title="Sắp ra mắt"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              <span className="text-gray-400">{child.name}</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              Sắp ra mắt
                            </span>
                          </div>
                        );
                      }
                      return (
                        <a
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            active
                              ? 'bg-[#FFF4E8] text-[#F5831F] font-medium'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#F5831F]' : 'bg-gray-300'}`} />
                          {child.name}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          </div>
          {/* Phone CTA - desktop */}
          <div className={`pt-3 border-t border-white/30 mt-2 ${isExpanded ? 'px-1' : 'px-0'}`}>
            <a
              href="tel:0988446113"
              className={`flex items-center gap-2 bg-[#F5831F] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#E0721A] transition-colors ${
                isExpanded ? 'justify-center px-4' : 'justify-center px-0'
              }`}
              title={!isExpanded ? '0988 446 113' : undefined}
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              {isExpanded && <span>0988 446 113</span>}
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
