import React from 'react';
import {
  Home,
  Package,
  Users,
  FileText,
  Calendar,
  Settings,
  BarChart3,
  Shield,
  Activity,
  Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen }) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, adminOnly: false },
    { id: 'catalog', label: 'Item Catalog', icon: Package, adminOnly: false },
    { id: 'my-loans', label: 'My Loans', icon: FileText, adminOnly: false },
    { id: 'calendar', label: 'Calendar', icon: Calendar, adminOnly: false },
    ...(isAdmin ? [
      { id: 'admin-items', label: 'Manage Items', icon: Package, adminOnly: true },
      { id: 'admin-categories', label: 'Manage Categories', icon: Tag, adminOnly: true },
      { id: 'admin-loans', label: 'Manage Loans', icon: FileText, adminOnly: true },
      { id: 'admin-users', label: 'Manage Users', icon: Users, adminOnly: true },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
      { id: 'activity', label: 'Activity Logs', icon: Activity, adminOnly: true },
      { id: 'security', label: 'Security', icon: Shield, adminOnly: true },
    ] : []),
    ...(isAdmin ? [
      { id: 'settings', label: 'Settings', icon: Settings, adminOnly: true },
    ] : []),
  ];

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl
      transform transition-all duration-500 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex flex-col h-full relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-gray-100/50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-300/10 to-gray-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-300/10 to-gray-400/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative flex-1 overflow-y-auto py-8">
          <nav className="px-6 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    group w-full flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg shadow-gray-500/25'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                  )}
                  <Icon
                    size={22}
                    className={`mr-4 relative z-10 transition-all duration-300 ${
                      isActive ? 'text-white drop-shadow-sm' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="relative p-6 border-t border-white/20 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg drop-shadow-sm">NUG</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">LoanMitra</p>
              <p className="text-xs text-gray-500 font-medium">Developed by NUG</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};