import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface NotificationCountContextType {
  totalCount: number;
  unreadCount: number;
  updateCounts: (total: number, unread: number) => void;
  refreshCounts: () => Promise<void>;
  decrementCount: (wasUnread?: boolean) => void;
  clearAllCounts: () => void;
}

const NotificationCountContext = createContext<NotificationCountContextType | undefined>(undefined);

export const useNotificationCount = () => {
  const context = useContext(NotificationCountContext);
  if (context === undefined) {
    throw new Error('useNotificationCount must be used within a NotificationCountProvider');
  }
  return context;
};

interface NotificationCountProviderProps {
  children: React.ReactNode;
}

export const NotificationCountProvider: React.FC<NotificationCountProviderProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch initial counts from API
  const refreshCounts = async () => {
    try {
      const userRole = isAdmin ? 'admin' : 'user';
      const userId = user?.id;
      
      const response = await api.getNotifications(userRole, userId);
      if (response.data) {
        const total = response.data.length;
        const unread = response.data.filter((n: any) => !n.isRead).length;
        setTotalCount(total);
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  };

  // Initial load
  useEffect(() => {
    if (user?.id) {
      refreshCounts();
      
      // Refresh every 30 seconds
      const interval = setInterval(refreshCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id, isAdmin]);

  const updateCounts = (total: number, unread: number) => {
    setTotalCount(total);
    setUnreadCount(unread);
  };

  const decrementCount = (wasUnread = false) => {
    setTotalCount(prev => Math.max(0, prev - 1));
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllCounts = () => {
    setTotalCount(0);
    setUnreadCount(0);
  };

  const value: NotificationCountContextType = {
    totalCount,
    unreadCount,
    updateCounts,
    refreshCounts,
    decrementCount,
    clearAllCounts,
  };

  return (
    <NotificationCountContext.Provider value={value}>
      {children}
    </NotificationCountContext.Provider>
  );
};
