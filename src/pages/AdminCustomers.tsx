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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Customer Management
           </h2>
           <p className="text-muted-foreground font-medium">View and manage your loyal customer base</p>
        </div>
        <Button className="rounded-xl h-12 px-6 gap-2 bg-primary font-bold">
           <UserPlus className="h-5 w-5" /> Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-secondary/20 border-none" 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary">Customer Name</TableHead>
              <TableHead className="font-bold text-primary">Contact info</TableHead>
              <TableHead className="font-bold text-primary">Location</TableHead>
              <TableHead className="font-bold text-primary text-center">Orders</TableHead>
              <TableHead className="font-bold text-primary">Total Spent</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-secondary/10 transition-colors border-b-primary/5">
                <TableCell className="pl-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase">
                         {customer.name.substring(0, 2)}
                      </div>
                      <p className="font-bold text-primary">{customer.name}</p>
                   </div>
                </TableCell>
                <TableCell>
                   <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                         <Mail className="h-3 w-3" /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                         <Phone className="h-3 w-3" /> {customer.phone}
                      </div>
                   </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-1 text-sm font-medium">
                      <MapPin className="h-3.5 w-3.5 text-accent" /> {customer.location}
                   </div>
                </TableCell>
                <TableCell className="text-center font-bold text-primary">
                   <Badge variant="outline" className="rounded-full bg-slate-50 border-slate-200">{customer.orders}</Badge>
                </TableCell>
                <TableCell className="font-black text-primary">৳ {customer.totalSpent.toLocaleString()}</TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
                      {customer.joinDate}
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                   </div>
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
