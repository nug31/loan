import React from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Settings, 
  MoreHorizontal,
  Users,
  BarChart3,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();

  // Define navigation items for regular users
  const userNavItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      color: 'text-blue-600',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: Package,
      color: 'text-green-600',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'my-loans',
      label: 'My Loans',
      icon: FileText,
      color: 'text-purple-600',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      activeColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // Define navigation items for admin users
  const adminNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'text-blue-600',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'catalog',
      label: 'Items',
      icon: Package,
      color: 'text-green-600',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'admin-loans',
      label: 'Loans',
      icon: FileText,
      color: 'text-purple-600',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'admin-users',
      label: 'Users',
      icon: Users,
      color: 'text-orange-600',
      activeColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      color: 'text-gray-600',
      activeColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleTabChange = (tabId: string) => {
    if (tabId === 'more' && isAdmin) {
      // Handle "More" button for admin - could open a modal or submenu
      // For now, let's navigate to settings
      onTabChange('settings');
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation - only visible on mobile/tablet */}
      <div className="lg:hidden">
        {/* Safe area padding for newer phones */}
        <div className="h-20 bg-transparent"></div>
        
        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Background with glass effect similar to the example */}
          <div className="bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
            {/* Navigation Items */}
            <div className="flex items-center justify-between px-4 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || 
                  (item.id === 'more' && ['settings', 'admin-items', 'admin-categories'].includes(activeTab));
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-2xl
                      transition-all duration-300 ease-out touch-target
                      ${isActive 
                        ? 'bg-white/20 scale-110 shadow-lg transform' 
                        : 'hover:bg-white/10 active:bg-white/20 active:scale-95'
                      }
                      min-w-[60px] relative group
                    `}
                  >
                    {/* Glow effect for active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-sm"></div>
                    )}
                    
                    {/* Icon with notification badge area */}
                    <div className="relative mb-1 z-10">
                      <Icon 
                        size={22} 
                        className={`
                          transition-all duration-300
                          ${isActive 
                            ? 'text-white drop-shadow-lg' 
                            : 'text-white/70 group-hover:text-white/90'
                          }
                        `}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      
                      {/* Badge/notification indicator */}
                      {item.id === 'my-loans' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full border border-white/50 shadow-lg animate-pulse"></div>
                      )}
                      {item.id === 'admin-loans' && isAdmin && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full border border-white/50 shadow-lg animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span 
                      className={`
                        text-xs font-semibold transition-all duration-300 truncate z-10
                        ${isActive 
                          ? 'text-white drop-shadow-sm' 
                          : 'text-white/70 group-hover:text-white/90'
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Safe area bottom padding for newer iPhones */}
            <div className="pb-safe bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95"></div>
          </div>
        </div>
      </div>

      {/* Admin "More" Modal/Dropdown */}
      {isAdmin && activeTab === 'settings' && (
        <div className="lg:hidden fixed inset-0 z-40 flex items-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => onTabChange('dashboard')}
          />
          
          {/* Bottom Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-hidden">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="px-4 pb-safe-area-inset-bottom">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Admin Tools</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onTabChange('admin-items')}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl transition-colors hover:bg-blue-100"
                >
                  <Package className="text-blue-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-blue-900">Manage Items</span>
                </button>
                
                <button
                  onClick={() => onTabChange('admin-categories')}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-2xl transition-colors hover:bg-green-100"
                >
                  <BarChart3 className="text-green-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-green-900">Categories</span>
                </button>
                
                <button
                  onClick={() => onTabChange('settings')}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl transition-colors hover:bg-gray-100"
                >
                  <Settings className="text-gray-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-900">Settings</span>
                </button>
                
                <button
                  onClick={() => onTabChange('my-loans')}
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-2xl transition-colors hover:bg-purple-100"
                >
                  <Clock className="text-purple-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-purple-900">My Activity</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
