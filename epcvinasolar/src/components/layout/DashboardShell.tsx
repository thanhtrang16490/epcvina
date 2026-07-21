import { useState, useEffect, useRef, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ZaloChatButton from '../shared/buttons/ZaloChatButton';
import CallBoxButton from '../shared/buttons/CallBoxButton';
import FooterSection from '../home/layout/FooterSection';
import BackToTop from '../ui/BackToTop';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean; // Control footer visibility
  showChrome?: boolean;
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

export default function DashboardLayout({ children, showFooter = true, showChrome = true }: DashboardLayoutProps) {
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

  return (
    <ScrollContext.Provider value={{ isHeaderVisible, scrollY }}>
      <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
        <div className="flex min-w-0">
          {/* Sidebar - always visible on desktop, mobile drawer */}
          {showChrome ? <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> : null}

          {/* Main content - full width, accounting for sidebar */}
          <div className={`flex-1 flex flex-col min-w-0 ${showChrome ? 'md:ml-16' : ''}`}>
            {/* Header: mobile-only hamburger toggle */}
            {showChrome ? (
              <Header
                onMenuClick={() => setIsSidebarOpen(true)}
                isHidden={!isHeaderVisible}
              />
            ) : null}
            
            {/* Page content */}
            <main ref={mainRef} className="flex-1 w-full">
              {children}
            </main>
          </div>
        </div>
        
        {/* Floating Contact Buttons */}
        {showChrome ? (
          <>
            <CallBoxButton />
            <ZaloChatButton />
          </>
        ) : null}
        
        {/* Footer - visible on equipment pages, hidden on homepage (SolarFullPage has its own footer) */}
        {showFooter && <FooterSection />}
        
        {/* Back to Top Button */}
        {showChrome ? <BackToTop /> : null}
      </div>
    </ScrollContext.Provider>
  );
}
