import React, { useState } from 'react';
import { NotificationTriggers } from '../../services/notificationTriggers';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Bell, Send, Users, Package, AlertTriangle, Clock, TestTube, Info, CheckCircle, Trash2 } from 'lucide-react';

export const NotificationTestPanel: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { items, loans, notifications: dbNotifications, createNotification, markNotificationRead, deleteNotification } = useData();
  const { showNotification, notifications: popupNotifications, clearNotifications } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'realtime' | 'popup' | 'database'>('realtime');
  
  // Popup notification states
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [popupDuration, setPopupDuration] = useState(5000);
  
  // Database notification states
  const [dbTitle, setDbTitle] = useState('');
  const [dbMessage, setDbMessage] = useState('');
  const [dbType, setDbType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [targetUser, setTargetUser] = useState('current');

  const sendTestNotification = async (type: string, customMessage?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      switch (type) {
        case 'welcome':
          await NotificationTriggers.onWelcomeUser(user);
          setMessage('Welcome notification sent!');
          break;
          
        case 'loan_approved':
          const firstItem = items[0];
          const mockLoan = {
            id: 'test-loan-' + Date.now(),
            userId: user.id,
            itemId: firstItem?.id || 'test-item',
            status: 'approved' as any,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            requestedAt: new Date()
          };
          await NotificationTriggers.onLoanApproved(mockLoan, firstItem || {
            id: 'test-item',
            name: 'Test Item',
            category: 'Electronics',
            description: 'Test item for notification',
            quantity: 1,
            availableQuantity: 1,
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            imageUrl: '',
            brand: '',
            model: '',
            serialNumber: '',
            purchaseDate: new Date(),
            purchasePrice: 0,
            location: '',
            condition: 'excellent',
            specifications: {}
          }, user);
          setMessage('Loan approval notification sent!');
          break;

        case 'item_added':
          const newItem = {
            id: 'test-item-' + Date.now(),
            name: 'New Test Item',
            category: 'Electronics',
            description: 'A new test item for notification testing',
            quantity: 1,
            availableQuantity: 1,
            tags: ['test', 'new'],
            createdAt: new Date(),
            updatedAt: new Date(),
            imageUrl: '',
            brand: 'TestBrand',
            model: 'TestModel',
            serialNumber: 'TEST123',
            purchaseDate: new Date(),
            purchasePrice: 100,
            location: 'Test Location',
            condition: 'excellent' as any,
            specifications: {}
          };
          await NotificationTriggers.onItemAdded(newItem);
          setMessage('New item notification sent!');
          break;

        case 'overdue':
          const overdueItem = items[0];
          const overdueLoan = {
            id: 'test-overdue-' + Date.now(),
            userId: user.id,
            itemId: overdueItem?.id || 'test-item',
            status: 'overdue' as any,
            startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          };
          await NotificationTriggers.onLoanOverdue(overdueLoan, overdueItem || {
            id: 'test-item',
            name: 'Overdue Test Item',
            category: 'Electronics',
            description: 'Test overdue item',
            quantity: 1,
            availableQuantity: 0,
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            imageUrl: '',
            brand: '',
            model: '',
            serialNumber: '',
            purchaseDate: new Date(),
            purchasePrice: 0,
            location: '',
            condition: 'excellent',
            specifications: {}
          }, user);
          setMessage('Overdue notification sent!');
          break;

        case 'maintenance':
          await NotificationTriggers.onSystemMaintenance(
            customMessage || 'Scheduled system maintenance will occur tonight from 2:00 AM to 4:00 AM.',
            new Date(Date.now() + 24 * 60 * 60 * 1000)
          );
          setMessage('System maintenance notification sent!');
          break;

        default:
          setMessage('Unknown notification type');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setMessage('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPopupNotification = () => {
    if (!popupTitle.trim() || !popupMessage.trim()) {
      alert('Silakan isi judul dan pesan');
      return;
    }

    showNotification(popupTitle, popupMessage, popupType, popupDuration);
    
    // Reset form
    setPopupTitle('');
    setPopupMessage('');
    setPopupType('info');
    setPopupDuration(5000);
  };

  const handleSendDbNotification = async () => {
    if (!dbTitle.trim() || !dbMessage.trim()) {
      alert('Silakan isi judul dan pesan');
      return;
    }

    const userId = targetUser === 'current' ? user?.id : undefined;
    
    await createNotification({
      title: dbTitle,
      message: dbMessage,
      type: dbType,
      userId: userId,
    });

    // Reset form
    setDbTitle('');
    setDbMessage('');
    setDbType('info');
    setTargetUser('current');
    
    showNotification('Berhasil!', 'Notifikasi database telah dibuat', 'success', 3000);
  };

  const sendQuickPopupTest = () => {
    const testNotifications = [
      { title: 'Test Info', message: 'Ini adalah notifikasi info untuk testing', type: 'info' as const },
      { title: 'Test Success', message: 'Berhasil! Ini adalah notifikasi sukses', type: 'success' as const },
      { title: 'Test Warning', message: 'Peringatan! Ada yang perlu diperhatikan', type: 'warning' as const },
      { title: 'Test Error', message: 'Error! Terjadi kesalahan sistem', type: 'error' as const },
    ];

    testNotifications.forEach((notif, index) => {
      setTimeout(() => {
        showNotification(notif.title, notif.message, notif.type, 4000);
      }, index * 500);
    });
  };

  const sendQuickDbTest = async () => {
    const testNotifications = [
      { title: 'DB Test Info', message: 'Database notification - Info type', type: 'info' as const },
      { title: 'DB Test Success', message: 'Database notification - Success type', type: 'success' as const },
      { title: 'DB Test Warning', message: 'Database notification - Warning type', type: 'warning' as const },
    ];

    for (let i = 0; i < testNotifications.length; i++) {
      const notif = testNotifications[i];
      await createNotification({
        title: notif.title,
        message: notif.message,
        type: notif.type,
        userId: user?.id,
      });
      
      // Small delay between each notification
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    showNotification('Berhasil!', 'Test database notifications telah dibuat', 'success', 3000);
  };

  const getTypeIcon = (notifType: string) => {
    switch (notifType) {
      case 'success': return <CheckCircle size={16} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'error': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Info size={16} className="text-blue-600" />;
    }
  };

  const getTypeColor = (notifType: string) => {
    switch (notifType) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle size={20} className="text-yellow-600" />
          <p className="text-yellow-800">Only admins can access the notification test panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TestTube className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Comprehensive Notification Test Panel
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Test all notification systems: Real-time, Popup, and Database
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('realtime')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'realtime'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Real-time Notifications
            </button>
            <button
              onClick={() => setActiveTab('popup')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'popup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Popup Notifications
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'database'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Database Notifications
            </button>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'realtime' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Welcome Notification */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Welcome</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Send a welcome notification to new users
                  </p>
                  <button
                    onClick={() => sendTestNotification('welcome')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Welcome</span>
                  </button>
                </div>

                {/* Loan Approved */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Loan Approved</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Simulate a loan approval notification
                  </p>
                  <button
                    onClick={() => sendTestNotification('loan_approved')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Approval</span>
                  </button>
                </div>

                {/* New Item */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package className="text-purple-600" size={20} />
                    <h3 className="font-semibold text-gray-900">New Item</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Notify about a new item being added
                  </p>
                  <button
                    onClick={() => sendTestNotification('item_added')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send New Item</span>
                  </button>
                </div>

                {/* Overdue Item */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="text-red-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Overdue Alert</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Send an overdue item notification
                  </p>
                  <button
                    onClick={() => sendTestNotification('overdue')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Overdue</span>
                  </button>
                </div>

                {/* System Maintenance */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow md:col-span-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <Bell className="text-orange-600" size={20} />
                    <h3 className="font-semibold text-gray-900">System Maintenance</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Send system-wide maintenance notifications
                  </p>
                  <button
                    onClick={() => sendTestNotification('maintenance')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Maintenance Notice</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How to Test:</h3>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Make sure you have multiple browser tabs/windows open</li>
                  <li>2. Click any notification button above</li>
                  <li>3. Check your notification dropdown for real-time updates</li>
                  <li>4. Verify browser notifications appear (if permission granted)</li>
                  <li>5. Listen for notification sounds</li>
                </ol>
              </div>
            </>
          )}

          {/* Popup Notifications Tab */}
          {activeTab === 'popup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Popup Notifications</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={sendQuickPopupTest}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Bell size={16} />
                    <span>Quick Test</span>
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                  <input
                    type="text"
                    value={popupTitle}
                    onChange={(e) => setPopupTitle(e.target.value)}
                    placeholder="Masukkan judul..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                  <select
                    value={popupType}
                    onChange={(e) => setPopupType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea
                  value={popupMessage}
                  onChange={(e) => setPopupMessage(e.target.value)}
                  placeholder="Masukkan pesan..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi: {popupDuration}ms
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="1000"
                  value={popupDuration}
                  onChange={(e) => setPopupDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1s</span>
                  <span>5s</span>
                  <span>10s</span>
                </div>
              </div>

              <button
                onClick={handleSendPopupNotification}
                disabled={!popupTitle.trim() || !popupMessage.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                <Send size={18} />
                <span>Kirim Popup Notification</span>
              </button>

              {/* Active Popup Notifications */}
              {popupNotifications.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Active Popup Notifications ({popupNotifications.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {popupNotifications.map((notif, index) => (
                      <div key={index} className={`border-l-4 p-3 rounded-r-lg ${getTypeColor(notif.type)}`}>
                        <div className="flex items-start space-x-2">
                          {getTypeIcon(notif.type)}
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{notif.title}</div>
                            <div className="text-gray-600 text-xs">{notif.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Database Notifications Tab */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Database Notifications</h3>
                <button
                  onClick={sendQuickDbTest}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Bell size={16} />
                  <span>Quick DB Test</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                  <input
                    type="text"
                    value={dbTitle}
                    onChange={(e) => setDbTitle(e.target.value)}
                    placeholder="Masukkan judul..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                  <select
                    value={dbType}
                    onChange={(e) => setDbType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea
                  value={dbMessage}
                  onChange={(e) => setDbMessage(e.target.value)}
                  placeholder="Masukkan pesan..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target User</label>
                <select
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="current">Current User ({user?.email})</option>
                  <option value="all">All Users (Global)</option>
                </select>
              </div>

              <button
                onClick={handleSendDbNotification}
                disabled={!dbTitle.trim() || !dbMessage.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                <Send size={18} />
                <span>Kirim Database Notification</span>
              </button>

              {/* Database Notifications List */}
              {dbNotifications.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Database Notifications ({dbNotifications.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dbNotifications.map((notif) => (
                      <div key={notif.id} className={`border-l-4 p-3 rounded-r-lg ${getTypeColor(notif.type)} ${!notif.isRead ? 'bg-opacity-100' : 'bg-opacity-50'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 flex-1">
                            {getTypeIcon(notif.type)}
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{notif.title}</div>
                              <div className="text-gray-600 text-xs">{notif.message}</div>
                              <div className="text-gray-400 text-xs mt-1">
                                {new Date(notif.createdAt).toLocaleString()} | 
                                {!notif.isRead ? ' Unread' : ' Read'}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {!notif.isRead && (
                              <button
                                onClick={() => markNotificationRead(notif.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
