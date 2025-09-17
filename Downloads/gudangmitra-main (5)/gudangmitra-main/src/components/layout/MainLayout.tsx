import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNavbar from "./BottomNavbar";
// ChatButton removed

interface MainLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  fullWidth = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative">
      {/* Ocean-themed Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-secondary-200/25 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200/15 to-warning-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-secondary-100/15 to-primary-100/20 rounded-full blur-3xl animate-float"></div>
        {/* Additional ocean elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-secondary-300/20 to-primary-300/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-accent-300/20 to-warning-300/15 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <Navbar />
      <main className="flex-grow relative z-10 pb-20 sm:pb-0">
        <div
          className={`${
            fullWidth ? "w-full" : "max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
          }`}
        >
          {children}
        </div>
      </main>
      <Footer />
      <BottomNavbar />

      {/* Chat functionality removed */}
    </div>
  );
};

export default MainLayout;
