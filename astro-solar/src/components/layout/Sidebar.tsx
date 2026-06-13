import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Sun,
  Lightbulb,
  Wrench,
  MessageSquare,
  BookOpen,
  Newspaper,
  Calculator,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  { name: 'Báo Giá', href: '/bao-gia', icon: Calculator },
  { name: 'Blog', href: '/blog', icon: Newspaper },
  {
    name: 'Gói combo',
    icon: Package,
    children: [
      { name: 'Combo On-Grid', href: '/on-grid' },
      { name: 'Combo Hybrid', href: '/hybrid-bess' },
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
      { name: 'Mái tôn', href: '/solar-home/mai-ton', soon: true },
      { name: 'Mái ngói', href: '/solar-home/mai-ngoi', soon: true },
      { name: 'Mái bằng', href: '/solar-home/mai-bang', soon: true },
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
            ? 'bg-[#FEF2F2] text-[#D0202A]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`h-5 w-5 ${active ? 'text-[#D0202A]' : 'text-gray-400'}`} />
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
                    ? 'bg-[#FEF2F2] text-[#D0202A] font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#D0202A]' : 'bg-gray-300'}`} />
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
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email ?? '',
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0],
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email ?? '',
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
          {/* App download badges */}
          <div className="pt-3 border-t border-white/30 mt-2 space-y-2">
            <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wider">Tải ứng dụng</p>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors"
            >
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="leading-tight">
                <div className="text-[9px] opacity-70">Download on the</div>
                <div className="text-[12px] font-semibold">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors"
            >
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.65.19.97.07l11.46-6.62-2.5-2.5-9.93 9zm16.52-10.69L17 11.5 14.35 9.3l-10.9-6.3c-.32-.18-.68-.17-.98.01L14.37 14l5.33-5.33c.49.49.49 1.29 0 1.78l-5.63 5.63 5.43-3.14c.6-.35.97-.99.97-1.67s-.37-1.32-.97-1.67l-.8-.53zM3.55.23c-.3-.18-.65-.19-.97-.07L13.73 11.5 3.55.23z"/>
              </svg>
              <div className="leading-tight">
                <div className="text-[9px] opacity-70">GET IT ON</div>
                <div className="text-[12px] font-semibold">Google Play</div>
              </div>
            </a>
          </div>
          {/* User auth */}
          <div className="pt-2">
            {user ? (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#D0202A] flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 truncate">{user.name}</span>
                </div>
                <button onClick={handleLogout} title="Đăng xuất"
                  className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <a href="/login" onClick={onClose}
                className="flex items-center justify-center gap-2 bg-[#D0202A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#B01A22] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </a>
            )}
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
            {/* Collapsed: show only the red EPC mark */}
            {!isExpanded && (
              <span className="w-7 h-7 rounded-md bg-[#D0202A] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-black leading-none">E</span>
              </span>
            )}
            {/* Expanded: show full logo */}
            {isExpanded && (
              <img src="/logo-epcvina-solar.png" alt="EPC Solar" className="h-8 w-auto flex-shrink-0" />
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
                        ? 'bg-[#FEF2F2] text-[#D0202A]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      : 'justify-center'
                  } ${!isExpanded && active ? 'bg-[#FEF2F2] text-[#D0202A]' : ''}`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    active ? 'text-[#D0202A]' : isExpanded ? 'text-gray-400' : 'text-gray-400'
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
                              ? 'bg-[#FEF2F2] text-[#D0202A] font-medium'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#D0202A]' : 'bg-gray-300'}`} />
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
          {/* App download + Phone CTA - desktop */}
          <div className={`pt-3 border-t border-white/30 mt-2 space-y-2 ${isExpanded ? 'px-1' : 'px-0'}`}>
            {isExpanded && (
              <>
                <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wider">Tải ứng dụng</p>
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="leading-tight">
                    <div className="text-[9px] opacity-70">Download on the</div>
                    <div className="text-[12px] font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.65.19.97.07l11.46-6.62-2.5-2.5-9.93 9zm16.52-10.69L17 11.5 14.35 9.3l-10.9-6.3c-.32-.18-.68-.17-.98.01L14.37 14l5.33-5.33c.49.49.49 1.29 0 1.78l-5.63 5.63 5.43-3.14c.6-.35.97-.99.97-1.67s-.37-1.32-.97-1.67l-.8-.53zM3.55.23c-.3-.18-.65-.19-.97-.07L13.73 11.5 3.55.23z"/>
                  </svg>
                  <div className="leading-tight">
                    <div className="text-[9px] opacity-70">GET IT ON</div>
                    <div className="text-[12px] font-semibold">Google Play</div>
                  </div>
                </a>
              </>
            )}
            {!isExpanded && (
              <div className="flex flex-col items-center gap-1.5">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  title="App Store"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  title="Google Play"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.65.19.97.07l11.46-6.62-2.5-2.5-9.93 9zm16.52-10.69L17 11.5 14.35 9.3l-10.9-6.3c-.32-.18-.68-.17-.98.01L14.37 14l5.33-5.33c.49.49.49 1.29 0 1.78l-5.63 5.63 5.43-3.14c.6-.35.97-.99.97-1.67s-.37-1.32-.97-1.67l-.8-.53zM3.55.23c-.3-.18-.65-.19-.97-.07L13.73 11.5 3.55.23z"/>
                  </svg>
                </a>
              </div>
            )}
            {/* User auth */}
            {user ? (
              isExpanded ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#D0202A] flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 truncate">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} title="Đăng xuất"
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogout} title="Đăng xuất"
                  className="w-full flex justify-center py-2 text-gray-400 hover:text-red-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              )
            ) : (
              isExpanded ? (
                <a href="/login"
                  className="flex items-center justify-center gap-2 bg-[#D0202A] text-white rounded-xl py-2.5 px-4 text-sm font-semibold hover:bg-[#B01A22] transition-colors"
                >
                  <LogIn className="h-4 w-4 flex-shrink-0" />
                  <span>Đăng nhập</span>
                </a>
              ) : (
                <a href="/login" title="Đăng nhập"
                  className="w-full flex justify-center py-2 text-gray-500 hover:text-[#D0202A] transition-colors">
                  <LogIn className="h-5 w-5" />
                </a>
              )
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
