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
  PlusCircle, 
  MinusCircle, 
  RefreshCcw,
  ArrowRight,
  Package,
  History,
  AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminStockAdjustment = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Portable Crusher Juicer', currentStock: 10, sku: 'JUICE-P-01', lastAdjusted: '2024-05-01' },
    { id: '2', name: 'Pro Neck Fan', currentStock: 15, sku: 'FAN-N-02', lastAdjusted: '2024-04-28' },
    { id: '3', name: 'Gaming Headset Elite', currentStock: 5, sku: 'AUDIO-H-03', lastAdjusted: '2024-05-05' },
  ]);

  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock Adjustment</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update inventory levels manually for corrections or incoming shipments.</p>
           </div>
           <Button className="h-11 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-slate-200 transition-all hover:scale-105">
              <History className="h-4 w-4" /> Adjustment Logs
           </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search products by name or SKU..." 
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
              <TableHead className="pl-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Product / SKU</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Current Stock</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Adjustment</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Last Correction</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Finalize</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="h-20 hover:bg-slate-50/50 group border-b border-slate-50">
                <TableCell className="pl-8">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sku}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 font-black text-[13px] border border-indigo-100 min-w-[70px] justify-center">
                      {item.currentStock}
                   </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center justify-center gap-4">
                      <button className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                        <MinusCircle className="h-4 w-4" />
                      </button>
                      <Input 
                        className="w-16 h-8 text-center rounded-lg border-slate-100 text-xs font-black p-0"
                        defaultValue="0"
                      />
                      <button className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                        <PlusCircle className="h-4 w-4" />
                      </button>
                   </div>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">{item.lastAdjusted}</span>
                </TableCell>
                <TableCell className="text-right pr-8">
                   <Button className="h-9 px-4 bg-[#00458e] text-white rounded-xl font-black text-[10px] uppercase gap-2 shadow-sm">
                      Apply <ArrowRight className="h-3 w-3" />
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 flex items-start gap-4">
         <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500 border border-amber-100 group">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
         </div>
         <div className="space-y-1">
            <h4 className="font-black text-amber-900 text-sm italic">Stock Sync Warning</h4>
            <p className="text-xs text-amber-700 leading-relaxed max-w-2xl font-medium">
               Manual adjustments bypass the standard order flow. Ensure you have physical confirmation of the inventory before finalizing these changes. All adjustments are logged with your user ID.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AdminStockAdjustment;
