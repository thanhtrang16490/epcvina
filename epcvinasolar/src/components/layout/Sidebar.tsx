import { useState, useEffect } from 'react';
import {
  Package,
  Sun,
  Lightbulb,
  Wrench,
  MessageCircle,
  BookOpen,
  Newspaper,
  LogOut,
  User,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { getLocaleFromPathname, messages, type Locale } from '../../i18n/messages';
import { getLocalePath } from '../../i18n/routes';
// Supabase is loaded dynamically to avoid adding it to every page's client bundle.

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pathname?: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
  children?: { name: string; href: string; soon?: boolean }[];
}

function buildMenuItems(locale: Locale): MenuItem[] {
  const vi = locale === 'vi';
  const text = {
    combo: vi ? 'Combo' : locale === 'en' ? 'Combos' : locale === 'zh' ? '组合方案' : locale === 'ja' ? 'コンボ' : '콤보',
    allCombo: vi ? 'Tất cả Combo' : locale === 'en' ? 'All combos' : locale === 'zh' ? '全部方案' : locale === 'ja' ? 'すべてのコンボ' : '전체 콤보',
    onGridCombo: vi ? 'Combo On-Grid' : locale === 'en' ? 'On-Grid combo' : locale === 'zh' ? '并网方案' : locale === 'ja' ? '系統連系コンボ' : '계통연계 콤보',
    hybridCombo: vi ? 'Combo Hybrid' : locale === 'en' ? 'Hybrid combo' : locale === 'zh' ? '混合方案' : locale === 'ja' ? 'ハイブリッドコンボ' : '하이브리드 콤보',
    equipment: vi ? 'Thiết bị' : locale === 'en' ? 'Equipment' : locale === 'zh' ? '设备' : locale === 'ja' ? '機器' : '장비',
    accessories: vi ? 'Phụ kiện' : locale === 'en' ? 'Accessories' : locale === 'zh' ? '配件' : locale === 'ja' ? 'アクセサリー' : '액세서리',
    application: vi ? 'Giải pháp ứng dụng' : locale === 'en' ? 'Applications' : locale === 'zh' ? '应用场景' : locale === 'ja' ? '用途' : '적용 분야',
    brand: vi ? 'Nhãn hàng' : locale === 'en' ? 'Brands' : locale === 'zh' ? '品牌' : locale === 'ja' ? 'ブランド' : '브랜드',
    project: vi ? 'Dự án' : locale === 'en' ? 'Projects' : locale === 'zh' ? '项目' : locale === 'ja' ? 'プロジェクト' : '프로젝트',
    blog: vi ? 'Blog' : locale === 'en' ? 'Blog' : locale === 'zh' ? '新闻' : locale === 'ja' ? 'ブログ' : '블로그',
    about: vi ? 'Về chúng tôi' : locale === 'en' ? 'About us' : locale === 'zh' ? '关于我们' : locale === 'ja' ? '私たちについて' : '회사 소개',
    careers: vi ? 'Tuyển dụng' : locale === 'en' ? 'Careers' : locale === 'zh' ? '招聘' : locale === 'ja' ? '採用' : '채용',
    faq: vi ? 'Hỏi đáp' : locale === 'en' ? 'FAQ' : locale === 'zh' ? '问答' : locale === 'ja' ? 'よくある質問' : '문의',
    guide: vi ? 'Hướng dẫn' : locale === 'en' ? 'Guide' : locale === 'zh' ? '指南' : locale === 'ja' ? 'ガイド' : '가이드',
  };

  return [
    { name: text.combo, icon: Package, children: [
      { name: text.allCombo, href: getLocalePath('/goi-combo', locale) },
      { name: text.onGridCombo, href: getLocalePath('/solar-home/on-grid', locale) },
      { name: text.hybridCombo, href: getLocalePath('/solar-home/hybrid', locale) },
    ]},
    { name: text.equipment, icon: Sun, children: [
      { name: vi ? 'Tấm quang năng' : locale === 'en' ? 'PV modules' : locale === 'zh' ? '光伏组件' : locale === 'ja' ? 'PVモジュール' : '태양광 모듈', href: getLocalePath('/thiet-bi/panel', locale) },
      { name: vi ? 'Biến tần On-Grid' : locale === 'en' ? 'On-grid inverter' : locale === 'zh' ? '并网逆变器' : locale === 'ja' ? '系統連系インバータ' : '온그리드 인버터', href: getLocalePath('/thiet-bi/on-grid-inverter', locale) },
      { name: vi ? 'Biến tần Hybrid' : locale === 'en' ? 'Hybrid inverter' : locale === 'zh' ? '混合逆变器' : locale === 'ja' ? 'ハイブリッドインバータ' : '하이브리드 인버터', href: getLocalePath('/thiet-bi/hybrid-inverter', locale) },
      { name: vi ? 'Pin lưu trữ áp cao' : locale === 'en' ? 'High-voltage battery' : locale === 'zh' ? '高压电池' : locale === 'ja' ? '高圧バッテリー' : '고전압 배터리', href: getLocalePath('/thiet-bi/hv-battery', locale) },
      { name: vi ? 'Pin lưu trữ áp thấp' : locale === 'en' ? 'Low-voltage battery' : locale === 'zh' ? '低压电池' : locale === 'ja' ? '低圧バッテリー' : '저전압 배터리', href: getLocalePath('/thiet-bi/lv-battery', locale) },
    ]},
    { name: text.accessories, icon: Wrench, children: [
      { name: vi ? 'Hệ khung nhôm' : locale === 'en' ? 'Mounting system' : locale === 'zh' ? '支架系统' : locale === 'ja' ? '架台システム' : '거치 시스템', href: getLocalePath('/thiet-bi/mounting', locale) },
      { name: vi ? 'Hệ dây điện' : locale === 'en' ? 'Wiring' : locale === 'zh' ? '线缆' : locale === 'ja' ? '配線' : '배선', href: getLocalePath('/thiet-bi/wiring', locale) },
      { name: vi ? 'Tủ điện' : locale === 'en' ? 'Electrical cabinet' : locale === 'zh' ? '电柜' : locale === 'ja' ? '盤' : '배전함', href: getLocalePath('/thiet-bi/cabinet', locale) },
      { name: vi ? 'Hệ tiếp địa' : locale === 'en' ? 'Grounding' : locale === 'zh' ? '接地' : locale === 'ja' ? '接地' : '접지', href: getLocalePath('/thiet-bi/grounding', locale) },
    ]},
    { name: vi ? 'Giải pháp thi công' : locale === 'en' ? 'Installation solutions' : locale === 'zh' ? '施工方案' : locale === 'ja' ? '施工ソリューション' : '시공 솔루션', icon: Lightbulb, children: [
      { name: vi ? 'Mái tôn' : locale === 'en' ? 'Metal roof' : locale === 'zh' ? '彩钢屋顶' : locale === 'ja' ? '折板屋根' : '철판 지붕', href: getLocalePath('/giai-phap-thi-cong-mai-ton', locale) },
      { name: vi ? 'Mái ngói' : locale === 'en' ? 'Tile roof' : locale === 'zh' ? '瓦屋顶' : locale === 'ja' ? '瓦屋根' : '기와 지붕', href: getLocalePath('/giai-phap-thi-cong-mai-ngoi', locale) },
      { name: vi ? 'Mái bằng' : locale === 'en' ? 'Flat roof' : locale === 'zh' ? '平屋顶' : locale === 'ja' ? 'フラット屋根' : '평지붕', href: getLocalePath('/giai-phap-thi-cong-mai-bang', locale) },
    ]},
    { name: text.brand, icon: Sun, children: [
      { name: vi ? 'Tất cả nhãn hàng' : locale === 'en' ? 'All brands' : locale === 'zh' ? '全部品牌' : locale === 'ja' ? '全ブランド' : '전체 브랜드', href: getLocalePath('/nhan-hang', locale) },
      { name: 'AIKO', href: getLocalePath('/nhan-hang/aiko', locale) },
      { name: 'Huawei', href: getLocalePath('/nhan-hang/huawei', locale) },
      { name: 'Growatt', href: getLocalePath('/nhan-hang/growatt', locale) },
      { name: 'Pylontech', href: getLocalePath('/nhan-hang/pylontech', locale) },
      { name: 'Canadian Solar', href: getLocalePath('/nhan-hang/canadian-solar', locale) },
      { name: 'JA Solar', href: getLocalePath('/nhan-hang/ja-solar', locale) },
      { name: 'Longi', href: getLocalePath('/nhan-hang/longi', locale) },
      { name: 'Sharp', href: getLocalePath('/nhan-hang/sharp', locale) },
      { name: 'Sungrow', href: getLocalePath('/nhan-hang/sungrow', locale) },
      { name: 'Deye', href: getLocalePath('/nhan-hang/deye', locale) },
      { name: 'SAJ', href: getLocalePath('/nhan-hang/saj', locale) },
      { name: 'CFE', href: getLocalePath('/nhan-hang/cfe', locale) },
      { name: 'Genix Green', href: getLocalePath('/nhan-hang/genix-green', locale) },
      { name: 'Hope Trek', href: getLocalePath('/nhan-hang/hope-trek', locale) },
      { name: 'Leader', href: getLocalePath('/nhan-hang/leader', locale) },
      { name: 'QUANG MINH TECH', href: getLocalePath('/nhan-hang/quang-minh-tech', locale) },
    ]},
    { name: text.application, icon: Lightbulb, children: [
      { name: vi ? 'Điện công nghiệp' : locale === 'en' ? 'Industrial power' : locale === 'zh' ? '工业用电' : locale === 'ja' ? '産業用電力' : '산업용 전력', href: getLocalePath('/ung-dung/dien-cong-nghiep', locale) },
      { name: vi ? 'Điện dân dụng' : locale === 'en' ? 'Residential power' : locale === 'zh' ? '家庭用电' : locale === 'ja' ? '家庭用電力' : '가정용 전력', href: getLocalePath('/ung-dung/dien-dan-dung', locale) },
      { name: vi ? 'Điện sản xuất nông nghiệp' : locale === 'en' ? 'Agriculture' : locale === 'zh' ? '农业用电' : locale === 'ja' ? '農業' : '농업', href: getLocalePath('/ung-dung/dien-nong-nghiep', locale) },
    ]},
    { name: text.project, href: getLocalePath('/du-an', locale), icon: FileText },
    { name: text.blog, href: getLocalePath('/tin-tuc', locale), icon: Newspaper },
    { name: text.about, href: getLocalePath('/ve-chung-toi', locale), icon: User },
    { name: text.careers, href: getLocalePath('/tuyen-dung', locale), icon: Users },
    { name: text.faq, href: getLocalePath('/hoi-dap', locale), icon: MessageCircle },
    { name: text.guide, icon: BookOpen, children: [
      { name: vi ? 'Hướng dẫn sử dụng' : locale === 'en' ? 'User guide' : locale === 'zh' ? '使用指南' : locale === 'ja' ? '使い方ガイド' : '사용 가이드', href: getLocalePath('/huong-dan-su-dung', locale) },
      { name: vi ? 'Bảo trì & Xử lý sự cố' : locale === 'en' ? 'Maintenance & troubleshooting' : locale === 'zh' ? '维护与故障排除' : locale === 'ja' ? '保守とトラブル対応' : '유지보수 및 문제 해결', href: getLocalePath('/bao-tri', locale) },
      { name: vi ? 'Quy trình thi công' : locale === 'en' ? 'Installation process' : locale === 'zh' ? '施工流程' : locale === 'ja' ? '施工プロセス' : '시공 절차', href: getLocalePath('/quy-trinh-thi-cong', locale) },
    ]},
  ];
}

