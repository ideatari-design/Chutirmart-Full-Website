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
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCcw,
  ArrowUpDown,
  LayoutGrid
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminSorting = () => {
  const [sortings, setSortings] = useState([
    { id: '1', name: 'Newest First', value: 'created_at_desc', status: 'active' },
    { id: '2', name: 'Oldest First', value: 'created_at_asc', status: 'active' },
    { id: '3', name: 'Price: Low to High', value: 'price_asc', status: 'active' },
    { id: '4', name: 'Price: High to Low', value: 'price_desc', status: 'active' },
  ]);

  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sorting Options</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage how products are ordered on your storefront.</p>
           </div>
           <Button className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-xl font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">
              <PlusCircle className="h-4 w-4" /> Add Sorting Rule
           </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search rules..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-2xl border-slate-100 bg-white shadow-sm"
              />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="h-14">
              <TableHead className="pl-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Rule Name</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Value / Key</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortings.map((rule) => (
              <TableRow key={rule.id} className="h-20 hover:bg-slate-50/50 group border-b border-slate-50">
                <TableCell className="pl-8">
                  <span className="text-[14px] font-black text-slate-900">{rule.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] text-slate-400 font-bold uppercase">{rule.value}</span>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                       <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                   </div>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSorting;
