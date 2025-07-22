import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Package, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export const LoanCalendar: React.FC = () => {
  const { loans, getItemById, approveLoan, rejectLoan, returnItem } = useData();
  const { user, isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getLoansForDate = (date: Date) => {
    const dateStr = date.toDateString();
    let filteredLoans = loans.filter(loan => {
      const startDate = new Date(loan.startDate).toDateString();
      const endDate = new Date(loan.endDate).toDateString();
      return startDate === dateStr || endDate === dateStr ||
             (new Date(loan.startDate) <= date && new Date(loan.endDate) >= date);
    });

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredLoans = filteredLoans.filter(loan => loan.status === statusFilter);
    }

    return filteredLoans;
  };

  const renderCalendarDay = (day: number, isCurrentMonth: boolean) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayLoans = getLoansForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const userLoans = isAdmin ? dayLoans : dayLoans.filter(loan => loan.userId === user?.id);

    return (
      <div
        key={day}
        className={`min-h-28 p-2 border border-gray-200 hover:bg-gray-50 transition-colors ${
          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
        } ${isToday ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : ''}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${
            isToday ? 'text-blue-700' :
            !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
          }`}>
            {day}
          </span>
          {userLoans.length > 0 && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              userLoans.some(l => l.status === 'overdue') ? 'bg-red-100 text-red-700' :
              userLoans.some(l => l.status === 'pending') ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {userLoans.length}
            </span>
          )}
        </div>

        <div className="space-y-1">
          {userLoans.slice(0, 3).map(loan => {
            const item = getItemById(loan.itemId);
            const isStartDate = new Date(loan.startDate).toDateString() === date.toDateString();
            const isEndDate = new Date(loan.endDate).toDateString() === date.toDateString();

            return (
              <div
                key={loan.id}
                className={`text-xs p-1.5 rounded-md truncate cursor-pointer hover:shadow-sm transition-all ${
                  loan.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  loan.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  loan.status === 'overdue' ? 'bg-red-100 text-red-800 border border-red-200' :
                  loan.status === 'returned' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                  'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
                title={`${item?.name} - ${loan.status.toUpperCase()}`}
              >
                <div className="flex items-center space-x-1">
                  {isStartDate && <span className="text-green-600">▶</span>}
                  {isEndDate && <span className="text-red-600">◀</span>}
                  <span className="truncate font-medium">{item?.name}</span>
                </div>
              </div>
            );
          })}
          {userLoans.length > 3 && (
            <div className="text-xs text-gray-500 font-medium text-center py-1">
              +{userLoans.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(renderCalendarDay(daysInPrevMonth - i, false));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderCalendarDay(day, true));
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(renderCalendarDay(day, false));
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Loan Calendar</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {renderCalendar()}
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon size={20} className="mr-2 text-blue-600" />
            Status Legend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-4 h-4 bg-emerald-100 border border-emerald-200 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Active Loans</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Pending Requests</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Overdue Items</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Returned Items</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50">
              <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded ring-2 ring-blue-200"></div>
              <span className="text-sm font-medium text-blue-700">Today's Date</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package size={20} className="mr-2 text-green-600" />
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-emerald-700">Active Loans</span>
              <span className="text-lg font-bold text-emerald-800">
                {loans.filter(l => l.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-amber-700">Pending Requests</span>
              <span className="text-lg font-bold text-amber-800">
                {loans.filter(l => l.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-700">Overdue Items</span>
              <span className="text-lg font-bold text-red-800">
                {loans.filter(l => l.status === 'overdue').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-orange-600" />
          Upcoming Due Dates
        </h3>
        <div className="space-y-3">
          {loans
            .filter(loan => {
              const today = new Date();
              const endDate = new Date(loan.endDate);
              return endDate >= today && endDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            })
            .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
            .slice(0, 6)
            .map(loan => {
              const item = getItemById(loan.itemId);
              const daysUntil = Math.ceil((new Date(loan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={loan.id} className={`flex items-center space-x-3 p-4 rounded-lg border transition-all hover:shadow-md ${
                  daysUntil <= 1 ? 'bg-red-50 border-red-200' :
                  daysUntil <= 3 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className={`p-2 rounded-full ${
                    daysUntil <= 1 ? 'bg-red-100 text-red-600' :
                    daysUntil <= 3 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Clock size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item?.name}</p>
                    <p className="text-sm text-gray-600">
                      Due {new Date(loan.endDate).toLocaleDateString()}
                      <span className={`ml-2 font-medium ${
                        daysUntil <= 1 ? 'text-red-600' :
                        daysUntil <= 3 ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        ({daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`})
                      </span>
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        loan.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        loan.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        loan.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <User size={14} />
                        <span>User #{loan.userId}</span>
                      </div>
                      {loan.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => approveLoan(loan.id, user?.id)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLoan(loan.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          {loans.filter(loan => {
            const today = new Date();
            const endDate = new Date(loan.endDate);
            return endDate >= today && endDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          }).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto mb-2 opacity-50" size={32} />
              <p>No upcoming due dates in the next 7 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};