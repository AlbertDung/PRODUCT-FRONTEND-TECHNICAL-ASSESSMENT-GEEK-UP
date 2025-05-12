import { Link, useLocation } from 'react-router-dom';
import { FiImage, FiUsers, FiMenu, FiX, FiHome, FiSettings, FiBarChart2, FiGrid, FiChevronLeft } from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default closed on mobile
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="flex min-h-screen bg-gray-50">
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
          className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 bg-white border-r border-gray-200
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isCollapsed ? 'w-20' : 'w-64'}
            lg:fixed lg:translate-x-0
          `}
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
        >
          {/* Flex container for the entire sidebar content */}
          <div className="flex flex-col h-screen">
            {/* Logo */}
            <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
              <Link 
                to="/" 
                className={`text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent ${isCollapsed ? 'text-center w-full' : ''}`}
              >
                {isCollapsed ? 'A' : (<span>Albert <span className="text-accent-500">AnhDung</span></span>)}
              </Link>
              {/* Close button for mobile */}
              {!isCollapsed && window.innerWidth < 1024 && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
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
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  onClick={() => {
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span>{label}</span>}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className={`p-4 border-t border-gray-200 flex-shrink-0 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                    alt="Admin"
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                    <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-gray-200 shadow rounded-full p-2 flex items-center justify-center transition-all duration-300 hover:bg-gray-100 focus:outline-none hidden lg:flex"
            style={{ zIndex: 60 }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiChevronLeft
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </aside>
      </div>

      {/* Floating open button for mobile */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center h-16 px-2 sm:px-4 lg:px-8">
          <div className="flex-1 flex justify-end items-center space-x-2 sm:space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <FiGrid className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
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