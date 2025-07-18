import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Version 1.0.1 - Fixed translation errors by removing i18n completely
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
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
        return <Dashboard />;
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