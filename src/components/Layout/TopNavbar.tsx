import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Settings, 
  Users,
  MoreHorizontal,
  BarChart3,
  Clock,
  LogOut,
  Bell,
  User,
  Handshake
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBell } from '../UI/NotificationBell';

interface TopNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin, user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Define navigation items for regular users
  const userNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'catalog',
      label: 'Browse Items',
      icon: Package,
    },
    {
      id: 'my-loans',
      label: 'My Loans',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  // Define navigation items for admin users
  const adminNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'admin-items',
      label: 'Manage Items',
      icon: Package,
    },
    {
      id: 'admin-loans',
      label: 'Manage Loans',
      icon: FileText,
    },
    {
      id: 'admin-users',
      label: 'Manage Users',
      icon: Users,
    },
    {
      id: 'admin-categories',
      label: 'Categories',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 overflow-hidden">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-lg border border-gray-500">
            <Handshake size={26} className="text-white" strokeWidth={3} />
          </div>
              <h1 className="text-lg lg:text-xl font-bold" style={{color: '#E9631A'}}>SmartLend</h1>
            </div>
            
            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-0.5 ml-1 lg:ml-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      group flex items-center space-x-1.5 px-3 py-2 mx-0.5 rounded-lg whitespace-nowrap text-sm
                      transition-all duration-200 ease-out
                      ${isActive 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                    style={isActive ? {backgroundColor: '#E9631A'} : {}}
                  >
                    <Icon 
                      size={18} 
                      className={`
                        transition-colors duration-200
                        ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#274C5B]'}
                      `}
                    />
                    <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#274C5B]'}`}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <NotificationBell />

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isAdmin ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden sm:block font-medium text-gray-700 text-sm">
                  {user?.firstName || user?.name || user?.email?.split('@')[0]} {user?.lastName}
                </span>
                <span className="hidden lg:block text-xs text-gray-500">
                  {isAdmin ? 'Administrator' : 'User'}
                </span>
              </button>

              {showProfileMenu && (
                <>
                  {/* Overlay to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
                    <div className="p-3">
                      <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 bg-gray-50 rounded mb-2">
                        {user?.email}
                      </div>
                      <div 
                        onClick={() => {
                          onTabChange('settings');
                          setShowProfileMenu(false);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onTabChange('settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2 cursor-pointer select-none"
                        role="button"
                        tabIndex={0}
                      >
                        <User size={16} className="text-gray-500" />
                        <span>Profile</span>
                      </div>
                      {isAdmin && (
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2">
                          <Settings size={16} className="text-gray-500" />
                          <span>Settings</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center space-x-2 mt-2"
                      >
                        <LogOut size={16} className="text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 border border-red-200 hover:border-red-300"
              title="Logout"
            >
              <LogOut size={16} className="text-red-600" />
              <span className="hidden md:block text-sm font-medium text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
