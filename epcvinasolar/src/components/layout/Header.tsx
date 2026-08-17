import { CaretLeft, List } from '@phosphor-icons/react';
import { useScrollContext } from './DashboardShell';
import { getLocaleFromPathname, messages } from '../../i18n/messages';

interface HeaderProps {
  onMenuClick?: () => void;
  isHidden?: boolean;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuClick, isHidden, isMenuOpen }: HeaderProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const navigateTo = (path: string) => { window.location.href = path; };
  const { scrollY } = useScrollContext();
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale];
  
  const isHome = pathname === '/';
  const isDetailPage = pathname.includes('/combos/') && pathname !== '/combos';
  const isTop = scrollY <= 10;
  const isDarkTheme = isTop;
  const iconColor = 'text-gray-800';
  const logoSrc = '/logo-epcvina-solar.png';

  return (
    <>
      {/* Mobile Header - only on phones and tablets (< lg). Desktop uses sidebar instead. */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-40 border-b transition-transform duration-300 will-change-transform ${
        'bg-white/90 backdrop-blur-md border-white/50 shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
      } ${
        isHidden || isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="flex items-center gap-2 px-3 sm:px-4 h-14">
          {/* Left - Hamburger or Back */}
          {isDetailPage ? (
            <button 
              onClick={() => navigateTo('/')}
              className={`p-2 -ml-2 ${iconColor}`}
              aria-label="Quay lại trang chủ"
            >
              <CaretLeft className="h-6 w-6" />
            </button>
          ) : (
            <button 
              onClick={onMenuClick}
              className={`p-2 -ml-2 ${iconColor}`}
              aria-label="Mở menu"
            >
              <List className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src={logoSrc}
              alt="EPCVINA Solar"
              width={1024}
              height={159}
              className="h-6 w-auto sm:h-7"
            />
          </a>

          <a
            href="/calculator"
            className="ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] sm:px-3.5 sm:py-2 sm:text-sm"
          >
            {t.nav.quote}
          </a>

        </div>
      </header>
    </>
  );
}
