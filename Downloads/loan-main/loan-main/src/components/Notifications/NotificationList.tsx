import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotificationCount } from '../../contexts/NotificationCountContext';
import { apiService } from '../../services/api';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'tinggi' | 'menunggu' | 'darurat' | 'proses' | 'sedang';
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  user?: string;
  relatedId?: string;
  isRead?: boolean;
}

const NotificationList: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { loans, items, users } = useData();
  const { updateCounts, decrementCount, clearAllCounts } = useNotificationCount();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userRole = isAdmin ? 'admin' : 'user';
        const userId = user?.id;
        
        const response = await apiService.getNotifications(userRole, userId);
        if (response.data) {
          // Convert API response to our NotificationItem format
          const apiNotifications: NotificationItem[] = response.data.map((notif: any) => ({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type as 'tinggi' | 'menunggu' | 'darurat' | 'proses' | 'sedang',
            priority: notif.priority as 'high' | 'medium' | 'low',
            timestamp: new Date(notif.timestamp),
            user: notif.user,
            relatedId: notif.relatedId,
            isRead: notif.isRead || false
          }));
          
          setNotifications(apiNotifications);
          setFilteredNotifications(apiNotifications);
          
          // Update global notification counts
          const total = apiNotifications.length;
          const unread = apiNotifications.filter(n => !n.isRead).length;
          updateCounts(total, unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to empty array if API fails
        setNotifications([]);
        setFilteredNotifications([]);
      }
    };

    fetchNotifications();
    
    // Optional: Set up polling to refresh notifications periodically
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [user?.id, isAdmin]);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (filterType !== 'all') {
      filtered = filtered.filter(notif => notif.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(notif => 
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notif.user && notif.user.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filterType, searchTerm]);

  const getStatusBadge = (type: string) => {
    const badges = {
      tinggi: { bg: 'bg-red-100 text-red-700', text: 'Tinggi' },
      menunggu: { bg: 'bg-yellow-100 text-yellow-700', text: 'Menunggu' },
      darurat: { bg: 'bg-red-200 text-red-800', text: 'Darurat' },
      proses: { bg: 'bg-blue-100 text-blue-700', text: 'Proses' },
      sedang: { bg: 'bg-orange-100 text-orange-700', text: 'Sedang' }
    };
    return badges[type as keyof typeof badges] || { bg: 'bg-gray-100 text-gray-700', text: 'Unknown' };
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'tinggi':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'menunggu':
        return <Clock size={16} className="text-yellow-600" />;
      case 'darurat':
        return <AlertCircle size={16} className="text-red-700" />;
      case 'proses':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'sedang':
        return <Bell size={16} className="text-orange-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleDateString('id-ID', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInDays < 7) {
      return `${diffInDays} hari lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Find notification to check if it was unread
    const notification = notifications.find(n => n.id === id);
    const wasUnread = notification && !notification.isRead;
    
    // Add to dismissing set for animation
    setDismissingIds(prev => new Set(prev).add(id));
    
    // Remove after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      setFilteredNotifications(prev => prev.filter(notif => notif.id !== id));
      setDismissingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      // Update global counts
      decrementCount(wasUnread);
    }, 300); // Match CSS animation duration
  };

  const clearAllNotifications = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
      setNotifications([]);
      setFilteredNotifications([]);
      
      // Clear global counts
      clearAllCounts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-start justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 lg:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Bell className="text-blue-600" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Notifikasi</h1>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isAdmin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
                <p className="text-sm lg:text-base text-gray-600">
                  {filteredNotifications.length} notifikasi {isAdmin ? 'sistem' : 'pribadi'}
                  {filteredNotifications.filter(n => !n.isRead).length > 0 && 
                    ` (${filteredNotifications.filter(n => !n.isRead).length} belum dibaca)`
                  }
                </p>
              </div>
            </div>
            
            {filteredNotifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs lg:text-sm font-medium flex-shrink-0"
              >
                <X size={14} className="lg:hidden" />
                <X size={16} className="hidden lg:block" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari notifikasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="tinggi">Tinggi</option>
                <option value="menunggu">Menunggu</option>
                <option value="darurat">Darurat</option>
                <option value="proses">Proses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
              <Bell className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada notifikasi
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Tidak ada notifikasi yang sesuai dengan filter Anda'
                  : 'Anda tidak memiliki notifikasi saat ini'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const badge = getStatusBadge(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300 ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                  } ${
                    dismissingIds.has(notification.id) ? 'opacity-0 transform scale-95 -translate-x-4' : 'opacity-100 transform scale-100 translate-x-0'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 lg:space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-0">
                            {notification.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} self-start`}>
                            {badge.text}
                          </span>
                        </div>
                        
                        <p className="text-sm lg:text-base text-gray-700 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs lg:text-sm text-gray-500 space-y-2 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                            {notification.user && (
                              <span className="flex items-center">
                                👤 <span className="ml-1">{notification.user}</span>
                              </span>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} className="lg:hidden" />
                              <Calendar size={14} className="hidden lg:block" />
                              <span>{formatTime(notification.timestamp)}</span>
                            </div>
                          </div>
                          
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-xs self-start sm:self-auto"
                            >
                              Tandai dibaca
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-2 lg:ml-4 flex-shrink-0">
                      <button 
                        onClick={(e) => dismissNotification(notification.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                        title="Dismiss notification"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {['tinggi', 'menunggu', 'darurat', 'proses'].map((type) => {
            const count = notifications.filter(n => n.type === type).length;
            const badge = getStatusBadge(type);
            
            return (
              <div
                key={type}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setFilterType(type)}
              >
                <div className="mb-2 flex justify-center">
                  {getStatusIcon(type)}
                </div>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{count}</p>
                <p className={`text-xs font-medium ${badge.bg.split(' ')[1]} rounded-full px-2 py-1`}>
                  {badge.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
