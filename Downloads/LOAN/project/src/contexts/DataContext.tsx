import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Loan, Category, AppNotification, DashboardStats } from '../types';
import { apiService } from '../services/api';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from './AuthContext';

interface DataContextType {
  items: Item[];
  loans: Loan[];
  categories: Category[];
  notifications: AppNotification[];
  dashboardStats: DashboardStats;
  recentActivity: any[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  requestLoan: (loan: Omit<Loan, 'id' | 'requestedAt'>) => void;
  approveLoan: (loanId: string, approvedBy?: string) => void;
  rejectLoan: (loanId: string) => void;
  returnItem: (loanId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  searchItems: (query: string) => Item[];
  getItemById: (id: string) => Item | undefined;
  getLoanById: (id: string) => Loan | undefined;
  getUserLoans: (userId: string) => Loan[];
  getOverdueLoans: () => Loan[];
  requestExtension: (loanId: string, newEndDate: Date) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Use real-time notifications hook
  const {
    notifications,
    markAsRead: markNotificationRead
  } = useNotifications(user?.id);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalItems: 0,
    activeLoans: 0,
    pendingRequests: 0,
    overdueItems: 0,
    totalUsers: 0,
    categoryBreakdown: [],
    loanTrends: []
  });

  // Function to load items
  const loadItems = async () => {
    try {
      const itemsResponse = await apiService.getItems();
      if (itemsResponse.data) {
        console.log('✅ Items refreshed:', itemsResponse.data.length, 'items');
        setItems(itemsResponse.data);
      } else {
        console.error('❌ Failed to refresh items:', itemsResponse.error);
      }
    } catch (error) {
      console.error('❌ Error refreshing items:', error);
    }
  };

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading data from API...');
        
        // Load items from API
        const itemsResponse = await apiService.getItems();
        if (itemsResponse.data) {
          console.log('✅ Items loaded:', itemsResponse.data.length, 'items');
          setItems(itemsResponse.data);
        } else {
          console.error('❌ Failed to load items:', itemsResponse.error);
        }

        // Load loans from API
        const loansResponse = await apiService.getLoans();
        if (loansResponse.data) {
          console.log('✅ Loans loaded:', loansResponse.data.length, 'loans');
          console.log('🔍 Loans data:', loansResponse.data);
          console.log('🔍 Loans by status:', {
            pending: loansResponse.data.filter(l => l.status === 'pending').length,
            active: loansResponse.data.filter(l => l.status === 'active').length,
            approved: loansResponse.data.filter(l => l.status === 'approved').length,
            returned: loansResponse.data.filter(l => l.status === 'returned').length,
            overdue: loansResponse.data.filter(l => l.status === 'overdue').length,
          });
          setLoans(loansResponse.data);
        } else {
          console.error('❌ Failed to load loans:', loansResponse.error);
        }

