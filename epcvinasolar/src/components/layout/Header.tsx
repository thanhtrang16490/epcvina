import { CaretLeft, List } from '@phosphor-icons/react';
import { useScrollContext } from './DashboardShell';

interface HeaderProps {
  onMenuClick?: () => void;
  isHidden?: boolean;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuClick, isHidden, isMenuOpen }: HeaderProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const navigateTo = (path: string) => { window.location.href = path; };
  const { scrollY } = useScrollContext();
  
  const isHome = pathname === '/';
  const isDetailPage = pathname.includes('/combos/') && pathname !== '/combos';
  const isTop = scrollY <= 10;
  const isDarkTheme = isTop;
  const iconColor = isDarkTheme ? 'text-white' : 'text-gray-800';
  const logoSrc = isDarkTheme ? '/logo-epcvina-solar-white.png' : '/logo-epcvina-solar.png';

  return (
    <>
      {/* Mobile Header - only on phones and tablets (< lg). Desktop uses sidebar instead. */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-40 border-b transition-transform duration-300 will-change-transform ${
        isDarkTheme
          ? 'bg-transparent/95 backdrop-blur-sm border-transparent'
          : 'bg-white/90 backdrop-blur-md border-white/50 shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
      } ${
        isHidden || isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="flex items-center px-4 h-14 gap-4">
          {/* Left - Hamburger or Back */}
          {isDetailPage ? (
            <button 
              onClick={() => navigateTo('/')}
              className={`p-2 -ml-2 ${iconColor}`}
            >
              <CaretLeft className="h-6 w-6" />
            </button>
          ) : (
            <button 
              onClick={onMenuClick}
              className={`p-2 -ml-2 ${iconColor}`}
            >
              <List className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logoSrc}
              alt="EPCVINA Solar"
              width={164}
              height={42}
              className={`h-7 w-auto ${isDarkTheme ? 'drop-shadow-sm' : ''}`}
            />
          </a>
        </div>
      </header>
    </>
  );
}
