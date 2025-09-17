import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ItemRequest } from '../types';

// Type for jsPDF with autoTable plugin
type jsPDFWithPlugin = jsPDF & {
  autoTable: (options: any) => jsPDF;
  lastAutoTable?: { finalY: number };
};

/**
 * Exports monthly report data to PDF file
 * @param requests Array of ItemRequest objects for the month
 * @param summary Monthly report summary statistics
 * @param year Year of the report
 * @param month Month of the report
 * @param filename Optional filename for the export
 * @returns Blob of the PDF file
 */
export const exportMonthlyReportToPDF = (
  requests: ItemRequest[],
  summary: {
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
  },
  year: number,
  month: number,
  filename?: string
): Blob => {
  const doc = new jsPDF() as jsPDFWithPlugin;
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  let yPosition = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly Item Request Report', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(14);
  doc.text(`Period: ${monthName} ${year}`, 20, yPosition);
  yPosition += 15;

  // Summary Statistics Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const summaryData = [
    ['Total Requests', summary.totalRequests.toString()],
    ['Pending Requests', summary.pendingRequests.toString()],
    ['Approved Requests', summary.approvedRequests.toString()],
    ['Rejected Requests', summary.rejectedRequests.toString()],
    ['Completed Requests', summary.completedRequests.toString()],
    ['', ''],
    ['High Priority Requests', summary.highPriorityRequests.toString()],
    ['Medium Priority Requests', summary.mediumPriorityRequests.toString()],
    ['Low Priority Requests', summary.lowPriorityRequests.toString()],
    ['', ''],
    ['Total Items Requested', summary.totalItemsRequested.toString()],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: 'center' }
    },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPosition + 50;

  // Most Requested Items Section
  if (summary.mostRequestedItems.length > 0) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Most Requested Items', 20, yPosition);
    yPosition += 5;

    const itemsData = summary.mostRequestedItems.map((item, index) => [
      (index + 1).toString(),
      item.name,
      item.count.toString()
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Rank', 'Item Name', 'Quantity Requested']],
      body: itemsData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 100 },
        2: { cellWidth: 40, halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });

    yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPosition + 50;
  }

  // Top Requesters Section
  if (summary.topRequesters.length > 0) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Requesters', 20, yPosition);
    yPosition += 5;

    const requestersData = summary.topRequesters.map((requester, index) => [
      (index + 1).toString(),
      requester.name,
      requester.count.toString()
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Rank', 'Requester Name', 'Total Requests']],
      body: requestersData,
      theme: 'striped',
      headStyles: { fillColor: [155, 89, 182] },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 100 },
        2: { cellWidth: 40, halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });

    yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPosition + 50;
  }

  // Detailed Requests Section
  if (requests.length > 0) {
    // Add a new page for detailed requests
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Request List', 20, yPosition);
    yPosition += 10;

    // Prepare detailed requests data
    const detailData = requests.map((request, index) => [
      (index + 1).toString(),
      request.id.substring(0, 8) + '...', // Truncate ID for space
      request.itemName.length > 20 ? request.itemName.substring(0, 17) + '...' : request.itemName,
      request.quantity.toString(),
      request.priority.charAt(0).toUpperCase(),
      request.status.charAt(0).toUpperCase(),
      request.requesterName && request.requesterName.length > 15 
        ? request.requesterName.substring(0, 12) + '...' 
        : request.requesterName || 'Unknown',
      request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }) : ''
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Request ID', 'Item Name', 'Qty', 'Pri', 'Status', 'Requester', 'Created']],
      body: detailData,
      theme: 'striped',
      headStyles: { 
        fillColor: [52, 73, 94],
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' }, // #
        1: { cellWidth: 20 }, // Request ID
        2: { cellWidth: 35 }, // Item Name
        3: { cellWidth: 15, halign: 'center' }, // Qty
        4: { cellWidth: 15, halign: 'center' }, // Pri
        5: { cellWidth: 20, halign: 'center' }, // Status
        6: { cellWidth: 30 }, // Requester
        7: { cellWidth: 20, halign: 'center' } // Created
      },
      margin: { left: 20, right: 20 }
    });
  }

  // Add footer with generation date
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
      20,
      doc.internal.pageSize.height - 10
    );
  }

  return doc.output('blob');
};

/**
 * Triggers a download of the monthly report PDF file
 * @param requests Array of ItemRequest objects for the month
 * @param summary Monthly report summary statistics
 * @param year Year of the report
 * @param month Month of the report
 * @param filename Optional filename for the export
 */
export const downloadMonthlyReportPDF = (
  requests: ItemRequest[],
  summary: {
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
  },
  year: number,
  month: number,
  filename?: string
): void => {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  const defaultFilename = `monthly_report_${monthName.toLowerCase()}_${year}.pdf`;
  const finalFilename = filename || defaultFilename;

  const blob = exportMonthlyReportToPDF(requests, summary, year, month, finalFilename);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};