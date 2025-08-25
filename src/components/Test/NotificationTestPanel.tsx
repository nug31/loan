import React, { useState } from 'react';
import { NotificationTriggers } from '../../services/notificationTriggers';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Bell, Send, Users, Package, AlertTriangle, Clock } from 'lucide-react';

export const NotificationTestPanel: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { items, loans } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Real-Time Notification Test Panel
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Test real-time notifications for different scenarios
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};
