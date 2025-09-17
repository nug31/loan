import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Home,
  ShoppingBag,
  ClipboardList,
  BoxIcon,
  Users,
  Menu,
  User,
  LogOut,
  X,
  BarChart3,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const BottomNavbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle logout navigation
  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/logout");
  };

  // Main navigation items
  const mainNavItems = [
    {
      path: "/",
      icon: Home,
      label: "Dashboard",
      show: true,
    },
    {
      path: "/browse",
      icon: ShoppingBag,
      label: "Browse",
      show: true,
    },
    {
      path: "/requests",
      icon: ClipboardList,
      label: "Requests",
      show: isAuthenticated,
    },
  ];

  // Admin navigation items for menu
  const adminNavItems = [
    {
      path: "/inventory",
      icon: BoxIcon,
      label: "Inventory",
      show: isAdmin,
    },
    {
      path: "/reports/monthly",
      icon: BarChart3,
      label: "Monthly Reports",
      show: isAdmin,
    },
    {
      path: "/users",
      icon: Users,
      label: "Users",
      show: isAdmin && user?.role === "manager",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className={`menu-overlay z-40 sm:hidden ${
            isMenuOpen ? "visible" : "hidden"
          }`}
          onClick={toggleMenu}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-lg border-r border-white/20 shadow-2xl z-50 side-menu sm:hidden ${
          isMenuOpen ? "open" : "closed"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Menu
            </h2>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100/50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <div className="px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {user?.username}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                  <div className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full inline-block mt-1">
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-2 px-4">
              {/* Main Navigation */}
              {mainNavItems
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-primary-50 text-primary-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

              {/* Admin Navigation */}
              {adminNavItems.some((item) => item.show) && (
                <>
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </div>
                  </div>
                  {adminNavItems
                    .filter((item) => item.show)
                    .map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={toggleMenu}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive(item.path)
                              ? "bg-primary-50 text-primary-700 shadow-sm"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                </>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="px-4 py-4 border-t border-gray-200/50">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  to="/login"
                  as={Link}
                  onClick={toggleMenu}
                  className="justify-center"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  to="/register"
                  as={Link}
                  onClick={toggleMenu}
                  className="justify-center"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden">
        <div className="bottom-nav-glass">
          <div className="grid grid-cols-4 h-16">
            {/* Main navigation items (3 slots) */}
            {mainNavItems
              .filter((item) => item.show)
              .slice(0, 3)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`bottom-nav-item flex flex-col items-center justify-center space-y-1 ${
                      isActive(item.path) ? "active" : ""
                    }`}
                  >
                    <Icon className={`bottom-nav-icon h-5 w-5`} />
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="bottom-nav-indicator" />
                    )}
                  </Link>
                );
              })}

            {/* Menu button (4th slot) */}
            <button
              onClick={toggleMenu}
              className={`bottom-nav-item flex flex-col items-center justify-center space-y-1 ${
                isMenuOpen ? "active" : ""
              }`}
            >
              <Menu className="bottom-nav-icon h-5 w-5" />
              <span className="text-xs font-medium">Menu</span>
              {isMenuOpen && (
                <div className="bottom-nav-indicator" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
