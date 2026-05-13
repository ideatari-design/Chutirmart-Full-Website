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
import { 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin,
  ChevronRight,
  Filter,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([
    { id: '1', name: 'Ashiqur Rahman', email: 'ashiq@example.com', phone: '01712345678', address: 'Dhaka, BD', totalOrders: 12, totalSpent: 15400, joinDate: '2023-05-12' },
    { id: '2', name: 'Mehedi Hasan', email: 'mehedi@example.com', phone: '01812345678', address: 'Chittagong, BD', totalOrders: 5, totalSpent: 6200, joinDate: '2023-08-20' },
    { id: '3', name: 'Sarah Khan', email: 'sarah@example.com', phone: '01912345678', address: 'Sylhet, BD', totalOrders: 8, totalSpent: 9800, joinDate: '2024-01-05' },
    { id: '4', name: 'Rakib Ahmed', email: 'rakib@example.com', phone: '01612345678', address: 'Rajshahi, BD', totalOrders: 2, totalSpent: 2100, joinDate: '2024-03-15' },
  ]);

  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Maintain relationships and view purchase history of your customers.</p>
           </div>
           <Button className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-xl font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105">
              <UserPlus className="h-4 w-4" /> Add New Customer
           </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, phone or email..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-2xl border-slate-100 bg-white shadow-sm font-medium"
              />
           </div>
           <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 px-6 rounded-2xl gap-2 font-bold text-xs border-slate-200">
                 <Filter className="h-4 w-4" /> Filter
              </Button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="h-14">
              <TableHead className="pl-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Customer</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Contact Info</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Total Orders</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Total Spent</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Join Date</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="h-24 hover:bg-slate-50/50 transition-colors group border-b border-slate-50">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                     <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                        {customer.name.charAt(0)}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-900 line-clamp-1">{customer.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                           <MapPin className="h-3 w-3" />
                           <span className="text-[10px] font-bold uppercase tracking-tight">{customer.address}</span>
                        </div>
                     </div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-600 group-hover:text-primary transition-colors">
                        <Phone className="h-3 w-3 opacity-50" />
                        <span className="text-[12px] font-bold">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="h-3 w-3 opacity-50" />
                        <span className="text-[11px] font-medium">{customer.email}</span>
                      </div>
                   </div>
                </TableCell>
                <TableCell>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-black text-[11px]">
                      {customer.totalOrders} Orders
                   </div>
                </TableCell>
                <TableCell>
                  <span className="text-[14px] font-black text-slate-900 tracking-tight">৳ {customer.totalSpent.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{customer.joinDate}</span>
                </TableCell>
                <TableCell className="text-right pr-8">
                   <div className="flex justify-end gap-2">
                      <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:bg-[#00458e] hover:text-white transition-all shadow-sm border border-slate-100">
                         <Edit className="h-4 w-4" />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100">
                         <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                       <Users className="h-12 w-12" />
                       <p className="font-black uppercase tracking-widest text-xs">No customers found</p>
                    </div>
                 </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
