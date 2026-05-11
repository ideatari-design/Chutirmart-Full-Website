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
  Users,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  UserPlus
} from 'lucide-react';

import AdminPagination from '@/components/AdminPagination';

const AdminCustomers = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const customers = [
    { id: 1, name: 'Ashiqur Rahman', email: 'ashiq@example.com', phone: '01712345678', location: 'Dhaka', orders: 5, totalSpent: 8500, joinDate: 'Jan 12, 2024' },
    { id: 2, name: 'Mehedi Hasan', email: 'mehedi@example.com', phone: '01812345678', location: 'Chittagong', orders: 2, totalSpent: 4200, joinDate: 'Feb 05, 2024' },
    { id: 3, name: 'Sabbir Ahmed', email: 'sabbir@example.com', phone: '01912345678', location: 'Sylhet', orders: 12, totalSpent: 24500, joinDate: 'Nov 20, 2023' },
    { id: 4, name: 'Rahat Islam', email: 'rahat@example.com', phone: '01612345678', location: 'Dhaka', orders: 0, totalSpent: 0, joinDate: 'May 08, 2024' },
  ];

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice(
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
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add Customer
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
                  placeholder="Search Customers..." 
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
              <TableHead className="text-[12px] font-medium text-slate-600">Avatar</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Customer Name</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Contact Info</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Location</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Orders</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Total Spent</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-right pr-6">Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-16">
                <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-full bg-[#00458e]/10 text-[#00458e] flex items-center justify-center font-bold text-xs">
                     {customer.name.substring(0, 2).toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-slate-900">{customer.name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-slate-600 font-medium">{customer.email}</span>
                    <span className="text-[11px] text-slate-400">{customer.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {customer.location}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {customer.orders}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-[#0db39e]">৳ {customer.totalSpent.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <span className="text-[12px] text-slate-500 font-medium">{customer.joinDate}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <AdminPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminCustomers;
