import React, { useState } from 'react';
import { Bell, Search, Menu, X, User, Settings, LogOut, Package, Handshake } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 transform hover:scale-105"
          >
            {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Enhanced logo with multiple layers */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-3">
                <div className="relative">
                  <Handshake size={24} className="text-white drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse"></div>
                </div>
              </div>
              {/* Multiple glow effects */}
              <div className="absolute inset-0 w-12 h-12 bg-blue-400 rounded-2xl blur-xl opacity-30 -z-10 animate-pulse"></div>
              <div className="absolute inset-0 w-12 h-12 bg-purple-400 rounded-2xl blur-2xl opacity-20 -z-20 pulse-slow"></div>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-xl gradient-text hidden sm:block leading-tight">
                LoanMitra
              </span>
              <span className="text-xs text-blue-600 font-semibold hidden sm:block -mt-1 tracking-wide">
                by NUG
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search items, users, or loans..."
              className="pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-300 w-80 backdrop-blur-sm"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 transform hover:scale-105 group"
            >
              <Bell size={22} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                  <p className="text-sm text-gray-600 mt-1">{unreadNotifications.length} unread</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className={`group p-4 border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-300 ${
                          !notification.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-2 transition-all duration-300 ${
                            !notification.isRead ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{notification.title}</p>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors mt-1">{notification.message}</p>
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
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <User size={18} className="text-white" />
              </div>
              <span className="hidden sm:block font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                {user?.firstName || user?.email} {user?.lastName}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                <div className="p-4">
                  <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100 bg-gray-50/50 rounded-xl mb-2">
                    {user?.email}
                  </div>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl flex items-center space-x-3 transition-all duration-300 group">
                    <User size={18} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                    <span className="font-medium">Profile</span>
                  </button>
                  {isAdmin && (
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl flex items-center space-x-3 transition-all duration-300 group">
                      <Settings size={18} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                      <span className="font-medium">Settings</span>
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl flex items-center space-x-3 transition-all duration-300 group mt-2"
                  >
                    <LogOut size={18} className="text-red-500 group-hover:text-red-600 transition-colors" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};