function getSoonText(locale: Locale) {
  return locale === 'en'
    ? 'Coming soon'
    : locale === 'zh'
      ? '即将推出'
      : locale === 'ja'
        ? '近日公開'
        : locale === 'ko'
          ? '출시 예정'
          : 'Sắp ra mắt';
}

function MenuGroup({ 
  item, 
  isExpanded, 
  isSidebarExpanded,
  onToggle, 
  onHover,
  isActive,
  onClose 
}: { 
  item: MenuItem; 
  isExpanded: boolean; 
  isSidebarExpanded: boolean;
  onToggle: () => void;
  onHover: () => void;
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
            ? 'bg-[#FEF2F2] text-[#DC2626]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`h-5 w-5 ${active ? 'text-[#DC2626]' : 'text-gray-400'}`} />
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
        onMouseEnter={isSidebarExpanded ? onHover : undefined}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
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
      {item.children && (
        <div
          className={`ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-4 overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1 pointer-events-none'
          }`}
        >
          {item.children.map((child) => {
            const active = isActive(child.href);
            if (child.soon) {
              return (
                <div
                  key={child.href}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                  title={getSoonText(locale)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-gray-400">{child.name}</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {getSoonText(locale)}
                  </span>
                </div>
              );
            }
            return (
              <a
                key={child.href}
                href={child.href}
                onClick={onClose}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out ${
                            active
                              ? 'bg-[#FEF2F2] text-[#DC2626] font-medium'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#DC2626]' : 'bg-gray-300'}`} />
                {child.name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, pathname = '/' }: SidebarProps) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale];
  const menuItems = buildMenuItems(locale);
  const isCalculatorPage = pathname.startsWith('/calculator');
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  // Delayed mobile content: keep DOM nodes during slide-out, remove after animation
  // Render menu content in SSR so the drawer remains usable while the shell hydrates.
  const [showMobileContent, setShowMobileContent] = useState(true);
  useEffect(() => {
    if (isOpen) {
      setShowMobileContent(true);
    } else {
      const timer = setTimeout(() => setShowMobileContent(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auth removed - Supabase no longer used
  const handleLogout = async () => {
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

  const openGroup = (name: string) => {
    setExpandedGroups(new Set([name]));
  };

  return (
    <>
      {/* Mobile Overlay - only on < md (phones) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar - slide-out drawer for phones only */}
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
            <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-8 w-auto" loading="lazy" />
          </a>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-600 hover:text-gray-900" aria-label={t.header.toggleMenu}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative z-10 p-3 space-y-1 overflow-y-auto h-[calc(100vh-60px)] flex flex-col">
          {showMobileContent && (<>
          <div className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <MenuGroup
              key={item.name}
              item={item}
              isExpanded={expandedGroups.has(item.name) || (item.children?.some(c => isActive(c.href)) ?? false)}
              isSidebarExpanded={isExpanded}
              onToggle={() => toggleGroup(item.name)}
              onHover={() => openGroup(item.name)}
              isActive={isActive}
              onClose={onClose}
            />
          ))}
          </div>
          {!isCalculatorPage && (
            <>
              {/* App download badges */}
              <div className="pt-3 border-t border-white/30 mt-2 space-y-2">
                <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wider">
                  {locale === 'en' ? 'Download app' : locale === 'zh' ? '下载应用' : locale === 'ja' ? 'アプリをダウンロード' : locale === 'ko' ? '앱 다운로드' : 'Tải ứng dụng'}
                </p>
                <a
                  href="/ung-dung/app-store"

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
                  href="/ung-dung/chplay"

                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"></path>
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
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700 truncate">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} title={locale === 'en' ? 'Logout' : locale === 'zh' ? '退出' : locale === 'ja' ? 'ログアウト' : locale === 'ko' ? '로그아웃' : 'Đăng xuất'}
                      className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
          </>)}
        </nav>
      </aside>

      {/* Desktop/Tablet Sidebar - persistent, expand on hover (desktop) or tap (tablet) */}
      <aside 
        className="hidden lg:block group/sidebar fixed top-0 left-0 h-screen z-[55] overflow-hidden transition-[width] duration-300 ease-in-out"
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
            {/* Collapsed: show logo favicon */}
            {!isExpanded && (
              <img src="/logo-favicon.svg" alt="EPCVINA Solar" className="w-7 h-7 flex-shrink-0" loading="lazy" />
            )}
            {/* Expanded: show full logo */}
            {isExpanded && (
              <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-8 w-auto flex-shrink-0" loading="lazy" />
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
                        ? 'bg-[#FEF2F2] text-[#DC2626]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      : 'justify-center'
                  } ${!isExpanded && active ? 'bg-[#FEF2F2] text-[#DC2626]' : ''}`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    active ? 'text-[#DC2626]' : isExpanded ? 'text-gray-400' : 'text-gray-400'
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
                  onMouseEnter={isExpanded ? () => openGroup(item.name) : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
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
                {item.children && (
                  <div
                    className={`ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-4 overflow-hidden transition-all duration-300 ease-out ${
                      isExpanded && expandedGroups.has(item.name) ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                  >
                    {item.children.map((child) => {
                      const active = isActive(child.href);
                      if (child.soon) {
                        return (
                          <div
                            key={child.href}
                            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                            title={getSoonText(locale)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              <span className="text-gray-400">{child.name}</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              {getSoonText(locale)}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <a
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out ${
                            active
                              ? 'bg-[#FEF2F2] text-[#DC2626] font-medium'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#DC2626]' : 'bg-gray-300'}`} />
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
                <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wider">
                  {locale === 'en' ? 'Download app' : locale === 'zh' ? '下载应用' : locale === 'ja' ? 'アプリをダウンロード' : locale === 'ko' ? '앱 다운로드' : 'Tải ứng dụng'}
                </p>
                <a
                  href="/ung-dung/app-store"

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
                  href="/ung-dung/chplay"

                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"></path>
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
                <a href="/ung-dung/app-store"
                  className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  title="App Store"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a href="/ung-dung/chplay"
                  className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  title="Google Play"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"></path>
                  </svg>
                </a>
              </div>
            )}
            {/* User auth */}
            {user ? (
              isExpanded ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 truncate">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} title={locale === 'en' ? 'Logout' : locale === 'zh' ? '退出' : locale === 'ja' ? 'ログアウト' : locale === 'ko' ? '로그아웃' : 'Đăng xuất'}
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogout} title={locale === 'en' ? 'Logout' : locale === 'zh' ? '退出' : locale === 'ja' ? 'ログアウト' : locale === 'ko' ? '로그아웃' : 'Đăng xuất'}
                  className="w-full flex justify-center py-2 text-gray-400 hover:text-red-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              )
            ) : (
              null
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
