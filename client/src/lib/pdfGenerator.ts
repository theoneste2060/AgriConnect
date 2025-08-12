import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFData {
  title: string;
  subtitle?: string;
  data: any[];
  columns: Array<{
    header: string;
    dataKey: string;
  }>;
  summary?: Array<{
    label: string;
    value: string | number;
  }>;
}

export function generatePDFReport(reportData: PDFData): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(22, 163, 74); // Rwanda green
  doc.text('AgriConnect Rwanda', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(reportData.title, 20, 35);
  
  if (reportData.subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(reportData.subtitle, 20, 45);
  }
  
  // Report generated date
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-RW')}`, 20, reportData.subtitle ? 55 : 50);
  
  let currentY = reportData.subtitle ? 70 : 65;
  
  // Summary section if provided
  if (reportData.summary && reportData.summary.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary', 20, currentY);
    currentY += 10;
    
    reportData.summary.forEach((item, index) => {
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`${item.label}: ${item.value}`, 25, currentY + (index * 6));
    });
    
    currentY += (reportData.summary.length * 6) + 15;
  }
  
  // Main data table
  if (reportData.data.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Detailed Data', 20, currentY);
    currentY += 10;
    
    autoTable(doc, {
      head: [reportData.columns.map(col => col.header)],
      body: reportData.data.map(row => 
        reportData.columns.map(col => {
          const value = row[col.dataKey];
          if (typeof value === 'number') {
            return value.toLocaleString();
          }
          if (value instanceof Date) {
            return value.toLocaleDateString('en-RW');
          }
          return value || '-';
        })
      ),
      startY: currentY,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 163, 74], // Rwanda green
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [60, 60, 60]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 20, right: 20 },
    });
  }
  
  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | AgriConnect Rwanda Admin Report`,
      20,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Download the PDF
  const filename = `${reportData.title.replace(/\s+/g, '_').toLowerCase()}_${new Date().getTime()}.pdf`;
  doc.save(filename);
}

export function generateOrdersReport(orders: any[]): void {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const reportData: PDFData = {
    title: 'Orders Report',
    subtitle: `Analysis of ${orders.length} orders`,
    data: orders,
    columns: [
      { header: 'Order ID', dataKey: 'id' },
      { header: 'Customer', dataKey: 'customerName' },
      { header: 'Farmer', dataKey: 'farmerName' },
      { header: 'Amount (RWF)', dataKey: 'totalAmount' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Date', dataKey: 'createdAt' }
    ],
    summary: [
      { label: 'Total Orders', value: orders.length },
      { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} RWF` },
      { label: 'Average Order Value', value: `${avgOrderValue.toLocaleString()} RWF` },
      { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length },
      { label: 'Completed Orders', value: orders.filter(o => o.status === 'delivered').length }
    ]
  };
  
  generatePDFReport(reportData);
}

export function generateUsersReport(users: any[]): void {
  const customerCount = users.filter(u => u.userType === 'customer').length;
  const farmerCount = users.filter(u => u.userType === 'farmer').length;
  const adminCount = users.filter(u => u.userType === 'admin').length;
  
  const reportData: PDFData = {
    title: 'Users Report',
    subtitle: `Analysis of ${users.length} registered users`,
    data: users,
    columns: [
      { header: 'User ID', dataKey: 'id' },
      { header: 'Name', dataKey: 'fullName' },
      { header: 'Email', dataKey: 'email' },
      { header: 'User Type', dataKey: 'userType' },
      { header: 'Registration Date', dataKey: 'createdAt' }
    ],
    summary: [
      { label: 'Total Users', value: users.length },
      { label: 'Customers', value: customerCount },
      { label: 'Farmers', value: farmerCount },
      { label: 'Administrators', value: adminCount },
      { label: 'Active Users', value: users.length } // Assuming all users are active
    ]
  };
  
  generatePDFReport(reportData);
}

export function generateFarmersReport(farmers: any[]): void {
  const activeFarmers = farmers.filter(f => f.isActive).length;
  const avgRating = farmers.length > 0 
    ? farmers.reduce((sum, f) => sum + Number(f.rating), 0) / farmers.length 
    : 0;
  
  const reportData: PDFData = {
    title: 'Farmers Report',
    subtitle: `Analysis of ${farmers.length} registered farmers`,
    data: farmers,
    columns: [
      { header: 'Farmer ID', dataKey: 'id' },
      { header: 'Farm Name', dataKey: 'farmName' },
      { header: 'Owner', dataKey: 'ownerName' },
      { header: 'Location', dataKey: 'location' },
      { header: 'Rating', dataKey: 'rating' },
      { header: 'Products', dataKey: 'productCount' },
      { header: 'Status', dataKey: 'status' }
    ],
    summary: [
      { label: 'Total Farmers', value: farmers.length },
      { label: 'Active Farmers', value: activeFarmers },
      { label: 'Average Rating', value: avgRating.toFixed(2) },
      { label: 'Inactive Farmers', value: farmers.length - activeFarmers }
    ]
  };
  
  generatePDFReport(reportData);
}

export function generateProductsReport(products: any[]): void {
  const availableProducts = products.filter(p => p.isAvailable).length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.availableQuantity), 0);
  const avgPrice = products.length > 0 
    ? products.reduce((sum, p) => sum + Number(p.pricePerUnit), 0) / products.length 
    : 0;
  
  const reportData: PDFData = {
    title: 'Products Report',
    subtitle: `Analysis of ${products.length} products`,
    data: products,
    columns: [
      { header: 'Product ID', dataKey: 'id' },
      { header: 'Product Name', dataKey: 'name' },
      { header: 'Farmer', dataKey: 'farmerName' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Price (RWF)', dataKey: 'pricePerUnit' },
      { header: 'Stock', dataKey: 'availableQuantity' },
      { header: 'Status', dataKey: 'status' }
    ],
    summary: [
      { label: 'Total Products', value: products.length },
      { label: 'Available Products', value: availableProducts },
      { label: 'Total Stock Units', value: totalStock },
      { label: 'Average Price', value: `${avgPrice.toLocaleString()} RWF` },
      { label: 'Out of Stock', value: products.filter(p => p.availableQuantity === 0).length }
    ]
  };
  
  generatePDFReport(reportData);
}