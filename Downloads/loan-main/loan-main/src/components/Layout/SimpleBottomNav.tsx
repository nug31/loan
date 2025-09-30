import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Settings, 
  MoreHorizontal,
  Users,
  Search,
  Grid,
  Clock,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SimpleBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SimpleBottomNav: React.FC<SimpleBottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Define navigation items for regular users (sesuai LOAN app)
  const userNavItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'catalog',
      label: 'Items',
      icon: Package,
    },
    {
      id: 'my-loans',
      label: 'My Loans',
      icon: FileText,
    },
    {
      id: 'notifications',
      label: 'Notif',
      icon: Bell,
    },
    {
      id: 'settings',
      label: 'Profile',
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
      id: 'admin-loans',
      label: 'Loans',
      icon: FileText,
    },
    {
      id: 'notifications',
      label: 'Notif',
      icon: Bell,
    },
    {
      id: 'admin-users',
      label: 'Users',
      icon: Users,
    },
    {
      id: 'settings',
      label: 'More',
      icon: MoreHorizontal,
    }
  ];

  // Define more menu items for admin users
  const adminMoreItems = [
    {
      id: 'admin-browse',
      label: 'Browse Items',
      icon: Search,
    },
    {
      id: 'admin-items',
      label: 'Manage Items',
      icon: Package,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleTabChange = (tabId: string) => {
    if (tabId === 'categories') {
      onTabChange('categories');
    } else if (tabId === 'settings' && isAdmin) {
      setShowMoreMenu(true); // Show more menu for admin
    } else {
      onTabChange(tabId);
      setShowMoreMenu(false);
    }
  };

  const handleMoreItemClick = (itemId: string) => {
    onTabChange(itemId);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Bottom Navigation - mobile only */}
      <div className="lg:hidden">
        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Background dengan warna yang lebih soft */}
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
            {/* Navigation Items */}
            <div className="flex items-center justify-around px-4 py-2 safe-area-padding-bottom">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || 
                  (item.id === 'search' && activeTab === 'catalog') ||
                  (item.id === 'admin-items' && activeTab === 'admin-items') ||
                  (item.id === 'settings' && ['settings', 'admin-categories'].includes(activeTab));
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`
                      flex flex-col items-center justify-center py-2 px-3
                      transition-all duration-200 ease-out
                      min-w-0 flex-1 max-w-[70px] relative group
                    `}
                  >
                    {/* Icon */}
                    <div className="relative mb-1">
                      <Icon 
                        size={20} 
                        className={`
                          transition-all duration-200
                          ${isActive 
                            ? 'text-[#274C5B]' 
                            : 'text-gray-500 group-hover:text-[#274C5B]'
                          }
                        `}
                        fill={isActive ? 'currentColor' : 'none'}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                    </div>
                    
                    {/* Label */}
                    <span 
                      className={`
                        text-xs font-medium transition-all duration-200 truncate
                        ${isActive 
                          ? 'text-[#274C5B]' 
                          : 'text-gray-500 group-hover:text-[#274C5B]'
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Safe area bottom padding */}
            <div className="pb-safe bg-white/95"></div>
          </div>
        </div>
        
        {/* Spacer to prevent content from being hidden behind nav - mobile only */}
        <div className="h-16 pb-safe"></div>
      </div>

      {/* Admin More Menu Modal */}
      {showMoreMenu && isAdmin && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMoreMenu(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-hidden">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="px-4 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Admin Tools</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {adminMoreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMoreItemClick(item.id)}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl transition-colors hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Icon className="mb-2" size={24} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
