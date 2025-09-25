import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon,
  DocumentArrowUpIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid,
  DocumentArrowUpIcon as DocumentSolid
} from '@heroicons/react/24/solid';

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      icon: HomeIcon, 
      iconSolid: HomeSolid,
      label: 'Overview', 
      path: '/dashboard',
      description: 'Dashboard home'
    },
    { 
      icon: DocumentArrowUpIcon, 
      iconSolid: DocumentSolid,
      label: 'Process Documents', 
      path: '/dashboard/upload',
      description: 'AI-powered document analysis'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
        >
          {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed lg:static inset-y-0 left-0 z-50 
        ${collapsed ? 'lg:w-16' : 'lg:w-64'} 
        w-64 
        bg-white/95 backdrop-blur-sm 
        border-r border-blue-200 
        transition-all duration-300 
        flex flex-col 
        shadow-xl lg:shadow-lg
      `}>
        {/* Header */}
        <div className="flex h-16 items-center border-b border-blue-200 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <div>
                <span className="font-bold text-white text-lg">AJIRI</span>
                <p className="text-xs text-blue-100">AI Document Intelligence</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden lg:flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/20 text-white"
          >
            {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </button>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <div className="border-t px-3 py-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <span className="text-sm font-medium">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : (user?.firstName || user?.username)?.[0]?.toUpperCase()
                  }
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.firstName || user?.username?.split('@')[0] || user?.username}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.firstName 
                    ? 'User' 
                    : user?.username?.split('@')[0] || 'User'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {menuItems.map((item) => {
              const IconComponent = isActive(item.path) ? item.iconSolid : item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto border-t px-3 py-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </div>
    </>
  );
}