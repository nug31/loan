import React from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Settings, 
  MoreHorizontal,
  Users,
  BarChart3,
  Clock,
  Search
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
      color: 'text-primary-400',
      activeColor: 'text-gradient-cyber-blue',
      bgColor: 'bg-primary-500/20'
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: Package,
      color: 'text-gradient-mint-green',
      activeColor: 'text-gradient-mint-green',
      bgColor: 'bg-gradient-mint-green/20'
    },
    {
      id: 'my-loans',
      label: 'My Loans',
      icon: FileText,
      color: 'text-gradient-neon-purple',
      activeColor: 'text-gradient-neon-purple',
      bgColor: 'bg-gradient-neon-purple/20'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-secondary-400',
      activeColor: 'text-secondary-300',
      bgColor: 'bg-secondary-500/20'
    }
  ];

  // Define navigation items for admin users
  const adminNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'text-primary-400',
      activeColor: 'text-gradient-cyber-blue',
      bgColor: 'bg-primary-500/20'
    },
    {
      id: 'admin-items',
      label: 'Manage',
      icon: Package,
      color: 'text-gradient-mint-green',
      activeColor: 'text-gradient-mint-green',
      bgColor: 'bg-gradient-mint-green/20'
    },
    {
      id: 'admin-loans',
      label: 'Loans',
      icon: FileText,
      color: 'text-gradient-neon-purple',
      activeColor: 'text-gradient-neon-purple',
      bgColor: 'bg-gradient-neon-purple/20'
    },
    {
      id: 'admin-users',
      label: 'Users',
      icon: Users,
      color: 'text-gradient-sunset-orange',
      activeColor: 'text-gradient-sunset-orange',
      bgColor: 'bg-gradient-sunset-orange/20'
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      color: 'text-secondary-400',
      activeColor: 'text-secondary-300',
      bgColor: 'bg-secondary-500/20'
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
          {/* Modern Cyber Background */}
          <div className="mobile-nav-cyber mobile-shadow-cyber">
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
                      flex flex-col items-center justify-center p-3 rounded-3xl
                      mobile-bounce touch-target animate-fade-in
                      ${isActive 
                        ? `scale-110 shadow-glow-cyber transform ring-2 ring-gradient-cyber-blue/50 ${item.bgColor}` 
                        : `hover:scale-105 active:scale-95 hover:shadow-glow mobile-transition glass`
                      }
                      min-w-[64px] relative group overflow-hidden
                    `}
                  >
                    {/* Active glow effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-cyber rounded-3xl blur-lg animate-pulse-glow opacity-60"></div>
                    )}
                    
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 
                                    rounded-3xl"></div>
                    
                    {/* Icon with notification badge area */}
                    <div className="relative mb-2 z-10">
                      <Icon 
                        size={24} 
                        className={`
                          transition-all duration-500 animate-float-smooth
                          ${isActive 
                            ? `${item.activeColor} drop-shadow-lg filter brightness-110 shadow-neon` 
                            : `${item.color} group-hover:scale-110 group-hover:drop-shadow-md hover:brightness-125`
                          }
                        `}
                        strokeWidth={isActive ? 2.8 : 2.2}
                      />
                      
                      {/* Modern notification badges */}
                      {item.id === 'my-loans' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent-400 to-accent-600 
                                        rounded-full border-2 border-white/80 shadow-lg animate-bounce-gentle 
                                        flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                      {item.id === 'admin-loans' && isAdmin && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-gradient-sunset-orange to-gradient-electric-pink
                                        rounded-full border-2 border-white/80 shadow-lg animate-bounce-gentle 
                                        flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced label */}
                    <span 
                      className={`
                        text-xs font-bold transition-all duration-500 truncate z-10 animate-fade-in
                        ${isActive 
                          ? `${item.activeColor} drop-shadow-md shadow-neon` 
                          : `${item.color} group-hover:drop-shadow-sm group-hover:brightness-125`
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Safe area bottom padding with cyber theme */}
            <div className="pb-safe mobile-nav-cyber"></div>
          </div>
        </div>
      </div>

      {/* Admin "More" Modal/Dropdown */}
      {isAdmin && activeTab === 'settings' && (
        <div className="lg:hidden fixed inset-0 z-40 flex items-end animate-fade-in">
          {/* Enhanced Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => onTabChange('dashboard')}
          />
          
          {/* Modern Bottom Sheet */}
          <div className="relative w-full glass-cyber rounded-t-3xl shadow-2xl max-h-[50vh] overflow-hidden animate-slide-up border-t border-gradient-cyber-blue/30">
            {/* Modern Handle */}
            <div className="flex justify-center pt-4 pb-3">
              <div className="w-12 h-1.5 bg-gradient-cyber rounded-full animate-pulse-glow"></div>
            </div>
            
            {/* Enhanced Content */}
            <div className="px-6 pb-safe-area-inset-bottom">
              <h3 className="text-xl font-bold gradient-text-cyber mb-6 px-2 text-center">Admin Tools</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onTabChange('admin-browse')}
                  className="flex flex-col items-center p-5 glass rounded-3xl mobile-bounce card-mobile-cyber hover:shadow-glow group"
                >
                  <Search className="text-primary-400 mb-3 group-hover:text-gradient-cyber-blue transition-all duration-300 animate-float-smooth" size={28} />
                  <span className="text-sm font-bold text-primary-300 group-hover:text-white transition-all duration-300">Browse Items</span>
                </button>
                
                <button
                  onClick={() => onTabChange('admin-items')}
                  className="flex flex-col items-center p-5 glass rounded-3xl mobile-bounce card-mobile-cyber hover:shadow-glow-green group"
                >
                  <Package className="text-gradient-mint-green mb-3 group-hover:scale-110 transition-all duration-300 animate-float-smooth" size={28} />
                  <span className="text-sm font-bold text-gradient-mint-green group-hover:text-white transition-all duration-300">Manage Items</span>
                </button>
                
                <button
                  onClick={() => onTabChange('admin-categories')}
                  className="flex flex-col items-center p-5 glass rounded-3xl mobile-bounce card-mobile-cyber hover:shadow-glow-purple group"
                >
                  <BarChart3 className="text-gradient-neon-purple mb-3 group-hover:scale-110 transition-all duration-300 animate-float-smooth" size={28} />
                  <span className="text-sm font-bold text-gradient-neon-purple group-hover:text-white transition-all duration-300">Categories</span>
                </button>
                
                <button
                  onClick={() => onTabChange('settings')}
                  className="flex flex-col items-center p-5 glass rounded-3xl mobile-bounce card-mobile-cyber hover:shadow-glow group"
                >
                  <Settings className="text-secondary-400 mb-3 group-hover:text-secondary-200 group-hover:rotate-180 transition-all duration-500 animate-float-smooth" size={28} />
                  <span className="text-sm font-bold text-secondary-400 group-hover:text-white transition-all duration-300">Settings</span>
                </button>
                
                <button
                  onClick={() => onTabChange('my-loans')}
                  className="flex flex-col items-center p-5 glass rounded-3xl mobile-bounce card-mobile-cyber hover:shadow-glow-red group col-span-2"
                >
                  <Clock className="text-gradient-electric-pink mb-3 group-hover:scale-110 transition-all duration-300 animate-float-smooth" size={28} />
                  <span className="text-sm font-bold text-gradient-electric-pink group-hover:text-white transition-all duration-300">My Activity</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
