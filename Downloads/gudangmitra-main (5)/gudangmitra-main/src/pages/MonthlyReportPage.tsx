import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { requestService } from '../services/requestService';
import { downloadMonthlyReportExcel } from '../utils/excelTemplateGenerator';
import { downloadMonthlyReportPDF } from '../utils/pdfExportUtils';
import MainLayout from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Alert from '../components/ui/Alert';
import { Calendar, Download, FileText, FileSpreadsheet, BarChart3, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Users, Package } from 'lucide-react';

interface ReportSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  completedRequests: number;
  highPriorityRequests: number;
  mediumPriorityRequests: number;
  lowPriorityRequests: number;
  totalItemsRequested: number;
  mostRequestedItems: Array<{ name: string; count: number }>;
  topRequesters: Array<{ name: string; count: number }>;
}

const MonthlyReportPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate year options (current year and previous 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  // Month options
  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Alert variant="error" title="Access Denied">
            You need administrator privileges to access this page.
          </Alert>
        </div>
      </MainLayout>
    );
  }

  const handleGeneratePreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      
      const reportSummary = await requestService.getMonthlyReportSummary(year, month);
      setSummary(reportSummary);
    } catch (err) {
      console.error('Error generating report preview:', err);
      setError('Failed to generate report preview. Please try again.');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!summary) {
      setError('Please generate a preview first');
      return;
    }

    setLoading(true);
    try {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      
      const requests = await requestService.getMonthlyRequests(year, month);
      downloadMonthlyReportExcel(requests, summary, year, month);
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setError('Failed to export to Excel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!summary) {
      setError('Please generate a preview first');
      return;
    }

    setLoading(true);
    try {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      
      const requests = await requestService.getMonthlyRequests(year, month);
      downloadMonthlyReportPDF(requests, summary, year, month);
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      setError('Failed to export to PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedMonthName = () => {
    return monthOptions.find(m => m.value === selectedMonth)?.label || 'Unknown';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
              Monthly Reports
            </h1>
            <p className="mt-2 text-gray-600">
              Generate and export monthly item request reports in Excel or PDF format.
            </p>
          </div>
        </div>

        {/* Report Configuration */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Report Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  options={yearOptions}
                  placeholder="Select year"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  options={monthOptions}
                  placeholder="Select month"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={handleGeneratePreview}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Generating...' : 'Generate Preview'}
                </Button>
              </div>
            </div>
            
            {error && (
              <Alert
                variant="error"
                title="Error"
                onDismiss={() => setError(null)}
                className="mb-4"
              >
                {error}
              </Alert>
            )}
          </div>
        </Card>

        {/* Report Summary */}
        {summary && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Report Summary - {getSelectedMonthName()} {selectedYear}
              </h2>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total Requests</p>
                      <p className="text-2xl font-bold text-blue-900">{summary.totalRequests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">{summary.pendingRequests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-900">{summary.completedRequests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Total Items</p>
                      <p className="text-2xl font-bold text-purple-900">{summary.totalItemsRequested}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-md font-semibold mb-3 flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-gray-600" />
                    Status Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Approved</span>
                      <span className="font-semibold text-green-600">{summary.approvedRequests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <span className="font-semibold text-red-600">{summary.rejectedRequests}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-gray-600" />
                    Priority Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Priority</span>
                      <span className="font-semibold text-red-600">{summary.highPriorityRequests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Medium Priority</span>
                      <span className="font-semibold text-yellow-600">{summary.mediumPriorityRequests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Low Priority</span>
                      <span className="font-semibold text-green-600">{summary.lowPriorityRequests}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Items and Requesters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {summary.mostRequestedItems.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold mb-3">Most Requested Items</h3>
                    <div className="space-y-2">
                      {summary.mostRequestedItems.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 truncate">{item.name}</span>
                          <span className="font-semibold text-blue-600">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {summary.topRequesters.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold mb-3 flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-600" />
                      Top Requesters
                    </h3>
                    <div className="space-y-2">
                      {summary.topRequesters.slice(0, 5).map((requester, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 truncate">{requester.name}</span>
                          <span className="font-semibold text-blue-600">{requester.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleExportExcel}
                  disabled={loading}
                  variant="primary"
                  className="flex items-center justify-center"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
                
                <Button
                  onClick={handleExportPDF}
                  disabled={loading}
                  variant="secondary"
                  className="flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to PDF
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default MonthlyReportPage;