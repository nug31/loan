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
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotificationCount } from '../../contexts/NotificationCountContext';
import { NotificationStatus } from '../Notifications/NotificationStatus';

interface TopNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin, user, logout } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const { isConnected, connectionStatus } = useNotifications(user?.id);
  const { unreadCount } = useNotificationCount();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

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
            <div className="relative">
              <button
                onClick={() => onTabChange('notifications')}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                title="View All Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  {/* Overlay to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden origin-top animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <NotificationStatus 
                          isConnected={isConnected} 
                          connectionStatus={connectionStatus}
                          className=""
                        />
                      </div>
                      <p className="text-sm text-gray-600">{unreadCount} unread</p>
                    </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="mx-auto text-gray-300 mb-2" size={32} />
                        <p className="text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationRead(notification.id)}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    </div>
                  </div>
                </>
              )}
            </div>

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