        // Load categories from API
        const categoriesResponse = await apiService.getCategories();
        if (categoriesResponse.data) {
          console.log('✅ Categories loaded:', categoriesResponse.data.length, 'categories');
          setCategories(categoriesResponse.data);
        } else {
          console.error('❌ Failed to load categories:', categoriesResponse.error);
          // Fallback to mock categories if API fails
          const mockCategories: Category[] = [
            { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', icon: 'Laptop', color: '#3b82f6', itemCount: 25 },
            { id: '2', name: 'Tools', description: 'Hand tools and equipment', icon: 'Wrench', color: '#10b981', itemCount: 18 },
            { id: '3', name: 'Books', description: 'Books and publications', icon: 'Book', color: '#f59e0b', itemCount: 42 },
            { id: '4', name: 'Furniture', description: 'Office and home furniture', icon: 'Home', color: '#8b5cf6', itemCount: 12 },
            { id: '5', name: 'Sports', description: 'Sports equipment and gear', icon: 'Trophy', color: '#ef4444', itemCount: 15 },
            { id: '6', name: 'Photography', description: 'Camera and photography equipment', icon: 'Camera', color: '#ec4899', itemCount: 3 },
            { id: '7', name: 'Audio', description: 'Audio equipment and accessories', icon: 'Volume2', color: '#06b6d4', itemCount: 4 }
          ];
          setCategories(mockCategories);
        }

      } catch (error) {
        console.error('❌ Error loading data from API:', error);
      }
    };

    loadData();

    // Real-time notifications are now handled by useNotifications hook
  }, []);

  // Load dashboard stats from API
  const loadDashboardStats = async () => {
    try {
      console.log('📊 Loading dashboard stats from API...');
      console.log('📊 Current loans data for stats calculation:', loans.length, 'loans');
      console.log('📊 Loans breakdown:', loans.map(l => ({
        id: l.id.substring(0, 8),
        status: l.status,
        userId: l.userId?.substring(0, 8),
        itemId: l.itemId?.substring(0, 8)
      })));

      const response = await apiService.getDashboardStats();
      if (response.data) {
        console.log('✅ Dashboard stats loaded from API:', response.data);
        console.log('📊 API vs Expected comparison:');
        console.log('  API activeLoans:', response.data.activeLoans);
        console.log('  Expected activeLoans:', loans.filter(l => l.status === 'active').length);
        console.log('  API pendingRequests:', response.data.pendingRequests);
        console.log('  Expected pendingRequests:', loans.filter(l => l.status === 'pending').length);
        console.log('  API overdueItems:', response.data.overdueItems);
        console.log('  Expected overdueItems:', loans.filter(l => l.status === 'overdue').length);
        setDashboardStats(response.data);
      } else {
        console.error('❌ Failed to load dashboard stats:', response.error);
        console.log('🔄 Using fallback calculation...');
        // Fallback to calculated stats
        console.log('🔍 Calculating fallback stats from loans:', loans.length, 'loans');
        console.log('🔍 Loans for fallback calculation:', loans.map(l => ({ id: l.id, status: l.status, userId: l.userId })));
        const fallbackStats: DashboardStats = {
          totalItems: items.length,
          activeLoans: loans.filter(l => l.status === 'active').length,
          pendingRequests: loans.filter(l => l.status === 'pending').length,
          overdueItems: loans.filter(l => l.status === 'overdue').length,
          totalUsers: 5,
          categoryBreakdown: categories.map(c => ({ category: c.name, count: c.itemCount })),
          loanTrends: []
        };
        console.log('✅ Dashboard stats calculated as fallback:', fallbackStats);
        setDashboardStats(fallbackStats);
      }
    } catch (error) {
      console.error('❌ Error loading dashboard stats:', error);
      console.log('🔄 Using fallback calculation after error...');
      // Fallback to calculated stats
      const fallbackStats: DashboardStats = {
        totalItems: items.length,
        activeLoans: loans.filter(l => l.status === 'active').length,
        pendingRequests: loans.filter(l => l.status === 'pending').length,
        overdueItems: loans.filter(l => l.status === 'overdue').length,
        totalUsers: 5,
        categoryBreakdown: categories.map(c => ({ category: c.name, count: c.itemCount })),
        loanTrends: []
      };
      console.log('✅ Dashboard stats calculated as fallback after error:', fallbackStats);
      setDashboardStats(fallbackStats);
    }
  };

  // Update dashboard stats when data changes
  useEffect(() => {
    loadDashboardStats();
  }, [items, loans, categories]);

  const addItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiService.createItem(itemData);
      if (response.data) {
        setItems(prev => [...prev, response.data]);
        console.log('✅ Item added successfully:', response.data);
        return response.data;
      } else if (response.error) {
        console.error('❌ Error adding item:', response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error adding item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, itemData: Partial<Item>) => {
    try {
      const response = await apiService.updateItem(id, itemData);
      if (response.data) {
        // Update state dengan data yang dikembalikan dari server
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, ...response.data } : item
        ));
        console.log('✅ Item updated successfully:', response.data);
        return response.data;
      } else if (response.error) {
        console.error('❌ Error updating item:', response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiService.createCategory(categoryData);
      if (response.data) {
        setCategories(prev => [...prev, response.data]);
        console.log('✅ Category added successfully:', response.data);
        return response.data;
      } else if (response.error) {
        console.error('❌ Error adding category:', response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const response = await apiService.updateCategory(id, categoryData);
      if (response.data) {
        setCategories(prev => prev.map(category =>
          category.id === id ? { ...category, ...response.data } : category
        ));
        console.log('✅ Category updated successfully:', response.data);
        return response.data;
      } else if (response.error) {
        console.error('❌ Error updating category:', response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await apiService.deleteCategory(id);
      if (response.error) {
        throw new Error(response.error);
      }
      setCategories(prev => prev.filter(category => category.id !== id));
      console.log('✅ Category deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      throw error;
    }
  };

  const requestLoan = async (loanData: Omit<Loan, 'id' | 'requestedAt'>) => {
    try {
      console.log('🔄 Requesting loan with data:', loanData);
      console.log('🔄 Data types:', {
        userId: typeof loanData.userId,
        itemId: typeof loanData.itemId,
        startDate: typeof loanData.startDate,
        endDate: typeof loanData.endDate,
        startDateValue: loanData.startDate,
        endDateValue: loanData.endDate
      });
      const response = await apiService.createLoan(loanData);

      if (response.error) {
        console.error('❌ API error:', response.error);
        throw new Error(response.error);
      }

      if (response.data) {
        console.log('✅ Loan request successful:', response.data);
        setLoans(prev => [...prev, response.data]);
        return response.data;
      } else {
        console.error('❌ No data in loan response:', response);
        throw new Error('No data returned from loan request');
      }
    } catch (error) {
      console.error('❌ Error requesting loan:', error);
      throw error;
    }
  };

  const approveLoan = async (loanId: string, approvedBy?: string) => {
    try {
      console.log('🔄 Starting loan approval for:', loanId);
      const response = await apiService.approveLoan(loanId, approvedBy);
      
      if (response.data) {
        console.log('✅ Loan approval API response:', response.data);
        // Update with full loan data from backend
        setLoans(prev => prev.map(loan =>
          loan.id === loanId ? response.data : loan
        ));
        console.log('✅ Loan approved and moved to active status');

        // Refresh items to update available quantities
        await loadItems();
        
        // CRITICAL: Reload all loans from database to ensure consistency
        console.log('🔄 Reloading all loans from database...');
        const loansResponse = await apiService.getLoans();
        if (loansResponse.data) {
          console.log('✅ Loans reloaded after approval:', loansResponse.data.length, 'loans');
          console.log('🔍 Updated loans by status:', {
            pending: loansResponse.data.filter(l => l.status === 'pending').length,
            active: loansResponse.data.filter(l => l.status === 'active').length,
            approved: loansResponse.data.filter(l => l.status === 'approved').length,
            returned: loansResponse.data.filter(l => l.status === 'returned').length,
            overdue: loansResponse.data.filter(l => l.status === 'overdue').length,
          });
          setLoans(loansResponse.data);
        }
      } else {
        console.warn('⚠️ No response data from approval API, using fallback');
        // Fallback update
        setLoans(prev => prev.map(loan =>
          loan.id === loanId ? { ...loan, status: 'active' as any } : loan
        ));

        // Refresh items to update available quantities
        await loadItems();
        
        // Still reload loans even in fallback case
        const loansResponse = await apiService.getLoans();
        if (loansResponse.data) {
          setLoans(loansResponse.data);
        }
      }
    } catch (error) {
      console.error('❌ Error approving loan:', error);
    }
  };

  const rejectLoan = async (loanId: string) => {
    try {
      await apiService.rejectLoan(loanId);
      setLoans(prev => prev.map(loan => 
        loan.id === loanId ? { ...loan, status: 'rejected' as any } : loan
      ));
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  const returnItem = async (loanId: string) => {
    try {
      await apiService.returnItem(loanId);
      setLoans(prev => prev.map(loan =>
        loan.id === loanId ? { ...loan, status: 'returned' as any, actualReturnDate: new Date() } : loan
      ));

      // Refresh items to update available quantities
      await loadItems();
    } catch (error) {
      console.error('Error returning item:', error);
    }
  };

  // markNotificationRead is now handled by useNotifications hook

  const searchItems = (query: string): Item[] => {
    if (!query.trim()) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getItemById = (id: string): Item | undefined => {
    return items.find(item => item.id === id);
  };

  const getLoanById = (id: string): Loan | undefined => {
    return loans.find(loan => loan.id === id);
  };

  const getUserLoans = (userId: string): Loan[] => {
    return loans.filter(loan => loan.userId === userId);
  };

  const getOverdueLoans = (): Loan[] => {
    return loans.filter(loan => loan.status === 'overdue');
  };

  const requestExtension = (loanId: string, newEndDate: Date) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { 
        ...loan, 
        extensionRequested: true,
        extensionEndDate: newEndDate,
        status: 'pending' as any
      } : loan
    ));
  };

  const value: DataContextType = {
    items,
    loans,
    categories,
    notifications,
    dashboardStats,
    recentActivity,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    requestLoan,
    approveLoan,
    rejectLoan,
    returnItem,
    markNotificationRead,
    searchItems,
    getItemById,
    getLoanById,
    getUserLoans,
    getOverdueLoans,
    requestExtension
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
