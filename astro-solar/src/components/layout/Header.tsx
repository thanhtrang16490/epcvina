import { Search, Bell, ChevronLeft, Menu, Sun, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  role: string;
}

const pageTitles: Record<string, string> = {
  '/': 'EPC Solar',
  '/combos': 'All Combos',
  '/on-grid': 'Combo On-Grid',
  '/hybrid-bess': 'Combo Hy-Brid',
  // Giải pháp
  '/solar-home/mai-ton': 'Mái tôn',
  '/solar-home/mai-ngoi': 'Mái ngói',
  '/solar-home/mai-bang': 'Mái bằng',
  // Ứng dụng
  '/applications/van-phong': 'Văn phòng',
  '/applications/nha-xuong': 'Nhà xưởng',
  '/applications/trang-trai': 'Trang trại',
  '/applications/khach-san': 'Khách sạn',
  '/applications/nha-hang': 'Nhà hàng',
  // Thiết bị
  '/equipment/panel': 'Tấm quang năng',
  '/equipment/inverter': 'Biến tần',
  '/equipment/battery': 'Pin lưu trữ',
  '/equipment/mounting': 'Hệ khung nhôm',
  '/equipment/electrical': 'Thiết bị điện',
  '/equipment/grounding': 'Hệ tiếp địa',
  '/settings': 'Settings',
};

interface HeaderProps {
  onMenuClick?: () => void;
  isHidden?: boolean;
  mobileOnly?: boolean;
}

export default function Header({ onMenuClick, isHidden, mobileOnly }: HeaderProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const navigateTo = (path: string) => { window.location.href = path; };
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isHome = pathname === '/';
  const pageTitle = pageTitles[pathname] || 'Chi tiết';
  const isDetailPage = pathname.includes('/combos/') && pathname !== '/combos';

  // Load user from session on mount
  useEffect(() => {
    const session = localStorage.getItem('user_session') || sessionStorage.getItem('user_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser({
          name: userData.name || userData.user?.email || 'User',
          email: userData.user?.email || '',
          role: userData.role || 'user',
        });
      } catch (e) {
        console.error('Failed to parse user session:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    sessionStorage.removeItem('user_session');
    setUser(null);
    navigateTo('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Header - Title căn trái cạnh hamburger */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-40 border-b transition-transform duration-300 ${
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
              className="p-2 -ml-2 text-gray-600"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : (
            <button 
              onClick={onMenuClick}
              className="p-2 -ml-2 text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Title - Căn trái cạnh hamburger */}
          <span className={`font-semibold text-lg ${
            isHome ? 'text-gray-900' : 'text-gray-900'
          }`}>
            {isDetailPage ? 'Chi tiết' : pageTitle}
          </span>

          {/* Spacer để đẩy search & avatar sang phải */}
          <div className="flex-1" />

          {/* Right - Search & Avatar */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600">
              <Search className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden ring-2 ring-white"
                >
                  {getInitials(user.name)}
                </button>
                
                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-orange-600 mt-1 capitalize">{user.role}</p>
                      </div>
                      {user.role === 'admin' && (
                        <a
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Admin Panel
                        </a>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <User className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Header - hidden when mobileOnly (homepage uses HeaderBar instead) */}
      <header className={`${mobileOnly ? 'hidden' : 'hidden lg:flex'} h-16 border-b items-center justify-between px-4 lg:px-8 fixed top-0 left-[64px] right-0 z-30 transition-all duration-300 ${
        isHome 
          ? 'bg-transparent/95 backdrop-blur-sm border-transparent'
          : 'bg-white border-gray-200'
      } ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}>
        {/* Breadcrumbs - Desktop only */}
        <nav className="flex items-center text-sm">
          <span className="font-medium text-gray-900">{pageTitle}</span>
        </nav>

        {/* Right side - Search, Notifications & Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-48 placeholder:text-gray-400"
            />
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg pr-2 py-1 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{user.name}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap capitalize">{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200">
                  {getInitials(user.name)}
                </div>
              </button>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-orange-600 mt-1 capitalize">{user.role}</p>
                    </div>
                    
                    {user.role === 'admin' && (
                      <a
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Admin Panel
                      </a>
                    )}
                    
                    <a
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      Hồ sơ cá nhân
                    </a>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-2 pl-4 border-l border-gray-200 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Đăng nhập
            </a>
          )}
        </div>
      </header>
    </>
  );
}
