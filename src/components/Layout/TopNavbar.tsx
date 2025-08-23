import React from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Settings, 
  Users,
  MoreHorizontal,
  BarChart3,
  Clock,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin, user, logout } = useAuth();

  // Define navigation items for regular users
  const userNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'catalog',
      label: 'Browse Items',
      icon: Package,
    },
    {
      id: 'my-loans',
      label: 'My Loans',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  // Define navigation items for admin users
  const adminNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'admin-items',
      label: 'Manage Items',
      icon: Package,
    },
    {
      id: 'admin-loans',
      label: 'Manage Loans',
      icon: FileText,
    },
    {
      id: 'admin-users',
      label: 'Manage Users',
      icon: Users,
    },
    {
      id: 'admin-categories',
      label: 'Categories',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 overflow-hidden">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4 lg:space-x-8 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <h1 className="text-xl lg:text-2xl font-bold" style={{color: '#E9631A'}}>SmartLend</h1>
            </div>
            
            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 lg:py-2.5 mx-0.5 lg:mx-1 rounded-lg whitespace-nowrap text-xs lg:text-sm
                      transition-all duration-200 ease-out
                      ${isActive 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                    style={isActive ? {backgroundColor: '#E9631A'} : {}}
                  >
                    <Icon 
                      size={18} 
                      className={`
                        transition-colors duration-200
                        ${isActive ? 'text-white' : 'text-current'}
                      `}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#E9631A'}}>
                <span className="text-white text-sm font-semibold">
                  {user?.firstName?.charAt(0) || user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName || user?.name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden xl:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
