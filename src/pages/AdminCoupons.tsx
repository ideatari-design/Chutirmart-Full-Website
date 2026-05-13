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
  Ticket,
  Percent,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'WELCOME50', type: 'percentage', value: 50, expiry: '2025-12-31', minPurchase: 500, status: 'active', usageCount: 145 },
    { id: '2', code: 'FLAT200', type: 'fixed', value: 200, expiry: '2025-06-30', minPurchase: 1000, status: 'active', usageCount: 42 },
    { id: '3', code: 'EXPIRED10', type: 'percentage', value: 10, expiry: '2023-01-01', minPurchase: 0, status: 'expired', usageCount: 890 },
  ]);

  const [search, setSearch] = useState('');

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vouchers & Coupons</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Drive sales by offering promotional discounts to your customers.</p>
           </div>
           <Button className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-xl font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105">
              <PlusCircle className="h-4 w-4" /> Create Voucher
           </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by coupon code..." 
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
              <TableHead className="pl-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Coupon Code</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Discount Info</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Min. Purchase</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Expiry Date</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Usage</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id} className="h-20 hover:bg-slate-50/50 transition-colors group border-b border-slate-50">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                        <Ticket className="h-5 w-5" />
                     </div>
                     <span className="text-[14px] font-black text-slate-900 tracking-widest">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-800">
                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `৳ ${coupon.value} OFF`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{coupon.type === 'percentage' ? 'Percentage Based' : 'Fixed Amount'}</span>
                   </div>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] font-bold text-slate-600">৳ {coupon.minPurchase}</span>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[11px] font-bold uppercase">{coupon.expiry}</span>
                   </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-indigo-500" />
                      <span className="text-[12px] font-black text-slate-700">{coupon.usageCount} Times</span>
                   </div>
                </TableCell>
                <TableCell>
                   <Badge className={`rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border-none ${
                     coupon.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'
                   }`}>
                      {coupon.status}
                   </Badge>
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

export default AdminCoupons;
