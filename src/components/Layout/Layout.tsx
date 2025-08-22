import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SimpleBottomNav } from './SimpleBottomNav';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-red-50">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="min-h-full pb-20">
            {children}
          </div>
        </main>

        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <SimpleBottomNav 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};
