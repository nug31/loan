import React, { useState } from 'react';
import { Search, Filter, Grid, List, Package, Eye, Calendar, Tag } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Item } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const ItemCatalog: React.FC = () => {
  const { items, categories, searchItems, requestLoan } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      setNotification(`✅ SUCCESS: Request for '${requestItem.name}' has been sent! Check "My Loans" to see your request.`);
      setTimeout(() => setNotification(null), 5000);
      setRequestItem(null);

      console.log('✅ Loan request completed successfully');
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
      case 'good': return 'bg-gray-100 text-gray-800';
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

  const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={item.images?.[0] || '/placeholder-image.jpg'}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{item.category}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(item)}`}>
            {item.availableQuantity > 0 ? `${item.availableQuantity} available` : 'Out of stock'}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            {/* <Tag size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600">${item.value}</span> */}
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Eye size={16} />
            </button>
            <button
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              onClick={() => openRequestForm(item)}
              disabled={item.availableQuantity === 0}
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ItemRow: React.FC<{ item: Item }> = ({ item }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={item.images[0] || '/placeholder-image.jpg'}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
              {item.condition}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{item.category}</span>
            {/* <span>${item.value}</span> */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(item)}`}>
              {item.availableQuantity > 0 ? `${item.availableQuantity} available` : 'Out of stock'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Eye size={16} />
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            onClick={() => openRequestForm(item)}
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );

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
              <button type="button" onClick={closeRequestForm} className="w-full sm:w-auto px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="w-full sm:w-auto px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900">Submit</button>
            </div>
          </form>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Item Catalog</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Mobile-Responsive Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
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

      {/* Items Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
            : 'space-y-4'
        }>
          {filteredItems.map(item => (
            viewMode === 'grid' ? (
              <ItemCard key={item.id} item={item} />
            ) : (
              <ItemRow key={item.id} item={item} />
            )
          ))}
        </div>
      )}
    </div>
  );
};