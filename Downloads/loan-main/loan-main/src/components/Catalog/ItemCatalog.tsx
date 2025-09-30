import React, { useState } from 'react';
import { Search, Filter, Package, MapPin, Clock, Star, Eye, FileText, Grid, List, Truck, Car, Ambulance, Bus, Wrench, CarFront } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Item } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ItemCatalogProps {
  onTabChange?: (tab: string) => void;
}

export const ItemCatalog: React.FC<ItemCatalogProps> = ({ onTabChange }) => {
  const { items, categories, searchItems, requestLoan } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Initialize selectedCategory from localStorage if present (set by BrowseCategories)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('catalog.selectedCategory');
      if (saved && saved !== 'all') {
        setSelectedCategory(saved);
        // Optionally clear after applying so future visits reset
        // localStorage.removeItem('catalog.selectedCategory');
      }
    } catch {}
  }, []);

  // Persist selection changes
  React.useEffect(() => {
    try {
      localStorage.setItem('catalog.selectedCategory', selectedCategory);
    } catch {}
  }, [selectedCategory]);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestItem, setRequestItem] = useState<Item | null>(null);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(''); // tanggal mulai
  const [startTime, setStartTime] = useState(''); // jam mulai
  const [returnDate, setReturnDate] = useState(''); // tanggal pengembalian
  const [returnTime, setReturnTime] = useState(''); // jam pengembalian

  const openRequestForm = (item: Item) => {
    setRequestItem(item);
    setShowRequestForm(true);
    setReason('');
    setDate('');
    setStartTime('');
    setReturnDate('');
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setRequestItem(null);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestItem) {
      console.error('❌ Missing user or requestItem:', { user, requestItem });
      return;
    }

    try {
      const startDate = new Date(date + 'T' + (startTime || '09:00'));
      const endDate = new Date(returnDate + 'T17:00');

      console.log('🔄 Submitting loan request for:', requestItem.name);
      console.log('👤 User:', user);
      console.log('📦 Item:', requestItem);
      console.log('📅 Dates:', { startDate, endDate });

      const loanData = {
        itemId: requestItem.id,
        userId: user.id,
        quantity: 1,
        startDate,
        endDate,
        purpose: reason,
        status: 'pending' as const
      };

      console.log('📋 Loan data to send:', loanData);

      await requestLoan(loanData);

      setShowRequestForm(false);
      setRequestItem(null);

      console.log('✅ Loan request completed successfully');

      // Auto redirect to My Loans page to see pending request
      if (onTabChange) {
        onTabChange('my-loans');
      }
    } catch (error) {
      console.error('❌ Error submitting loan request:', error);
      setNotification(`❌ ERROR: Failed to submit request for '${requestItem?.name}'. Please try again.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };



  const filteredItems = React.useMemo(() => {
    let filtered = searchQuery ? searchItems(searchQuery) : items;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }
    
    // Sort items
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'condition':
          return a.condition.localeCompare(b.condition);
        case 'availability':
          return b.availableQuantity - a.availableQuantity;
        case 'value':
          return b.value - a.value;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [items, searchQuery, selectedCategory, selectedCondition, sortBy, searchItems]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (item: Item) => {
    if (item.availableQuantity === 0) return 'bg-red-100 text-red-800';
    if (item.availableQuantity <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Function to get category-specific icon
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('ambulance')) {
      return <Ambulance size={48} className="text-red-400 group-hover:text-red-500 transition-colors" />;
    }
    if (categoryLower.includes('carry') || categoryLower.includes('truck')) {
      return <Truck size={48} className="text-blue-400 group-hover:text-blue-500 transition-colors" />;
    }
    if (categoryLower.includes('crv') || categoryLower.includes('car')) {
      return <Car size={48} className="text-green-400 group-hover:text-green-500 transition-colors" />;
    }
    if (categoryLower.includes('fortuner') || categoryLower.includes('suv')) {
      return <CarFront size={48} className="text-purple-400 group-hover:text-purple-500 transition-colors" />;
    }
    if (categoryLower.includes('h1') || categoryLower.includes('hummer')) {
      return <Truck size={48} className="text-gray-400 group-hover:text-gray-500 transition-colors" />;
    }
    if (categoryLower.includes('tool') || categoryLower.includes('equipment')) {
      return <Wrench size={48} className="text-orange-400 group-hover:text-orange-500 transition-colors" />;
    }
    
    // Default icon for unknown categories
    return <Package size={48} className="text-orange-400 group-hover:text-orange-500 transition-colors" />;
  };



  const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
    console.log(`🔍 ItemCard rendering for ${item.name}:`, {
      availableQuantity: item.availableQuantity,
      totalQuantity: item.quantity,
      condition: item.condition,
      category: item.category
    });
    
    return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Item Name & Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>
        
        {/* Item Details */}
        <div className="space-y-2">
          {/* Status and Condition Badges */}
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${getAvailabilityColor(item)}`}>
              {item.availableQuantity > 0 ? 'In Stock' : 'Dipinjam'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
              {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
            </span>
          </div>
          
          {/* Category with Icon */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Package size={12} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{item.category}</span>
          </div>
          
          {/* Location if available */}
          {item.location && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin size={12} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-600">{item.location}</span>
            </div>
          )}
          
        </div>
        
        {/* Action Buttons */}
        <div className="pt-2">
          {/* Request Button - Always show for available items */}
          {item.availableQuantity > 0 ? (
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              onClick={() => openRequestForm(item)}
            >
              <FileText size={16} />
              <span className="text-sm font-semibold">Request</span>
            </button>
          ) : (
            <button className="w-full px-4 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2">
              <Clock size={16} />
              <span className="text-sm font-semibold">Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center font-medium">
          {notification}
        </div>
      )}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <form onSubmit={handleRequestSubmit} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Request Item</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
              <input type="text" value={requestItem?.name || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter your reason for borrowing..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-2">
              <button type="button" onClick={closeRequestForm} className="w-full sm:w-auto px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" className="w-full sm:w-auto px-4 py-2 rounded bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">Submit</button>
            </div>
          </form>
        </div>
      )}
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Item Catalog</h1>
            <p className="text-gray-600 text-sm sm:text-base">Discover and request items from our comprehensive inventory</p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="all">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="name">Name</option>
                  <option value="category">Category</option>
                  <option value="condition">Condition</option>
                  <option value="availability">Availability</option>
                  <option value="value">Value</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </p>
        
        <div className="flex items-center space-x-2">
          <Package className="text-gray-400" size={16} />
          <span className="text-sm text-gray-600">
            {items.reduce((sum, item) => sum + item.availableQuantity, 0)} items available
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};