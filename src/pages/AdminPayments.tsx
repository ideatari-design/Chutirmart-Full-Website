import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  CreditCard,
  Download,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

import AdminPagination from '@/components/AdminPagination';

const AdminPayments = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const payments = [
    { id: 'PAY-8821', orderId: '#1001', customer: 'Ashiqur Rahman', method: 'bKash', amount: 1200, status: 'completed', date: '2024-05-08 10:30 AM' },
    { id: 'PAY-8822', orderId: '#1002', customer: 'Mehedi Hasan', method: 'Nagad', amount: 2500, status: 'pending', date: '2024-05-08 11:45 AM' },
    { id: 'PAY-8823', orderId: '#1003', customer: 'Sabbir Ahmed', method: 'Rocket', amount: 3700, status: 'completed', date: '2024-05-07 09:15 PM' },
    { id: 'PAY-8824', orderId: '#1004', customer: 'Rahat Islam', method: 'bKash', amount: 800, status: 'failed', date: '2024-05-07 04:20 PM' },
  ];

  const filteredPayments = payments.filter(p => 
    p.id.toLowerCase().includes(search.toLowerCase()) || 
    p.orderId.toLowerCase().includes(search.toLowerCase()) ||
    p.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
          <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
             <Download className="h-4 w-4" /> Export History
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center">
                <select className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Bulk Action</option>
                </select>
                <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
                <Button className="h-10 ml-3 bg-[#00458e] hover:bg-blue-800 text-white px-6 rounded-lg font-semibold text-xs">Apply</Button>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search transaction..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 w-[300px] border-slate-200 rounded-lg text-sm bg-white" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-[#0db39e]/20 shadow-sm">
        <Table>
          <TableHeader className="bg-[#ecfdfa]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 w-12"><div className="w-4 h-4 border border-[#0db39e] rounded bg-[#0db39e]/10"></div></TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Transaction ID</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Order ID</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Customer</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Method</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Amount</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Status</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-right pr-6">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.map((pay) => (
              <TableRow key={pay.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-16">
                <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                <TableCell>
                  <span className="text-[12px] font-bold text-[#00458e] tracking-tight">{pay.id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] font-medium text-slate-600">{pay.orderId}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-slate-900">{pay.customer}</span>
                </TableCell>
                <TableCell>
                   <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase">
                     {pay.method}
                   </span>
                </TableCell>
                <TableCell>
                   <span className="text-[13px] font-bold text-slate-900">৳ {pay.amount.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                   {pay.status === 'completed' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-[#0db39e] text-[10px] font-bold uppercase flex items-center w-fit gap-1">
                         <CheckCircle2 className="h-3 w-3" /> Success
                      </span>
                   ) : pay.status === 'pending' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00458e] text-[10px] font-bold uppercase flex items-center w-fit gap-1">
                         <Clock className="h-3 w-3" /> Pending
                      </span>
                   ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase flex items-center w-fit gap-1">
                         Failed
                      </span>
                   )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <span className="text-[11px] text-slate-500 font-medium">{pay.date}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="py-4 px-6 border-t border-slate-100">
          <AdminPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPayments.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
