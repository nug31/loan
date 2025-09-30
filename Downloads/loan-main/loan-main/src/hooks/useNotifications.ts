import { useState, useEffect, useRef } from 'react';
import { AppNotification } from '../types';
import { notificationService, RealTimeNotification } from '../services/notificationService';

interface UseNotificationsReturn {
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  markAsRead: (notificationId: string) => void;
  clearAll: () => void;
  unreadCount: number;
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export const useNotifications = (userId?: string): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userId) return;

    console.log('🔔 Setting up real-time notifications for user:', userId);
    
    // Set up real-time notification service
    const unsubscribe = notificationService.subscribe(userId, (notification: RealTimeNotification) => {
      console.log('📡 Received real-time notification:', notification);
      
      // Convert to AppNotification format
      const appNotification: AppNotification = {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        relatedId: notification.relatedId
      };

      // Add to notifications list
      setNotifications(prev => {
        // Avoid duplicates
        if (prev.some(n => n.id === appNotification.id)) {
          return prev;
        }
        return [appNotification, ...prev];
      });
    });

    // Set up connection status listener
    const unsubscribeConnection = notificationService.onConnectionChange((connected) => {
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    });

    // Load existing notifications from API
    loadExistingNotifications(userId);

    return () => {
      unsubscribe();
      unsubscribeConnection();
    };
  }, [userId]);

  // Request notification permission on mount
  useEffect(() => {
    notificationService.requestPermission().then(permission => {
      console.log('📡 Notification permission:', permission);
    });
  }, []);

  const loadExistingNotifications = async (userId: string) => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://loan-production-a1a2.up.railway.app'
        : 'http://localhost:3002';
        
      const response = await fetch(`${baseUrl}/api/notifications?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const existingNotifications: AppNotification[] = await response.json();
        console.log('📡 Loaded existing notifications:', existingNotifications.length);
        
        // Convert createdAt strings to Date objects
        const processedNotifications = existingNotifications.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        
        setNotifications(processedNotifications);
      } else {
        console.warn('⚠️ Could not load existing notifications:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error loading existing notifications:', error);
    }
  };

  const addNotification = (notification: AppNotification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const playNotificationSound = () => {
    try {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('📡 Could not play notification sound:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount,
    isConnected,
    connectionStatus
  };
};
