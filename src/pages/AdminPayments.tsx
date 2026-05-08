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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              Payment Management
           </h2>
           <p className="text-muted-foreground font-medium">Monitor and manage all store transactions</p>
        </div>
        <Button className="rounded-xl h-12 px-6 gap-2 bg-primary font-bold">
           <Download className="h-5 w-5" /> Export History
        </Button>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by transaction ID or customer..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-secondary/20 border-none" 
          />
        </div>
        <Button variant="outline" className="rounded-xl gap-2 font-bold">
            <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary">Transaction ID</TableHead>
              <TableHead className="font-bold text-primary">Order ID</TableHead>
              <TableHead className="font-bold text-primary">Customer</TableHead>
              <TableHead className="font-bold text-primary">Method</TableHead>
              <TableHead className="font-bold text-primary">Amount</TableHead>
              <TableHead className="font-bold text-primary">Status</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.map((pay) => (
              <TableRow key={pay.id} className="hover:bg-secondary/10 transition-colors border-b-primary/5">
                <TableCell className="pl-6 font-bold text-primary text-xs">{pay.id}</TableCell>
                <TableCell className="font-medium">{pay.orderId}</TableCell>
                <TableCell className="font-bold text-sm tracking-tight">{pay.customer}</TableCell>
                <TableCell>
                   <Badge variant="secondary" className="rounded-lg font-bold bg-slate-100 text-slate-700">{pay.method}</Badge>
                </TableCell>
                <TableCell className="font-black text-primary">৳ {pay.amount.toLocaleString()}</TableCell>
                <TableCell>
                   {pay.status === 'completed' ? (
                      <Badge className="bg-green-500 hover:bg-green-600 gap-1 rounded-lg px-2">
                         <CheckCircle2 className="h-3 w-3" /> SUCCESS
                      </Badge>
                   ) : pay.status === 'pending' ? (
                      <Badge className="bg-accent hover:bg-accent/90 gap-1 rounded-lg px-2">
                         <Clock className="h-3 w-3" /> PENDING
                      </Badge>
                   ) : (
                      <Badge variant="destructive" className="rounded-lg px-2 text-[10px]">FAILED</Badge>
                   )}
                </TableCell>
                <TableCell className="text-right pr-6 text-xs text-muted-foreground font-medium">{pay.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <AdminPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredPayments.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminPayments;
