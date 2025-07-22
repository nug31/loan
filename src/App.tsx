import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';

// Version 1.0.1 - Fixed translation errors by removing i18n completely
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Layout } from './components/Layout/Layout';
// import { Dashboard } from './components/Dashboard/Dashboard';
import { ItemCatalog } from './components/Catalog/ItemCatalog';
import { MyLoans } from './components/Loans/MyLoans';
import { LoanCalendar } from './components/Calendar/LoanCalendar';
import { ManageItems } from './components/Admin/ManageItems';
import { ManageLoans } from './components/Admin/ManageLoans';
import { ManageUsers } from './components/Admin/ManageUsers';
import ManageCategories from './components/Admin/ManageCategories';
import { Analytics } from './components/Analytics/Analytics';
import { ActivityLogs } from './components/Activity/ActivityLogs';
import { Security } from './components/Security/Security';
import { Settings } from './components/Settings/Settings';
import { Package, FileText, Clock, AlertTriangle, TrendingUp, Calendar, Users, CheckCircle } from 'lucide-react';

// Temporary inline Dashboard component
const Dashboard: React.FC<{ onTabChange: (tab: string) => void }> = ({ onTabChange }) => {
  const { user, isAdmin } = useAuth();
  const { dashboardStats, loans, getUserLoans, getOverdueLoans } = useData();

  const userLoans = getUserLoans(user?.id || '');
  const overdueLoans = getOverdueLoans();
  const activeUserLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingUserLoans = userLoans.filter(loan => loan.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-red-50">
      <div className="space-y-8 p-6">
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-red-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold gradient-text">
                Welcome back, {user?.firstName || user?.email}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening with your loans and items today.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.totalItems || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Package size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-3xl font-bold text-gray-900">{isAdmin ? dashboardStats?.activeLoans || 0 : activeUserLoans.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <FileText size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">{isAdmin ? dashboardStats?.pendingLoans || 0 : pendingUserLoans.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg">
                <Clock size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-3xl font-bold text-gray-900">{isAdmin ? overdueLoans.length : userLoans.filter(l => l.status === 'overdue').length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <AlertTriangle size={28} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Loan Trends</h3>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-red-500" size={20} />
                <span className="text-sm font-semibold text-red-600">7 days</span>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between space-x-2 mb-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayLoans = loans.filter(loan => {
                  try {
                    const loanDate = new Date(loan.requestedAt);
                    if (isNaN(loanDate.getTime())) return false;
                    return loanDate.toDateString() === date.toDateString();
                  } catch (error) {
                    return false;
                  }
                });
                const maxLoans = Math.max(...Array.from({ length: 7 }, (_, j) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - j));
                  return loans.filter(l => {
                    try {
                      const loanDate = new Date(l.requestedAt);
                      if (isNaN(loanDate.getTime())) return false;
                      return loanDate.toDateString() === d.toDateString();
                    } catch (error) {
                      return false;
                    }
                  }).length;
                }), 1);

                const requested = dayLoans.filter(l => l.status === 'pending').length;
                const approved = dayLoans.filter(l => l.status === 'active').length;
                const returned = dayLoans.filter(l => l.status === 'returned').length;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-br from-amber-50 to-red-50 rounded-xl border border-red-100 p-2 mb-2">
                      <div className="space-y-1">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-sm transition-all duration-500 hover:scale-105"
                          style={{
                            height: `${Math.max((requested / maxLoans) * 80, requested > 0 ? 8 : 0)}px`,
                            minHeight: requested > 0 ? '8px' : '0px'
                          }}
                          title={`${requested} requested`}
                        ></div>
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm transition-all duration-500 hover:scale-105"
                          style={{
                            height: `${Math.max((approved / maxLoans) * 80, approved > 0 ? 8 : 0)}px`,
                            minHeight: approved > 0 ? '8px' : '0px'
                          }}
                          title={`${approved} approved`}
                        ></div>
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm transition-all duration-500 hover:scale-105"
                          style={{
                            height: `${Math.max((returned / maxLoans) * 80, returned > 0 ? 8 : 0)}px`,
                            minHeight: returned > 0 ? '8px' : '0px'
                          }}
                          title={`${returned} returned`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-sm"></div>
                <span className="text-gray-600">Requested</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm"></div>
                <span className="text-gray-600">Approved</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm"></div>
                <span className="text-gray-600">Returned</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl border border-red-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-red-600">{loans.length}</span> total loans recorded
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {loans
                .sort((a, b) => {
                  try {
                    const dateA = new Date(a.requestedAt);
                    const dateB = new Date(b.requestedAt);
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
                    return dateB.getTime() - dateA.getTime();
                  } catch (error) {
                    return 0;
                  }
                })
                .slice(0, 5)
                .map((loan) => {
                  const activityType = loan.status === 'pending' ? 'requested' :
                                     loan.status === 'active' ? 'approved' :
                                     loan.status === 'returned' ? 'returned' : 'overdue';

                  const iconColor = activityType === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                   activityType === 'requested' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' :
                                   activityType === 'returned' ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                                   'bg-gradient-to-r from-red-500 to-red-600';

                  const IconComponent = activityType === 'approved' ? FileText :
                                       activityType === 'requested' ? Clock :
                                       activityType === 'returned' ? Package :
                                       AlertTriangle;

                  return (
                    <div key={loan.id} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-red-50 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className={`p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${iconColor} text-white`}>
                        <IconComponent size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-900 transition-colors">
                          Loan {activityType}
                        </p>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
                          {(() => {
                            try {
                              const date = new Date(loan.requestedAt);
                              if (isNaN(date.getTime())) {
                                return 'Recently';
                              }
                              return date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (error) {
                              return 'Recently';
                            }
                          })()}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  );
                })}
              {loans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onTabChange('catalog')}
                className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Package size={24} />
                <span className="text-sm font-semibold">Browse Items</span>
              </button>
              <button
                onClick={() => onTabChange('my-loans')}
                className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FileText size={24} />
                <span className="text-sm font-semibold">My Loans</span>
              </button>
              <button
                onClick={() => onTabChange('calendar')}
                className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Calendar size={24} />
                <span className="text-sm font-semibold">Calendar</span>
              </button>
              {isAdmin ? (
                <button
                  onClick={() => onTabChange('admin-users')}
                  className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Users size={24} />
                  <span className="text-sm font-semibold">Manage Users</span>
                </button>
              ) : (
                <button
                  onClick={() => onTabChange('settings')}
                  className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Users size={24} />
                  <span className="text-sm font-semibold">Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  return isLogin ? (
    <LoginForm onToggleForm={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onToggleForm={() => setIsLogin(true)} />
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'catalog':
        return <ItemCatalog />;
      case 'my-loans':
        return <MyLoans />;
      case 'calendar':
        return <LoanCalendar />;
      case 'admin-items':
        return <ManageItems />;
      case 'admin-loans':
        return <ManageLoans />;
      case 'admin-users':
        return <ManageUsers />;
      case 'admin-categories':
        return <ManageCategories />;
      case 'analytics':
        return <Analytics />;
      case 'activity':
        return <ActivityLogs />;
      case 'security':
        return <Security />;
      case 'settings':
        return isAdmin ? <Settings /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;