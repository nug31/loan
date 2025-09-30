import React from 'react';
import { NotificationBellIcon } from '../UI/NotificationBellIcon';

export const NotificationBellDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Notification Bell Badge Demo
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* No notifications */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={0}
              onClick={() => alert('No notifications')}
            />
            <span className="text-sm text-gray-600">No notifications (0)</span>
          </div>

          {/* Single digit */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={3}
              onClick={() => alert('3 notifications')}
            />
            <span className="text-sm text-gray-600">Single digit (3)</span>
          </div>

          {/* Double digit */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={25}
              onClick={() => alert('25 notifications')}
            />
            <span className="text-sm text-gray-600">Double digit (25)</span>
          </div>

          {/* 99+ notifications */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={150}
              onClick={() => alert('150+ notifications')}
            />
            <span className="text-sm text-gray-600">99+ (150)</span>
          </div>
        </div>
      </div>

      {/* Different colors and sizes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Different Styles & Colors
        </h3>
        
        <div className="flex flex-wrap gap-6">
          {/* Default */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={9}
              size={24}
              onClick={() => alert('Default style')}
            />
            <span className="text-sm text-gray-600">Default</span>
          </div>

          {/* Orange theme (for header) */}
          <div className="flex flex-col items-center space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg">
            <NotificationBellIcon
              count={9}
              size={24}
              bellClassName="text-orange-100"
              className="hover:bg-orange-400"
              onClick={() => alert('Orange theme')}
            />
            <span className="text-xs text-orange-100">Header style</span>
          </div>

          {/* Large size */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={42}
              size={32}
              onClick={() => alert('Large size')}
            />
            <span className="text-sm text-gray-600">Large (32px)</span>
          </div>

          {/* Custom badge color */}
          <div className="flex flex-col items-center space-y-2">
            <NotificationBellIcon
              count={7}
              size={24}
              badgeClassName="bg-blue-500"
              onClick={() => alert('Custom badge color')}
            />
            <span className="text-sm text-gray-600">Blue badge</span>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Usage Examples
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium text-gray-700">Basic usage</span>
            <NotificationBellIcon
              count={3}
              onClick={() => alert('Basic notification clicked')}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium text-gray-700">In navigation bar</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">SmartLend</span>
              <NotificationBellIcon
                count={15}
                onClick={() => alert('Nav notification clicked')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium text-gray-700">High count</span>
            <NotificationBellIcon
              count={999}
              onClick={() => alert('999+ notifications!')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
