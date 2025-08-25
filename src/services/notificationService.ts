import { io, Socket } from 'socket.io-client';
import { AppNotification } from '../types';

export interface NotificationPayload {
  type: 'loan_request' | 'loan_approved' | 'loan_rejected' | 'loan_returned' | 'loan_overdue' | 'item_added' | 'item_updated' | 'system_maintenance' | 'welcome';
  title: string;
  message: string;
  userId?: string;
  adminOnly?: boolean;
  relatedId?: string;
}

export interface RealTimeNotification extends AppNotification {
  timestamp: Date;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, (notification: RealTimeNotification) => void> = new Map();
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://loan-production-a1a2.up.railway.app'
        : 'http://localhost:3002';

      console.log('🔌 Connecting to notification service at:', baseUrl);

      this.socket = io(baseUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to notification service');
        this.reconnectAttempts = 0;
        this.notifyConnectionListeners(true);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from notification service:', reason);
        this.notifyConnectionListeners(false);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('🔌 Max reconnection attempts reached, falling back to polling');
          this.fallbackToPolling();
        }
      });

      this.socket.on('notification', (data: RealTimeNotification) => {
        console.log('📩 Received real-time notification:', data);
        this.handleIncomingNotification(data);
      });

      this.socket.on('bulk_notifications', (notifications: RealTimeNotification[]) => {
        console.log('📩 Received bulk notifications:', notifications.length);
        notifications.forEach(notification => this.handleIncomingNotification(notification));
      });

    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
      this.fallbackToPolling();
    }
  }

  private handleIncomingNotification(notification: RealTimeNotification) {
    // Convert timestamp to Date object if needed
    if (typeof notification.createdAt === 'string') {
      notification.createdAt = new Date(notification.createdAt);
    }
    
    notification.timestamp = new Date();

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
    
    // Play notification sound
    this.playNotificationSound(notification.type);
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('❌ Error in notification listener:', error);
      }
    });
  }

  private showBrowserNotification(notification: RealTimeNotification) {
    if (Notification.permission === 'granted' && !document.hasFocus()) {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
          badge: '/favicon.ico',
          silent: false,
          requireInteraction: notification.type === 'loan_overdue' || notification.type === 'system_maintenance'
        });

        // Auto-close after 5 seconds unless it requires interaction
        if (!browserNotification.requireInteraction) {
          setTimeout(() => browserNotification.close(), 5000);
        }

        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };
      } catch (error) {
        console.error('❌ Error showing browser notification:', error);
      }
    }
  }

  private playNotificationSound(type: string) {
    try {
      // Different sounds for different notification types
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different notification types
      let frequency1 = 800;
      let frequency2 = 600;
      let duration = 0.2;

      switch (type) {
        case 'loan_approved':
          frequency1 = 600;
          frequency2 = 800;
          break;
        case 'loan_rejected':
          frequency1 = 400;
          frequency2 = 300;
          break;
        case 'loan_overdue':
          frequency1 = 1000;
          frequency2 = 500;
          duration = 0.5;
          break;
        case 'system_maintenance':
          frequency1 = 300;
          frequency2 = 200;
          duration = 0.8;
          break;
        default:
          // Default notification sound
          break;
      }

      oscillator.frequency.setValueAtTime(frequency1, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(frequency2, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('🔊 Could not play notification sound:', error);
    }
  }

  private fallbackToPolling() {
    console.log('📡 Falling back to polling for notifications');
    // Implement polling fallback
    this.startPolling();
  }

  private async startPolling() {
    const pollInterval = 30000; // 30 seconds
    
    const poll = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://loan-production-a1a2.up.railway.app'
          : 'http://localhost:3002';
          
        const response = await fetch(`${baseUrl}/api/notifications/poll`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const notifications: RealTimeNotification[] = await response.json();
          notifications.forEach(notification => this.handleIncomingNotification(notification));
        }
      } catch (error) {
        console.error('❌ Error polling notifications:', error);
      }
      
      // Continue polling
      setTimeout(poll, pollInterval);
    };

    poll();
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error) {
        console.error('❌ Error in connection listener:', error);
      }
    });
  }

  // Public API
  public subscribe(userId: string, callback: (notification: RealTimeNotification) => void): () => void {
    const key = `user_${userId}`;
    this.listeners.set(key, callback);
    
    // Join user room for targeted notifications
    if (this.socket?.connected) {
      this.socket.emit('join_user_room', userId);
    }

    return () => {
      this.listeners.delete(key);
      if (this.socket?.connected) {
        this.socket.emit('leave_user_room', userId);
      }
    };
  }

  public subscribeAdmin(callback: (notification: RealTimeNotification) => void): () => void {
    const key = 'admin_notifications';
    this.listeners.set(key, callback);
    
    // Join admin room
    if (this.socket?.connected) {
      this.socket.emit('join_admin_room');
    }

    return () => {
      this.listeners.delete(key);
      if (this.socket?.connected) {
        this.socket.emit('leave_admin_room');
      }
    };
  }

  public onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    
    // Immediately notify of current status
    callback(this.socket?.connected || false);
    
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  public async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://loan-production-a1a2.up.railway.app'
        : 'http://localhost:3002';

      const response = await fetch(`${baseUrl}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      console.log('✅ Notification sent successfully');
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      throw error;
    }
  }

  public requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('⚠️ This browser does not support notifications');
      return Promise.resolve('denied');
    }

    if (Notification.permission === 'granted') {
      return Promise.resolve('granted');
    }

    if (Notification.permission === 'denied') {
      return Promise.resolve('denied');
    }

    return Notification.requestPermission();
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.connectionListeners.clear();
  }

  public get isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
