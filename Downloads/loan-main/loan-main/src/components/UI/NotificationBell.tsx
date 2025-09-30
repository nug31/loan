import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationBell: React.FC = () => {
  const { notifications, removeNotification, clearNotifications } = useNotifications();
  const { isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter notifications for current user context
  const relevantNotifications = notifications.filter(notification => {
    // Show all notifications to admin
    if (isAdmin) return true;
    
    // For regular users, show notifications that are relevant to them
    return true;
  });

  const unreadCount = relevantNotifications.length;

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDismiss = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeNotification(notificationId);
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    clearNotifications();
    setShowDropdown(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        
        {/* Notification Badge - Matches the design from image */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifications */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {isAdmin ? 'Admin Notifications' : 'Notifications'}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-indigo-100 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {unreadCount > 0 && (
                <p className="text-xs text-indigo-100 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {relevantNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No new notifications</p>
                </div>
              ) : (
                relevantNotifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 border-b border-gray-100 last:border-b-0 ${getTypeColor(notification.type)} hover:bg-gray-50 transition-colors group`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDismiss(notification.id, e)}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-gray-200 rounded-full transition-all duration-200"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              {relevantNotifications.length > 10 && (
                <div className="p-3 text-center text-xs text-gray-500 bg-gray-50">
                  ... and {relevantNotifications.length - 10} more notifications
                </div>
              )}
            </div>

            {/* Footer */}
            {relevantNotifications.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 text-center">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
