import { CaretLeft, List } from '@phosphor-icons/react';

interface HeaderProps {
  onMenuClick?: () => void;
  isHidden?: boolean;
}

export default function Header({ onMenuClick, isHidden }: HeaderProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const navigateTo = (path: string) => { window.location.href = path; };
  
  const isHome = pathname === '/';
  const isDetailPage = pathname.includes('/combos/') && pathname !== '/combos';
  const iconColor = isHome ? 'text-white' : 'text-gray-800';
  const logoSrc = '/logo-epcvina-solar.png';

  return (
    <>
      {/* Mobile Header - only on phones (< md). Tablet+ uses sidebar instead. */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-40 border-b transition-transform duration-300 ${
        isHome 
          ? 'bg-transparent/95 backdrop-blur-sm border-transparent'
          : 'bg-white border-gray-100'
      } ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
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
              className="h-7 w-auto"
            />
          </a>
        </div>
      </header>
    </>
  );
}
