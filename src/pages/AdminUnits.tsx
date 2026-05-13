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
  Scale,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';

const AdminUnits = () => {
  const [units, setUnits] = useState([
    { id: '1', name: 'Piece', shortName: 'PCS', status: 'active' },
    { id: '2', name: 'Kilogram', shortName: 'KG', status: 'active' },
    { id: '3', name: 'Liter', shortName: 'L', status: 'active' },
    { id: '4', name: 'Gram', shortName: 'G', status: 'active' },
    { id: '5', name: 'Box', shortName: 'BOX', status: 'active' },
  ]);

  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Units of Measurement</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Define units for product quantities (e.g., PCS, KG, L).</p>
           </div>
           <Button className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">
              <PlusCircle className="h-4 w-4" /> Add Unit
           </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search units..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-lg border-slate-100 bg-white shadow-sm"
              />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="h-14">
              <TableHead className="pl-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Unit Name</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Short Name</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id} className="h-20 hover:bg-slate-50/50 group border-b border-slate-50">
                <TableCell className="pl-8">
                  <span className="text-[14px] font-black text-slate-900">{unit.name}</span>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 font-bold text-[11px] uppercase tracking-widest">
                     {unit.shortName}
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                       <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                   </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                   <div className="flex justify-end gap-2">
                      <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-slate-400 hover:bg-[#00458e] hover:text-white transition-all shadow-sm border border-slate-100">
                         <Edit className="h-4 w-4" />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100">
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

export default AdminUnits;
