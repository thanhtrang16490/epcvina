import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ZaloChatButton from '../shared/buttons/ZaloChatButton';
import CallBoxButton from '../shared/buttons/CallBoxButton';
import FooterSection from '../home/layout/FooterSection';
import BackToTop from '../ui/BackToTop';
import ErrorBoundary from '../ui/ErrorBoundary';
import { ScrollContext } from './dashboardShellContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean; // Control footer visibility
  showChrome?: boolean;
  pathname?: string;
}

export default function DashboardLayout({ children, showFooter = true, showChrome = true, pathname }: DashboardLayoutProps) {
  const currentPathname = pathname || '/';
  const needsMobileTopOffset = currentPathname.startsWith('/goi-combo') || currentPathname.startsWith('/solar-home/he-thong');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;
      const nearTop = currentScrollY <= 10;

      if (nearTop) {
        setIsHeaderVisible(true);
      } else if (scrollingDown && currentScrollY > 72) {
        setIsHeaderVisible(false);
      } else if (scrollingUp && lastScrollY.current - currentScrollY > 8) {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ isHeaderVisible, scrollY }}>
      <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
        <div className="flex min-w-0">
          {/* Sidebar - always visible on desktop, mobile drawer */}
          {showChrome ? (
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} pathname={currentPathname} />
          ) : null}

          {/* Main content - full width, accounting for sidebar */}
          <div className={`flex-1 flex flex-col min-w-0 ${showChrome ? 'lg:ml-16' : ''} ${needsMobileTopOffset ? 'pt-14' : ''}`}>
            {/* Header: mobile-only hamburger toggle */}
            {showChrome ? (
              <Header
                onMenuClick={() => setIsSidebarOpen(true)}
                isHidden={!isHeaderVisible}
                isMenuOpen={isSidebarOpen}
                pathname={currentPathname}
              />
            ) : null}
            
            {/* Page content */}
            <main ref={mainRef} className="flex-1 w-full">
              <ErrorBoundary name="DashboardShellContent">
                {children}
              </ErrorBoundary>
            </main>
          </div>
        </div>
        
        {/* Floating Contact Buttons */}
        {showChrome ? (
          <>
            <CallBoxButton stackAboveBackToTop={isBackToTopVisible} />
            <ZaloChatButton stackAboveBackToTop={isBackToTopVisible} />
          </>
        ) : null}

        {/* Footer - visible on equipment pages, hidden on homepage (SolarFullPage has its own footer) */}
        {showFooter && (
          <div className={showChrome ? 'lg:ml-16' : ''}>
            <FooterSection pathname={currentPathname} />
          </div>
        )}
        
        {/* Back to Top Button */}
        {showChrome ? <BackToTop onVisibilityChange={setIsBackToTopVisible} /> : null}
      </div>
    </ScrollContext.Provider>
  );
}
