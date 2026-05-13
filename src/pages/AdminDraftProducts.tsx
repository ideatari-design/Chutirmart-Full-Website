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
import { 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminDraftProducts = () => {
  const [drafts, setDrafts] = useState([
    { id: '101', name: 'Upcoming Wireless Earbuds', price: 2500, category: 'Audio', createdAt: '2024-05-10', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=200' },
    { id: '102', name: 'Summer Collection T-Shirt', price: 800, category: 'Fashion', createdAt: '2024-05-11', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200' },
  ]);

  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Draft Products</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Products that are saved but not yet visible to customers.</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search drafts..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-2xl border-slate-100 bg-white shadow-sm font-medium"
              />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="h-14">
              <TableHead className="pl-8 w-24 text-[11px] font-black uppercase text-slate-400 tracking-widest">Image</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Product Name</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Category</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Price</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Date Created</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.map((prod) => (
              <TableRow key={prod.id} className="h-20 hover:bg-slate-50/50 group border-b border-slate-50">
                <TableCell className="pl-8">
                  <div className="h-14 w-14 bg-white rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center p-0.5 shadow-sm">
                     <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[14px] font-black text-slate-900 line-clamp-1">{prod.name}</span>
                </TableCell>
                <TableCell>
                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{prod.category}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[14px] font-black text-slate-900 italic opacity-50">৳ {prod.price}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] font-bold text-slate-400 uppercase">{prod.createdAt}</span>
                </TableCell>
                <TableCell className="text-right pr-8">
                   <div className="flex justify-end gap-2">
                      <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-[#00458e] text-white hover:bg-blue-800 transition-all shadow-md shadow-blue-100" title="Publish Now">
                         <Zap className="h-4 w-4" />
                      </button>
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
            {drafts.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                       <FileText className="h-12 w-12" />
                       <p className="font-black uppercase tracking-widest text-xs">No drafts found</p>
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

export default AdminDraftProducts;
