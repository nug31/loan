import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search...',
    'common.filters': 'Filters',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.request': 'Request',
    'common.unavailable': 'Unavailable',
    'common.available': 'Available',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.catalog': 'Item Catalog',
    'nav.myLoans': 'My Loans',
    'nav.settings': 'Settings',
    'nav.manageItems': 'Manage Items',
    'nav.manageLoans': 'Manage Loans',
    'nav.manageUsers': 'Manage Users',
    'nav.manageCategories': 'Manage Categories',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': "Here's what's happening with your loans and items today.",
    'dashboard.personalOverview': "Here's an overview of your personal loan activity.",
    'dashboard.totalItems': 'Total Items',
    'dashboard.activeLoans': 'Active Loans',
    'dashboard.myActiveLoans': 'My Active Loans',
    'dashboard.pendingRequests': 'Pending Requests',
    'dashboard.myPendingRequests': 'My Pending Requests',
    'dashboard.overdueItems': 'Overdue Items',
    'dashboard.myOverdueItems': 'My Overdue Items',
    'dashboard.myTotalLoans': 'My Total Loans',
    'dashboard.loanTrends': 'Loan Trends',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.myRecentActivity': 'My Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.browseItems': 'Browse Items',
    'dashboard.myLoans': 'My Loans',
    'dashboard.manageUsers': 'Manage Users',
    'dashboard.totalLoansRecorded': 'total loans recorded',
    'dashboard.noRecentActivity': 'No recent activity',
    'dashboard.noLoanActivity': 'No loan activity yet',
    
    // Item Catalog
    'catalog.title': 'Item Catalog',
    'catalog.subtitle': 'Discover and request items from our comprehensive inventory',
    'catalog.totalItems': 'Total Items',
    'catalog.available': 'Available',
    'catalog.category': 'Category',
    'catalog.condition': 'Condition',
    'catalog.sortBy': 'Sort by',
    'catalog.allCategories': 'All Categories',
    'catalog.allConditions': 'All Conditions',
    'catalog.name': 'Name',
    'catalog.availability': 'Availability',
    'catalog.value': 'Value',
    'catalog.excellent': 'Excellent',
    'catalog.good': 'Good',
    'catalog.fair': 'Fair',
    'catalog.poor': 'Poor',
    'catalog.showing': 'Showing',
    'catalog.of': 'of',
    'catalog.items': 'items',
    'catalog.itemsAvailable': 'items available',
    'catalog.noItemsFound': 'No items found',
    'catalog.adjustCriteria': 'Try adjusting your search criteria or filters',
    'catalog.inStock': 'In Stock',
    'catalog.outOfStock': 'Out of Stock',
    
    // Request Form
    'request.title': 'Request Item',
    'request.item': 'Item',
    'request.reason': 'Reason',
    'request.reasonPlaceholder': 'Enter your reason for borrowing...',
    'request.startDate': 'Start Date',
    'request.returnDate': 'Return Date',
    'request.startTime': 'Start Time',
    
    // Status
    'status.requested': 'requested',
    'status.approved': 'approved',
    'status.returned': 'returned',
    'status.overdue': 'overdue',
    'status.recently': 'Recently',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    
    // Language
    'language.english': 'English',
    'language.indonesian': 'Bahasa Indonesia'
  },
  id: {
    // Common
    'common.loading': 'Memuat...',
    'common.search': 'Cari...',
    'common.filters': 'Filter',
    'common.cancel': 'Batal',
    'common.submit': 'Kirim',
    'common.request': 'Ajukan',
    'common.unavailable': 'Tidak Tersedia',
    'common.available': 'Tersedia',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.catalog': 'Katalog Item',
    'nav.myLoans': 'Pinjaman Saya',
    'nav.settings': 'Pengaturan',
    'nav.manageItems': 'Kelola Item',
    'nav.manageLoans': 'Kelola Pinjaman',
    'nav.manageUsers': 'Kelola Pengguna',
    'nav.manageCategories': 'Kelola Kategori',
    
    // Dashboard
    'dashboard.welcome': 'Selamat Datang',
    'dashboard.overview': 'Berikut adalah aktivitas pinjaman dan item hari ini.',
    'dashboard.personalOverview': 'Berikut adalah ringkasan aktivitas pinjaman pribadi Anda.',
    'dashboard.totalItems': 'Total Item',
    'dashboard.activeLoans': 'Pinjaman Aktif',
    'dashboard.myActiveLoans': 'Pinjaman Aktif Saya',
    'dashboard.pendingRequests': 'Permintaan Tertunda',
    'dashboard.myPendingRequests': 'Permintaan Tertunda Saya',
    'dashboard.overdueItems': 'Item Terlambat',
    'dashboard.myOverdueItems': 'Item Terlambat Saya',
    'dashboard.myTotalLoans': 'Total Pinjaman Saya',
    'dashboard.loanTrends': 'Tren Pinjaman',
    'dashboard.recentActivity': 'Aktivitas Terkini',
    'dashboard.myRecentActivity': 'Aktivitas Terkini Saya',
    'dashboard.quickActions': 'Tindakan Cepat',
    'dashboard.browseItems': 'Jelajahi Item',
    'dashboard.myLoans': 'Pinjaman Saya',
    'dashboard.manageUsers': 'Kelola Pengguna',
    'dashboard.totalLoansRecorded': 'total pinjaman tercatat',
    'dashboard.noRecentActivity': 'Tidak ada aktivitas terkini',
    'dashboard.noLoanActivity': 'Belum ada aktivitas pinjaman',
    
    // Item Catalog
    'catalog.title': 'Katalog Item',
    'catalog.subtitle': 'Temukan dan ajukan item dari inventori lengkap kami',
    'catalog.totalItems': 'Total Item',
    'catalog.available': 'Tersedia',
    'catalog.category': 'Kategori',
    'catalog.condition': 'Kondisi',
    'catalog.sortBy': 'Urutkan berdasarkan',
    'catalog.allCategories': 'Semua Kategori',
    'catalog.allConditions': 'Semua Kondisi',
    'catalog.name': 'Nama',
    'catalog.availability': 'Ketersediaan',
    'catalog.value': 'Nilai',
    'catalog.excellent': 'Sangat Baik',
    'catalog.good': 'Baik',
    'catalog.fair': 'Cukup',
    'catalog.poor': 'Buruk',
    'catalog.showing': 'Menampilkan',
    'catalog.of': 'dari',
    'catalog.items': 'item',
    'catalog.itemsAvailable': 'item tersedia',
    'catalog.noItemsFound': 'Tidak ada item ditemukan',
    'catalog.adjustCriteria': 'Coba sesuaikan kriteria pencarian atau filter Anda',
    'catalog.inStock': 'Tersedia',
    'catalog.outOfStock': 'Habis',
    
    // Request Form
    'request.title': 'Ajukan Item',
    'request.item': 'Item',
    'request.reason': 'Alasan',
    'request.reasonPlaceholder': 'Masukkan alasan peminjaman...',
    'request.startDate': 'Tanggal Mulai',
    'request.returnDate': 'Tanggal Kembali',
    'request.startTime': 'Waktu Mulai',
    
    // Status
    'status.requested': 'mengajukan',
    'status.approved': 'menyetujui',
    'status.returned': 'mengembalikan',
    'status.overdue': 'terlambat',
    'status.recently': 'Baru-baru ini',
    
    // Auth
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.email': 'Email',
    'auth.password': 'Kata Sandi',
    'auth.firstName': 'Nama Depan',
    'auth.lastName': 'Nama Belakang',
    
    // Language
    'language.english': 'English',
    'language.indonesian': 'Bahasa Indonesia'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackK of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackK];
          } else {
            return key; // Return key if not found in both languages
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
