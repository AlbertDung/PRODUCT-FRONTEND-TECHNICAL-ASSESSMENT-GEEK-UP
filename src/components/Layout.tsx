import { Link, useLocation } from 'react-router-dom';
import { FiImage, FiUsers, FiMenu, FiX, FiHome, FiSettings, FiBarChart2, FiGrid, FiChevronLeft, FiMoon, FiSun } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  // Responsive sidebar: always open on desktop, toggle on mobile
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    // On mount, check initial width
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/albums', label: 'Albums', icon: FiImage },
    { path: '/users', label: 'Users', icon: FiUsers },
    { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar & Backdrop */}
      {/* Mobile: overlay sidebar and backdrop */}
      <div className="relative">
        {/* Backdrop */}
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div
            className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar backdrop"
          />
        )}
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isSidebarCollapsed ? 'w-20' : 'w-64'}
            lg:fixed lg:translate-x-0
            transition-all duration-300 ease-in-out
            transform-gpu
          `}
          style={{ 
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            transformOrigin: 'left center',
            willChange: 'transform, width'
          }}
        >
          {/* Flex container for the entire sidebar content */}
          <div className="flex flex-col h-screen">
            {/* Logo */}
            <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <Link 
                to="/" 
                className={`text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'text-center w-full' : ''}`}
              >
                {isSidebarCollapsed ? 'A' : (<span>Albert <span className="text-accent-500">AnhDung</span></span>)}
              </Link>
              {/* Close button for mobile */}
              {!isSidebarCollapsed && window.innerWidth < 1024 && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Navigation - with overflow-y-auto */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                    isActive(path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  onClick={() => {
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? '' : 'mr-3'}`} />
                  {!isSidebarCollapsed && <span className="transition-opacity duration-300 ease-in-out">{label}</span>}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className={`p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full transition-transform duration-300 ease-in-out"
                    src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                    alt="Admin"
                  />
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0 transition-opacity duration-300 ease-in-out">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@example.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded-full p-2 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none hidden lg:flex"
            style={{ zIndex: 60 }}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiChevronLeft
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out ${isSidebarCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </aside>
      </div>

      {/* Floating open button for mobile */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center h-16 px-2 sm:px-4 lg:px-8">
          <div className="flex-1 flex justify-end items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <FiMoon className="w-5 h-5" />
              ) : (
                <FiSun className="w-5 h-5" />
              )}
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FiGrid className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FiSettings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;