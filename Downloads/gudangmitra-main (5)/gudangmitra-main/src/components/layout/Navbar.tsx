import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  BoxIcon,
  ShoppingBag,
  Users,
  Home,
  ClipboardList,
  LogOut,
  User,
  ChevronDown,
  BarChart3,
  // MessageSquare removed
} from "lucide-react";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import NotificationBell from "../notifications/NotificationBell";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect with throttle for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown on scroll or route change
  useEffect(() => {
    if (showProfileDropdown) {
      const handleScroll = () => setShowProfileDropdown(false);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showProfileDropdown]);

  // Close dropdown on route change
  useEffect(() => {
    setShowProfileDropdown(false);
  }, [location.pathname]);

  // Handle logout navigation
  const handleLogout = () => {
    navigate("/logout");
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`sticky-navbar transition-all duration-500 ease-out ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-3d-hover border-b border-white/30 py-2"
          : "bg-white/95 backdrop-blur-md shadow-3d border-b border-white/20 py-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo size={48} className="rounded-full" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Gudang Mitra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/browse"
                className={`${
                  isActive("/browse")
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Browse Items
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/requests"
                    className={`${
                      isActive("/requests")
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Requests
                  </Link>
                  {/* Chat link removed */}
                  {isAdmin && (
                    <>
                      <Link
                        to="/inventory"
                        className={`${
                          isActive("/inventory")
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        <BoxIcon className="h-4 w-4 mr-1" />
                        Inventory
                      </Link>
                      <Link
                        to="/reports/monthly"
                        className={`${
                          isActive("/reports/monthly")
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Reports
                      </Link>

                      {/* Only show Users link for managers */}
                      {user?.role === "manager" && (
                        <Link
                          to="/users"
                          className={`${
                            isActive("/users")
                              ? "border-primary-500 text-primary-600"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Users
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side - Authentication & Profile */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell - Desktop only */}
                <div className="hidden sm:block">
                  <NotificationBell />
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 bg-white/80 hover:bg-white/90 border border-gray-200 rounded-full pl-2 pr-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {user?.username}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <>
                      {/* Overlay to close dropdown */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowProfileDropdown(false)}
                      />
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-20 overflow-hidden">
                        <div className="py-2">
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user?.username}</div>
                                <div className="text-sm text-gray-500">{user?.email}</div>
                                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                                  {user?.role}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>My Profile</span>
                            </button>
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Mobile Notification Bell */}
                <div className="sm:hidden">
                  <NotificationBell />
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  to="/login"
                  as={Link}
                  className="border-gray-300 hover:bg-gray-100 text-gray-700"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  to="/register"
                  as={Link}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu removed - using BottomNavbar instead */}
    </nav>
  );
};

export default Navbar;
