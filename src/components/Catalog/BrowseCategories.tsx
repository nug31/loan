import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Grid, Tag } from 'lucide-react';

interface BrowseCategoriesProps {
  onTabChange?: (tab: string) => void;
}

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({ onTabChange }) => {
  const { categories } = useData();

  const handleSelect = (name: string) => {
    try {
      localStorage.setItem('catalog.selectedCategory', name);
    } catch {}
    if (onTabChange) onTabChange('catalog');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#274C5B] text-white">
              <Grid size={18} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h2>
              <p className="text-sm text-gray-600">Choose a category to browse items faster</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelect(c.name)}
            className="group bg-white rounded-xl border border-gray-200 hover:border-[#274C5B] hover:shadow-md transition-all p-4 text-left flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow"
              style={{ backgroundColor: c.color }}
            >
              <Tag size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate group-hover:text-[#274C5B]">{c.name}</div>
              <div className="text-xs text-gray-500 truncate">{c.itemCount} items</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

