import { useState, useEffect, useRef, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ZaloChatButton from '../ui/ZaloChatButton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Scroll context for header visibility
const ScrollContext = createContext<{
  isHeaderVisible: boolean;
  scrollY: number;
}>({
  isHeaderVisible: true,
  scrollY: 0,
});

export const useScrollContext = () => useContext(ScrollContext);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only show header when at the very top (within 10px)
      if (currentScrollY <= 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        // Hide when scrolling down past 60px
        setIsHeaderVisible(false);
      }
      // Don't show on scroll up - only show at top
      
      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current page is homepage
  const isHomePage = pathname === '/';

  return (
    <ScrollContext.Provider value={{ isHeaderVisible, scrollY }}>
      <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
        <div className="flex min-w-0">
          {/* Sidebar - always present */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main content - offset by sidebar on desktop */}
          <div className="flex-1 flex flex-col min-w-0 lg:ml-16">
            {/* Header: mobile = always show; desktop = hide on homepage */}
            {!isHomePage ? (
              <Header onMenuClick={() => setIsSidebarOpen(true)} isHidden={!isHeaderVisible} />
            ) : (
              <div className="lg:hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} isHidden={!isHeaderVisible} />
              </div>
            )}
            
            {/* Page content */}
            <main ref={mainRef} className={`flex-1 ${
              isHomePage
                ? 'pt-14 lg:pt-0'
                : pathname?.startsWith('/equipment') ? '' : 'pt-14 lg:pt-16'
            } ${isHomePage ? '' : 'lg:pl-8 lg:pr-8'}`}>
              {children}
            </main>
          </div>
        </div>
        
        {/* Zalo Chat Button (hidden on homepage) */}
        {!isHomePage && <ZaloChatButton />}
      </div>
    </ScrollContext.Provider>
  );
}
