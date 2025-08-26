import React from 'react';
import { Footer } from './Footer';
import { SimpleBottomNav } from './SimpleBottomNav';
import { TopNavbar } from './TopNavbar';
import { MobileHeader } from './MobileHeader';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-red-50">
      <div className="flex flex-col min-h-screen">
        {/* Desktop Top Navigation */}
        <TopNavbar 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        
        {/* Mobile Header */}
        <MobileHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="min-h-full lg:pb-0 pb-20">
            {children}
          </div>
        </main>

        {/* Footer - responsive for both desktop and mobile */}
        <Footer />
        
        {/* Mobile Bottom Navigation - only visible on mobile */}
        <SimpleBottomNav 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};
