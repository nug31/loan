import React, { useState } from 'react';
import { Bell, User, LogOut, Handshake } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export const MobileHeader: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <header className="lg:hidden bg-gradient-to-r from-white to-orange-50 shadow-md border-b border-orange-100 sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-orange-300">
              <Handshake size={28} className="text-white drop-shadow-sm" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight" style={{
                color: '#D97706',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                SmartLend
              </h1>
            </div>
          </div>

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  {/* Overlay */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  
                  {/* Notifications Dropdown */}
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-600">{unreadNotifications.length} unread</p>
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

            {/* User Avatar */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isAdmin ? 'bg-red-600' : 'bg-blue-600'
              }`}>
                <User size={14} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700">
                  {user?.firstName || user?.name || user?.email?.split('@')[0]}
                </span>
                <span className="text-xs text-gray-500">
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
              title="Logout"
            >
              <LogOut size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
