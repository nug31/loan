import React, { useState, useEffect } from 'react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  XCircle, 
  X,
  Bell,
  Clock,
  User,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationPopup: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const { user, isAdmin } = useAuth();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Filter notifications for current user context
    const relevantNotifications = notifications.filter(notification => {
      // Show all notifications to admin
      if (isAdmin) return true;
      
      // For regular users, show notifications that are relevant to them
      // This could be enhanced based on notification metadata
      return true;
    });

    setVisibleNotifications(relevantNotifications);
    
    // Show popup if there are new notifications
    if (relevantNotifications.length > 0) {
      setShowPopup(true);
    }
  }, [notifications, isAdmin]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getGradientColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'info':
        return 'from-blue-500 to-blue-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      case 'error':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleDismiss = (notificationId: string) => {
    removeNotification(notificationId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Clear all notifications when closing popup
    visibleNotifications.forEach(notification => {
      removeNotification(notification.id);
    });
  };

  if (!showPopup || visibleNotifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={handleClosePopup}
      />
      
      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isAdmin ? 'Admin Notifications' : 'Notifications'}
                  </h3>
                  <p className="text-sm text-indigo-100">
                    {visibleNotifications.length} new notification{visibleNotifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClosePopup}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {visibleNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`border-l-4 p-4 ${getBorderColor(notification.type)} ${
                  index !== visibleNotifications.length - 1 ? 'border-b border-gray-100' : ''
                } relative group hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon with gradient background */}
                  <div className={`flex-shrink-0 p-2 rounded-full bg-gradient-to-r ${getGradientColor(notification.type)} shadow-lg`}>
                    <div className="w-6 h-6 text-white flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all duration-200"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{notification.timestamp.toLocaleTimeString()}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>Admin Alert</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Loan Management System</span>
              </div>
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Dismiss All
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
