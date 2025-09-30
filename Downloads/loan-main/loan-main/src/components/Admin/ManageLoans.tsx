import React, { useState } from 'react';
import { Search, Filter, CheckCircle, X, Clock, AlertTriangle, Eye, Download, FileSpreadsheet, FileText, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Loan } from '../../types';
import { exportLoansData } from '../../utils/exportUtils';

export const ManageLoans: React.FC = () => {
  const { loans, getItemById, approveLoan, rejectLoan, returnItem, deleteLoan } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredLoans = loans.filter(loan => {
    const item = getItemById(loan.itemId);
    const matchesSearch = item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-slate-100 text-slate-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertTriangle size={16} />;
      case 'returned': return <CheckCircle size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleApprove = (loanId: string) => {
    console.log('🔄 Approving loan:', { loanId, userId: user?.id, user });
    approveLoan(loanId, user?.id);
  };

  const handleReject = (loanId: string) => {
    rejectLoan(loanId);
  };

  const handleDelete = (loanId: string, loanStatus?: string) => {
    let confirmMessage = 'Delete this loan request? This action cannot be undone.';
    
    if (loanStatus === 'overdue') {
      confirmMessage = 'Delete this overdue loan? This will permanently remove the loan record and cannot be undone.';
    }
    
    if (window.confirm(confirmMessage)) {
      deleteLoan(loanId);
    }
  };

  const handleReturn = (loanId: string) => {
    returnItem(loanId);
  };

  const showDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  const getDaysOverdue = (endDate: string | Date) => {
    const today = new Date();
    const endDateObj = new Date(endDate);
    const diffTime = today.getTime() - endDateObj.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    exportLoansData(filteredLoans, format);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Manage Loans</h1>
        
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2 px-3 py-2 sm:px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          {showExportMenu && (
            <>
              {/* Overlay for mobile */}
              <div 
                className="fixed inset-0 z-40 sm:hidden" 
                onClick={() => setShowExportMenu(false)}
              ></div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Export to Excel</span>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                  >
                    <FileText size={16} />
                    <span>Export to PDF</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">
                {loans.filter(l => l.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-green-600">
                {loans.filter(l => l.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Items</p>
              <p className="text-2xl font-bold text-orange">
                {loans.filter(l => l.status === 'overdue').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-light">
              <AlertTriangle className="text-orange" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-800">{loans.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <Eye className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search loans by item name or user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredLoans.map((loan) => {
          const item = getItemById(loan.itemId);
          const isOverdue = loan.status === 'overdue';
          const daysOverdue = isOverdue ? getDaysOverdue(loan.endDate) : 0;
          
          return (
            <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {loan.item?.name || item?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {loan.item?.category || item?.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {loan.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {loan.user?.name || `User #${loan.userId}`}
                      </p>
                      {loan.user?.department && (
                        <p className="text-xs text-gray-500 truncate">{loan.user.department}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(loan.status)}`}>
                    {getStatusIcon(loan.status)}
                    <span className="capitalize">{loan.status}</span>
                  </span>
                  {loan.returnRequested && (
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Return requested
                    </span>
                  )}
                  {isOverdue && (
                    <span className="text-xs text-orange">
                      {daysOverdue}d overdue
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(loan.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(loan.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-500">Qty: </span>
                  <span className="font-medium text-gray-900">{loan.quantity}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => showDetails(loan)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  
                  {loan.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(loan.id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {loan.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                  
                  {(loan.status === 'active' || loan.status === 'overdue') && (
                    <button
                      onClick={() => handleReturn(loan.id)}
                      className="px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-900 transition-colors"
                    >
                      Return
                    </button>
                  )}
                  
                  {/* Delete button untuk overdue loans */}
                  {loan.status === 'overdue' && (
                    <button
                      onClick={() => handleDelete(loan.id, loan.status)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                      title="Delete overdue loan"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const item = getItemById(loan.itemId);
                const isOverdue = loan.status === 'overdue';
                const daysOverdue = isOverdue ? getDaysOverdue(loan.endDate) : 0;
                
                return (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <CheckCircle size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.item?.name || item?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.item?.category || item?.category}
                          </div>
                          {loan.item?.location && (
                            <div className="text-xs text-gray-400">📍 {loan.item.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {loan.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.user?.name || `User #${loan.userId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.user?.email}
                          </div>
                          {loan.user?.department && (
                            <div className="text-xs text-gray-400">🏢 {loan.user.department}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="capitalize">{loan.status}</span>
                      </span>
                      {loan.returnRequested && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Return requested
                        </span>
                      )}
                      {isOverdue && (
                        <div className="text-xs text-orange mt-1">
                          {daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Start: {new Date(loan.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(loan.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => showDetails(loan)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {loan.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(loan.id)}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(loan.id)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {loan.status === 'pending' && (
                          <button
                            onClick={() => handleDelete(loan.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                        
                        {(loan.status === 'active' || loan.status === 'overdue') && (
                          <button
                            onClick={() => handleReturn(loan.id)}
                            className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-900 transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}
                        
                        {/* Delete button untuk overdue loans */}
                        {loan.status === 'overdue' && (
                          <button
                            onClick={() => handleDelete(loan.id, loan.status)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                            title="Delete overdue loan"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Details Modal */}
      {showDetailsModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Loan Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Borrower:</span> {selectedLoan.user?.name || `User #${selectedLoan.userId}`}</div>
                    {selectedLoan.user?.email && (
                      <div><span className="text-gray-500">Email:</span> {selectedLoan.user.email}</div>
                    )}
                    {selectedLoan.user?.department && (
                      <div><span className="text-gray-500">Department:</span> {selectedLoan.user.department}</div>
                    )}
                    <div><span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.status)}`}>
                        {selectedLoan.status}
                      </span>
                    </div>
                    <div><span className="text-gray-500">Quantity:</span> {selectedLoan.quantity}</div>
                    {selectedLoan.purpose && (
                      <div><span className="text-gray-500">Purpose:</span> {selectedLoan.purpose}</div>
                    )}
                    {selectedLoan.approvedAt && (
                      <div><span className="text-gray-500">Approved:</span> {new Date(selectedLoan.approvedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Start Date:</span> {new Date(selectedLoan.startDate).toLocaleDateString()}</div>
                    <div><span className="text-gray-500">Start Time:</span> {new Date(selectedLoan.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div><span className="text-gray-500">End Date:</span> {new Date(selectedLoan.endDate).toLocaleDateString()}</div>
                    <div><span className="text-gray-500">End Time:</span> {new Date(selectedLoan.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    {selectedLoan.actualReturnDate && (
                      <div><span className="text-gray-500">Returned:</span> {new Date(selectedLoan.actualReturnDate).toLocaleDateString()} {new Date(selectedLoan.actualReturnDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    )}
                    <div><span className="text-gray-500">Reminders Sent:</span> {selectedLoan.remindersSent}</div>
                  </div>
                </div>
              </div>
              
              {selectedLoan.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedLoan.notes}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};